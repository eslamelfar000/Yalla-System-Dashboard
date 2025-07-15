"use client";
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Calendar, Clock, User } from "lucide-react";
import { formatDate } from "@/lib/utils";
import { bookSession } from "@/config/calendar.config";
import toast from "react-hot-toast";
import { useAuth } from "@/hooks/use-auth";

const QualitySessionSelector = ({
  open,
  onClose,
  selectedDate,
  availableSessions = [],
  onSessionBooked,
  selectedTeacher,
}) => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [selectedSession, setSelectedSession] = useState(null);

  const handleBookSession = async (session) => {
    try {
      setLoading(true);
      setSelectedSession(session);

      const bookingData = {
        date: session.day,
        start_time: session.start_time,
        end_time: session.end_time,
        teacher_id: session.teacher_id,
      };

      const response = await bookSession(session.id, bookingData, user?.role);

      if (response?.success) {
        toast.success("Session booked successfully");
        onClose();
        onSessionBooked?.();
      } else {
        toast.error(response?.message || "Failed to book session");
      }
    } catch (error) {
      toast.error("Failed to book session");
    } finally {
      setLoading(false);
      setSelectedSession(null);
    }
  };

  const formatTime = (timeStr) => {
    if (!timeStr) return "";

    // Convert 24-hour to 12-hour format
    const [hours, minutes] = timeStr.split(":");
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? "PM" : "AM";
    const displayHour = hour % 12 || 12;
    return `${displayHour}:${minutes} ${ampm}`;
  };

  const formatSessionDate = (dateStr) => {
    if (!dateStr) return "";
    const date = new Date(dateStr);
    return formatDate(date, "PPP");
  };

  return (
    <Sheet open={open} onOpenChange={onClose}>
      <SheetContent className="px-0">
        <SheetHeader className="px-6">
          <SheetTitle>Select Available Session</SheetTitle>
        </SheetHeader>
        <div className="mt-6 h-full">
          <div className="h-[calc(100vh-150px)]">
            <ScrollArea className="h-full">
              <div className="space-y-4 pb-5 px-6">
                {selectedDate && (
                  <Card>
                    <CardContent className="p-4">
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-blue-500" />
                        <span className="font-medium">
                          {formatSessionDate(selectedDate.dateStr)}
                        </span>
                      </div>
                    </CardContent>
                  </Card>
                )}

                {availableSessions.length === 0 ? (
                  <Card>
                    <CardContent className="p-6 text-center">
                      <div className="space-y-2">
                        <Clock className="w-8 h-8 text-gray-400 mx-auto" />
                        <h3 className="font-medium text-gray-900">
                          No Available Sessions
                        </h3>
                        <p className="text-sm text-gray-500">
                          All sessions for this date are either booked or
                          blocked.
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                ) : (
                  <div className="space-y-3">
                    <h3 className="font-medium text-gray-900">
                      Available Sessions ({availableSessions.length})
                    </h3>
                    {availableSessions.map((session) => (
                      <Card
                        key={session.id}
                        className="cursor-pointer hover:shadow-md transition-shadow"
                        onClick={() => handleBookSession(session)}
                      >
                        <CardContent className="p-4">
                          <div className="space-y-3">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-2">
                                <Clock className="w-4 h-4 text-blue-500" />
                                <span className="font-medium">
                                  {formatTime(session.start_time)} -{" "}
                                  {formatTime(session.end_time)}
                                </span>
                              </div>
                              <Badge
                                variant="secondary"
                                className="bg-blue-100 text-blue-800"
                              >
                                Available
                              </Badge>
                            </div>

                            {session.coaching !== null &&
                              session.coaching !== undefined && (
                                <div className="flex items-center gap-2">
                                  <User className="w-4 h-4 text-green-500" />
                                  <span className="text-sm text-gray-600">
                                    Quality:{" "}
                                    {session.coaching === 1 ? "Good" : "Poor"}
                                  </span>
                                </div>
                              )}
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </div>
            </ScrollArea>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default QualitySessionSelector;
