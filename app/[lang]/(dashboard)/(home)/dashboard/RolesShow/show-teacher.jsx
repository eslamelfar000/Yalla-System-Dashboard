"use client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import ReportsSnapshot from "../components/reports-snapshot";
import UserStats from "../components/user-stats-chart";
import WelcomeBlock from "../../project/components/welcome-block";
import OverdueTask from "../../project/components/overdue-task";
import ReportsCard from "../../project/components/reports";
import DashboardSelect from "@/components/dasboard-select";
import TopSell from "../../ecommerce/components/top-sell";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useGetData } from "@/hooks/useGetData";
import { usePathname } from "next/navigation";

const ShowTeacher = ({ role }) => {
  const pathname = usePathname();
  const { data, isLoading, error } = useGetData({
    endpoint: "dashboard/home-teacher",
    enabledKey: ["teacher", pathname],
  });

  const TeacherData = data;

  return (
    <div className="space-y-6">
      <div className="flex items-center flex-wrap justify-between gap-4">
        <div className="text-2xl font-medium text-default-800">Analytics</div>
      </div>

      <div className="grid grid-cols-12 gap-6">
        <div className="col-span-12 md:col-span-4 mt-10 md:mt-0">
          <WelcomeBlock />
        </div>
        <div className="col-span-12 md:col-span-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 2xl:grid-cols-4 gap-4">
            <ReportsCard
              role={role}
              data={TeacherData}
              isLoading={isLoading}
              error={error}
            />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-12 gap-6">
        <div className="col-span-8">
          <ReportsSnapshot
            data={TeacherData}
            isLoading={isLoading}
            error={error}
          />
        </div>
        <div className="col-span-4">
          <Card className="h-full flex flex-col">
            <CardHeader className="border-none p-6 pt-5 mb-20">
              <CardTitle className="text-lg font-semibold text-default-900 p-0">
                Students Type
              </CardTitle>
            </CardHeader>
            <CardContent>
              <UserStats data={TeacherData} isLoading={isLoading} error={error} />
            </CardContent>
          </Card>
        </div>
      </div>

      {/* <div className="grid grid-cols-12 gap-6">
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
                <TopSell
                  data={TeacherData}
                  isLoading={isLoading}
                  error={error}
                />
              </ScrollArea>
            </CardContent>
          </Card>
        </div>
        <div className="col-span-6">
          <OverdueTask data={TeacherData} isLoading={isLoading} error={error} />
        </div>
      </div> */}
    </div>
  );
};

export default ShowTeacher;
