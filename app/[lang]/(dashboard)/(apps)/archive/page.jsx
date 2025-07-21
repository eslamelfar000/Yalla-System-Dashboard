"use client";
import React, { useState } from "react";
import ArchiveDataTable from "./archive-table";
import RoleArchive from "./page-view";
import { Button } from "@/components/ui/button";
import { getUserRoleFromCookies } from "@/lib/auth-utils";

function page() {
  const userRole = getUserRoleFromCookies();
  const [role, setRole] = useState(userRole);

  return (
    <div>
      {/* {role === "teacher" ? (
        <div className="cover">
          <div className="flex-1">
            <h3 className="text-xl font-medium text-default-700 mb-2 opacity-60">
              Archive
            </h3>
          </div>
          <ArchiveDataTable />
        </div>
      ) : ( */}
        <RoleArchive role={role} />
      {/* )} */}
    </div>
  );
}

export default page;
