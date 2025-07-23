"use client";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { useGetData } from "@/hooks/useGetData";
import { Icon } from "@iconify/react/dist/iconify.js";
import { Banknote, DollarSign } from "lucide-react";
import { Fragment } from "react";
import {
  getAllCurrencyConversions,
  areExchangeRatesSet,
} from "@/lib/currency-utils";

const IncomeReportsCard = ({
  type,
  role,
  selectedTeacher,
  selectedQuality,
  selectedMonth,
}) => {
  const user = JSON.parse(localStorage.getItem("user_data"));

  const { data, isLoading, error } = useGetData({
    endpoint:
      type === "quality-assurance" || role === "quality"
        ? `dashboard/quailty-financial/${
            selectedQuality || user.id || user.user_id
          }/summary${
            selectedMonth !== "" ? `?month=2025-${selectedMonth}` : ""
          }`
        : `dashboard/teacher-financial/${
            selectedTeacher || user.user_id || user.id
          }/summary${
            selectedMonth !== "" ? `?month=2025-${selectedMonth}` : ""
          }`,
    enabled: type === "quality-assurance" ? selectedQuality : selectedTeacher,
    enabledKey: "incomeReports",
    queryKey: [
      "incomeReports",
      selectedTeacher,
      selectedQuality,
      role,
      selectedMonth,
    ],
  });

  const summaryData = data?.data;

  const reports = [
    {
      id: 1,
      name: "Total Salary",
      count: summaryData?.gross_total || 0,
      rate: "8.2",
      currency: "EGP",
      icon: <DollarSign className="w-6 h-6 text-primary" />,
      color: "primary",
      Salary: [
        {
          id: 1,
          name: "USD Salary",
          count: areExchangeRatesSet()
            ? getAllCurrencyConversions(
                summaryData?.gross_total || 0
              ).usd.toFixed(2)
            : "0.00",
          currency: "USD",
          icon: <Banknote className="w-5 h-5 text-yellow-600" />,
        },
        {
          id: 2,
          name: "ILS Salary",
          count: areExchangeRatesSet()
            ? getAllCurrencyConversions(
                summaryData?.gross_total || 0
              ).ils.toFixed(2)
            : "0.00",
          currency: "ILS",
          icon: <Banknote className="w-5 h-5 text-yellow-600" />,
        },
      ],
    },
    {
      id: 2,
      name: "Total Raise",
      count: summaryData?.total_raise || 0,
      rate: "8.2",
      currency: "EGP",
      icon: <DollarSign className="w-6 h-6 text-success" />,
      color: "success",
      Salary: [
        {
          id: 1,
          name: "USD Salary",
          count: areExchangeRatesSet()
            ? getAllCurrencyConversions(
                summaryData?.total_raise || 0
              ).usd.toFixed(2)
            : "0.00",
          currency: "USD",
          icon: <Banknote className="w-5 h-5 text-yellow-600" />,
        },
        {
          id: 2,
          name: "ILS Salary",
          count: areExchangeRatesSet()
            ? getAllCurrencyConversions(
                summaryData?.total_raise || 0
              ).ils.toFixed(2)
            : "0.00",
          currency: "ILS",
          icon: <Banknote className="w-5 h-5 text-yellow-600" />,
        },
      ],
    },
    {
      id: 3,
      name: "Total Deduction",
      count: summaryData?.total_reduction || 0,
      rate: "8.2",
      currency: "EGP",
      icon: <DollarSign className="w-6 h-6 text-destructive" />,
      color: "destructive",
      Salary: [
        {
          id: 1,
          name: "USD Salary",
          count: areExchangeRatesSet()
            ? getAllCurrencyConversions(
                summaryData?.total_reduction || 0
              ).usd.toFixed(2)
            : "0.00",
          currency: "USD",
          icon: <Banknote className="w-5 h-5 text-yellow-600" />,
        },
        {
          id: 2,
          name: "ILS Salary",
          count: areExchangeRatesSet()
            ? getAllCurrencyConversions(
                summaryData?.total_reduction || 0
              ).ils.toFixed(2)
            : "0.00",
          currency: "ILS",
          icon: <Banknote className="w-5 h-5 text-yellow-600" />,
        },
      ],
    },
    {
      id: 4,
      name: "In Debt",
      count: summaryData?.debt || 0,
      rate: "8.2",
      currency: "EGP",
      icon: <DollarSign className="w-6 h-6 text-info" />,
      color: "info",
      Salary: [
        {
          id: 1,
          name: "USD Salary",
          count: areExchangeRatesSet()
            ? getAllCurrencyConversions(summaryData?.debt || 0).usd.toFixed(2)
            : "0.00",
          currency: "USD",
          icon: <Banknote className="w-5 h-5 text-yellow-600" />,
        },
        {
          id: 2,
          name: "ILS Salary",
          count: areExchangeRatesSet()
            ? getAllCurrencyConversions(summaryData?.debt || 0).ils.toFixed(2)
            : "0.00",
          currency: "ILS",
          icon: <Banknote className="w-5 h-5 text-yellow-600" />,
        },
      ],
    },
  ];
  return (
    <Fragment>
      {reports.map((item) => (
        <Card
          key={item.id}
          className="rounded-lg p-2 xl:p-2 xl:py-6 2xl:p-6  flex flex-col items-center relative"
        >
          {selectedQuality === null &&
            type === "quality-assurance" &&
            role === "admin" && (
              <div className="absolute top-0 right-0 w-full h-full bg-white/80 z-10 rounded-lg flex flex-col items-center justify-center gap-2">
                <div className="bg-orange-200/50 rounded-lg p-2 flex items-center justify-center gap-2">
                  <Icon
                    icon="mdi:information-outline"
                    className="w-6 h-6 text-orange-500"
                  />
                  <span className="text-sm text-orange-500">
                    No Quality Selected
                  </span>
                </div>
              </div>
            )}
          {selectedTeacher === null &&
            type === "teachers" &&
            role === "admin" && (
              <div className="absolute top-0 right-0 w-full h-full bg-white/80 z-10 rounded-lg flex flex-col items-center justify-center gap-2">
                <div className="bg-primary/20 rounded-lg p-2 flex items-center justify-center gap-2">
                  <Icon
                    icon="mdi:information-outline"
                    className="w-6 h-6 text-primary"
                  />
                  <span className="text-sm text-primary">
                    No Teacher Selected
                  </span>
                </div>
              </div>
            )}
          <div>
            <span
              className={`h-12 w-12 rounded-full flex justify-center items-center bg-${item.color}/10`}
            >
              {item.icon}
            </span>
          </div>
          <div className="mt-4 text-center w-full">
            <div className="text-base font-medium text-default-600">
              {item.name}
            </div>
            <div
              className={`text-3xl font-semibold text-${item.color} mt-1 flex items-center justify-center`}
            >
              {isLoading ? <Skeleton className="w-10 h-6" /> : item.count || 0}
              <span className="text-2xl ml-1">{item.currency}</span>
            </div>
            <Separator className="my-2 w-full" />
            <ul className="flex justify-between mt-4">
              <li className="flex items-center gap-2">
                <span className="flex justify-center border-2 border-yellow-600 rounded-full p-1">
                  {item.Salary[0].icon}
                </span>
                <span className="text-md text-default-600 font-medium flex items-center gap-1">
                  <span className="flex items-center gap-1">
                    {isLoading ? (
                      <Skeleton className="w-8 h-3" />
                    ) : (
                      item.Salary[0].count
                    )}
                  </span>
                  <span className="text-[10px] ml-1 opacity-70">
                    {item.Salary[0].currency}
                  </span>
                </span>
              </li>
              <li className="flex items-center gap-2">
                <span className="flex justify-center border-2 border-yellow-600 rounded-full p-1">
                  {item.Salary[1].icon}
                </span>
                <span className="text-md text-default-600 font-medium flex items-center gap-1">
                  <span className="flex items-center gap-1">
                    {isLoading ? (
                      <Skeleton className="w-7 h-3" />
                    ) : (
                      item.Salary[1].count
                    )}
                  </span>
                  <span className="text-[10px] ml-1 opacity-70">
                    {item.Salary[1].currency}
                  </span>
                </span>
              </li>
            </ul>
          </div>
        </Card>
      ))}
    </Fragment>
  );
};

export default IncomeReportsCard;
