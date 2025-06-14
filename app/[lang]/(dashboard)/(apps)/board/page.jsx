"use client";
import { Card } from "@/components/ui/card";
import React from "react";
import BoradTableStatus from "./board-table";
import ReportsTableStatus from "./reports-table";
import BoardStepsLineSpacs from "./board-steps";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import CoachingTableStatus from "../archive/QualityComponents/coaching-table";

function page() {
  return (
    <div>
      <div className=" space-y-10">
        {/* <BoardStepsLineSpacs/> */}
        <div className="cover space-y-5">
          <div className="flex flex-wrap items-center gap-4">
            <div className="flex-1">
              <h3 className="text-xl font-medium text-default-700 opacity-60">
                Borad
              </h3>
            </div>
            <div className="flex-none">
              <Select>
                <SelectTrigger className="w-[180px]">
                  <SelectValue
                    placeholder="Select Teacher"
                    className="whitespace-nowrap"
                  />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="jan-12">Jan 12</SelectItem>
                  <SelectItem value="jan-13">Jan 13</SelectItem>
                  <SelectItem value="jan-14">Jan 14</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <BoradTableStatus />
        </div>

        <div className="space-y-5">
          <div className="flex flex-wrap items-center gap-4 mb-1">
            <div className="flex-1">
              <h3 className="text-xl font-medium text-default-700 mb-2 opacity-60">
                Reports
              </h3>
            </div>
          </div>
          <ReportsTableStatus />
        </div>

        <div className="space-y-5">
          <div className="flex flex-wrap items-center gap-4 mb-1">
            <div className="flex-1">
              <h3 className="text-xl font-medium text-default-700 mb-2 opacity-60">
                Coaching
              </h3>
            </div>
          </div>
          <CoachingTableStatus action={'board'}/>
        </div>
      </div>
    </div>
  );
}

export default page;
