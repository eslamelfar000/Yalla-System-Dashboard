"use client";
import React, { useState } from "react";
import ArchiveDataTable from "./archive-table";
import RoleArchive from "./page-view";
import { Button } from "@/components/ui/button";

function page() {
  const [role, setRole] = useState("admin");
  return (
    <div>


    <div className="cover">
      <ul className="flex items-center gap-2 mb-5">
        <li>
          <Button
          disabled={role === "admin"}
            onClick={() => setRole("admin")}>
            Admin
            </Button>
        </li>
        <li>
          <Button
          disabled={role === "teacher"}
            onClick={() => setRole("teacher")}>
            Teacher
            </Button>
        </li>
        <li>
          <Button
          disabled={role === "quality"}
            onClick={() => setRole("quality")}>
            Quality
            </Button>
        </li>
      </ul>
    </div>

      {role === "teacher" ? (
        <div className="cover">
          <div className="flex-1">
            <h3 className="text-xl font-medium text-default-700 mb-2 opacity-60">
              Archive
            </h3>
          </div>
          <ArchiveDataTable />
        </div>
      ) : (
        <RoleArchive role={role} />
      )}
    </div>
  );
}

export default page;
