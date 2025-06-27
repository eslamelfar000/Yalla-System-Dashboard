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
import { useState } from "react";
import { cn } from "@/lib/utils";
import { useGetData } from "@/hooks/useGetData";
import { useMutate } from "@/hooks/useMutate";
import LoadingButton from "@/components/Shared/loading-button";
import { TableSkeleton } from "@/components/ui/table-skeleton";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import Link from "next/link";

const ReportsTable = ({ selectedTeacher }) => {
  const [selectedReport, setSelectedReport] = useState(null);
  const [sendConfirmOpen, setSendConfirmOpen] = useState(false);

  // Get reports data using custom hook with teacher filter
  const {
    data: reportsData,
    isLoading,
    error,
    refetch,
  } = useGetData({
    endpoint: selectedTeacher
      ? `dashboard/reports?teacher_id=${selectedTeacher}`
      : "dashboard/reports",
    queryKey: ["reports", selectedTeacher],
  });

  const reports = reportsData?.data || [];

  // Send report mutation using custom hook
  const sendReportMutation = useMutate({
    method: "GET",
    endpoint: `dashboard/send-report/${selectedReport?.id}`,
    queryKeysToInvalidate: [["reports"]],
    text: "Report sent successfully",
    onSuccess: () => {
      refetch();
      setSendConfirmOpen(false);
      setSelectedReport(null);
    },
  });

  const handleSendReport = (report) => {
    setSelectedReport(report);
    setSendConfirmOpen(true);
  };

  const confirmSendReport = () => {
    if (selectedReport) {
      sendReportMutation.mutate();
    }
  };

  const columns = [
    {
      key: "student",
      label: "Student",
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
      key: "target",
      label: "Target",
    },
    {
      key: "admin_report",
      label: "Admin Report",
    },
    {
      key: "teacher_report",
      label: "Teacher Report",
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
    data: reports,
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
      <Card>
        <TableSkeleton columns={columns} rows={3} />
      </Card>
    );
  }

  if (error) {
    return (
      <Card>
        <div className="flex justify-center items-center h-64">
          <div className="text-center">
            <p className="text-red-500 mb-4">Error loading reports</p>
            <Button onClick={() => refetch()}>Retry</Button>
          </div>
        </div>
      </Card>
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
            {reports.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="text-center py-8"
                >
                  {selectedTeacher
                    ? "No reports found for the selected teacher"
                    : "Please select a teacher to view reports"}
                </TableCell>
              </TableRow>
            ) : (
              reports.map((report) => (
                <TableRow key={report.id} className="hover:bg-default-100">
                  <TableCell>
                    <div className="flex gap-3 items-center">
                      <Avatar className="w-8 h-8 rounded-full">
                        <AvatarImage
                          src={report.teacher?.avatar || report.teacher?.image}
                        />
                        <AvatarFallback>
                          {report.teacher?.name?.charAt(0) || "T"}
                        </AvatarFallback>
                      </Avatar>
                      <span className="text-sm text-default-600">
                        {report.teacher?.name || "Unknown Teacher"}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell className="font-medium">{report.id}</TableCell>
                  <TableCell>
                    {new Date(report?.lesson?.created_at).toLocaleDateString()}
                  </TableCell>
                  <TableCell>{report.target}%</TableCell>
                  <TableCell>
                    <Link href={report.admin_report} target="_blank">
                      <Button
                        variant="outline"
                        size="sm"
                        className="flex items-center gap-2"
                      >
                        <span className="">Admin Report</span>
                        <Icon
                          icon="heroicons:arrow-top-right-on-square"
                          className="w-4 h-4 mr-1"
                        />
                      </Button>
                    </Link>
                  </TableCell>
                  <TableCell>
                    <Link href={report.teacher_report} target="_blank">
                      <Button
                        variant="outline"
                        size="sm"
                        className="flex items-center gap-2"
                      >
                        <span className="">Teacher Report</span>
                        <Icon
                          icon="heroicons:arrow-top-right-on-square"
                          className="w-4 h-4 mr-1"
                        />
                      </Button>
                    </Link>
                  </TableCell>
                  <TableCell>
                    {report?.send === "pending" ? (
                      <Button
                        size="sm"
                        variant="outline"
                        className="flex items-center gap-2"
                        onClick={() => handleSendReport(report)}
                        disabled={report.status === "sent"}
                      >
                        <span className="">Send</span>
                        <Icon
                          icon="heroicons:paper-airplane"
                          className="w-4 h-4 mr-1"
                        />
                      </Button>
                    ) : (
                      <div size="sm" className="flex items-start">
                        <div className="flex items-center gap-2 bg-green-500 text-white rounded-md p-2 select-none">
                          <span className="">Done</span>
                          <Icon
                            icon="heroicons:check-circle"
                            className="w-5 h-5"
                          />
                        </div>
                      </div>
                    )}
                  </TableCell>
                </TableRow>
              ))
            )}
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

      {/* Send Report Confirmation Dialog */}
      <Dialog open={sendConfirmOpen} onOpenChange={setSendConfirmOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Send Report</DialogTitle>
            <DialogDescription>
              Are you sure you want to send this report? This action cannot be
              undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setSendConfirmOpen(false)}>
              Cancel
            </Button>
            <LoadingButton
              onClick={confirmSendReport}
              loading={sendReportMutation.isPending}
            >
              Send Report
            </LoadingButton>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default ReportsTable;
