"use client";
import React from "react";
import { Stepper, Step, StepLabel } from "@/components/ui/steps";

const LessonsStepsLineSpace = () => {
  const steps = [
    {
      id: 1,
      time: "10 Am",
      date: "April 12",
    },
    {
      id: 2,
      time: "10 Am",
      date: "April 12",
    },
    {
      id: 3,
      time: "10 Am",
      date: "April 12",
    },
    {
      id: 4,
      time: "10 Am",
      date: "April 12",
    },
    {
      id: 5,
      time: "10 Am",
      date: "April 12",
    },
    {
      id: 6,
      time: "10 Am",
      date: "April 12",
    },
    {
      id: 7,
      time: "10 Am",
      date: "April 12",
    },
    {
      id: 8,
      time: "10 Am",
      date: "April 12",
    },
  ];
  return (
    <div>
      <Stepper
        current={3}
        size="md"
        className="py-3 grid grid-cols-4 lg:grid-cols-8 gap-y-10"
      >
        {steps?.map((label, i) => (
          <Step key={label}>
            <StepLabel>{label.date}</StepLabel>
            <StepLabel className="uppercase -mt-0">{label.time}</StepLabel>
          </Step>
        ))}
      </Stepper>
    </div>
  );
};

export default LessonsStepsLineSpace;
