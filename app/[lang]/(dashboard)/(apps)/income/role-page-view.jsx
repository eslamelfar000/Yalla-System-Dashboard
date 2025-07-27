"use client";
import React, { useState } from "react";
import IncomeReportsCard from "./Components/income-cards";
import IncomeTeacherDataTable from "./Components/income-teacher-table";
import IncomeQualityDataTable from "./Components/income-quality-table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

function RolePageView({ role }) {
  const [selectedMonth, setSelectedMonth] = useState("");
  const handleMonthChange = React.useCallback((month) => {
    setSelectedMonth(month);
  }, []);

  // Generate all 12 months
  const months = React.useMemo(() => {
    const months = [];
    const currentDate = new Date();
    const currentYear = currentDate.getFullYear();
    const currentMonth = currentDate.getMonth();

    // Get last 12 months including current month
    for (let i = 0; i < 12; i++) {
      const date = new Date(currentYear, currentMonth - i, 1);
      const monthNumber = (date.getMonth() + 1).toString().padStart(2, "0");
      const monthLabel = date.toLocaleDateString("en-US", {
        month: "long",
        year: "numeric"
      });
      months.push({
        value: `${date.getFullYear()}-${monthNumber}`,
        label: monthLabel
      });
    }

    return months;
  }, []);
  
  return (
    <div>
      <div className="space-y-6">
        <div className="flex flex-wrap items-end gap-4">
          <div className="flex-1">
            <h3 className="text-xl font-medium text-default-700 opacity-60">
              Income
            </h3>
          </div>
          <div className="flex-none">
            <Select value={selectedMonth} onValueChange={handleMonthChange}>
              <SelectTrigger className="w-[200px]">
                <SelectValue
                  placeholder="Select Month"
                  className="whitespace-nowrap"
                />
              </SelectTrigger>
              <SelectContent className="h-[300px] overflow-y-auto">
                <SelectItem value="">All Months</SelectItem>
                {months.map((month) => (
                  <SelectItem key={month.value} value={month.value}>
                    {month.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="col-span-12 md:col-span-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 2xl:grid-cols-4 gap-4">
            <IncomeReportsCard role={role} selectedMonth={selectedMonth} />
          </div>
        </div>

        <div className="cover space-y-10">
          {/* income table */}
          {role === "quality" ? (
            <div className="cover">
              <IncomeQualityDataTable selectedMonth={selectedMonth} />
            </div>
          ) : (
            <div className="cover">
              <IncomeTeacherDataTable selectedMonth={selectedMonth} />
            </div>
          )}

          {/* summary table */}
          {/* <div className="">
            <IncomeSummaryTable />
          </div> */}
        </div>
      </div>
    </div>
  );
}

export default RolePageView;
