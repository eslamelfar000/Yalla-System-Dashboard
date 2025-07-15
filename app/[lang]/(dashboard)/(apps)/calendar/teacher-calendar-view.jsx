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
import { getTeacherSessions } from "@/config/calendar.config";
import toast from "react-hot-toast";
import { Loader2, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";

const TeacherCalendarView = ({ sessions = [] }) => {
  const { user } = useAuth();
  const [calendarSessions, setCalendarSessions] = useState(sessions);
  const [loading, setLoading] = useState(false);
  const [sheetOpen, setSheetOpen] = useState(false);
  const [selectedSession, setSelectedSession] = useState(null);
  const [selectedDate, setSelectedDate] = useState(null);

  // Function to convert 12-hour time to 24-hour format
  const convertTo24Hour = (timeStr) => {
    if (!timeStr) return "00:00";

    // Remove any extra spaces and convert to lowercase
    const cleanTime = timeStr.toLowerCase().trim();

    // Check if it's already in 24-hour format (no am/pm)
    if (!cleanTime.includes("am") && !cleanTime.includes("pm")) {
      return cleanTime;
    }

    // Extract time and period
    const match = cleanTime.match(/(\d{1,2}):(\d{2})\s*(am|pm)/);
    if (!match) return "00:00";

    let [_, hours, minutes, period] = match;
    hours = parseInt(hours);

    // Convert to 24-hour format
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

    // Parse times to compare
    const startHour = parseInt(start24.split(":")[0]);
    const startMinute = parseInt(start24.split(":")[1]);
    const endHour = parseInt(end24.split(":")[0]);
    const endMinute = parseInt(end24.split(":")[1]);

    // Convert to minutes for comparison
    const startMinutes = startHour * 60 + startMinute;
    const endMinutes = endHour * 60 + endMinute;

    // If end time is before or equal to start time, add 1 hour to end time
    if (endMinutes <= startMinutes) {
      const newEndHour = startHour + 1;
      const newEndTime = `${String(newEndHour).padStart(2, "0")}:${String(
        startMinute
      ).padStart(2, "0")}`;
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
        console.error("Invalid date:", dateStr);
        return null;
      }

      // Format as YYYY-MM-DD
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, "0");
      const day = String(date.getDate()).padStart(2, "0");
      return `${year}-${month}-${day}`;
    } catch (error) {
      return null;
    }
  };

  // Update sessions when props change
  useEffect(() => {
    setCalendarSessions(sessions);
  }, [sessions]);

  // Also fetch sessions on component mount if no sessions provided
  useEffect(() => {
    if (sessions.length === 0 && user?.id) {
      fetchSessions();
    }
  }, [user?.id, sessions.length]);

  // Fetch teacher sessions (for refresh)
  const fetchSessions = async () => {
    try {
      setLoading(true);
      const response = await getTeacherSessions(user?.id, null, user?.role);

      if (response?.success) {
        // Handle external API response format
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
      // Handle the API data structure
      const sessionData = session;

      // Validate and format date
      const formattedDate = formatDate(sessionData.day);
      if (!formattedDate) {
        return null;
      }

      // Convert and validate time formats
      const { start: startTime24, end: endTime24 } = validateAndFixTimes(
        sessionData.start_time,
        sessionData.end_time
      );

      // Create title based on booking and coaching status
      let title = "";
      if (sessionData.is_booked) {
        // Booked sessions with student - GREEN (regardless of coaching value)
        if (sessionData.student?.name) {
          title = `${sessionData.student.name}`;
        } else {
          title = "Booked";
        }
      } else if (
        sessionData.coaching !== null &&
        sessionData.coaching !== undefined &&
        sessionData.coaching !== ""
      ) {
        // Sessions with coaching quality but NOT booked - RED
        title = `Quality ${sessionData.coaching === 1 ? "Good" : "Poor"}`;
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
          coaching: sessionData.coaching,
          teacher_id: sessionData.teacher_id,
          admin_status: sessionData.admin_status,
          booking_status: sessionData.booking_status,
          booking_date: sessionData.booking_date,
          sessionData: sessionData,
        },
      };

      // Simple validation to ensure event is created properly
      if (!event.start || !event.end || !event.title) {
        return null;
      }

      return event;
    })
    .filter(Boolean);

  // Event click handler
  const handleEventClick = (arg) => {
    const sessionData = arg.event.extendedProps.sessionData;

    // Check if session is booked
    if (sessionData.is_booked) {
      // Show booked session details but don't allow editing
      setSelectedSession(arg.event);
      setSelectedDate(null);
      setSheetOpen(true);
    } else {
      // Allow editing for available sessions
      setSelectedSession(arg.event);
      setSelectedDate(null);
      setSheetOpen(true);
    }
  };

  // Date click handler
  const handleDateClick = (arg) => {
    // Check if the clicked date is in the past
    const clickedDate = new Date(arg.date);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (clickedDate < today) {
      toast.error("Cannot create sessions in the past");
      return;
    }

    setSelectedDate(arg);
    setSelectedSession(null);
    setSheetOpen(true);
  };

  // Close modal
  const handleCloseModal = () => {
    setSheetOpen(false);
    setSelectedSession(null);
    setSelectedDate(null);
  };

  // Handle session updates
  const handleSessionUpdated = () => {
    fetchSessions();
  };

  // Event class names based on booking status and coaching quality
  const handleClassName = (arg) => {
    const { is_booked, coaching } = arg.event.extendedProps;

    if (is_booked && coaching === 0) {
      // Booked sessions with student - GREEN (regardless of coaching value)
      return "bg-green-500 text-white border-green-600 hover:bg-green-600 transition-colors";
    } else if (coaching === 1) {
      // Sessions with coaching quality but NOT booked - RED
      return "bg-red-500 text-white border-red-600 hover:bg-red-600 transition-colors";
    } else {
      // Available sessions - PRIMARY
      return "bg-primary text-primary-foreground border-primary hover:bg-primary/90 transition-colors";
    }
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
          {/* Session Legend */}
          <div className="mb-4">
            <div className="flex justify-center gap-4 text-sm">
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-primary border border-primary rounded"></div>
                <span>Available Sessions</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-green-500 border border-green-600 rounded"></div>
                <span>Booked with Student</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-red-500 border border-red-600 rounded"></div>
                <span>Booked with Quality</span>
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
            selectable={true}
            selectMirror={true}
            weekends={true}
            eventClassNames={handleClassName}
            dateClick={handleDateClick}
            eventClick={handleEventClick}
            initialView="timeGridWeek"
            views={{
              timeGridWeek: {
                type: "timeGrid",
                duration: { days: 7 },
                buttonText: "Week",
              },
            }}
            height="auto"
            selectConstraint={{
              start: new Date().toISOString().split("T")[0], // Today
              end: "2100-12-31", // Far future
            }}
            validRange={{
              start: new Date().toISOString().split("T")[0], // Cannot navigate to past
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
      />
    </>
  );
};

export default TeacherCalendarView;
