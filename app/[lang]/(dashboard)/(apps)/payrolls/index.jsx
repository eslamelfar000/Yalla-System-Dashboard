"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useThemeStore } from "@/store";
import { useTheme } from "next-themes";
import { themes } from "@/config/thems";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { cn } from "@/lib/utils";

const PayrollsTaps = ({ setType }) => {
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
  const tabsTrigger = [
    {
      value: "teachers",
      text: "Teachers",
      total: "10,234",
      color: "primary",
    },
    {
      value: "quality-assurance",
      text: "Quality Assurance",
      total: "536",
      color: "warning",
    },
  ];
  return (
    <Card className="h-full flex flex-col justify-between">
      <CardContent className="p-1 md:p-5">
        <Tabs defaultValue="teachers">
          <TabsList className="grid grid-cols-2 gap-2 md:gap-6 justify-start w-full bg-transparent h-full">
            {tabsTrigger.map((item, index) => (
              <TabsTrigger
                key={`report-trigger-${index}`}
                value={item.value}
                onClick={() => {
                  setType(item.value);
                }}
                className={cn(
                  "flex flex-col gap-1.5 p-4 overflow-hidden items-start  relative before:absolute before:left-1/2 before:-translate-x-1/2 before:bottom-1 before:h-[3px] before:w-14 before:bg-primary/50 dark:before:bg-primary-foreground before:hidden data-[state=active]:shadow-none data-[state=active]:before:block",
                  {
                    "bg-primary/30 data-[state=active]:bg-primary/30 dark:bg-primary/70":
                      item.color === "primary",
                    "bg-orange-50 data-[state=active]:bg-orange-50 dark:bg-orange-500":
                      item.color === "warning",
                    "bg-green-50 data-[state=active]:bg-green-50 dark:bg-green-500":
                      item.color === "success",
                    "bg-cyan-50 data-[state=active]:bg-cyan-50 dark:bg-cyan-500 ":
                      item.color === "info",
                  }
                )}
              >
                <span
                  className={cn(
                    "h-10 w-10 rounded-full bg-primary/40 absolute -top-3 -right-3 ring-8 ring-primary/30",
                    {
                      "bg-primary/50  ring-primary/20 dark:bg-primary dark:ring-primary/40":
                        item.color === "primary",
                      "bg-orange-200 ring-orange-100 dark:bg-orange-300 dark:ring-orange-400":
                        item.color === "warning",
                      "bg-green-200 ring-green-100 dark:bg-green-300 dark:ring-green-400":
                        item.color === "success",
                      "bg-cyan-200 ring-cyan-100 dark:bg-cyan-300 dark:ring-cyan-400":
                        item.color === "info",
                    }
                  )}
                ></span>
                <span className="text-sm text-default-800 dark:text-primary-foreground font-semibold capitalize relative z-10">
                  {" "}
                  {item.text}
                </span>
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default PayrollsTaps;
