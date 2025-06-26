"use client";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { Icon } from "@iconify/react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import { Slider } from "@/components/ui/slider";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useGetData } from "@/hooks/useGetData";
import { useMutate } from "@/hooks/useMutate";
import LoadingButton from "@/components/Shared/loading-button";
import toast from "react-hot-toast";

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

const BoardTableStatus = () => {
  // const [percent, setPercent] = useState(50);
  const [selectedSession, setSelectedSession] = useState(null);
  const [reportForm, setReportForm] = useState({
    teacher_id: "",
    lesson_id: "",
    target: 50,
    teacher_report: null,
    admin_report: null,
  });

  // Get sessions data using custom hook
  const {
    data: sessionsData,
    isLoading,
    error,
    refetch,
  } = useGetData({
    endpoint: "dashboard/sessions",
    queryKey: ["sessions"],
  });

  const sessions = sessionsData?.data || [];

  // Create report mutation using custom hook
  const createReportMutation = useMutate({
    method: "POST",
    endpoint: "dashboard/reports",
    queryKeysToInvalidate: [["sessions"]],
    text: "Report created successfully",
    onSuccess: (data) => {
      setSelectedSession(null);
      setReportForm({
        teacher_id: "",
        lesson_id: "",
        target: 50,
        teacher_report: null,
        admin_report: null,
      });
    },
  });

  const handleFileChange = (e, field) => {
    const file = e.target.files[0];
    if (file) {
      setReportForm((prev) => ({
        ...prev,
        [field]: file,
      }));
    }
  };

  const handleSessionSelect = (session) => {
    setSelectedSession(session);
    // Auto-fill lesson_id from the selected session
    setReportForm((prev) => ({
      ...prev,
      lesson_id: session.id || session.lesson_id || "",
    }));
  };

  const handleCreateReport = async (e) => {
    e.preventDefault();

    if (!reportForm.teacher_id || !reportForm.lesson_id) {
      toast.error("Please fill in all required fields");
      return;
    }

    const formData = new FormData();
    formData.append("teacher_id", reportForm.teacher_id);
    formData.append("lesson_id", reportForm.lesson_id);
    formData.append("target", reportForm.target);

    if (reportForm.teacher_report) {
      formData.append("teacher_report", reportForm.teacher_report);
    }

    if (reportForm.admin_report) {
      formData.append("admin_report", reportForm.admin_report);
    }

    createReportMutation.mutate(formData);
  };

  const columns = [
    {
      key: "student",
      label: "Student Name",
    },
    {
      key: "id",
      label: "ID",
    },
    {
      key: "date",
      label: "Date",
    },
    {
      key: "action",
      label: "Action",
    },
  ];

  const [sorting, setSorting] = useState([]);
  const [columnFilters, setColumnFilters] = useState([]);
  const [columnVisibility, setColumnVisibility] = useState({});
  const [rowSelection, setRowSelection] = useState({});

  const table = useReactTable({
    data: sessions,
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
    },
  });

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-center">
          <p className="text-red-500 mb-4">Error loading sessions</p>
          <Button onClick={() => refetch()}>Retry</Button>
        </div>
      </div>
    );
  }

  return (
    <>
      <Card>
        <Table>
          <TableHeader>
            <TableRow>
              {columns.map((column) => (
                <TableHead key={column.key}>{column.label}</TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {sessions.map((session) => (
              <TableRow key={session.id} className="hover:bg-default-100">
                <TableCell className="font-medium text-card-foreground/80">
                  <div className="flex gap-3 items-center">
                    <Avatar className="rounded-lg">
                      <AvatarImage
                        src={session.student?.avatar || session.student?.image}
                      />
                      <AvatarFallback>
                        {session.student?.name?.charAt(0) || "S"}
                      </AvatarFallback>
                    </Avatar>
                    <span className="text-sm text-default-600">
                      {session.student || "Unknown Student"}
                    </span>
                  </div>
                </TableCell>
                <TableCell>{session.id}</TableCell>
                <TableCell>{session.day}</TableCell>
                <TableCell>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        size="icon"
                        variant="outline"
                        className="h-7 w-7"
                        color="primary"
                        onClick={() => handleSessionSelect(session)}
                      >
                        <Icon icon="heroicons:plus" className="h-4 w-4" />
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-80">
                      <form
                        onSubmit={handleCreateReport}
                        className="grid gap-4"
                      >
                        <div className="space-y-2">
                          <h4 className="font-medium leading-none">
                            Create Report
                          </h4>
                          <p className="text-sm text-muted-foreground">
                            Create a report for session #{selectedSession?.id}
                          </p>
                        </div>

                        <div className="grid gap-2 w-full space-y-5">
                          <div className="space-y-2">
                            <Label htmlFor="teacher_id">Teacher ID</Label>
                            <Input
                              id="teacher_id"
                              type="text"
                              value={reportForm.teacher_id}
                              onChange={(e) =>
                                setReportForm((prev) => ({
                                  ...prev,
                                  teacher_id: e.target.value,
                                }))
                              }
                              placeholder="Enter teacher ID"
                              required
                            />
                          </div>

                          <div className="space-y-2">
                            <Label htmlFor="admin_report">
                              Admin Report (File)
                            </Label>
                            <Input
                              id="admin_report"
                              type="file"
                              onChange={(e) =>
                                handleFileChange(e, "admin_report")
                              }
                              className="col-span-2 h-8 w-full"
                            />
                          </div>

                          <div className="space-y-2">
                            <Label htmlFor="teacher_report">
                              Teacher Report (File)
                            </Label>
                            <Input
                              id="teacher_report"
                              type="file"
                              onChange={(e) =>
                                handleFileChange(e, "teacher_report")
                              }
                              className="col-span-2 h-8"
                            />
                          </div>

                          <div className="space-y-3">
                            <div className="flex items-center justify-between">
                              <Label htmlFor="target">Target</Label>
                              <Label htmlFor="target">
                                {reportForm.target}%
                              </Label>
                            </div>
                            <Slider
                              value={[reportForm.target]}
                              max={100}
                              step={1}
                              className="w-full"
                              onValueChange={(value) => {
                                setReportForm((prev) => ({
                                  ...prev,
                                  target: value[0],
                                }));
                              }}
                            />
                          </div>

                          <div className="space-y-2">
                            <LoadingButton
                              type="submit"
                              className="w-full h-8"
                              loading={createReportMutation.isPending}
                            >
                              {createReportMutation.isPending
                                ? "Creating..."
                                : "Create Report"}
                            </LoadingButton>
                          </div>
                        </div>
                      </form>
                    </PopoverContent>
                  </Popover>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>

      <div className="flex items-center flex-wrap gap-4">
        <div className="flex-1 text-sm text-muted-foreground whitespace-nowrap">
          {table.getFilteredSelectedRowModel().rows.length} of{" "}
          {table.getFilteredRowModel().rows.length} row(s) selected.
        </div>

        <div className="flex gap-2 items-center">
          <Button
            variant="outline"
            size="icon"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
            className="h-8 w-8"
          >
            <Icon
              icon="heroicons:chevron-left"
              className="w-5 h-5 rtl:rotate-180"
            />
          </Button>

          {table.getPageOptions().map((page, pageIdx) => (
            <Button
              key={`basic-data-table-${pageIdx}`}
              onClick={() => table.setPageIndex(pageIdx)}
              variant={`${
                pageIdx === table.getState().pagination.pageIndex
                  ? ""
                  : "outline"
              }`}
              className={cn("w-8 h-8")}
            >
              {page + 1}
            </Button>
          ))}

          <Button
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
            variant="outline"
            size="icon"
            className="h-8 w-8"
          >
            <Icon
              icon="heroicons:chevron-right"
              className="w-5 h-5 rtl:rotate-180"
            />
          </Button>
        </div>
      </div>
    </>
  );
};

export default BoardTableStatus;
