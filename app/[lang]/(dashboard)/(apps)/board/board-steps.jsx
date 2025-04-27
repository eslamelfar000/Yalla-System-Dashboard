"use client";
import React from "react";
import { Stepper, Step, StepLabel } from "@/components/ui/steps";

const BoardStepsLineSpace = () => {
  const steps = [
    {
      id: 1,
      label: "Review 1",
    },
    {
      id: 2,
      label: "Review 2",
    },
    {
      id: 3,
      label: "Review 3",
    },
    {
      id: 4,
      label: "Review 4",
    },
  ];
  return (
      <div className="">
        <Stepper
          current={2}
          size="md"
          className="py-3"
        >
          {steps?.map((label, i) => (
            <Step key={label} className="">
              <StepLabel>{label.label}</StepLabel>
            </Step>
          ))}
        </Stepper>
      </div>
  );
};

export default BoardStepsLineSpace;
