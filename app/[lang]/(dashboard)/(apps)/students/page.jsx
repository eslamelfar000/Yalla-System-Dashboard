"use client";
import React from "react";
import StudentsDataTable from "./students-table";

function page() {
  return (
    <div>
      <div className="flex-1">
        <h3 className="text-xl font-medium text-default-700 mb-2 opacity-60">
          Students
        </h3>
      </div>
      <StudentsDataTable />
    </div>
  );
}

export default page;
