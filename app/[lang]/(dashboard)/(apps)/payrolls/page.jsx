"use client";
import { Card } from "@/components/ui/card";
import React from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import PayrollReportsCard from "./payroll-report-card";
import PayrollsrDataTable from "./payrolls-table";
import SummaryTable from "./summary-table";

function page() {
  return (
    <div>
      <div className="space-y-6">
        <div className="flex flex-wrap items-end gap-4">
          <div className="flex-1">
            <h3 className="text-xl font-medium text-default-700 opacity-60">
              Payrolls
            </h3>
          </div>
          <div className="flex-none">
            <Select>
              <SelectTrigger className="w-[180px]">
                <SelectValue
                  placeholder="Select Teacher"
                  className="whitespace-nowrap"
                />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="jan-12">Jan 12</SelectItem>
                <SelectItem value="jan-13">Jan 13</SelectItem>
                <SelectItem value="jan-14">Jan 14</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="col-span-12 md:col-span-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 2xl:grid-cols-4 gap-4">
            <PayrollReportsCard />
          </div>
        </div>

        <div className="cover space-y-20">
          {/* payrolls table */}
          <div className="cover">
            <PayrollsrDataTable />
          </div>

          {/* summary table */}
          <div className="">
            <SummaryTable />
          </div>
        </div>
      </div>
    </div>
  );
}

export default page;
