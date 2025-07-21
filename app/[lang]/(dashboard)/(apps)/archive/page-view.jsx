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
        ) : role === "admin" || role === "teacher" ? (
          <div className="">
            <AdminArchiveTable role={role} />
          </div>
        ) : (
          ""
        )}
      </div>
    </div>
  );
}

export default RoleArchive;
