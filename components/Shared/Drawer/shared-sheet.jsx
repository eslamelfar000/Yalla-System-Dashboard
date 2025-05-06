"use client";

import * as React from "react";
import { Edit } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import AddTeacherComponent from "@/components/Apis/Teacher/add-teacher";
import AddQualityComponent from "@/components/Apis/Quality/add-quality";
import EditTeacherComponent from "@/components/Apis/Teacher/edit-teacher";
import EditQualityComponent from "@/components/Apis/Quality/edit-quality";
import FilterStudentsComponent from "@/components/Apis/Student/filter-students";
import FilterArchiveComponent from "@/components/Apis/Student/filter-archive";
import { Icon } from "@iconify/react";

export function SharedSheet({ type, user }) {
  return (
    <Sheet>
      <SheetTrigger asChild>
        {["add-teacher", "add-quality"].includes(type) ? (
          <Button variant="outline" size="md" className="text-[12px]">
            <Edit className="mr-2 h-4 w-4" />
            {type === "add-teacher" ? "Add Teacher" : "Add Quality Assurance"}
          </Button>
        ) : ["edit-teacher", "edit-quality"].includes(type) ? (
          <Button
            size="icon"
            variant="outline"
            className=" h-7 w-7"
            color="primary"
            title="Edit"
          >
            <Icon icon="heroicons:pencil" className="h-4 w-4" />
          </Button>
        ) : ["show-teacher", "show-quality"].includes(type) ? (
          <Button
            size="icon"
            variant="outline"
            className=" h-7 w-7"
            color="primary"
            title="Show"
          >
            <Icon icon="heroicons:eye" className="h-4 w-4" />
          </Button>
        ) : type === "filter-students" ? (
          <Button variant="outline" color="primary" title="filter">
            Filter Results
          </Button>
        ) : (
          <Button variant="outline" title="filter">
            Filter Results
          </Button>
        )}
      </SheetTrigger>
      <SheetContent
        className={`w-3/4 max-w-lg md:max-w-2xl ${
          ["filter-students","filter-archive"].includes(type) ? "md:max-w-sm" : ""
        }`}
      >
        <div className="cover">
          <SheetHeader>
            <SheetTitle>
              {" "}
              {type === "add-teacher"
                ? "Add Teacher"
                : type === "add-quality"
                ? "Add Quality Assurance"
                : type === "edit-teacher"
                ? "Edit Teacher"
                : type === "edit-quality"
                ? "Edit Quality Assurance"
                : type === "show-teacher"
                ? "Show Teacher"
                : type === "show-quality"
                ? "Show Quality Assurance"
                : "Filter Results"}
            </SheetTitle>
          </SheetHeader>

          <div className="overflow-y-auto h-[calc(100vh-100px)] px-4 py-3 space-y-6">
            {type === "add-teacher" ? (
              <AddTeacherComponent />
            ) : type === "add-quality" ? (
              <AddQualityComponent />
            ) : type === "edit-teacher" ? (
              <EditTeacherComponent user={user} />
            ) : type === "edit-quality" ? (
              <EditQualityComponent user={user} />
            ) : type === "show-teacher" ? (
              <EditTeacherComponent user={user} info={true} />
            ) : type === "show-quality" ? (
              <EditQualityComponent user={user} info={true} />
            ) : type === "filter-students" ? (
              <FilterStudentsComponent />
            ) : type === "filter-archive" ? (
              <FilterArchiveComponent />
            ) : (
              <div className="flex flex-col gap-4">
                <h3 className="text-lg font-medium text-default-700 mb-2 opacity-60">
                  Filter Results
                </h3>
                <p className="text-sm text-muted-foreground">
                  This is a filter component. You can add your filter fields
                  here.
                </p>
              </div>
            )}
          </div>
        </div>
        {/* 
        <SheetFooter>
          <SheetClose asChild>
            <Button type="submit" className="w-full" variant="outline">
              Close
            </Button>
          </SheetClose>
        </SheetFooter> */}
      </SheetContent>
    </Sheet>
  );
}
