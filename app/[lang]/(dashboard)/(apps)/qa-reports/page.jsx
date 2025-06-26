"use client";
import React from "react";
import { ReportsDataTable } from "./reports-table";
import ReportsPage from "./reports-page";
import CoachingTableStatus from "../archive/QualityComponents/coaching-table";
import ProtectedRoute from "@/components/auth/ProtectedRoute";

function page() {
  return (
    <ProtectedRoute requiredRoles={["admin", "quality"]}>
      <div className="space-y-6">
        <ReportsDataTable />
        <div className="space-y-5">
          <div className="flex flex-wrap items-center gap-4 mb-1">
            <div className="flex-1">
              <h3 className="text-xl font-medium text-default-700 mb-2 opacity-60">
                Coaching
              </h3>
            </div>
          </div>
          <CoachingTableStatus action={"qa-reports"} />
        </div>
        <ReportsPage />
      </div>
    </ProtectedRoute>
  );
}

export default page;
