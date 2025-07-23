"use client";
import React, { useState } from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import PayrollsTaps from "./index";
import ProtectedRoute from "@/components/auth/ProtectedRoute";
import IncomeTeacherDataTable from "../income/Components/income-teacher-table";
import TeacherFilter from "@/components/Shared/TeacherFilter";
import IncomeQualityDataTable from "../income/Components/income-quality-table";
import QualityFilter from "@/components/Shared/QualityFilter";
import IncomeReportsCard from "../income/Components/income-cards";
import { getUserRoleFromCookies } from "@/lib/auth-utils";
function page() {
  const [type, setType] = useState("teachers");
  const [selectedTeacher, setSelectedTeacher] = useState(null);
  const [selectedQuality, setSelectedQuality] = useState(null);
  const userRole = getUserRoleFromCookies();
  const [role, setRole] = useState(userRole);
  const [selectedMonth, setSelectedMonth] = React.useState("");

  const handleTeacherChange = (teacher) => {
    setSelectedTeacher(teacher);
  };
  const handleClearFilter = () => {
    setSelectedTeacher(null);
  };

  const handleQualityChange = (quality) => {
    setSelectedQuality(quality);
  };
  const handleClearQualityFilter = () => {
    setSelectedQuality(null);
  };

  const handleMonthChange = React.useCallback((month) => {
    setSelectedMonth(month);
  }, []);

  // Generate all 12 months
  const months = React.useMemo(() => {
    const months = [];
    const currentYear = new Date().getFullYear();

    for (let month = 1; month <= 12; month++) {
      const date = new Date(currentYear, month - 1, 1); // month - 1 because getMonth() is 0-based
      const monthNumber = month.toString().padStart(2, "0"); // 01-12 format
      const monthLabel = date.toLocaleDateString("en-US", {
        month: "long",
      });
      months.push({ value: monthNumber, label: monthLabel });
    }
    return months;
  }, []);

  return (
    <ProtectedRoute requiredRoles={["admin"]}>
      <div>
        <div className="space-y-6">
          <PayrollsTaps setType={setType} />
          <div className="flex flex-wrap items-end gap-4">
            <div className="flex-1">
              <h3 className="text-xl font-medium text-default-700 opacity-60">
                {type === "teachers" ? "Teachers" : "Quality"} Payrolls
              </h3>
            </div>
            <div className="flex gap-4">
              {type === "teachers" ? (
                <TeacherFilter
                  selectedTeacher={selectedTeacher}
                  onTeacherChange={handleTeacherChange}
                  onClearFilter={handleClearFilter}
                  payrolls={true}
                />
              ) : (
                <QualityFilter
                  selectedQuality={selectedQuality}
                  onQualityChange={handleQualityChange}
                  onClearFilter={handleClearQualityFilter}
                />
              )}
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
              <IncomeReportsCard
                type={type}
                role={role}
                selectedTeacher={selectedTeacher}
                selectedQuality={selectedQuality}
                selectedMonth={selectedMonth}
              />
            </div>
          </div>

          <div className="cover space-y-10">
            {/* payrolls table */}

            {type === "teachers" ? (
              <div className="cover">
                <IncomeTeacherDataTable
                  type="admin-payrolls"
                  selectedTeacher={selectedTeacher}
                  selectedMonth={selectedMonth}
                />
              </div>
            ) : (
              <div className="cover">
                <IncomeQualityDataTable
                  type="admin-payrolls"
                  selectedQuality={selectedQuality}
                  selectedMonth={selectedMonth}
                />
              </div>
            )}

            {/* summary table */}
            {/* <div className="">
              <SummaryTable />
            </div> */}
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}

export default page;
