"use client";
import { Card } from "@/components/ui/card";
import React from "react";
import ReportsTableStatus from "./reports-table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

function page() {
  return (
    <div>
      <div className=" space-y-6">
        <div className="flex flex-wrap items-center gap-4 mb-1">
          <div className="flex-1">
            <h3 className="text-xl font-medium text-default-700 mb-2 opacity-60">
              Reports
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
        <Card title="Simple">
          <ReportsTableStatus />
        </Card>
      </div>
    </div>
  );
}

export default page;
