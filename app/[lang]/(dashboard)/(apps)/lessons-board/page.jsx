"use client";
import React from "react";

import LessonBoardTable from "./lesson-board-table";
import { Input } from "@/components/ui/input";
import { data } from "./data";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card } from "@/components/ui/card";

function page() {
  return (
    <div>
      <div className="flex-1">
        <h3 className="text-xl font-medium text-default-700 mb-2 opacity-60">
          Lessons Board
        </h3>
      </div>

      <div className="cover">
        <div className="flex items-center flex-wrap gap-2 mb-5">
          <Input
            placeholder="Filter emails..."
            value={""}
            className="max-w-sm min-w-[200px] h-10"
          />
          <Select className="w-[280px]">
            <SelectTrigger className="w-[200px]">
              <SelectValue
                placeholder="Select Teacher"
                className="whitespace-nowrap"
              />
            </SelectTrigger>
            <SelectContent className="h-[300px] overflow-y-auto ">
              {data?.map((item) => (
                <SelectItem key={item?.user?.name} value={item?.user?.name}>
                  {item?.user?.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <Card>
        <LessonBoardTable />
      </Card>
    </div>
  );
}

export default page;
