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
import ProtectedRoute from "@/components/auth/ProtectedRoute";

function page() {
  return (
    <ProtectedRoute requiredRoles={["admin", "teacher"]}>
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
          </div>
        </div>

        <LessonBoardTable />
      </div>
    </ProtectedRoute>
  );
}

export default page;
