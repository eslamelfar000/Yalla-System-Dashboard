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
import Pagination from "@/components/Shared/Pagination/Pagination";

const ReportsTable = ({ selectedTeacher }) => {
  const [selectedReport, setSelectedReport] = useState(null);
  const [sendConfirmOpen, setSendConfirmOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);

  // Get reports data using custom hook with teacher filter and pagination
  const {
    data: reportsData,
    isLoading,
    error,
    refetch,
  } = useGetData({
    endpoint: selectedTeacher
      ? `dashboard/reports?send=pending&teacher_id=${selectedTeacher}&page=${currentPage}`
      : `dashboard/reports?send=pending&page=${currentPage}`,
    queryKey: ["reports", selectedTeacher, currentPage],
  });

  const reports = reportsData?.data?.reports || [];

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
                        <AvatarImage src={report?.lesson?.student?.image} />
                        <AvatarFallback>
                          {report?.lesson?.student?.name?.charAt(0) || "T"}
                        </AvatarFallback>
                      </Avatar>
                      <span className="text-sm text-default-600">
                        {report?.lesson?.student?.name || "Unknown Student"}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell className="font-medium">{report.id}</TableCell>
                  <TableCell>
                    {
                      new Date(report?.lesson?.created_at)
                        .toLocaleString()
                        .split(",")[0]
                    }
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
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 24 24"
                          fill="currentColor"
                          className="w-8 h-8 text-green-500"
                        >
                          <path
                            fillRule="evenodd"
                            d="M8.603 3.799A4.49 4.49 0 0 1 12 2.25c1.357 0 2.573.6 3.397 1.549a4.49 4.49 0 0 1 3.498 1.307 4.491 4.491 0 0 1 1.307 3.497A4.49 4.49 0 0 1 21.75 12a4.49 4.49 0 0 1-1.549 3.397 4.491 4.491 0 0 1-1.307 3.497 4.491 4.491 0 0 1-3.497 1.307A4.49 4.49 0 0 1 12 21.75a4.49 4.49 0 0 1-3.397-1.549 4.49 4.49 0 0 1-3.498-1.306 4.491 4.491 0 0 1-1.307-3.498A4.49 4.49 0 0 1 2.25 12c0-1.357.6-2.573 1.549-3.397a4.49 4.49 0 0 1 1.307-3.497 4.49 4.49 0 0 1 3.497-1.307Zm7.007 6.387a.75.75 0 1 0-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 0 0-1.06 1.06l2.25 2.25a.75.75 0 0 0 1.14-.094l3.75-5.25Z"
                            clipRule="evenodd"
                          />
                        </svg>
                      </div>
                    )}
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </Card>

      {/* Pagination */}
      <Pagination
        last_page={reportsData?.data?.pagination?.last_page}
        setCurrentPage={setCurrentPage}
        current_page={currentPage}
        studentsPagination={false}
      />

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
