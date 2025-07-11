import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import React from "react";
import UserTableStatus from "./users-table";
import { SharedSheet } from "../../../../../components/Shared/Drawer/shared-sheet";
import ProtectedRoute from "@/components/auth/ProtectedRoute";

function page() {
  return (
    <ProtectedRoute requiredRoles={["admin"]}>
      <div className="space-y-20">
        {/* Teachers */}
        <div className=" space-y-6">
          <div className="flex flex-wrap items-center gap-4 mb-1">
            <div className="flex-1">
              <h3 className="text-xl font-medium text-default-700 mb-2 opacity-60">
                Teachers
              </h3>
            </div>
            <div className="flex-none">
              <SharedSheet type="add-teacher" />
            </div>
          </div>
          <UserTableStatus type="teacher" />
        </div>

        {/* Quality Assurance */}
        <div className=" space-y-6">
          <div className="flex flex-wrap items-center gap-4 mb-1">
            <div className="flex-1">
              <h3 className="text-xl font-medium text-default-700 mb-2 opacity-60">
                Quality Assurance
              </h3>
            </div>
            <div className="flex-none">
              <SharedSheet type="add-quality" />
            </div>
          </div>
          <UserTableStatus type="quality" />
        </div>
      </div>
    </ProtectedRoute>
  );
}

export default page;
