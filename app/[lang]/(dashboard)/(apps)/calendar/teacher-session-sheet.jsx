"use client";
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useForm } from "react-hook-form";
import { cn, formatDate } from "@/lib/utils";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  Loader2,
  CalendarIcon,
  User,
  Star,
  Mail,
  Phone,
  Info,
  Clock,
} from "lucide-react";
import {
  createTeacherSession,
  updateTeacherSession,
  deleteTeacherSession,
} from "@/config/calendar.config";
import toast from "react-hot-toast";
import DeleteConfirmationDialog from "@/components/delete-confirmation-dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { useAuth } from "@/hooks/use-auth";

const schema = z
  .object({
    date: z.string().min(1, { message: "Date is required" }),
    start_time: z.string().min(1, { message: "Start time is required" }),
    end_time: z.string().min(1, { message: "End time is required" }),
  })
  .refine(
    (data) => {
      // Validate that end time is after start time
      const startTime = data.start_time;
      const endTime = data.end_time;

      if (startTime && endTime) {
        const start = new Date(`2000-01-01T${startTime}`);
        const end = new Date(`2000-01-01T${endTime}`);
        return end > start;
      }
      return true;
    },
    {
      message: "End time must be after start time",
      path: ["end_time"],
    }
  );

const TeacherSessionSheet = ({
  open,
  onClose,
  session,
  selectedDate,
  selectedRange,
  onSessionUpdated,
  onCreateMultipleSessions,
  isCreatingMultiple,
  userRole = null,
  showBookingButton = false,
  onBookSession = null,
  bookingLoading = false,
}) => {
  const { user } = useAuth();
  const [startDate, setStartDate] = useState(new Date());
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [isPending, startTransition] = React.useTransition();
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [sessionIdToDelete, setSessionIdToDelete] = useState(null);
  const startTimeRef = React.useRef(null);
  const endTimeRef = React.useRef(null);

  const sessionData = session?.extendedProps?.sessionData;
  const isBooked = sessionData?.is_booked;
  const isQualityRole = userRole === "quality";
  const isAdminRole = userRole === "admin";
  const isReadOnly = isBooked || isQualityRole || isAdminRole; // Admin is read-only
  const isAvailableSession =
    sessionData && !isBooked && sessionData.coaching !== 1;

  const {
    register,
    reset,
    setValue,
    formState: { errors },
    handleSubmit,
  } = useForm({
    resolver: zodResolver(schema),
    mode: "all",
  });

  const onSubmit = (data) => {
    startTransition(async () => {
      // Ensure we have a teacher ID
      if (!user?.id) {
        toast.error("Teacher ID not found. Please log in again.");
        return;
      }

      const sessionData = {
        date: data.date,
        start_time: data.start_time,
        end_time: data.end_time,
        teacher_id: user.id,
      };

      if (!session) {
        // Create new session
        const response = await createTeacherSession(sessionData, user.role);
        if (response?.success) {
          toast.success("Session created successfully");
          reset();
          onClose();
          onSessionUpdated?.();
        } else {
          toast.error(response?.message || "Failed to create session");
        }
      } else {
        // Update existing session
        const response = await updateTeacherSession(session.id, sessionData);
        if (response?.success) {
          toast.success("Session updated successfully");
          reset();
          onClose();
          onSessionUpdated?.();
        } else {
          toast.error(response?.message || "Failed to update session");
        }
      }
    });
  };

  useEffect(() => {
    if (selectedDate) {
      console.log("Selected date object:", selectedDate);

      // Extract the clicked date and time from FullCalendar arg
      const clickedDate = new Date(selectedDate.date);
      console.log("Clicked date:", clickedDate);

      // Set the start date for the calendar picker
      setStartDate(clickedDate);

      // Format date as YYYY-MM-DD
      const year = clickedDate.getFullYear();
      const month = String(clickedDate.getMonth() + 1).padStart(2, "0");
      const day = String(clickedDate.getDate()).padStart(2, "0");
      const dateStr = `${year}-${month}-${day}`;

      setValue("date", dateStr);

      // Extract time from clicked slot and set dynamically
      let clickedHour = clickedDate.getHours();
      let clickedMinute = clickedDate.getMinutes();

      // Use the actual clicked time instead of forcing bounds
      // Only ensure it's within reasonable bounds (0 AM to 11 PM)
      clickedHour = Math.max(0, Math.min(23, clickedHour));

      // Set start time to clicked hour and minutes
      const startHour = clickedHour;
      const endHour = startHour + 1; // End time is next hour

      const startTimeStr = `${String(startHour).padStart(2, "0")}:${String(
        clickedMinute
      ).padStart(2, "0")}`;
      const endTimeStr = `${String(endHour).padStart(2, "0")}:${String(
        clickedMinute
      ).padStart(2, "0")}`;

      // Set times immediately
      setStartTime(startTimeStr);
      setEndTime(endTimeStr);
      setValue("start_time", startTimeStr + ":00");
      setValue("end_time", endTimeStr + ":00");

      // Force update the input values directly
      setTimeout(() => {
        if (startTimeRef.current) {
          startTimeRef.current.value = startTimeStr;
          startTimeRef.current.dispatchEvent(
            new Event("input", { bubbles: true })
          );
          startTimeRef.current.dispatchEvent(
            new Event("change", { bubbles: true })
          );
        }
        if (endTimeRef.current) {
          endTimeRef.current.value = endTimeStr;
          endTimeRef.current.dispatchEvent(
            new Event("input", { bubbles: true })
          );
          endTimeRef.current.dispatchEvent(
            new Event("change", { bubbles: true })
          );
        }
      }, 100);

      console.log("Selected date set:", dateStr);
      console.log("Dynamic times set based on clicked slot:", {
        start: startTimeStr,
        end: endTimeStr,
        clickedHour: clickedHour,
        clickedMinute: clickedMinute,
      });
    }
    if (session) {
      const sessionData = session.extendedProps.sessionData;
      const sessionDate = new Date(sessionData.day);
      sessionDate.setHours(12, 0, 0, 0); // Set to noon to avoid timezone issues
      setStartDate(sessionDate);

      // Format time values for HTML time input fields (HH:MM format)
      const formatTimeForInput = (timeStr) => {
        if (!timeStr) return "00:00";

        console.log("Original time string:", timeStr);

        // Handle different time formats
        let cleanTime = timeStr.toString().trim();

        // Remove any seconds if present (e.g., "09:00:00" -> "09:00")
        if (cleanTime.includes(":")) {
          const parts = cleanTime.split(":");
          if (parts.length >= 2) {
            cleanTime = `${parts[0]}:${parts[1]}`;
          }
        }

        // Handle 12-hour format with AM/PM
        if (
          cleanTime.toLowerCase().includes("am") ||
          cleanTime.toLowerCase().includes("pm")
        ) {
          // Handle different time formats with AM/PM
          // Match patterns like: "10:00 am", "10:00:00 am", "2:00 pm", etc.
          const match = cleanTime
            .toLowerCase()
            .match(/(\d{1,2}):(\d{2})(?::\d{2})?\s*(am|pm)/);
          if (match) {
            let [_, hours, minutes, period] = match;
            hours = parseInt(hours);

            if (period === "pm" && hours !== 12) {
              hours += 12;
            } else if (period === "am" && hours === 12) {
              hours = 0;
            }

            cleanTime = `${hours.toString().padStart(2, "0")}:${minutes}`;
          }
        }

        // Ensure it's in HH:MM format
        const parts = cleanTime.split(":");
        if (parts.length === 2) {
          const hours = parts[0].padStart(2, "0");
          const minutes = parts[1].padStart(2, "0");
          const result = `${hours}:${minutes}`;
          console.log("Formatted time:", result);
          return result;
        }

        console.log("Failed to format time, using default");
        return "00:00";
      };

      const formattedStartTime = formatTimeForInput(sessionData.start_time);
      const formattedEndTime = formatTimeForInput(sessionData.end_time);

      setStartTime(formattedStartTime);
      setEndTime(formattedEndTime);
      setValue("date", sessionData.day);
      setValue("start_time", formattedStartTime + ":00");
      setValue("end_time", formattedEndTime + ":00");

      console.log("Session times formatted:", {
        original: { start: sessionData.start_time, end: sessionData.end_time },
        formatted: { start: formattedStartTime, end: formattedEndTime },
      });
    }
  }, [session, selectedDate, setValue]);

  // Reset form when sheet opens/closes
  useEffect(() => {
    if (!open) {
      setStartTime("");
      setEndTime("");
      reset();
    }
  }, [reset]);

  // Update refs when state changes
  useEffect(() => {
    if (startTimeRef.current && startTime) {
      console.log("Setting start time ref to:", startTime);
      startTimeRef.current.value = startTime;
      // Force the input to recognize the change
      startTimeRef.current.dispatchEvent(new Event("input", { bubbles: true }));
      startTimeRef.current.dispatchEvent(
        new Event("change", { bubbles: true })
      );
    }
    if (endTimeRef.current && endTime) {
      console.log("Setting end time ref to:", endTime);
      endTimeRef.current.value = endTime;
      // Force the input to recognize the change
      endTimeRef.current.dispatchEvent(new Event("input", { bubbles: true }));
      endTimeRef.current.dispatchEvent(new Event("change", { bubbles: true }));
    }
  }, [startTime, endTime]);

  // Force update inputs when sheet opened with selectedDate
  useEffect(() => {
    if (open && selectedDate && !session) {
      const clickedDate = new Date(selectedDate.date);
      const clickedHour = Math.max(0, Math.min(23, clickedDate.getHours()));
      const clickedMinute = clickedDate.getMinutes();
      const startTimeStr = `${String(clickedHour).padStart(2, "0")}:${String(
        clickedMinute
      ).padStart(2, "0")}`;
      const endTimeStr = `${String(clickedHour + 1).padStart(2, "0")}:${String(
        clickedMinute
      ).padStart(2, "0")}`;

      console.log("Sheet opened - forcing time update:", {
        startTimeStr,
        endTimeStr,
        clickedHour,
        clickedMinute,
      });

      // Force update after a short delay to ensure DOM is ready
      setTimeout(() => {
        setStartTime(startTimeStr);
        setEndTime(endTimeStr);
        setValue("start_time", startTimeStr + ":00");
        setValue("end_time", endTimeStr + ":00");

        if (startTimeRef.current) {
          startTimeRef.current.value = startTimeStr;
          startTimeRef.current.dispatchEvent(
            new Event("input", { bubbles: true })
          );
          startTimeRef.current.dispatchEvent(
            new Event("change", { bubbles: true })
          );
        }
        if (endTimeRef.current) {
          endTimeRef.current.value = endTimeStr;
          endTimeRef.current.dispatchEvent(
            new Event("input", { bubbles: true })
          );
          endTimeRef.current.dispatchEvent(
            new Event("change", { bubbles: true })
          );
        }
      }, 150);
    }
  }, [open, selectedDate, session, setValue]);

  const onDeleteSessionAction = async () => {
    try {
      if (!sessionIdToDelete) {
        toast.error("Session ID not found");
        return;
      }

      const response = await deleteTeacherSession(sessionIdToDelete);
      if (response?.success) {
        toast.success("Session deleted successfully");
        reset();
        onClose();
        onSessionUpdated?.();
      } else {
        toast.error(response?.message || "Failed to delete session");
      }
    } catch (error) {
      toast.error("Something went wrong");
    }
  };

  const handleOpenDeleteModal = (sessionId) => {
    setSessionIdToDelete(sessionId);
    setDeleteModalOpen(true);
    onClose();
  };

  const handleBookSession = () => {
    if (onBookSession && sessionData && !bookingLoading && !isAdminRole) {
      onBookSession(sessionData);
    }
  };

  // Prevent closing sheet during booking
  const handleClose = () => {
    if (bookingLoading) {
      return; // Don't close if booking is in progress
    }
    onClose();
  };

  return (
    <>
      <DeleteConfirmationDialog
        open={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        onConfirm={onDeleteSessionAction}
        defaultToast={false}
      />
      <Sheet open={open}>
        <SheetContent
          onPointerDownOutside={handleClose}
          onClose={handleClose}
          className="px-0"
        >
          <SheetHeader className="px-6">
            <SheetTitle>
              {session
                ? isBooked
                  ? "View Booked Session"
                  : isAdminRole
                  ? "View Session Details"
                  : "Book Session"
                : "Create New Session"}
            </SheetTitle>
          </SheetHeader>
          <div className="mt-6 h-full">
            <form className="h-full" onSubmit={handleSubmit(onSubmit)}>
              <div className="h-[calc(100vh-150px)]">
                <ScrollArea className="h-full">
                  <div className="space-y-4 pb-5 px-6">
                    {/* Session Details */}
                    {sessionData && (
                      <Card>
                        <CardContent className="p-4">
                          <div className="space-y-3">
                            <div className="flex items-center justify-between">
                              <h3 className="font-medium">Session Details</h3>
                              <Badge
                                variant={
                                  sessionData.is_booked
                                    ? "default"
                                    : "secondary"
                                }
                                className={
                                  sessionData.is_booked &&
                                  sessionData.coaching === 0
                                    ? "bg-primary"
                                    : sessionData.coaching === 1
                                    ? "bg-red-500"
                                    : "bg-green-600"
                                }
                              >
                                {sessionData.is_booked
                                  ? "Booked"
                                  : sessionData.coaching === 1
                                  ? "Quality Session"
                                  : "Available"}
                              </Badge>
                            </div>

                            {/* Show session time and date */}
                            <div className="space-y-2">
                              <div className="flex items-center gap-2">
                                <CalendarIcon className="w-4 h-4 text-gray-500" />
                                <span className="text-sm">
                                  {new Date(
                                    sessionData.day
                                  ).toLocaleDateString()}
                                </span>
                              </div>
                              <div className="flex items-center gap-2">
                                <span className="text-sm font-medium">
                                  {sessionData.start_time} -{" "}
                                  {sessionData.end_time}
                                </span>
                              </div>
                            </div>

                            {sessionData.is_booked && sessionData.student && (
                              <div className="space-y-2">
                                <div className="flex items-center gap-2">
                                  <User className="w-4 h-4 text-blue-500" />
                                  <span className="font-medium">
                                    {sessionData.student.name}
                                  </span>
                                </div>
                                <div className="flex items-center gap-2">
                                  <Mail className="w-4 h-4 text-gray-500" />
                                  <span className="text-sm">
                                    {sessionData.student.email}
                                  </span>
                                </div>
                                <div className="flex items-center gap-2">
                                  <span className="text-sm">
                                    Booked{" "}
                                    {sessionData.coaching === 1
                                      ? "By Quality"
                                      : "By Student"}
                                  </span>
                                </div>
                              </div>
                            )}

                            {/* Show additional info for available sessions */}
                            {!sessionData.is_booked && (
                              <div className="space-y-2">
                                <div className="flex items-center gap-2">
                                  <span className="text-sm text-gray-600">
                                    {sessionData.coaching === 1
                                      ? "This session has been marked as quality approved and is available for booking."
                                      : "This session is available for booking by students or quality team."}
                                  </span>
                                </div>
                                {isQualityRole &&
                                  sessionData.coaching !== 1 && (
                                    <div className="flex items-center gap-2">
                                      <span className="text-sm text-blue-600 font-medium">
                                        You can book this session as a quality
                                        session.
                                      </span>
                                    </div>
                                  )}
                              </div>
                            )}
                          </div>
                        </CardContent>
                      </Card>
                    )}

                    {/* Form Fields */}
                    <div className="space-y-4">
                      {/* Show range selection info if range is selected */}
                      {selectedRange && (
                        <Card className="bg-blue-50 border-blue-200">
                          <CardContent className="p-4">
                            <div className="space-y-3">
                              <div className="flex items-center justify-between">
                                <h3 className="font-medium text-blue-900">
                                  Range Selection
                                </h3>
                                <Badge
                                  variant="secondary"
                                  className="bg-blue-100 text-blue-800"
                                >
                                  {selectedRange.hours} session
                                  {selectedRange.hours !== 1 ? "s" : ""}
                                </Badge>
                              </div>
                              <div className="space-y-2 text-sm text-blue-700">
                                <div className="flex items-center gap-2">
                                  <CalendarIcon className="w-4 h-4" />
                                  <span>
                                    {selectedRange.start.toLocaleDateString()} -{" "}
                                    {selectedRange.end.toLocaleDateString()}
                                  </span>
                                </div>
                                <div className="flex items-center gap-2">
                                  <Clock className="w-4 h-4" />
                                  <span>
                                    {selectedRange.start.toLocaleTimeString(
                                      [],
                                      { hour: "2-digit", minute: "2-digit" }
                                    )}{" "}
                                    -{" "}
                                    {selectedRange.end.toLocaleTimeString([], {
                                      hour: "2-digit",
                                      minute: "2-digit",
                                    })}
                                  </span>
                                </div>
                              </div>
                              <div className="text-xs text-blue-600">
                                This will create {selectedRange.hours}{" "}
                                consecutive 1-hour sessions.
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      )}

                      {/* Show regular form fields for single session */}
                      {!selectedRange && (
                        <>
                          <div>
                            <Label htmlFor="date" className="mb-1.5">
                              Date
                            </Label>
                            <Popover>
                              <PopoverTrigger asChild>
                                <Button
                                  variant="outline"
                                  className={cn(
                                    "w-full justify-between text-left font-normal border-default-200 text-default-600",
                                    !startDate && "text-muted-foreground"
                                  )}
                                  disabled={isReadOnly || bookingLoading}
                                >
                                  {startDate ? (
                                    formatDate(startDate, "PPP")
                                  ) : (
                                    <span>Pick a date</span>
                                  )}
                                  <CalendarIcon className="h-4 w-4" />
                                </Button>
                              </PopoverTrigger>
                              <PopoverContent className="w-auto p-0">
                                <Calendar
                                  mode="single"
                                  selected={startDate}
                                  onSelect={(date) => {
                                    if (!isBooked && date && !bookingLoading) {
                                      // Set the time to noon to avoid timezone issues
                                      date.setHours(12, 0, 0, 0);
                                      setStartDate(date);

                                      // Format date as YYYY-MM-DD
                                      const year = date.getFullYear();
                                      const month = String(
                                        date.getMonth() + 1
                                      ).padStart(2, "0");
                                      const day = String(
                                        date.getDate()
                                      ).padStart(2, "0");
                                      const dateStr = `${year}-${month}-${day}`;

                                      setValue("date", dateStr);
                                      console.log(
                                        "Calendar date selected:",
                                        dateStr
                                      );
                                    }
                                  }}
                                  disabled={(date) =>
                                    date <
                                      new Date(
                                        new Date().setHours(0, 0, 0, 0)
                                      ) ||
                                    isReadOnly ||
                                    bookingLoading
                                  }
                                  initialFocus
                                />
                              </PopoverContent>
                            </Popover>
                            {errors.date && (
                              <div className="text-destructive text-sm mt-1">
                                {errors.date.message}
                              </div>
                            )}
                          </div>

                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <Label htmlFor="start_time" className="mb-1.5">
                                Start Time (24h)
                              </Label>
                              <Input
                                id="start_time"
                                type="time"
                                value={startTime}
                                ref={startTimeRef}
                                key={`start-${startTime}`}
                                onChange={(e) => {
                                  if (bookingLoading) return;
                                  const newStartTime = e.target.value;
                                  console.log(
                                    "Start time changed to:",
                                    newStartTime
                                  );
                                  setStartTime(newStartTime);
                                  setValue("start_time", newStartTime + ":00");

                                  // Auto-adjust end time if it's before start time
                                  if (
                                    newStartTime &&
                                    endTime &&
                                    newStartTime >= endTime
                                  ) {
                                    const startHour = parseInt(
                                      newStartTime.split(":")[0]
                                    );
                                    const startMinute = parseInt(
                                      newStartTime.split(":")[1]
                                    );
                                    const newEndHour = startHour + 1;
                                    const newEndTime = `${String(
                                      newEndHour
                                    ).padStart(2, "0")}:${String(
                                      startMinute
                                    ).padStart(2, "0")}`;
                                    setEndTime(newEndTime);
                                    setValue("end_time", newEndTime + ":00");
                                  }
                                }}
                                disabled={isReadOnly || bookingLoading}
                                placeholder="HH:MM (24h)"
                                min="00:00"
                                max="23:59"
                              />
                              <div className="text-xs text-gray-500 mt-1">
                                Current value: {startTime}
                              </div>
                              {errors.start_time && (
                                <div className="text-destructive text-sm mt-1">
                                  {errors.start_time.message}
                                </div>
                              )}
                            </div>

                            <div>
                              <Label htmlFor="end_time" className="mb-1.5">
                                End Time (24h)
                              </Label>
                              <Input
                                id="end_time"
                                type="time"
                                value={endTime || ""}
                                ref={endTimeRef}
                                key={`end-${endTime}`}
                                onChange={(e) => {
                                  if (bookingLoading) return;
                                  const newEndTime = e.target.value;
                                  console.log(
                                    "End time changed to:",
                                    newEndTime
                                  );
                                  setEndTime(newEndTime);
                                  setValue("end_time", newEndTime + ":00");
                                }}
                                disabled={isReadOnly || bookingLoading}
                                min={startTime} // Set minimum time to start time
                                max="23:59"
                                placeholder="HH:MM (24h)"
                              />
                              <div className="text-xs text-gray-500 mt-1">
                                Current value: {endTime}
                              </div>
                              {errors.end_time && (
                                <div className="text-destructive text-sm mt-1">
                                  {errors.end_time.message}
                                </div>
                              )}
                            </div>
                          </div>
                        </>
                      )}

                      <div className="flex items-center gap-2 text-sm text-gray-500">
                        <Info className="w-14 h-14 text-yellow-600" />
                        <span>
                          {selectedRange
                            ? `You can create ${selectedRange.hours} sessions at once by clicking "Create Multiple Sessions" below.`
                            : "You can create multiple sessions at once by selecting a range of time slots in the calendar."}
                        </span>
                      </div>
                    </div>
                  </div>
                </ScrollArea>
              </div>
              <div className="pb-12 flex flex-wrap gap-2 px-6">
                {/* Show different buttons based on selection type */}
                {selectedRange ? (
                  // Range selection - show multiple session creation button
                  <Button
                    type="button"
                    onClick={onCreateMultipleSessions}
                    disabled={isCreatingMultiple || isReadOnly}
                    className="flex-1"
                  >
                    {isCreatingMultiple ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Creating {selectedRange.hours} Sessions...
                      </>
                    ) : (
                      `Create ${selectedRange.hours} Session${
                        selectedRange.hours !== 1 ? "s" : ""
                      }`
                    )}
                  </Button>
                ) : (
                  // Single session - show regular create/update button
                  <Button
                    type="submit"
                    disabled={isPending || isReadOnly || bookingLoading}
                    className="flex-1"
                  >
                    {isPending ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        {session ? "Updating..." : "Creating..."}
                      </>
                    ) : isReadOnly ? (
                      isAdminRole ? (
                        "View Only (Admin Role)"
                      ) : isQualityRole ? (
                        "View Only (Quality Role)"
                      ) : (
                        "Session Booked (Cannot Edit)"
                      )
                    ) : session ? (
                      "Update Session"
                    ) : (
                      "Create Session"
                    )}
                  </Button>
                )}

                {/* Show booking button for quality users on available sessions */}
                {showBookingButton &&
                  isQualityRole &&
                  isAvailableSession &&
                  !isAdminRole && (
                    <Button
                      type="button"
                      variant="default"
                      onClick={handleBookSession}
                      disabled={bookingLoading}
                      className="flex-1 bg-green-600 hover:bg-green-700 disabled:bg-green-400"
                    >
                      {bookingLoading ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Booking...
                        </>
                      ) : (
                        "Book Session"
                      )}
                    </Button>
                  )}

                {session && !isReadOnly && !isAdminRole && !selectedRange && (
                  <Button
                    type="button"
                    variant="destructive"
                    onClick={() => handleOpenDeleteModal(session.id)}
                    disabled={bookingLoading}
                    className="flex-1"
                  >
                    Delete
                  </Button>
                )}
              </div>
            </form>
          </div>
        </SheetContent>
      </Sheet>
    </>
  );
};

export default TeacherSessionSheet;
