"use client";

import { Docs } from "@/components/svg";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Banknote, CircleDollarSignIcon, Currency, DollarSign, FlagIcon, TrendingUp } from "lucide-react";
import { Fragment } from "react";

const PayrollReportsCard = () => {
  const reports = [
    {
      id: 1,
      name: "Total Salary",
      count: "1206",
      rate: "8.2",
      currency: "EGP",
      icon: <DollarSign className="w-6 h-6 text-primary" />,
      color: "primary",
      Salary: [
        {
          id: 1,
          name: "USD Salary",
          count: "1206",
          currency: "USD",
          icon: <Banknote className="w-5 h-5 text-yellow-600" />,
        },
        {
          id: 2,
          name: "ILS Salary",
          count: "240",
          currency: "ILS",
          icon: <Banknote className="w-5 h-5 text-yellow-600" />,
        },
      ],
    },
    {
      id: 2,
      name: "Total Raise",
      count: "240",
      rate: "8.2",
      currency: "EGP",
      icon: <DollarSign className="w-6 h-6 text-success" />,
      color: "success",
      Salary: [
        {
          id: 1,
          name: "USD Salary",
          count: "1206",
          currency: "USD",
          icon: <Banknote className="w-5 h-5 text-yellow-600" />,
        },
        {
          id: 2,
          name: "ILS Salary",
          count: "240",
          currency: "ILS",
          icon: <Banknote className="w-5 h-5 text-yellow-600" />,
        },
      ],
    },
    {
      id: 3,
      name: "Total Reduction",
      count: "-96",
      rate: "8.2",
      currency: "EGP",
      icon: <DollarSign className="w-6 h-6 text-destructive" />,
      color: "destructive",
      Salary: [
        {
          id: 1,
          name: "USD Salary",
          count: "1206",
          currency: "USD",
          icon: <Banknote className="w-5 h-5 text-yellow-600" />,
        },
        {
          id: 2,
          name: "ILS Salary",
          count: "240",
          currency: "ILS",
          icon: <Banknote className="w-5 h-5 text-yellow-600" />,
        },
      ],
    },
    {
      id: 4,
      name: "In Debt",
      count: "18",
      rate: "8.2",
      currency: "EGP",
      icon: <DollarSign className="w-6 h-6 text-info" />,
      color: "info",
      Salary: [
        {
          id: 1,
          name: "USD Salary",
          count: "1206",
          currency: "USD",
          icon: <Banknote className="w-5 h-5 text-yellow-600" />,
        },
        {
          id: 2,
          name: "ILS Salary",
          count: "240",
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
          className="rounded-lg p-2 xl:p-2 xl:py-6 2xl:p-6  flex flex-col items-center"
        >
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
            <div className={`text-3xl font-semibold text-${item.color} mt-1`}>
              {item.count}
              <span className="text-sm ml-1">{item.currency}</span>
            </div>
            <Separator className="my-2 w-full" />
            <ul className="flex justify-between mt-4">
              <li className="flex items-center gap-2">
                <span className="flex justify-center border-2 border-yellow-600 rounded-full p-1">
                  {item.Salary[0].icon}
                </span>
                <span className="text-md text-default-600 font-medium">
                  {item.Salary[0].count}
                  <span className="text-[10px] ml-1 opacity-70">
                    {item.Salary[0].currency}
                  </span>
                </span>
              </li>
              <li className="flex items-center gap-2">
                <span className="flex justify-center border-2 border-yellow-600 rounded-full p-1">
                  {item.Salary[1].icon}
                </span>
                <span className="text-md text-default-600 font-medium">
                  {item.Salary[1].count}
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

export default PayrollReportsCard;
