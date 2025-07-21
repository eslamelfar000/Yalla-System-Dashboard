import React, { useState, useCallback } from "react";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import ReviewTableStatus from "./review-table";
import CoachingTableStatus from "./coaching-table";
import TeacherFilter from "@/components/Shared/TeacherFilter.jsx";
import { Icon } from "@iconify/react";

function ShowQuality() {
  const [selectedTeacher, setSelectedTeacher] = useState("");
  const [selectedMonth, setSelectedMonth] = useState("");

  const handleTeacherChange = useCallback((teacherId) => {
    setSelectedTeacher(teacherId);
  }, []);

  const handleMonthChange = useCallback((month) => {
    setSelectedMonth(month);
  }, []);

  const handleClearFilter = useCallback(() => {
    setSelectedTeacher("");
    setSelectedMonth("");
  }, []);

  // Generate all 12 months
  const months = React.useMemo(() => {
    const months = [];
    const currentYear = new Date().getFullYear();

    for (let month = 1; month <= 12; month++) {
      const date = new Date(currentYear, month - 1, 1); // month - 1 because getMonth() is 0-based
      const monthNumber = month; // 1-12 format
      const monthLabel = date.toLocaleDateString("en-US", {
        month: "long",
      });
      months.push({ value: monthNumber.toString(), label: monthLabel });
    }
    return months;
  }, []);

  return (
    <div>
      <div className="flex-1 flex justify-between">
        <div className="flex items-center flex-wrap gap-2 mb-5">
          <TeacherFilter
            selectedTeacher={selectedTeacher}
            onTeacherChange={handleTeacherChange}
            onClearFilter={handleClearFilter}
            clearButton={false}
          />
          <Select value={selectedMonth} onValueChange={handleMonthChange}>
            <SelectTrigger className="w-[200px] h-10">
              <Icon icon="heroicons:calendar" className="w-4 h-4" />
              <SelectValue placeholder="Select Month" />
            </SelectTrigger>
            <SelectContent className="h-[300px] overflow-y-auto">
              <SelectItem value="" disabled>
                Select Month
              </SelectItem>
              {months.map((month) => (
                <SelectItem key={month.value} value={month.value}>
                  {month.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {(selectedMonth || selectedTeacher) && (
            <Button
              variant="outline"
              onClick={handleClearFilter}
              className="flex items-center gap-2"
            >
              <Icon icon="heroicons:x-mark" className="w-4 h-4" />
              Clear Filters
            </Button>
          )}
        </div>
        <Button>Download</Button>
      </div>

      <div className="space-y-6">
        <div>
          <h3 className="text-xl font-medium text-default-700 mb-2 opacity-60">
            Review
          </h3>
          <ReviewTableStatus
            selectedTeacher={selectedTeacher}
            selectedMonth={selectedMonth}
          />
        </div>
        <div>
          <h3 className="text-xl font-medium text-default-700 mb-2 opacity-60">
            Coaching
          </h3>
          <CoachingTableStatus
            action={"archive"}
            selectedTeacher={selectedTeacher}
            selectedMonth={selectedMonth}
          />
        </div>
      </div>
    </div>
  );
}

export default ShowQuality;
