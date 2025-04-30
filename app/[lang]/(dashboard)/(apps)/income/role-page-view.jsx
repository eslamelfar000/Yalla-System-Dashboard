"use client";
import React, { useState } from "react";
import IncomeReportsCard from "./Components/income-cards";
import IncomeRolesDataTable from "./Components/income-role-table";
import IncomeSummaryTable from "./Components/summary-table";

function RolePageView() {
  return (
    <div>
      <div className="space-y-6">
        <div className="flex flex-wrap items-end gap-4">
          <div className="flex-1">
            <h3 className="text-xl font-medium text-default-700 opacity-60">
              Income
            </h3>
          </div>
          <div className="flex-none"></div>
        </div>

        <div className="col-span-12 md:col-span-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 2xl:grid-cols-4 gap-4">
            <IncomeReportsCard />
          </div>
        </div>

        <div className="cover space-y-10">
          {/* income table */}
          <div className="cover">
            <IncomeRolesDataTable />
          </div>

          {/* summary table */}
          <div className="">
            <IncomeSummaryTable />
          </div>
        </div>
      </div>
    </div>
  );
}

export default RolePageView;
