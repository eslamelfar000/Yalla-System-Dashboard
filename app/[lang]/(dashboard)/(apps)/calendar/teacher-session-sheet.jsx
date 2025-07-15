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
import { Loader2, CalendarIcon, User, Star, Mail, Phone } from "lucide-react";
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
  onSessionUpdated,
  userRole = null,
  availableSessions = [],
  showBookingButton = false,
  onBookSession = null,
  bookingLoading = false,
}) => {
  const { user } = useAuth();
  const [startDate, setStartDate] = useState(new Date());
  const [startTime, setStartTime] = useState("09:00");
  const [endTime, setEndTime] = useState("10:00");
  const [isPending, startTransition] = React.useTransition();
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [sessionIdToDelete, setSessionIdToDelete] = useState(null);

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

      console.log("Creating/updating session with data:", sessionData);
      console.log("Teacher ID being used:", user.id);

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
      // Fix date handling - use the date directly without timezone conversion
      const date = new Date(selectedDate.date);
      // Set the time to noon to avoid timezone issues
      date.setHours(12, 0, 0, 0);
      setStartDate(date);

      // Format date as YYYY-MM-DD
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, "0");
      const day = String(date.getDate()).padStart(2, "0");
      const dateStr = `${year}-${month}-${day}`;

      setValue("date", dateStr);

      // Set default times for new sessions
      const currentHour = new Date().getHours();
      const nextHour = currentHour + 1;

      // Ensure times are within reasonable bounds (9 AM to 9 PM)
      const startHour = Math.max(9, Math.min(21, currentHour));
      const endHour = Math.max(10, Math.min(22, nextHour));

      const defaultStartTime = `${String(startHour).padStart(2, "0")}:00`;
      const defaultEndTime = `${String(endHour).padStart(2, "0")}:00`;

      setStartTime(defaultStartTime);
      setEndTime(defaultEndTime);
      setValue("start_time", defaultStartTime + ":00");
      setValue("end_time", defaultEndTime + ":00");

      console.log("Selected date set:", dateStr);
      console.log("Default times set:", {
        start: defaultStartTime,
        end: defaultEndTime,
      });
      console.log(
        "State updated - startTime:",
        defaultStartTime,
        "endTime:",
        defaultEndTime
      );
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
          const match = cleanTime
            .toLowerCase()
            .match(/(\d{1,2}):(\d{2})\s*(am|pm)/);
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
                                  const day = String(date.getDate()).padStart(
                                    2,
                                    "0"
                                  );
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
                                  new Date(new Date().setHours(0, 0, 0, 0)) ||
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
                            Start Time
                          </Label>
                          <Input
                            id="start_time"
                            type="time"
                            value={startTime}
                            onChange={(e) => {
                              if (bookingLoading) return;
                              const newStartTime = e.target.value;
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
                            placeholder="Select start time"
                          />
                          {errors.start_time && (
                            <div className="text-destructive text-sm mt-1">
                              {errors.start_time.message}
                            </div>
                          )}
                        </div>

                        <div>
                          <Label htmlFor="end_time" className="mb-1.5">
                            End Time
                          </Label>
                          <Input
                            id="end_time"
                            type="time"
                            value={endTime}
                            onChange={(e) => {
                              if (bookingLoading) return;
                              const newEndTime = e.target.value;
                              setEndTime(newEndTime);
                              setValue("end_time", newEndTime + ":00");
                            }}
                            disabled={isReadOnly || bookingLoading}
                            min={startTime} // Set minimum time to start time
                            placeholder="Select end time"
                          />
                          {errors.end_time && (
                            <div className="text-destructive text-sm mt-1">
                              {errors.end_time.message}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </ScrollArea>
              </div>
              <div className="pb-12 flex flex-wrap gap-2 px-6">
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

                {session && !isReadOnly && !isAdminRole && (
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
