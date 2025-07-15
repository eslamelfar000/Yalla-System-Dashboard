"use client";
import React from "react";
import AdminArchiveTable from "./AdminArchive/Admin-archive-table";
import ShowQuality from "./QualityComponents/showQuality";

function RoleArchive({ role }) {
  return (
    <div>
      <div className="cover">
        {role === "quality" ? (
          <ShowQuality />
        ) : role === "admin" ? (
          <div className="">
            <AdminArchiveTable />
          </div>
        ) : (
          ""
        )}
      </div>
    </div>
  );
}

export default RoleArchive;
