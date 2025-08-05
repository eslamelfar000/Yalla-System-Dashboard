"use client";
import dynamic from "next/dynamic";
const Chart = dynamic(() => import("react-apexcharts"), { ssr: false });
import { useThemeStore } from "@/store";
import { useTheme } from "next-themes";
import { themes } from "@/config/thems";
import { getGridConfig, getYAxisConfig } from "@/lib/appex-chart-options";
import { useGetData } from "@/hooks/useGetData";
import { usePathname, useSearchParams } from "next/navigation";
import { useState, useEffect } from "react";

const RevinueChart = ({ height = 350, selectedYear }) => {
  const { theme: config, setTheme: setConfig, isRtl } = useThemeStore();
  const { theme: mode } = useTheme();
  const pathname = usePathname();


  const {
    data: reservationsData,
    isLoading: reservationsLoading,
    error: reservationsError,
  } = useGetData({
    endpoint: `dashboard/reservations-admin-home?year=${selectedYear}`,
    enabledKey: ["reservations-admin-home", "chart", selectedYear, pathname],
  });

  const theme = themes.find((theme) => theme.name === config);

  // Extract data from the API response
  const monthlyChartData = reservationsData?.monthly_chart_data || {};
  const monthlyReservations = reservationsData?.monthly_reservations || {};

  // Create arrays for all 12 months
  const months = Array.from({ length: 12 }, (_, i) => i + 1);
  const monthNames = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];

  // Extract data for each type - using monthly_reservations.types for totals
  const trialTotal = monthlyReservations?.types?.trial || 0;
  const payBeforeTotal = monthlyReservations?.types?.pay_before || 0;
  const payAfterTotal = monthlyReservations?.types?.pay_after || 0;

  // For monthly data, we'll distribute the totals across months
  // This is a simplified approach - ideally the API should provide monthly breakdown
  const currentMonth = monthlyReservations?.month || 1;

  // Create monthly data arrays
  const trialData = months.map((month) =>
    month === currentMonth ? trialTotal : 0
  );
  const payBeforeData = months.map((month) =>
    month === currentMonth ? payBeforeTotal : 0
  );
  const payAfterData = months.map((month) =>
    month === currentMonth ? payAfterTotal : 0
  );


  // Calculate grand total
  const grandTotal = trialTotal + payBeforeTotal + payAfterTotal;

  const series = [
    {
      name: "Trial",
      data: trialData,
    },
    {
      name: "Pay Before",
      data: payBeforeData,
    },
    {
      name: "Pay After",
      data: payAfterData,
    },
  ];
  const options = {
    chart: {
      toolbar: {
        show: false,
      },
      stacked: true,
    },
    plotOptions: {
      bar: {
        borderRadius: 8,
        horizontal: false,
        columnWidth: "20%",
        dataLabels: {
          total: {
            enabled: false,
            offsetX: 0,
            style: {
              colors: [
                `hsl(${
                  theme?.cssVars[
                    mode === "dark" || mode === "system" ? "dark" : "light"
                  ].chartLabel
                })`,
              ],
              fontSize: "13px",
              fontWeight: 800,
            },
          },
        },
      },
    },
    dataLabels: {
      enabled: false,
    },
    stroke: {
      show: false,
      width: 1,
      colors: [
        `hsl(${
          theme?.cssVars[
            mode === "dark" || mode === "system" ? "dark" : "light"
          ].chartLabel
        })`,
      ],
    },
    colors: [
      `hsl(${theme?.cssVars[mode === "dark" ? "dark" : "light"].primary})`,
      `hsl(${theme?.cssVars[mode === "dark" ? "dark" : "light"].info})`,
      `hsl(${theme?.cssVars[mode === "dark" ? "dark" : "light"].warning})`,
    ],
    tooltip: {
      theme: mode === "dark" ? "dark" : "light",
    },
    grid: getGridConfig(
      `hsl(${theme?.cssVars[mode === "dark" ? "dark" : "light"].chartGird})`
    ),
    yaxis: getYAxisConfig(
      `hsl(${theme?.cssVars[mode === "dark" ? "dark" : "light"].chartLabel})`
    ),
    xaxis: {
      categories: monthNames,
      axisBorder: {
        show: false,
      },
      axisTicks: {
        show: false,
      },
      labels: {
        style: {
          colors: `hsl(${
            theme?.cssVars[
              mode === "dark" || mode === "system" ? "dark" : "light"
            ].chartLabel
          })`,
          fontSize: "12px",
        },
      },
    },

    legend: {
      position: "bottom",
      horizontalAlign: "center",
      fontSize: "12px",
      fontWeight: 500,
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
  };
  // Show loading state
  if (reservationsLoading) {
    return (
      <div className="flex items-center justify-center h-[420px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }



  // Show error state
  if (reservationsError) {
    return (
      <div className="flex items-center justify-center h-[350px] text-red-500">
        Error loading chart data
      </div>
    );
  }

  return (
    <div className="space-y-4">
 
      {/* Summary Stats */}
      <div className="grid grid-cols-4 gap-4 p-4 bg-muted/20 rounded-lg mt-4">
        <div className="text-center">
          <div className="text-2xl font-bold text-primary">{trialTotal}</div>
          <div className="text-sm text-muted-foreground">Trial</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-info">{payBeforeTotal}</div>
          <div className="text-sm text-muted-foreground">Pay Before</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-warning">{payAfterTotal}</div>
          <div className="text-sm text-muted-foreground">Pay After</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-foreground">{grandTotal}</div>
          <div className="text-sm text-muted-foreground">Total</div>
        </div>
      </div>

      {/* Chart */}
      <Chart
        options={options}
        series={series}
        type="bar"
        height={300}
        width={"100%"}
      />
    </div>
  );
};

export default RevinueChart;
