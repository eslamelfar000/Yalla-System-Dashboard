"use client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import ReportsSnapshot from "./components/reports-snapshot";
import UserStats from "./components/user-stats-chart";
import ReportsArea from "./components/reports-area";
import WelcomeBlock from "../project/components/welcome-block";
import OverdueTask from "../project/components/overdue-task";
import UpcomingDeadline from "../project/components/upcoming-deadlines";
import TopContributer from "../project/components/top-contributer";
import ReportsCard from "../project/components/reports";
import RevinueChart from "../ecommerce/components/revinue-chart";
import DashboardSelect from "@/components/dasboard-select";
import TopSell from "../ecommerce/components/top-sell";
import EcommerceStats from "../ecommerce/components/ecommerce-stats";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useState } from "react";
import NotesTable from "./components/notes-table";
import { SharedDrawer } from "../../../../../components/Shared/Drawer/shared-drawer";
import { Button } from "@/components/ui/button";

const DashboardPageView = ({ trans }) => {
  const [role, setRole] = useState("admin");

  return (
    <>
      {/* Role Switch Buttons */}
      <ul className="flex items-center justify-center gap-4 my-6">
        <li>
          <Button onClick={() => setRole("admin")}>Admin</Button>
        </li>
        <li>
          <Button onClick={() => setRole("teacher")}>Teacher</Button>
        </li>
        <li>
          <Button onClick={() => setRole("quality")}>Quality</Button>
        </li>
      </ul>

      {/* Admin Dashboard */}
      {role === "admin" && (
        <div className="space-y-6">
          <div className="flex items-center flex-wrap justify-between gap-4">
            <div className="text-2xl font-medium text-default-800">
              Analytics {trans?.dashboard}
            </div>
          </div>

          <Card>
            <CardContent className="p-4">
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
                <EcommerceStats />
              </div>
            </CardContent>
          </Card>

          <div className="grid grid-cols-12 gap-6">
            <div className="col-span-8">
              <ReportsSnapshot />
            </div>
            <div className="col-span-4">
              <Card className="h-full">
                <CardHeader className="border-none p-6 pt-5 mb-20">
                  <CardTitle className="text-lg font-semibold text-default-900 p-0">
                    Students types
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <UserStats />
                </CardContent>
              </Card>
            </div>
          </div>

          <div className="grid grid-cols-12 gap-6">
            <div className="col-span-4">
              <div className="grid grid-cols-2 gap-4 h-full">
                <ReportsArea />
              </div>
            </div>
            <div className="col-span-8">
              <Card>
                <CardHeader className="border-none pb-0 mb-0">
                  <div className="flex flex-wrap items-center gap-3">
                    <CardTitle className="flex-1 whitespace-nowrap">
                      Average Revenue
                    </CardTitle>
                    <div className="flex-none">
                      <DashboardSelect />
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="px-0">
                  <RevinueChart />
                </CardContent>
              </Card>
            </div>
          </div>

          <div className="grid grid-cols-12 gap-6">
            <div className="col-span-6">
              <TopContributer />
            </div>
            <div className="col-span-6">
              <Card title="Simple">
                <div className="flex flex-wrap items-center gap-4 p-5">
                  <div className="flex-1">
                    <h3 className="text-xl font-medium text-default-700 mb-2">
                      Expenses
                    </h3>
                  </div>
                  <div className="flex-none">
                    <SharedDrawer />
                  </div>
                </div>
                <CardContent className="h-[510px] overflow-y-auto">
                  <NotesTable />
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      )}

      {/* Quality Dashboard */}
      {role === "quality" && (
        <div className="space-y-6">
          <div className="flex items-center flex-wrap justify-between gap-4">
            <div className="text-2xl font-medium text-default-800">
              Analytics {trans?.dashboard}
            </div>
          </div>

          <div className="grid grid-cols-12 gap-6">
            <div className="col-span-12 md:col-span-4 mt-10 md:mt-0">
              <WelcomeBlock />
            </div>
            <div className="col-span-12 md:col-span-8">
              <div className="grid grid-cols-1 sm:grid-cols-2 2xl:grid-cols-4 gap-4">
                <ReportsCard />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-12 gap-6">
            <div className="col-span-12">
              <UpcomingDeadline />
            </div>
          </div>
        </div>
      )}

      {/* Teacher Dashboard */}
      {role === "teacher" && (
        <div className="space-y-6">
          <div className="flex items-center flex-wrap justify-between gap-4">
            <div className="text-2xl font-medium text-default-800">
              Analytics {trans?.dashboard}
            </div>
          </div>

          <div className="grid grid-cols-12 gap-6">
            <div className="col-span-12 md:col-span-4 mt-10 md:mt-0">
              <WelcomeBlock />
            </div>
            <div className="col-span-12 md:col-span-8">
              <div className="grid grid-cols-1 sm:grid-cols-2 2xl:grid-cols-4 gap-4">
                <ReportsCard />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-12 gap-6">
            <div className="col-span-8">
              <ReportsSnapshot />
            </div>
            <div className="col-span-4">
              <Card className="h-full flex flex-col">
                <CardHeader className="border-none p-6 pt-5 mb-20">
                  <CardTitle className="text-lg font-semibold text-default-900 p-0">
                    Students Type
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <UserStats />
                </CardContent>
              </Card>
            </div>
          </div>

          <div className="grid grid-cols-12 gap-6">
            <div className="col-span-6">
              <Card>
                <CardHeader className="mb-0">
                  <div className="flex flex-wrap items-center gap-3">
                    <CardTitle className="flex-1 whitespace-nowrap">
                      Top Sell
                    </CardTitle>
                    <div className="flex-none">
                      <DashboardSelect />
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="px-0 pt-0 h-[520px] pb-2">
                  <ScrollArea className="h-full">
                    <TopSell />
                  </ScrollArea>
                </CardContent>
              </Card>
            </div>
            <div className="col-span-6">
              <OverdueTask />
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default DashboardPageView;
