"use client";
import React, { useState } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import PayrollReportsCard from "./payroll-report-card";
import PayrollsTeacherDataTable from "./payroll-teacher-table";
import PayrollsQualityDataTable from "./payroll-quality-table";
import SummaryTable from "./summary-table";
import PayrollsTaps from "./index";
import ProtectedRoute from "@/components/auth/ProtectedRoute";

function page() {
  const [type, setType] = useState("teachers");

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
            <div className="flex-none">
              {type === "teachers" ? (
                <Select>
                  <SelectTrigger className="w-[250px]">
                    <SelectValue placeholder="Select Teachers" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="teachers">All Teachers</SelectItem>
                    <SelectItem value="active-teachers">
                      Active Teachers
                    </SelectItem>
                    <SelectItem value="inactive-teachers">
                      Inactive Teachers
                    </SelectItem>
                  </SelectContent>
                </Select>
              ) : (
                <Select>
                  <SelectTrigger className="w-[250px]">
                    <SelectValue placeholder="Select Quality Assurance" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="quality-assurance">
                      All Quality Assurance
                    </SelectItem>
                    <SelectItem value="active-quality-assurance">
                      Active Quality Assurance
                    </SelectItem>
                    <SelectItem value="inactive-quality-assurance">
                      Inactive Quality Assurance
                    </SelectItem>
                  </SelectContent>
                </Select>
              )}
            </div>
          </div>

          <div className="col-span-12 md:col-span-8">
            <div className="grid grid-cols-1 sm:grid-cols-2 2xl:grid-cols-4 gap-4">
              <PayrollReportsCard />
            </div>
          </div>

          <div className="cover space-y-10">
            {/* payrolls table */}

            {type === "teachers" ? (
              <div className="cover">
                <PayrollsTeacherDataTable />
              </div>
            ) : (
              <div className="cover">
                <PayrollsQualityDataTable />
              </div>
            )}

            {/* summary table */}
            <div className="">
              <SummaryTable />
            </div>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}

export default page;
