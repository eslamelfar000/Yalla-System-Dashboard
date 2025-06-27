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

const TeacherFilter = ({ selectedTeacher, onTeacherChange, onClearFilter }) => {
  const { user } = useAuth();

  // Get teachers data for filter
  const { data: teachersData, isLoading: teachersLoading } = useGetData({
    endpoint: "dashboard/teachers",
    queryKey: ["teachers"],
  });

  const teachers = teachersData?.data || [];

  // Set default teacher to current user if they are a teacher
  useEffect(() => {
    if (user && user.role === "teacher" && user.id && !selectedTeacher) {
      onTeacherChange(user.id.toString());
    }
  }, [user, selectedTeacher, onTeacherChange]);

  const handleClearFilter = () => {
    onClearFilter();
  };

  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-4">
        <Label htmlFor="teacher-filter" className="text-sm font-medium">
          Filter by Teacher:
        </Label>
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
              <SelectItem key={teacher.id} value={teacher.id.toString()}>
                {teacher.name || teacher.email}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      {selectedTeacher && (
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
    </div>
  );
};

export default TeacherFilter;
