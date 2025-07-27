import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Icon } from "@iconify/react";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";

function FilterArchiveComponent({ onApply, onReset, initialFilters = {} }) {
  const types = [
    { id: 1, name: "Trail Lesson", value: "trail" },
    { id: 2, name: "Pay After Lesson", value: "payafter" },
    { id: 3, name: "Pay Before Lesson", value: "paybefore" },
  ];

  const month = [
    { id: 1, name: "January", value: "01" },
    { id: 2, name: "February", value: "02" },
    { id: 3, name: "March", value: "03" },
    { id: 4, name: "April", value: "04" },
    { id: 5, name: "May", value: "05" },
    { id: 6, name: "June", value: "06" },
    { id: 7, name: "July", value: "07" },
    { id: 8, name: "August", value: "08" },
    { id: 9, name: "September", value: "09" },
    { id: 10, name: "October", value: "10" },
    { id: 11, name: "November", value: "11" },
    { id: 12, name: "December", value: "12" },
  ];

  const years = [
    { id: 1, name: "2024", value: "2024" },
    { id: 2, name: "2025", value: "2025" },
    { id: 3, name: "2026", value: "2026" },
    { id: 4, name: "2027", value: "2027" },
    { id: 5, name: "2028", value: "2028" },
    { id: 6, name: "2029", value: "2029" },
    { id: 7, name: "2030", value: "2030" },
    { id: 8, name: "2031", value: "2031" },
    { id: 9, name: "2032", value: "2032" },
    { id: 10, name: "2033", value: "2033" },
    { id: 11, name: "2034", value: "2034" },
    { id: 12, name: "2035", value: "2035" },
  ];

  const sessionCount = 8;

  const [selectedTypes, setSelectedTypes] = useState(
    initialFilters.types || []
  );
  const [selectedSessions, setSelectedSessions] = useState(
    initialFilters.sessions || []
  );
  const [selectedMonth, setSelectedMonth] = useState(
    initialFilters.months || []
  );
  const [selectedYear, setSelectedYear] = useState("");

  // Update local state when initialFilters change
  useEffect(() => {
    setSelectedTypes(initialFilters.types || []);
    setSelectedSessions(initialFilters.sessions || []);
    setSelectedMonth(initialFilters.months || []);
    setSelectedYear(initialFilters.year || "");
  }, [initialFilters]);

  const toggleType = (value) => {
    setSelectedTypes((prev) =>
      prev.includes(value) ? prev.filter((v) => v !== value) : [...prev, value]
    );
  };

  const toggleSession = (num) => {
    setSelectedSessions((prev) =>
      prev.includes(num) ? prev.filter((v) => v !== num) : [...prev, num]
    );
  };

  const toggleMonth = (value) => {
    setSelectedMonth((prev) =>
      prev.includes(value) ? prev.filter((v) => v !== value) : [...prev, value]
    );
  };

  const handleYearChange = (value) => {
    setSelectedYear(value);
    // Clear selected months when year changes
    if (value === "" || value === "Select Year") {
      setSelectedMonth([]);
    }
  };

  const handleReset = () => {
    setSelectedTypes([]);
    setSelectedSessions([]);
    setSelectedMonth([]);
    setSelectedYear("");
    if (onReset) {
      onReset();
    }
  };

  const handleApply = () => {
    const filters = {
      types: selectedTypes,
      sessions: selectedSessions,
      months: selectedMonth,
      year: selectedYear,
    };
    if (onApply) {
      onApply(filters);
    }
  };

  return (
    <div className="space-y-5">
      <div className="actions">
        <ul className="flex items-center justify-between text-primary font-medium">
          <li>
            <Button variant="soft" onClick={handleReset}>
              Reset
            </Button>
          </li>
          <li>
            <Button variant="soft" onClick={handleApply}>
              Apply
            </Button>
          </li>
        </ul>
      </div>

      <div className="type-filter">
        <div className="head">
          <h2 className="text-sm flex items-center gap-2 font-medium p-2 bg-primary text-white rounded-xl">
            <Icon icon="heroicons:adjustments-vertical" className="w-7 h-7" />
            Filter By Type
          </h2>
        </div>
        <div className="content">
          <ul className="mx-5 my-4 space-y-3">
            {types.map((type) => (
              <li key={type.id} className="flex items-center space-x-2 mb-2">
                <Checkbox
                  id={`type-${type.id}`}
                  className="size-10"
                  checked={selectedTypes.includes(type.value)}
                  onCheckedChange={() => toggleType(type.value)}
                />
                <label
                  htmlFor={`type-${type.id}`}
                  className="text-sm font-medium text-card-foreground/80 select-none"
                >
                  {type.name}
                </label>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="session-filter">
        <div className="head">
          <h2 className="text-sm flex items-center gap-2 font-medium p-2 bg-primary text-white rounded-xl">
            <Icon icon="heroicons:adjustments-vertical" className="w-7 h-7" />
            Filter By Session Number
          </h2>
        </div>
        <div className="content">
          <ul className="grid grid-cols-2 mx-5 my-4">
            {[...Array(sessionCount)].map((_, index) => (
              <li key={index} className="flex items-center space-x-2 mb-2">
                <Checkbox
                  id={`session-${index + 1}`}
                  className="size-10"
                  checked={selectedSessions.includes(index + 1)}
                  onCheckedChange={() => toggleSession(index + 1)}
                />
                <label
                  htmlFor={`session-${index + 1}`}
                  className="text-sm font-medium text-card-foreground/80 select-none"
                >
                  {index + 1} Session
                </label>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="month-filter">
        <div className="head">
          <h2 className="text-sm flex items-center gap-2 font-medium p-2 bg-primary text-white rounded-xl">
            <Icon icon="heroicons:adjustments-vertical" className="w-7 h-7" />
            Filter By Month
          </h2>
        </div>

        <div className="year-filter mt-5">
          <Select
            value={selectedYear || "Select Year"}
            onValueChange={handleYearChange}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select Year" />
            </SelectTrigger>
            <SelectContent defaultValue={"Select Year"} className="z-[999]">
              <SelectItem value="Select Year" disabled>
                Select Year
              </SelectItem>
              {years?.map((year) => (
                <SelectItem key={year.id} value={year.value}>
                  {year.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="content">
          {selectedYear ? (
            <ul className="grid grid-cols-2 mx-5 my-4">
              {month.map((item) => (
                <li key={item?.id} className="flex items-center space-x-2 mb-2">
                  <Checkbox
                    id={`month-${item.id}`}
                    className="size-10"
                    checked={selectedMonth.includes(item.value)}
                    onCheckedChange={() => toggleMonth(item.value)}
                  />
                  <label
                    htmlFor={`month-${item.id}`}
                    className="text-sm font-medium text-card-foreground/80 select-none"
                  >
                    {item.name}
                  </label>
                </li>
              ))}
            </ul>
          ) : (
            <div className="mx-5 my-4 p-4 text-center text-sm text-gray-500 bg-gray-50 rounded-lg">
              Please select a year first to filter by month
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default FilterArchiveComponent;
