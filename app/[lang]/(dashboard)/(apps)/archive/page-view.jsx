"use client";
import React from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { SharedSheet } from "@/components/Shared/Drawer/shared-sheet";
import ReviewTableStatus from "./QualityComponents/review-table";
import CoachingTableStatus from "./QualityComponents/coaching-table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import AdminArchiveTable from "./QualityComponents/AdminArchive/Admin-archive-table";

function RoleArchive({ role }) {
  return (
    <div>
      <div className="flex-1">
        <div className="flex items-center flex-wrap gap-2 mb-5">
          <Input
            placeholder="Filter results..."
            className="max-w-sm min-w-[200px] h-10"
          />
          {(role === "quality") && (
            <Select>
              <SelectTrigger className="w-[180px] h-10">
                <SelectValue placeholder="Select Teacher" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
              </SelectContent>
            </Select>
          )}
          <Button>Download</Button>
          {role === "admin" && (
            <>
              <SharedSheet type={"filter-archive"} />
            </>
          )}
        </div>
      </div>

      <div className="cover">
        {role === "quality" ? (
          <div className="space-y-6">
            <div>
              <h3 className="text-xl font-medium text-default-700 mb-2 opacity-60">
                Review
              </h3>
              <ReviewTableStatus />
            </div>
            <div>
              <h3 className="text-xl font-medium text-default-700 mb-2 opacity-60">
                Coaching
              </h3>
              <CoachingTableStatus />
            </div>
          </div>
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
