"use client";
import { Card } from "@/components/ui/card";
import React, { useState } from "react";
import BoradTableStatus from "./board-table";
import ReportsTableStatus from "./reports-table";
import BoardStepsLineSpacs from "./board-steps";
import TeacherFilter from "@/components/Shared/TeacherFilter";
import CoachingTableStatus from "../archive/QualityComponents/coaching-table";

function page() {
  const [selectedTeacher, setSelectedTeacher] = useState("");

  const handleTeacherChange = (teacherId) => {
    setSelectedTeacher(teacherId);
  };

  const handleClearFilter = () => {
    setSelectedTeacher("");
  };

  return (
    <div>
      <div className="space-y-10">
        {/* <BoardStepsLineSpacs/> */}

        {/* Global Teacher Filter */}
        <Card className="p-4 flex justify-between items-center">
          <div className="title">
            <h3 className="text-xl font-medium text-default-700 opacity-60">
              Board Sessions
            </h3>
          </div>
            <TeacherFilter
              selectedTeacher={selectedTeacher}
              onTeacherChange={handleTeacherChange}
              onClearFilter={handleClearFilter}
            />
        </Card>

        <div className="cover space-y-5">
          <div className="flex flex-wrap items-center gap-4">
            <div className="flex-1">
              <h3 className="text-xl font-medium text-default-700 opacity-60">
                Board
              </h3>
            </div>
          </div>
          <BoradTableStatus selectedTeacher={selectedTeacher} />
        </div>

        <div className="space-y-5">
          <div className="flex flex-wrap items-center gap-4 mb-1">
            <div className="flex-1">
              <h3 className="text-xl font-medium text-default-700 mb-2 opacity-60">
                Reports
              </h3>
            </div>
          </div>
          <ReportsTableStatus selectedTeacher={selectedTeacher} />
        </div>

        <div className="space-y-5">
          <div className="flex flex-wrap items-center gap-4 mb-1">
            <div className="flex-1">
              <h3 className="text-xl font-medium text-default-700 mb-2 opacity-60">
                Coaching
              </h3>
            </div>
          </div>
          <CoachingTableStatus
            action={"board"}
            selectedTeacher={selectedTeacher}
          />
        </div>
      </div>
    </div>
  );
}

export default page;
