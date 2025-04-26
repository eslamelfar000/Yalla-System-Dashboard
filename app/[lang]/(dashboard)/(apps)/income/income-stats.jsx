"use client";

import { Tabs, TabsContent } from "@/components/ui/tabs";
import IncomeChart from "./income-chart";
import { useThemeStore } from "@/store";
import { useTheme } from "next-themes";
import { themes } from "@/config/thems";
import { Card, CardContent } from "@/components/ui/card";

const allUsersSeries = [
  {
    data: [90, 70, 85, 60, 80, 70, 90, 75, 60, 80],
  },
];
// const conversationSeries = [
//   {
//     data: [80, 70, 65, 40, 40, 100, 100, 75, 60, 80],
//   },
// ];
// const eventCountSeries = [
//   {
//     data: [20, 70, 65, 60, 40, 60, 90, 75, 60, 40],
//   },
// ];
// const newUserSeries = [
//   {
//     data: [20, 70, 65, 40, 100, 60, 100, 75, 60, 80],
//   },
// ];
const IncomeStats = () => {
  const { theme: config, setTheme: setConfig } = useThemeStore();
  const { theme: mode } = useTheme();
  const theme = themes.find((theme) => theme.name === config);
  const primary = `hsl(${
    theme?.cssVars[mode === "dark" ? "dark" : "light"].primary
  })`;
  const warning = `hsl(${
    theme?.cssVars[mode === "dark" ? "dark" : "light"].warning
  })`;
  const success = `hsl(${
    theme?.cssVars[mode === "dark" ? "dark" : "light"].success
  })`;
  const info = `hsl(${
    theme?.cssVars[mode === "dark" ? "dark" : "light"].info
  })`;
  // const tabsTrigger = [
  //   {
  //     value: "all",
  //     text: "all user",
  //     total: "10,234",
  //     color: "primary",
  //   },
  // ];
  const tabsContentData = [
    {
      value: "all",
      series: allUsersSeries,
      color: primary,
    },
  ];
  return (
    <Card className="shadow-none">
      <CardContent className="p-1">
        <Tabs defaultValue="all">
          {/* charts data */}
          {tabsContentData.map((item, index) => (
            <TabsContent key={`report-tab-${index}`} value={item.value}>
              <IncomeChart series={item.series} chartColor={item.color} />
            </TabsContent>
          ))}
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default IncomeStats;
