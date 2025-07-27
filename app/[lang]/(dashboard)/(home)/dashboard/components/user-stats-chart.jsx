"use client";

import dynamic from "next/dynamic";
const Chart = dynamic(() => import("react-apexcharts"), { ssr: false });
import { useThemeStore } from "@/store";
import { useTheme } from "next-themes";
import { themes } from "@/config/thems";

const UserStats = ({ height = 350, data, isLoading, error }) => {
  const { theme: config, setTheme: setConfig, isRtl } = useThemeStore();
  const { theme: mode } = useTheme();
  const theme = themes.find((theme) => theme.name === config);
  const series = [
    data?.reservation_types?.trial || data?.student_types?.trial || 0,
    data?.reservation_types?.paybefore || data?.student_types?.pay_before || 0,
    data?.reservation_types?.payafter || data?.student_types?.pay_after || 0,
  ];

  const options = {
    chart: {
      toolbar: {
        show: false,
      },
    },
    labels: ["Trial", "Pay Before", "Pay After"],
    dataLabels: {
      enabled: false,
    },
    colors: [
      `hsl(${theme?.cssVars[mode === "dark" ? "dark" : "light"].primary})`,
      `hsl(${theme?.cssVars[mode === "dark" ? "dark" : "light"].info})`,
      `hsl(${theme?.cssVars[mode === "dark" ? "dark" : "light"].warning})`,
    ],
    tooltip: {
      theme: mode === "dark" ? "dark" : "light",
    },
    stroke: {
      width: 0,
    },
    plotOptions: {
      pie: {
        donut: {
          labels: {
            show: true,
            name: {
              show: true,
              fontSize: "14px",
              fontWeight: 600,
              colors: `hsl(${
                theme?.cssVars[
                  mode === "dark" || mode === "system" ? "dark" : "light"
                ].chartLabel
              })`,
            },
            value: {
              show: true,
              label: "Total",
              fontSize: "14px",
              fontWeight: 600,
              color: `hsl(${
                theme?.cssVars[
                  mode === "dark" || mode === "system" ? "dark" : "light"
                ].chartLabel
              })`,
            },
            total: {
              show: true,
              label: "Total",
              fontSize: "16px",
              fontWeight: 600,
              color: `hsl(${
                theme?.cssVars[
                  mode === "dark" || mode === "system" ? "dark" : "light"
                ].chartLabel
              })`,
            },
          },
        },
      },
    },
    legend: {
      position: "bottom",
      labels: {
        colors: `hsl(${
          theme?.cssVars[
            mode === "dark" || mode === "system" ? "dark" : "light"
          ].chartLabel
        })`,
      },
      itemMargin: {
        horizontal: 10,
        vertical: 8,
      },
      markers: {
        width: 10,
        height: 10,
        radius: 10,
        offsetX: isRtl ? 5 : -5,
      },
    },
    padding: {
      top: 0,
      right: 0,
      bottom: 0,
      left: 0,
    },
  };
  // Show loading state
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-[350px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-2"></div>
          <p className="text-sm text-muted-foreground">Loading chart data...</p>
        </div>
      </div>
    );
  }

  // Show error state
  if (error) {
    return (
      <div className="flex items-center justify-center h-[350px]">
        <div className="text-center">
          <p className="text-sm text-destructive mb-2">Error loading data</p>
          <p className="text-xs text-muted-foreground">
            {error.message || "Unknown error"}
          </p>
        </div>
      </div>
    );
  }

  // Show empty state if no data
  // if (!data || series.every((value) => value === 0)) {
  //   return (
  //     <div className="flex items-center justify-center h-[350px]">
  //       <div className="text-center">
  //         <p className="text-sm text-muted-foreground">No data available</p>
  //       </div>
  //     </div>
  //   );
  // }

  return (
    <Chart
      options={options}
      series={series}
      type="donut"
      height={height}
      width={"100%"}
    />
  );
};

export default UserStats;
