"use client";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Icon } from "@iconify/react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import Link from "next/link";
import { ArrowBigRightDash } from "lucide-react";
import { useState, useCallback, useMemo } from "react";
import {
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { cn } from "@/lib/utils";
import { useGetData } from "@/hooks/useGetData";
import { useMutate } from "@/hooks/useMutate";
import { TableSkeleton } from "@/components/ui/table-skeleton";
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import LoadingButton from "@/components/Shared/loading-button";
import Pagination from "@/components/Shared/Pagination/Pagination";
import DownloadButton from "@/components/Shared/DownloadButton";

const ReviewTableStatus = ({ selectedTeacher, selectedMonth, searchQuery }) => {
  const [selectedReport, setSelectedReport] = useState(null);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [loadingRows, setLoadingRows] = useState(new Set());

  // Build API endpoint with filters
  const buildEndpoint = useMemo(() => {
    let endpoint = `dashboard/reports?page=${currentPage}`;
    const params = [];

    if (selectedTeacher) {
      params.push(`teacher_id=${selectedTeacher}`);
    }

    if (selectedMonth) {
      params.push(`month=${selectedMonth}`);
    }

    if (params.length > 0) {
      endpoint += `&${params.join("&")}`;
    }

    return endpoint;
  }, [currentPage, selectedTeacher, selectedMonth]);

  // Fetch reports data from API
  const {
    data: reportsData,
    isLoading,
    error,
    refetch,
  } = useGetData({
    endpoint: buildEndpoint,
    queryKey: ["reports", selectedTeacher, selectedMonth, currentPage],
  });

  const reportsList = reportsData?.data?.reports || [];

  // Prepare data for export
  const prepareExportData = useCallback(() => {
    return reportsList.map((report) => ({
      "Student Name": report?.lesson?.student?.name || "N/A",
      "Student Email": report?.lesson?.student?.email || "N/A",
      "Student Phone": report?.lesson?.student?.phone || "N/A",
      "Report ID": report.id || "N/A",
      Date: report?.lesson?.created_at
        ? new Date(report.lesson.created_at).toLocaleDateString()
        : "N/A",
      Target: `${report.target || 0}%`,
      "Admin Report URL": report.admin_report || "N/A",
      "Teacher Report URL": report.teacher_report || "N/A",
      Status: report.status || "N/A",
      "Created Date": report.created_at
        ? new Date(report.created_at).toLocaleDateString()
        : "N/A",
    }));
  }, [reportsList]);

  // Mutation for updating report status to "done"
  const updateReportStatusMutation = useMutate({
    method: "POST",
    endpoint: `dashboard/status-report/${selectedReport?.id}`,
    queryKeysToInvalidate: [["reports"]],
    text: "Report status updated successfully!",
    onSuccess: () => {
      setShowConfirmDialog(false);
      setSelectedReport(null);
      setLoadingRows((prev) => {
        const newSet = new Set(prev);
        newSet.delete(selectedReport?.id);
        return newSet;
      });
      refetch();
    },
    onError: () => {
      setLoadingRows((prev) => {
        const newSet = new Set(prev);
        newSet.delete(selectedReport?.id);
        return newSet;
      });
    },
  });

  const handleToggleReport = useCallback((report) => {
    if (report.status === "done") {
      return; // Don't allow changes if already done
    }
    setSelectedReport(report);
    setShowConfirmDialog(true);
  }, []);

  const handleConfirmStatusUpdate = useCallback(async () => {
    if (selectedReport) {
      setLoadingRows((prev) => new Set(prev).add(selectedReport.id));
      await updateReportStatusMutation.mutateAsync();
    }
  }, [selectedReport, updateReportStatusMutation]);

  const columns = [
    {
      key: "student-name",
      label: "Student Name",
    },
    {
      key: "ID",
      label: "ID",
    },
    {
      key: "Date",
      label: "Date",
    },
    {
      key: "Target",
      label: "Target",
    },
    {
      key: "Admin Report",
      label: "Admin Report",
    },
    {
      key: "Teacher Report",
      label: "Teacher Report",
    },
  ];

  // Add onToggle function and loading state to each report item
  const reportsWithActions = useMemo(() => {
    return reportsList.map((report) => ({
      ...report,
      onToggle: handleToggleReport,
      isLoading: loadingRows.has(report.id),
    }));
  }, [reportsList, loadingRows, handleToggleReport]);

  const [columnFilters, setColumnFilters] = useState([]);
  const [columnVisibility, setColumnVisibility] = useState({});
  const [rowSelection, setRowSelection] = useState({});

  const table = useReactTable({
    data: reportsWithActions,
    columns,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    state: {
      columnFilters,
      columnVisibility,
      rowSelection,
    },
  });

  if (isLoading) {
    return (
      <Card>
        <TableSkeleton columns={columns} rows={5} />
      </Card>
    );
  }

  if (error) {
    return (
      <Card>
        <div className="flex justify-center items-center h-64">
          <div className="text-center">
            <p className="text-red-500 mb-4">Error loading reports data</p>
            <Button onClick={() => refetch()}>Retry</Button>
          </div>
        </div>
      </Card>
    );
  }

  return (
    <>
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-xl font-medium text-default-700 mb-2 opacity-60">
          Review
        </h3>
        <DownloadButton
          data={reportsList}
          prepareExportData={prepareExportData}
          fileName="quality-reports"
          disabled={isLoading}
        />
      </div>

      <Card>
        <Table>
          <TableHeader>
            <TableRow>
              {columns.map((column) => (
                <TableHead key={column.key} className="text-right!">
                  {column.label}
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {reportsList.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="text-center py-8"
                >
                  {selectedTeacher
                    ? "No reports found for the selected teacher"
                    : "No reports found"}
                </TableCell>
              </TableRow>
            ) : (
              reportsList.map((report) => (
                <TableRow key={report.id} className="hover:bg-default-100">
                  <TableCell className="font-medium text-card-foreground/80">
                    <div className="flex gap-3 items-center">
                      <Avatar className="rounded-lg">
                        <AvatarImage src={report?.lesson?.student?.image} />
                        <AvatarFallback>
                          {report?.lesson?.student?.name?.charAt(0) || "S"}
                        </AvatarFallback>
                      </Avatar>
                      <span className="text-sm text-default-600">
                        {report?.lesson?.student?.name || "Unknown Student"}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell>{report.id}</TableCell>
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
                      <button className="text-primary text-[12px] border px-4 py-1 border-solid border-primary rounded-full">
                        Check
                        <ArrowBigRightDash className="inline-block ml-1 w-6 h-6" />
                      </button>
                    </Link>
                  </TableCell>
                  <TableCell>
                    <Link href={report.teacher_report} target="_blank">
                      <button className="text-primary text-[12px] border px-4 py-1 border-solid border-primary rounded-full">
                        Check
                        <ArrowBigRightDash className="inline-block ml-1 w-6 h-6" />
                      </button>
                    </Link>
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

      {/* Confirmation Dialog */}
      <AlertDialog open={showConfirmDialog} onOpenChange={setShowConfirmDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirm Report Status Update</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to mark this report as done?
              <br />
              <br />
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="font-medium">Student:</span>
                  <span>{selectedReport?.lesson?.student?.name || "N/A"}</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium">Report ID:</span>
                  <span>{selectedReport?.id}</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium">Date:</span>
                  <span>
                    {selectedReport?.lesson?.created_at
                      ? new Date(selectedReport.lesson.created_at)
                          .toLocaleString()
                          .split(",")[0]
                      : "N/A"}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium">Target:</span>
                  <span>{selectedReport?.target || "N/A"}%</span>
                </div>
              </div>
              <br />
              <span className="text-orange-600 font-medium">
                ⚠️ This action cannot be undone once completed.
              </span>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={updateReportStatusMutation.isPending}>
              Cancel
            </AlertDialogCancel>
            <LoadingButton
              loading={updateReportStatusMutation.isPending}
              onClick={handleConfirmStatusUpdate}
              variant="default"
            >
              Mark as Done
            </LoadingButton>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export default ReviewTableStatus;
