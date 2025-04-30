"use client";
import React, { useState } from "react";
import SalaryIncomeStat from "./income-reports";
import IncomeArea from "./income-area";
import SalariesDataTable from "./income-table";
import RolePageView from "./role-page-view";
import { Button } from "@/components/ui/button";

function page() {
  const [role, setRole] = useState("admin");
  return (
    <div className="space-y-6">

      <ul className="flex items-center space-x-4 mb-4">
        <li>
          <Button onClick={
            () => {
              setRole("admin");
            }
          }>Admin</Button>
        </li>
        <li>
          <Button onClick={
            () => {
              setRole("teacher");
            }
          }>Teacher</Button>
        </li>
      </ul>

      {role === "admin" ? (
        <>
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
        </>
      ) : (
        <RolePageView />
      )}
    </div>
  );
}

export default page;
