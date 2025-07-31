"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";

const DashboardSelect = ({ selectedYear, setSelectedYear }) => {
  return (
    <Select value={selectedYear} onValueChange={setSelectedYear}>
      <SelectTrigger className="w-[124px]">
        <SelectValue placeholder="Select Year" className="whitespace-nowrap" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="2025">2025</SelectItem>
        <SelectItem value="2024">2026</SelectItem>
        <SelectItem value="2023">2027</SelectItem>
        <SelectItem value="2022">2028</SelectItem>
        <SelectItem value="2021">2029</SelectItem>
        <SelectItem value="2020">2030</SelectItem>
        <SelectItem value="2019">2031</SelectItem>
        <SelectItem value="2018">2032</SelectItem>
        <SelectItem value="2017">2033</SelectItem>
        <SelectItem value="2016">2034</SelectItem>
        <SelectItem value="2015">2035</SelectItem>
      </SelectContent>
    </Select>
  );
};

export default DashboardSelect;
