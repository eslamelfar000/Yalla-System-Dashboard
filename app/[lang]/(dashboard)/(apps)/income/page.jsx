"use client";
import React from "react";
import SalaryIncomeStat from "./income-reports";
import IncomeArea from "./income-area";
import SalariesDataTable from "./income-table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
function page() {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-12 gap-6 ">
        <div className="col-span-12 2xl:col-span-8">
          <SalaryIncomeStat />
        </div>
        <div className="grid col-span-12 2xl:col-span-4 grid-cols-1 sm:grid-cols-2 gap-4">
          <IncomeArea />
        </div>
      </div>

      <div className="cover">
        <SalariesDataTable />
      </div>
    </div>
  );
}

export default page;
