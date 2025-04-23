"use client";
import React from "react";
import { ReportsDataTable } from "./reports-table";
import ReportsPage from "./reports-page";

function page() {
  return (
    <div className="space-y-6">
      <ReportsDataTable />
      <ReportsPage />
    </div>
  );
}

export default page;
