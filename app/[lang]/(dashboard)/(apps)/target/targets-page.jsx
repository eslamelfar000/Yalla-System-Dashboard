import React from 'react'
import { Progress } from "@/components/ui/progress";
import { Card } from "@/components/ui/card";
import line from "@/public/images/line.png";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Icon } from "@iconify/react";

const monthTargets = [
  { week: 1, target: 80.45 },
  { week: 2, target: 70.25 },
  { week: 3, target: 90.75 },
  { week: 4, target: 85.50 },
];

function TargetsPage() {
  return (
    <div className="space-y-6">
      <div className="hours-target">
        <Card className="w-full p-8 rounded-md">
          <div className="cover">
            <div className="head mb-8">
              <h2 className="text-xl font-bold ">Hours Target</h2>
            </div>
            <ul className="flex justify-between items-start ">
              <li className="flex-1 text-md font-[600] text-gray-400">
                <p className="flex items-center gap-1">
                  In <span>Progress</span>
                </p>
                <span className="text-xl font-large text-gray-700">50</span>
              </li>
              <li className="w-full flex-2 relative h-full mx-5">
                <img src={line?.src} alt="" className="w-full mb-2" />
                <Progress
                  value="50"
                  color="primary"
                  isStripe
                  isAnimate
                  className="h-7 rounded-sm"
                />
              </li>
              <li className="flex-1 text-md font-[600] text-gray-400">
                <p className="">Target</p>
                <span className="text-xl font-large text-gray-700">80</span>
              </li>
            </ul>
          </div>
        </Card>
      </div>

      <Card className="progress">
        <Accordion type="single" collapsible className="w-full space-y-3.5">
          <AccordionItem value="item-1">
            <AccordionTrigger>
              <div className="flex justify-between items-center w-full mr-5 p-5">
                <div className="flex justify-between items-center space-x-2">
                  <div>
                    <Icon icon="heroicons:squares-2x2" className=" h-8 w-8" />
                  </div>
                  <div className="text-lg font-[600]">
                    Your Achieved Target This Month
                  </div>
                </div>

                <div className="percent">
                  <span className="text-xl font-bold">92.5%</span>
                </div>
              </div>
            </AccordionTrigger>
            <AccordionContent className="py-5 mx-20">
              <div className="flex flex-col-reverse">
                {monthTargets.map((target, index) => (
                  <ul
                    key={index}
                    className="flex justify-between items-start mt-10 last:mt-0 "
                  >
                    <li className="flex-1">
                      <span className="text-sm text-gray-400 flex gap-1">
                        week <span>{target.week}</span>
                      </span>
                    </li>
                    <li className="w-full flex-2 mx-3">
                      <Progress
                        value={target.target}
                        color="primary"
                        isStripe
                        isAnimate
                        className="h-5 rounded-sm z-10"
                      />
                    </li>
                    <li className="flex-1">
                      <span className="text-sm text-gray-400">
                        {target.target}%
                      </span>
                    </li>
                  </ul>
                ))}
              </div>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </Card>
    </div>
  );
}

export default TargetsPage;