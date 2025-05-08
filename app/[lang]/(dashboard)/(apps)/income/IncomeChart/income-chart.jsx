import React from 'react'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import IncomeChartComponent from './income-chart-component';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Icon } from '@iconify/react';

function incomeChart() {
  return (
    <div>
      <Card>
        <CardHeader className="mb-0 border-none pt-6 pl-7 pb-0 flex-row flex-wrap items-center justify-between gap-4">
          <CardTitle className="whitespace-nowrap">Report Chart</CardTitle>
          <div className="w-[170px]">
            {/* <Select>
              <SelectTrigger className="text-default-500 bg-transparent dark:bg-transparent">
                <Icon icon="heroicons:calendar-days" className="w-4 h-4" />
                <SelectValue placeholder="Select Date" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="10">Jan 10,2024</SelectItem>
                <SelectItem value="11">Jan 11,2024</SelectItem>
                <SelectItem value="12">Jan 12,2024</SelectItem>
                <SelectItem value="13">Jan 13,2024</SelectItem>
              </SelectContent>
            </Select> */}
          </div>
        </CardHeader>
        <CardContent className="p-4 pt-0">
          <IncomeChartComponent />
        </CardContent>
      </Card>
    </div>
  );
}

export default incomeChart