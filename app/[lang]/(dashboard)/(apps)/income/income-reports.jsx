"use client"
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Icon } from "@iconify/react";
import IncomeStats from "./income-stats";

const SalaryIncomeStat = () => {
  return (
    <Card className="h-full">
      <CardHeader className="border-none pb-0">
        <div className="flex items-center gap-1">
          <div className="flex-1">
            <div className="text-xl font-semibold text-default-900">
              {" "}
              Income{" "}
            </div>
            <span className="text-xs text-default-600 ml-1">
              In Last 30 Minutes
            </span>
          </div>
          <div className="flex-none flex items-center gap-1">
            <span className="text-4xl font-semibold text-primary">63</span>
            <span className="text-2xl text-success">
              <Icon icon="heroicons:arrow-trending-up-16-solid" />
            </span>
          </div>
        </div>
      </CardHeader>
      <CardContent className="px-5 pb-4">
        {/* <p className="text-xs font-medium text-default-800">User Per Minutes</p> */}
        <IncomeStats />
      </CardContent>
    </Card>
  );
};

export default SalaryIncomeStat;