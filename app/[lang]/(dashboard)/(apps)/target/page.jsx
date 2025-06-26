"use client";
import React from "react";
import { TargetDataTable } from "./target-table";
import TargetsPage from "./targets-page";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import ProtectedRoute from "@/components/auth/ProtectedRoute";

function page() {
  return (
    <ProtectedRoute requiredRoles={["admin"]}>
      <div className="space-y-10">
        <TargetsPage />

        <div className="space-y-5">
          <div className="flex flex-wrap items-center gap-4">
            <div className="flex-1">
              <h3 className="text-xl font-medium text-default-700 opacity-60">
                Reports
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
          <TargetDataTable />
        </div>
      </div>
    </ProtectedRoute>
  );
}

export default page;
