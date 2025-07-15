"use client";
import { useEffect, useState } from "react";
import { useAuth } from "@/hooks/use-auth";
import CalendarView from "./calender-view";
import TeacherCalendarView from "./teacher-calendar-view";
import QualityCalendarView from "./quality-calendar-view";
import { getEvents, getTeacherSessions } from "@/config/calendar.config";
import toast from "react-hot-toast";

const CalendarWrapper = () => {
  const { user } = useAuth();
  const [events, setEvents] = useState(null);
  const [teacherSessions, setTeacherSessions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (user?.role === "teacher") {
          // Fetch teacher sessions

          // Ensure we have a teacher ID
          if (!user?.id) {
            toast.error("Teacher ID not found. Please log in again.");
            setTeacherSessions([]);
            return;
          }

          const sessionsResponse = await getTeacherSessions(
            user.id,
            null,
            user.role
          );

          if (sessionsResponse?.success) {
            const sessionsData = Array.isArray(sessionsResponse.data)
              ? sessionsResponse.data
              : [];
            setTeacherSessions(sessionsData);
          } else {
            setTeacherSessions([]);
            // Show error message to user
            toast.error("Failed to fetch sessions. Please try again.");
          }
        } else {
          // Fetch regular events for other roles
          const eventsData = await getEvents();
          setEvents(eventsData?.data);
        }
      } catch (error) {
        if (user?.role === "teacher") {
          setTeacherSessions([]);
          toast.error("Error loading sessions. Please refresh the page.");
        }
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      fetchData();
    } else {
    }
  }, [user]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
          <p className="mt-2 text-sm text-gray-600">Loading calendar...</p>
        </div>
      </div>
    );
  }

  // Show teacher-specific calendar for teachers
  if (user?.role === "teacher") {
    return <TeacherCalendarView sessions={teacherSessions} />;
  }

  // Show quality-specific calendar for quality role
  if (user?.role === "quality" || user?.role === "admin") {
    return <QualityCalendarView />;
  }

  // Show regular calendar for other roles
};

export default CalendarWrapper;
