"use client";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Icon } from "@iconify/react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useGetData } from "@/hooks/useGetData";
import { useAuth } from "@/hooks/use-auth";
import { Skeleton } from "../ui/skeleton";

const TeacherFilter = ({
  selectedTeacher,
  onTeacherChange,
  onClearFilter,
  clearButton = true,
  quality = false,
  payrolls = false,
}) => {
  const { user } = useAuth();

  // Get teachers data for filter
  const {
    data: teachersData,
    isLoading: teachersLoading,
    error: teachersError,
  } = useGetData({
    endpoint: "dashboard/teachers",
    queryKey: ["teachers"],
  });

  const teachers = teachersData?.data || [];

  // Set default teacher to first teacher in list for quality role
  useEffect(() => {
    if (quality && teachers.length > 0 && !selectedTeacher) {
      // Use user_id for quality role
      onTeacherChange(teachers[0].user_id.toString());
    } else if (user && user.role === "teacher" && user.id && !selectedTeacher) {
      onTeacherChange(user.id.toString());
    }
  }, [user, selectedTeacher, onTeacherChange, quality, teachers]);

  const handleClearFilter = () => {
    onClearFilter();
  };

  if (teachersLoading) {
    return <Skeleton className="h-10 w-[200px]" />;
  }

  if (teachersError) {
    return <div className="text-red-500">Error loading teachers</div>;
  }

  return (
    <div className="flex items-center justify-between gap-4">
      {selectedTeacher && clearButton && (
        <Button
          variant="outline"
          size="sm"
          onClick={handleClearFilter}
          className="h-8"
        >
          <Icon icon="heroicons:x-mark" className="w-4 h-4 mr-1" />
          Clear Filter
        </Button>
      )}
      <div className="flex items-center gap-4">
        <Select
          value={selectedTeacher || "Select your teacher"}
          onValueChange={onTeacherChange}
        >
          <SelectTrigger className="w-48">
            <SelectValue placeholder="Select your teacher" />
          </SelectTrigger>
          <SelectContent defaultValue={"Select your teacher"}>
            <SelectItem value="Select your teacher" disabled>
              Select your teacher
            </SelectItem>
            {teachers.map((teacher) => (
              <SelectItem
                key={teacher.id}
                value={
                  quality || payrolls
                    ? teacher.user_id.toString()
                    : teacher.id.toString()
                }
              >
                {teacher.name || teacher.email}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
};

export default TeacherFilter;
