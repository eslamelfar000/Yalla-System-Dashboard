"use client";
import React from "react";

import LessonBoardTable from "./lesson-board-table";
import { Input } from "@/components/ui/input";
import ProtectedRoute from "@/components/auth/ProtectedRoute";

function page() {
  return (
    <ProtectedRoute requiredRoles={["teacher"]}>
      <div>
        <LessonBoardTable />
      </div>
    </ProtectedRoute>
  );
}

export default page;
