"use client";

import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Calendar,
  CalendarClock,
  CalendarDays,
  DoorClosed,
  FileText,
  TrendingUp,
  Users,
} from "lucide-react";
import { Fragment } from "react";

const ReportsCard = ({ role, data, isLoading, error }) => {
  const teacherReports = [
    {
      id: 1,
      name: "Total Students",
      count: data?.students || 0,
      rate: "8.2",
      icon: <Users className="w-6 h-6 text-primary" />,
      color: "primary",
    },
    {
      id: 2,
      name: "Total Lessons",
      count: data?.lessons || 0,
      rate: "8.2",
      icon: <Calendar className="w-6 h-6 text-success" />,
      color: "success",
    },
    {
      id: 3,
      name: "New Reports",
      count: data?.new_reports || 0,
      rate: "8.2",
      icon: <DoorClosed className="w-6 h-6 text-destructive" />,
      color: "destructive",
    },
    {
      id: 4,
      name: "New Reservations",
      count: data?.new_reservations || 0,
      rate: "8.2",
      icon: <FileText className="w-6 h-6 text-info" />,
      color: "info",
    },
  ];

  const qualityReports = [
    {
      id: 1,
      name: "Teachers",
      count: data?.teacher_count || 0,
      rate: "8.2",
      icon: <Users className="w-6 h-6 text-primary" />,
      color: "primary",
    },
    {
      id: 2,
      name: "Coaching Sessions",
      count: data?.coaching_count || 0,
      rate: "8.2",
      icon: <Calendar className="w-6 h-6 text-success" />,
      color: "success",
    },
    {
      id: 3,
      name: "Today's Sessions",
      count: data?.today_sessions || 0,
      rate: "8.2",
      icon: <CalendarClock className="w-6 h-6 text-destructive" />,
      color: "destructive",
    },
    {
      id: 4,
      name: "Upcoming Sessions",
      count: data?.next_sessions || 0,
      rate: "8.2",
      icon: <CalendarDays className="w-6 h-6 text-info" />,
      color: "info",
    },
  ];

  return (
    <Fragment>
      {(role === "teacher" ? teacherReports : qualityReports).map((item) => (
        <Card
          key={item.id}
          className="rounded-lg p-4 xl:p-2 xl:py-6 2xl:p-6  flex flex-col items-center 2xl:min-w-[168px]"
        >
          <div>
            <span
              className={`h-12 w-12 rounded-full flex justify-center items-center bg-${item.color}/10`}
            >
              {item.icon}
            </span>
          </div>
          <div className="mt-4 text-center w-full">
            <div className="text-md font-[700] text-default-600">
              {item.name}
            </div>
            <div
              className={`text-3xl font-semibold text-${item.color} mt-2 w-full`}
            >
              {isLoading ? <Skeleton className="w-full h-9" /> : item.count}
            </div>
          </div>
        </Card>
      ))}
    </Fragment>
  );
};

export default ReportsCard;
