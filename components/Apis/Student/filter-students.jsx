import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Icon } from "@iconify/react";

function FilterStudentsComponent({
  onApply,
  onReset: parentReset,
  initialFilters,
}) {
  const types = [
    { id: "Trail Lesson", name: "Trail Lesson" },
    { id: "Pay After Lesson", name: "Pay After Lesson" },
    { id: "Pay Before Lesson", name: "Pay Before Lesson" },
  ];

  const sessionCount = 8;

  const [selectedTypes, setSelectedTypes] = useState(
    initialFilters?.types || []
  );
  const [selectedSessions, setSelectedSessions] = useState(
    initialFilters?.sessions || []
  );

  // Update local state when initialFilters change
  useEffect(() => {
    if (initialFilters) {
      setSelectedTypes(initialFilters.types || []);
      setSelectedSessions(initialFilters.sessions || []);
    }
  }, [initialFilters]);

  const toggleType = (typeName) => {
    setSelectedTypes((prev) =>
      prev.includes(typeName)
        ? prev.filter((v) => v !== typeName)
        : [...prev, typeName]
    );
  };

  const toggleSession = (num) => {
    setSelectedSessions((prev) =>
      prev.includes(num) ? prev.filter((v) => v !== num) : [...prev, num]
    );
  };

  const handleReset = () => {
    setSelectedTypes([]);
    setSelectedSessions([]);
    if (parentReset) {
      parentReset();
    }
  };

  const handleApply = () => {
    if (onApply) {
      onApply({
        types: selectedTypes,
        sessions: selectedSessions,
      });
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
                  checked={selectedTypes.includes(type.id)}
                  onCheckedChange={() => toggleType(type.id)}
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
    </div>
  );
}

export default FilterStudentsComponent;
