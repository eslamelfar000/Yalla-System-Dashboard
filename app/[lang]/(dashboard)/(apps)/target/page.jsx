"use client";
import React from "react";
import { TargetDataTable } from "./target-table";
import TargetsPage from "./targets-page";

function page() {
  return (
    <div className="space-y-6">
      <TargetsPage />

      <div className="flex-1 mt-10">
        <h3 className="text-xl font-medium text-default-700 mb-2 opacity-60">
          October
        </h3>
      </div>

      <TargetDataTable />
    </div>
  );
}

export default page;
