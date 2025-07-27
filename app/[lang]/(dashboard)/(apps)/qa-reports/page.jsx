"use client";
import React from "react";
import { ReportsDataTable } from "./reports-table";
import ReportsPage from "./reports-page";
import CoachingTableStatus from "../archive/QualityComponents/coaching-table";
import ProtectedRoute from "@/components/auth/ProtectedRoute";

function page() {
  return (
    <ProtectedRoute requiredRoles={["admin", "quality"]}>
      <div className="space-y-10">
        <ReportsDataTable />
        <div className="space-y-5">
          <CoachingTableStatus action={"qa-reports"} />
        </div>
        <ReportsPage />
      </div>
    </ProtectedRoute>
  );
}

export default page;
