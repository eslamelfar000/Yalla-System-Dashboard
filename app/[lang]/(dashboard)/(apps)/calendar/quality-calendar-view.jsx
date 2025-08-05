"use client";
import React, { useState, useEffect } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import listPlugin from "@fullcalendar/list";
import TeacherSessionSheet from "./teacher-session-sheet";
import { Card, CardContent } from "@/components/ui/card";
import { useAuth } from "@/hooks/use-auth";
import { getTeacherSessions, bookSession } from "@/config/calendar.config";
import toast from "react-hot-toast";
import { Loader2 } from "lucide-react";
import TeacherFilter from "@/components/Shared/TeacherFilter";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useGetData } from "@/hooks/useGetData";

const QualityCalendarView = () => {
  const { user } = useAuth();
  const [calendarSessions, setCalendarSessions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [bookingLoading, setBookingLoading] = useState(false);
  const [sheetOpen, setSheetOpen] = useState(false);
  const [selectedSession, setSelectedSession] = useState(null);
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedTeacher, setSelectedTeacher] = useState(null);
  const [bookingDialog, setBookingDialog] = useState(false);
  const [sessionToBook, setSessionToBook] = useState(null);
  const [sessionSelectorOpen, setSessionSelectorOpen] = useState(false);
  const [availableSessionsForDate, setAvailableSessionsForDate] = useState([]);

  // Get teachers data for filter
  const { data: teachersData, isLoading: teachersLoading } = useGetData({
    endpoint: "dashboard/teachers",
    queryKey: ["teachers"],
  });

  const teachers = teachersData?.data || [];

  // Set default teacher to first teacher in list
  useEffect(() => {
    if (teachers.length > 0 && !selectedTeacher) {
      setSelectedTeacher(teachers[0].user_id.toString());
    }
  }, [teachers, selectedTeacher]);

  // Check if user can perform actions (quality role only)
  const canPerformActions = user?.role === "quality";
  const isAdminRole = user?.role === "admin";
  const isQualityRole = user?.role === "quality";

  // Function to convert 12-hour time to 24-hour format
  const convertTo24Hour = (timeStr) => {
    if (!timeStr) return "00:00";

    const cleanTime = timeStr.toLowerCase().trim();

    if (!cleanTime.includes("am") && !cleanTime.includes("pm")) {
      // Handle seconds if present (e.g., "10:00:00" -> "10:00")
      if (cleanTime.includes(":")) {
        const parts = cleanTime.split(":");
        if (parts.length >= 2) {
          return `${parts[0]}:${parts[1]}`;
        }
      }
      return cleanTime;
    }

    // Handle different time formats with AM/PM
    // Match patterns like: "10:00 am", "10:00:00 am", "2:00 pm", etc.
    const match = cleanTime.match(/(\d{1,2}):(\d{2})(?::\d{2})?\s*(am|pm)/);
    if (!match) {
      console.warn("Could not parse time format:", timeStr);
      return "00:00";
    }

    let [_, hours, minutes, period] = match;
    hours = parseInt(hours);

        // Handle hours 13+ as 24-hour format regardless of period
    if (hours >= 12 && period === "am") {
      return `${hours.toString().padStart(2, "0")}:${minutes}`;
    }

    if (period === "pm" && hours !== 12) {
      hours += 12;
    } else if (period === "am" && hours === 12) {
      hours = 0;
    }

    return `${hours.toString().padStart(2, "0")}:${minutes}`;
  };

  // Function to validate and fix end time
  const validateAndFixTimes = (startTime, endTime) => {
    const start24 = convertTo24Hour(startTime);
    const end24 = convertTo24Hour(endTime);

    const startHour = parseInt(start24.split(":")[0]);
    const startMinute = parseInt(start24.split(":")[1]);
    const endHour = parseInt(end24.split(":")[0]);
    const endMinute = parseInt(end24.split(":")[1]);

    const startMinutes = startHour * 60 + startMinute;
    const endMinutes = endHour * 60 + endMinute;

    // Handle cases where end time is before start time
    if (endMinutes <= startMinutes) {
      // If end time is before or equal to start time, add 1 hour to end time
      const newEndHour = startHour + 1;
      const newEndTime = `${String(newEndHour).padStart(2, "0")}:${String(
        startMinute
      ).padStart(2, "0")}`;

      console.warn(
        `Invalid time range: ${startTime} - ${endTime}. Fixed to: ${start24} - ${newEndTime}`
      );
      return { start: start24, end: newEndTime };
    }

    return { start: start24, end: end24 };
  };

  // Function to validate and format date
  const formatDate = (dateStr) => {
    if (!dateStr) return null;

    try {
      const date = new Date(dateStr);
      if (isNaN(date.getTime())) {
        return null;
      }

      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, "0");
      const day = String(date.getDate()).padStart(2, "0");
      return `${year}-${month}-${day}`;
    } catch (error) {
      return null;
    }
  };

  // Fetch sessions when selected teacher changes
  useEffect(() => {
    if (selectedTeacher && user?.role) {
      fetchSessions();
    }
  }, [selectedTeacher, user?.role]);

  // Fetch teacher sessions
  const fetchSessions = async () => {
    try {
      setLoading(true);
      const response = await getTeacherSessions(
        selectedTeacher,
        null,
        user?.role
      );

      if (response?.success) {
        const sessionsData = Array.isArray(response.data) ? response.data : [];
        setCalendarSessions(sessionsData);
      } else {
        toast.error("Failed to fetch sessions");
      }
    } catch (error) {
      toast.error("Failed to fetch sessions");
    } finally {
      setLoading(false);
    }
  };

  // Convert sessions to FullCalendar format
  const calendarEvents = calendarSessions
    .map((session) => {
      const sessionData = session;

      const formattedDate = formatDate(sessionData.day);
      if (!formattedDate) {
        return null;
      }

      const { start: startTime24, end: endTime24 } = validateAndFixTimes(
        sessionData.start_time,
        sessionData.end_time
      );

      // Create title based on booking and coaching status
      let title = "";
      if (sessionData.is_booked) {
        // Booked sessions with student - GREEN
        if (sessionData.student?.name) {
          title = `${sessionData.student.name}`;
        } else {
          title = "Booked";
        }
      } else if (sessionData.coaching === 1) {
        // Sessions with coaching quality but NOT booked - RED (can be booked)
        title = "Quality Good - Available";
      } else {
        // Available sessions - PRIMARY
        title = "Available";
      }

      const event = {
        id: sessionData.id,
        title: title,
        start: `${formattedDate}T${startTime24}:00`,
        end: `${formattedDate}T${endTime24}:00`,
        allDay: false,
        extendedProps: {
          is_booked: sessionData.is_booked,
          coaching: sessionData.coaching,
          student: sessionData.student,
          teacher_id: sessionData.teacher_id,
          admin_status: sessionData.admin_status,
          booking_status: sessionData.booking_status,
          booking_date: sessionData.booking_date,
          sessionData: sessionData,
        },
      };

      if (!event.start || !event.end || !event.title) {
        return null;
      }

      return event;
    })
    .filter(Boolean);

  // Event click handler
  const handleEventClick = (arg) => {
    const sessionData = arg.event.extendedProps.sessionData;

    // Admin and quality can view all sessions, but admin cannot perform actions
    if (sessionData.is_booked) {
      // Show booked session details but don't allow editing
      setSelectedSession(arg.event);
      setSelectedDate(null);
      setSheetOpen(true);
    } else {
      // For available sessions, show details in sheet with booking option (quality only)
      setSelectedSession(arg.event);
      setSelectedDate(null);
      setSheetOpen(true);
    }
  };

  // Date click handler - only allow clicking on dates with available sessions (quality only)
  const handleDateClick = (arg) => {
    // Admin role cannot create or book sessions
    if (isAdminRole) {
      return;
    }

    const clickedDate = new Date(arg.date);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (clickedDate < today) {
      return;
    }

    // Check if there are any sessions for this date
    const dateStr = clickedDate.toISOString().split("T")[0];
    const sessionsForDate = calendarSessions.filter(
      (session) => session.day === dateStr
    );

    if (sessionsForDate.length === 0) {
      return;
    }

    // Check if there are any available sessions for this date
    const availableSessions = sessionsForDate.filter(
      (session) => !session.is_booked && session.coaching !== 1
    );

    if (availableSessions.length === 0) {
      return;
    }

    // Set available sessions and open session selector
    setAvailableSessionsForDate(availableSessions);
    setSelectedDate(arg);
    setSessionSelectorOpen(true);
  };

  // Close modal
  const handleCloseModal = () => {
    setSheetOpen(false);
    setSelectedSession(null);
    setSelectedDate(null);
  };

  // Close session selector
  const handleCloseSessionSelector = () => {
    setSessionSelectorOpen(false);
    setSelectedDate(null);
    setAvailableSessionsForDate([]);
  };

  // Handle session updates
  const handleSessionUpdated = () => {
    fetchSessions();
  };

  // Handle teacher change
  const handleTeacherChange = (teacherId) => {
    setSelectedTeacher(teacherId);
  };

  // Handle clear filter
  const handleClearFilter = () => {
    if (teachers.length > 0) {
      setSelectedTeacher(teachers[0].user_id.toString());
    }
  };

  // Handle booking confirmation (quality role only)
  const handleBookingConfirm = async () => {
    if (!sessionToBook || !canPerformActions) return;

    try {
      setBookingLoading(true);

      // Pass the session ID directly to the booking function
      const response = await bookSession(
        sessionToBook.id,
        null, // No additional booking data needed
        user?.role
      );

      if (response?.success) {
        toast.success("Session booked successfully");
        // Only close dialog and sheet after successful booking
        setBookingDialog(false);
        setSessionToBook(null);
        setSheetOpen(false); // Close sheet after successful booking
        fetchSessions(); // Refresh sessions
      } else {
        toast.error(response?.message || "Failed to book session");
        // Don't close dialog on error - let user try again
      }
    } catch (error) {
      toast.error("Failed to book session");
      // Don't close dialog on error - let user try again
    } finally {
      setBookingLoading(false);
    }
  };

  // Handle booking from sheet (quality role only)
  const handleBookFromSheet = (sessionData) => {
    if (!canPerformActions) return;

    setSessionToBook(sessionData);
    setBookingDialog(true);
    // Don't close sheet immediately - wait for booking confirmation
  };

  // Handle dialog close - only allow closing if not loading
  const handleDialogClose = (open) => {
    if (bookingLoading) {
      return; // Don't allow closing during booking
    }
    setBookingDialog(open);
    if (!open) {
      setSessionToBook(null);
    }
  };

  // Event class names based on booking status and coaching quality
  const handleClassName = (arg) => {
    const { is_booked, coaching } = arg.event.extendedProps;

    if (is_booked && coaching === 0) {
      // Booked sessions with student - GREEN
      return "bg-primary text-white border-primary hover:bg-primary transition-colors";
    } else if (coaching === 1) {
      // Sessions with coaching quality but NOT booked - RED (can be booked)
      return "bg-red-500 text-white border-red-600 hover:bg-red-600 transition-colors cursor-pointer";
    } else {
      // Available sessions - PRIMARY
      return "bg-green-600 text-white border-green-600 hover:bg-green-600 transition-colors cursor-pointer";
    }
  };

  // Custom date click handler to block dates without sessions
  const handleDateClickCustom = (arg) => {
    // Admin role cannot create or book sessions
    if (isAdminRole) {
      return;
    }

    const clickedDate = new Date(arg.date);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (clickedDate < today) {
      return;
    }

    // Check if there are any sessions for this date
    const dateStr = clickedDate.toISOString().split("T")[0];
    const sessionsForDate = calendarSessions.filter(
      (session) => session.day === dateStr
    );

    if (sessionsForDate.length === 0) {
      return;
    }

    // Check if there are any available sessions for this date
    const availableSessions = sessionsForDate.filter(
      (session) => !session.is_booked && session.coaching !== 1
    );

    if (availableSessions.length === 0) {
      return;
    }

    // Set available sessions and open session selector
    setAvailableSessionsForDate(availableSessions);
    setSelectedDate(arg);
    setSessionSelectorOpen(true);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
          <p className="mt-2 text-sm text-gray-600">Loading sessions...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <Card className="pt-5">
        <CardContent className="dash-tail-calendar">
          {/* Teacher Filter */}
          <div className="flex justify-between mb-8 items-center">
            <div className="mb-4">
              <TeacherFilter
                selectedTeacher={selectedTeacher}
                onTeacherChange={handleTeacherChange}
                onClearFilter={handleClearFilter}
                clearButton={false}
                quality={true}
              />
            </div>

            {/* Session Legend */}
            <div className="mb-4">
              <div className="flex justify-center gap-4 text-sm">
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-green-500 border border-green-600 rounded"></div>

                  <span>Available Sessions</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-primary border border-primary rounded"></div>
                  <span>Booked by Student</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-red-500 border border-red-600 rounded"></div>
                  <span>Booked by Quality</span>
                </div>
              </div>
            </div>
          </div>

          <FullCalendar
            plugins={[
              dayGridPlugin,
              timeGridPlugin,
              interactionPlugin,
              listPlugin,
            ]}
            headerToolbar={{
              left: "prev,next today",
              center: "title",
              right: "dayGridMonth,timeGridWeek,timeGridDay,listWeek",
            }}
            allDaySlot={false}
            events={calendarEvents}
            slotDuration="01:00:00"
            viewDidMount={() => {
              const slots = document.querySelectorAll(".fc .fc-timegrid-slot");
              slots.forEach((slot) => {
                slot.style.height = "3.5em";
              });
            }}
            slotLabelFormat={{ hour: "2-digit", minute: "2-digit" }}
            editable={false}
            selectable={!isAdminRole} // Disable date selection for admin
            selectMirror={false}
            weekends={true}
            eventClassNames={handleClassName}
            dateClick={handleDateClickCustom} // Use custom date click handler
            eventClick={handleEventClick}
            initialView="timeGridWeek"
            views={{
              timeGridWeek: {
                type: "timeGrid",
                duration: { days: 7 },
                buttonText: "Week",
              },
            }}
            slotMinTime="09:00:00"
            slotMaxTime="21:00:00"
            height="auto"
            selectConstraint={{
              start: new Date().toISOString().split("T")[0],
              end: "2100-12-31",
            }}
            validRange={{
              start: new Date().toISOString().split("T")[0],
            }}
            className="smooth-calendar"
            eventDisplay="block"
            eventTimeFormat={{
              hour: "2-digit",
              minute: "2-digit",
              meridiem: false,
            }}
          />
        </CardContent>
      </Card>

      <TeacherSessionSheet
        open={sheetOpen}
        onClose={handleCloseModal}
        session={selectedSession}
        selectedDate={selectedDate}
        onSessionUpdated={handleSessionUpdated}
        userRole={user?.role}
        showBookingButton={canPerformActions} // Only show booking button for quality role
        onBookSession={handleBookFromSheet}
        bookingLoading={bookingLoading}
      />

      {/* Booking Confirmation Dialog - Only for quality role */}
      {canPerformActions && (
        <AlertDialog open={bookingDialog} onOpenChange={handleDialogClose}>
          <AlertDialogContent
            onPointerDownOutside={(e) => {
              if (bookingLoading) {
                e.preventDefault();
                return;
              }
            }}
          >
            <AlertDialogHeader>
              <AlertDialogTitle>Book Session</AlertDialogTitle>
              <AlertDialogDescription>
                {sessionToBook && (
                  <div className="space-y-2">
                    <p>Are you sure you want to book this session?</p>
                    <div className="bg-gray-50 p-3 rounded-md">
                      <div className="text-sm">
                        <strong>Date:</strong>{" "}
                        {new Date(sessionToBook.day).toLocaleDateString()}
                      </div>
                      <div className="text-sm">
                        <strong>Time:</strong> {sessionToBook.start_time} -{" "}
                        {sessionToBook.end_time}
                      </div>
                      <div className="text-sm">
                        <strong>Status:</strong>{" "}
                        {sessionToBook.coaching === 1
                          ? "Quality Session"
                          : "Available Session"}
                      </div>
                    </div>
                    <p className="text-sm text-gray-600 mt-2">
                      This will mark the session as booked by the quality team.
                    </p>
                  </div>
                )}
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel disabled={bookingLoading}>
                Cancel
              </AlertDialogCancel>
              <AlertDialogAction
                onClick={handleBookingConfirm}
                disabled={bookingLoading}
                className="flex items-center gap-2"
              >
                {bookingLoading ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Booking...
                  </>
                ) : (
                  "Book Session"
                )}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      )}
    </>
  );
};

export default QualityCalendarView;
