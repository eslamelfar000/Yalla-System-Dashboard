import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Icon } from "@iconify/react";

function FilterArchiveComponent({ onApply, onReset, initialFilters = {} }) {
  const types = [
    { id: 1, name: "Trail Lesson", value: "trail_lesson" },
    { id: 2, name: "Pay After Lesson", value: "pay_after_lesson" },
    { id: 3, name: "Pay Before Lesson", value: "pay_before_lesson" },
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

  // Update local state when initialFilters change
  useEffect(() => {
    setSelectedTypes(initialFilters.types || []);
    setSelectedSessions(initialFilters.sessions || []);
    setSelectedMonth(initialFilters.months || []);
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

  const handleReset = () => {
    setSelectedTypes([]);
    setSelectedSessions([]);
    setSelectedMonth([]);
    if (onReset) {
      onReset();
    }
  };

  const handleApply = () => {
    const filters = {
      types: selectedTypes,
      sessions: selectedSessions,
      months: selectedMonth,
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
        <div className="content">
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
        </div>
      </div>
    </div>
  );
}

export default FilterArchiveComponent;
