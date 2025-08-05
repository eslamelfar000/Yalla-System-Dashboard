"use client";
import React, { useState } from "react";
import SalaryIncomeStat from "./income-reports";
import IncomeArea from "./income-area";
import SalariesDataTable from "./income-table";
import RolePageView from "./role-page-view";
import { Button } from "@/components/ui/button";
import IncomeChart from "./IncomeChart/income-chart";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import UserStats from "../../(home)/dashboard/components/user-stats-chart";
import { getUserRoleFromCookies } from "@/lib/auth-utils";
import { useGetData } from "@/hooks/useGetData";

function page() {
  const userRole = getUserRoleFromCookies();
  const [role, setRole] = useState(userRole);


  const { data, isLoading, error } = useGetData({
    endpoint: "dashboard/financial-dashboard",
    enabledKey: ["financial-dashboard"],
  });



  return (
    <div className="space-y-6">
      {role === "admin" ? (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-3 md:grid-cols-6 gap-4">
            <IncomeArea data={data} isLoading={isLoading} error={error} />
          </div>
          <div className="grid grid-cols-3 gap-4 ">
            <div className="col-span-2">
              {/* <SalaryIncomeStat /> */}
              <IncomeChart />
            </div>
            <div className="">
              <Card className="h-full">
                <CardHeader className="border-none p-6 pt-5">
                  <CardTitle className="text-lg font-semibold text-default-900 p-0">
                    Outcomes
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <UserStats />
                </CardContent>
              </Card>
            </div>
          </div>

          <div className="cover">
            <SalariesDataTable />
          </div>
        </>
      ) : (
        <RolePageView role={role} />
      )}
    </div>
  );
}

export default page;
