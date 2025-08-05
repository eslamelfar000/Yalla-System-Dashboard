"use client";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { Icon } from "@iconify/react";
import { Cup, Eye, Increase, Session } from "@/components/svg";
import { Loader2 } from "lucide-react";

const IncomeArea = ({ data, isLoading, error }) => {
  console.log(data);

  const reports = [
    {
      id: 1,
      name: "Revenue",
      count: data?.revenue?.current || 0,
      rate: data?.revenue?.percentage || 0,
      isUp: data?.revenue?.trend === "up" ? true : false,
      icon: <Session className="h-4 w-4" />,
      color: "primary",
      previous: data?.revenue?.previous || 0,
    },
    {
      id: 2,
      name: "Income",
      count: data?.income?.current || 0,
      rate: data?.income?.percentage || 0,
      isUp: data?.income?.trend === "up" ? true : false,
      icon: <Eye className="h-4 w-4" />,
      color: "info",
      previous: data?.income?.previous || 0,
    },
    {
      id: 3,
      name: "Salaries",
      count: data?.salaries?.current || 0,
      rate: data?.salaries?.percentage || 0,
      isUp: data?.salaries?.trend === "up" ? true : false,
      icon: <Increase className="h-4 w-4" />,
      color: "warning",
      previous: data?.salaries?.previous || 0,
    },
    {
      id: 4,
      name: "Expenses",
      count: data?.expenses?.current || 0,
      rate: data?.expenses?.percentage || 0,
      isUp: data?.expenses?.trend === "up" ? true : false,
      icon: <Cup className="h-4 w-4" />,
      color: "destructive",
      previous: data?.expenses?.previous || 0,
    },
    {
      id: 3,
      name: "Raise",
      count: data?.raise?.current || 0,
      rate: data?.raise?.percentage || 0,
      isUp: data?.raise?.trend === "up" ? true : false,
      icon: <Increase className="h-4 w-4" />,
      color: "warning",
      previous: data?.raise?.previous || 0,
    },
    {
      id: 4,
      name: "Deduction",
      count: data?.deduction?.current || 0,
      rate: data?.deduction?.percentage || 0,
      isUp: data?.deduction?.trend === "up" ? true : false,
      icon: <Cup className="h-4 w-4" />,
      color: "destructive",
      previous: data?.deduction?.previous || 0,
    },
  ];
  return (
    <>
      {reports.map((item, index) => (
        <Card key={`report-card-${index}`} className="relative">
          {isLoading && (
            <div className="absolute top-0 right-0 bg-white/90 rounded-md p-2 w-full h-full flex items-center justify-center">
              <Loader2
                className={`h-7 w-7 animate-spin ${
                  index === 0
                    ? "text-primary"
                    : index === 1
                    ? "text-info"
                    : index === 2
                    ? "text-warning"
                    : index === 3
                    ? "text-destructive"
                    : index === 4
                    ? "text-success"
                    : index === 5
                    ? "text-info"
                    : "text-warning"
                }`}
                size={20}
              />
            </div>
          )}
          <CardHeader className="flex-col-reverse sm:flex-row flex-wrap gap-2 border-none mb-0 pb-0">
            <span className="text-sm font-medium text-default-900 flex-1">
              {item.name}
            </span>
            <span
              className={cn(
                "flex-none h-9 w-9 flex justify-center items-center bg-default-100 rounded-full",
                {
                  "bg-primary bg-opacity-10 text-primary":
                    item.color === "primary",
                  "bg-info bg-opacity-10 text-info": item.color === "info",
                  "bg-warning bg-opacity-10 text-warning":
                    item.color === "warning",
                  "bg-destructive bg-opacity-10 text-destructive":
                    item.color === "destructive",
                }
              )}
            >
              {item.icon}
            </span>
          </CardHeader>
          <CardContent className="pb-4 px-4">
            <div className="text-2xl font-semibold text-default-900 mb-2.5">
              {item.count}
            </div>
            <div className="flex items-center font-semibold gap-1">
              {item.isUp ? (
                <>
                  <span className="text-success">{item.rate}%</span>
                  <Icon
                    icon="heroicons:arrow-trending-up-16-solid"
                    className="text-success text-xl"
                  />
                </>
              ) : (
                <>
                  <span className="text-destructive">{item.rate}%</span>
                  <Icon
                    icon="heroicons:arrow-trending-down-16-solid"
                    className="text-destructive text-xl"
                  />
                </>
              )}
            </div>
            <div className="mt-1 text-xs text-default-600 flex items-center gap-2">
              <Icon
                icon="heroicons:arrow-right"
                className="text-destructive text-md"
              />{" "}
              Previous {item.previous}
            </div>
          </CardContent>
        </Card>
      ))}
    </>
  );
};

export default IncomeArea;
