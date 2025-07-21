"use client";

import * as React from "react";
import { Edit, Plus } from "lucide-react";
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
import AddExpenseComponent from "@/app/[lang]/(dashboard)/(home)/dashboard/components/add-expense";
import { Icon } from "@iconify/react";
import { useUser } from "@/hooks/useUsers";

export function SharedSheet({
  type,
  user,
  open,
  onOpenChange,
  onSuccess,
  onReset,
  initialFilters,
}) {
  const [isOpen, setIsOpen] = React.useState(false);

  // const { data: userData, isLoading } = useUser(user?.id);

  React.useEffect(() => {
    if (open !== undefined) {
      setIsOpen(open);
    }
  }, [open]);

  const handleOpenChange = (newOpen) => {
    setIsOpen(newOpen);
    if (onOpenChange) {
      onOpenChange(newOpen);
    }
  };

  const handleSuccess = async (data) => {
    if (onSuccess) {
      await onSuccess(data);
    }
    handleOpenChange(false);
  };

  const handleReset = () => {
    if (onReset) {
      onReset();
    }
    handleOpenChange(false);
  };

  // console.log(initialFilters);

  return (
    <Sheet open={isOpen} onOpenChange={handleOpenChange}>
      <SheetTrigger asChild>
        {["add-teacher", "add-quality", "add-expense"].includes(type) ? (
          <Button variant="outline" size="md" className="text-[12px]">
            {type === "add-expense" ? (
              <Icon icon="heroicons:plus" className="mr-2 h-4 w-4" />
            ) : (
              <Edit className="mr-2 h-4 w-4" />
            )}
            {type === "add-teacher"
              ? "Add Teacher"
              : type === "add-quality"
              ? "Add Quality Assurance"
              : "Add Expense"}
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
          ["filter-students", "filter-archive"].includes(type)
            ? "md:max-w-sm"
            : ""
        } ${type === "add-expense" ? "md:max-w-md" : ""}`}
      >
        <div className="cover">
          <SheetHeader>
            <SheetTitle>
              {type === "add-teacher"
                ? "Add Teacher"
                : type === "add-quality"
                ? "Add Quality Assurance"
                : type === "add-expense"
                ? "Add New Expense"
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

          <div className="mt-4 px-4">
            {type === "add-teacher" ? (
              <AddTeacherComponent onSuccess={handleSuccess} />
            ) : type === "add-quality" ? (
              <AddQualityComponent onSuccess={handleSuccess} />
            ) : type === "add-expense" ? (
              <AddExpenseComponent onSuccess={handleSuccess} />
            ) : type === "edit-teacher" ? (
              <EditTeacherComponent
                user={user}
                onSuccess={handleSuccess}
                onReset={handleReset}
              />
            ) : type === "edit-quality" ? (
              <EditQualityComponent
                user={user}
                onSuccess={handleSuccess}
                onReset={handleReset}
              />
            ) : type === "show-teacher" ? (
              <EditTeacherComponent user={user} info={true} />
            ) : type === "show-quality" ? (
              <EditQualityComponent user={user} info={true} />
            ) : type === "filter-students"  ? (
              <FilterStudentsComponent
                onApply={handleSuccess}
                onReset={handleReset}
                initialFilters={initialFilters}
              />
            ) : type === "filter-archive" ? (
              <FilterArchiveComponent
                onApply={handleSuccess}
                onReset={handleReset}
                initialFilters={initialFilters}
              />
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
      </SheetContent>
    </Sheet>
  );
}
