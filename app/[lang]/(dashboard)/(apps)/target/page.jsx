"use client";
import React from "react";
import { TargetDataTable } from "./target-table";
import TargetsPage from "./targets-page";
import ProtectedRoute from "@/components/auth/ProtectedRoute";

function page() {
  return (
    <ProtectedRoute requiredRoles={["teacher"]}>
      <div className="space-y-10">
        <TargetsPage />

        <TargetDataTable />
      </div>
    </ProtectedRoute>
  );
}

export default page;
