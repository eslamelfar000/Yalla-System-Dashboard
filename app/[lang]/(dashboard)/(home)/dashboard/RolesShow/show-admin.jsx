"use client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import ReportsSnapshot from "../components/reports-snapshot";
import UserStats from "../components/user-stats-chart";
import ReportsArea from "../components/reports-area";
import TopContributer from "../../project/components/top-contributer";
import RevinueChart from "../../ecommerce/components/revinue-chart";
import DashboardSelect from "@/components/dasboard-select";
import EcommerceStats from "../../ecommerce/components/ecommerce-stats";
import NotesTable from "../components/notes-table";
import { SharedSheet } from "@/components/Shared/Drawer/shared-sheet";
import { useGetData } from "@/hooks/useGetData";
import { usePathname } from "next/navigation";
import { useMutate } from "@/hooks/useMutate";

const ShowAdmin = ({ role }) => {
  const pathname = usePathname();
  const { data, isLoading, error } = useGetData({
    endpoint: "dashboard/home-admin",
    enabledKey: ["admin", pathname],
  });

  const AdminData = data;

  const {
    mutate: addExpense,
    isPending: isAddingExpense,
    isSuccess: isAddedExpense,
  } = useMutate({
    method: "POST",
    endpoint: "dashboard/add-expense",
    queryKeysToInvalidate: ["expenses"],
    text: "Expense added successfully!",
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center flex-wrap justify-between gap-4">
        <div className="text-2xl font-medium text-default-800">Analytics</div>
      </div>

      <Card>
        <CardContent className="p-4">
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
            <EcommerceStats
              data={AdminData}
              isLoading={isLoading}
              error={error}
            />
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-12 gap-6">
        <div className="col-span-8">
          <ReportsSnapshot
            data={AdminData}
            isLoading={isLoading}
            error={error}
          />
        </div>
        <div className="col-span-4">
          <Card className="h-full">
            <CardHeader className="border-none p-6 pt-5 mb-20">
              <CardTitle className="text-lg font-semibold text-default-900 p-0">
                Reservation Types
              </CardTitle>
            </CardHeader>
            <CardContent>
              <UserStats data={AdminData} isLoading={isLoading} error={error} />
            </CardContent>
          </Card>
        </div>
      </div>

      <div className="grid grid-cols-12 gap-6">
        <div className="col-span-4">
          <div className="grid grid-cols-2 gap-4 h-full">
            <ReportsArea data={AdminData} isLoading={isLoading} error={error} />
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
              <RevinueChart
                data={AdminData}
                isLoading={isLoading}
                error={error}
              />
            </CardContent>
          </Card>
        </div>
      </div>

      <div className="grid grid-cols-12 gap-6">
        <div className="col-span-6">
          <TopContributer />
        </div>
        <div className="col-span-6">
          <Card title="Simple" className="h-full rounded-lg overflow-hidden">
            <div className="flex justify-between items-center gap-4 p-5">
              <div className="">
                <h3 className="text-xl font-medium text-default-700">
                  Expenses
                </h3>
              </div>
              <SharedSheet
                type="add-expense"
                addExpense={addExpense}
                isAddingExpense={isAddingExpense}
                isAddedExpense={isAddedExpense}
              />
            </div>
            <CardContent className="h-[510px] overflow-y-auto">
              <NotesTable />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default ShowAdmin;
