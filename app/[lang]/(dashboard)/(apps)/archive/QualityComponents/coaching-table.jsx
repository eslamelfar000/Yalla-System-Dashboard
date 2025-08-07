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
import { useState, useCallback, useMemo } from "react";
import {
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
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
import { usePathname } from "next/navigation";
import { Badge } from "@/components/ui/badge";

const CoachingTableStatus = ({ selectedTeacher, action, selectedMonth }) => {
  const [selectedCoaching, setSelectedCoaching] = useState(null);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const { pathname } = usePathname();

  // Build API endpoint with filters
  const buildEndpoint = useMemo(() => {
    if (action === "archive") {
      // Use reports endpoint for archive action
      let endpoint = `dashboard/coaching?page=${currentPage}&status=done`;
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
    } else {
      // Use coaching endpoint for other actions
      let endpoint = `dashboard/coaching?page=${currentPage}`;
      if (selectedTeacher) {
        endpoint += `&teacher_id=${selectedTeacher}`;
      }
      return endpoint;
    }
  }, [action, currentPage, selectedTeacher, selectedMonth, pathname]);

  // Fetch data from API
  const {
    data: data,
    isLoading,
    error,
    refetch,
  } = useGetData({
    endpoint: buildEndpoint,
    queryKey: ["coaching", action, selectedTeacher, selectedMonth, currentPage],
  });

  const dataList = data?.data?.sessions || [];

  // Prepare data for export
  const prepareExportData = useCallback(() => {
    return dataList.map((item) => ({
      "Teacher Name": item.teacher?.name || "N/A",
      "Teacher Email": item.teacher?.email || "N/A",
      "Session ID": item.id || "N/A",
      Date:
        item.date || item.created_at
          ? new Date(item.date || item.created_at).toLocaleDateString()
          : "N/A",
      Purpose: item.purpose || "N/A",
      Status: item.status || "N/A",
      "Created Date": item.created_at
        ? new Date(item.created_at).toLocaleDateString()
        : "N/A",
    }));
  }, [dataList]);

  // Mutation for completing coaching/reports
  const completeMutation = useMutate({
    method: "POST",
    endpoint: `dashboard/update-session-status/${selectedCoaching?.id}`,
    queryKeysToInvalidate: [["coaching", action]],
    text: "Coaching completed successfully!",
    onSuccess: () => {
      setShowConfirmDialog(false);
      setSelectedCoaching(null);
      refetch();
    },
  });

  const columns = [
    {
      key: "session",
      label: "Session",
    },
    {
      key: "date",
      label: "Date",
    },

    ...(action === "qa-reports" || action === "board"
      ? [
          {
            key: "action",
            label: "Action",
          },
        ]
      : []),
  ];

  const [columnFilters, setColumnFilters] = useState([]);
  const [columnVisibility, setColumnVisibility] = useState({});
  const [rowSelection, setRowSelection] = useState({});

  const table = useReactTable({
    data: dataList,
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

  const handleCompleteCoaching = (coaching) => {
    setSelectedCoaching(coaching);
    setShowConfirmDialog(true);
  };

  const handleConfirmComplete = async () => {
    if (selectedCoaching) {
      await completeMutation.mutateAsync();
    }
  };

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
            <p className="text-red-500 mb-4">Error loading coaching data</p>
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
          Coaching
        </h3>
        {action === "archive" && (
          <DownloadButton
            data={dataList}
            prepareExportData={prepareExportData}
            fileName="coaching-sessions"
            disabled={isLoading}
          />
        )}
      </div>

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
            {dataList.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="text-center py-8"
                >
                  {selectedTeacher
                    ? `No ${
                        action === "qa-reports" || action === "board"
                          ? "reports"
                          : "coaching sessions"
                      } found for the selected teacher`
                    : `No ${
                        action === "qa-reports" || action === "board"
                          ? "reports"
                          : "coaching sessions"
                      } found`}
                </TableCell>
              </TableRow>
            ) : (
              dataList.map((item) => (
                <TableRow key={item.id} className="hover:bg-default-100">
                  <TableCell className="font-medium">
                    {item.teacher?.name || item.id}
                  </TableCell>
                  <TableCell>
                    {new Date(item.day || item.created_at).toLocaleDateString()}
                  </TableCell>
                  {action === "qa-reports" && (
                    <TableCell>
                      {item?.status === "done" ? (
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
                      ) : (
                        <Badge
                          variant={
                            item?.status === "done" ? "success" : "warning"
                          }
                          className="text-xs"
                        >
                          Pending
                        </Badge>
                      )}
                    </TableCell>
                  )}
                  {action === "board" && (
                    <TableCell>
                      {item?.status === "done" ? (
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
                      ) : (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleCompleteCoaching(item)}
                          disabled={item.completed}
                        >
                          <Icon
                            icon="heroicons:check"
                            className="w-4 h-4 mr-1"
                          />
                          Mark Done
                        </Button>
                      )}
                    </TableCell>
                  )}
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </Card>

      {/* Pagination */}
      <Pagination
        last_page={data?.data?.pagination?.last_page}
        setCurrentPage={setCurrentPage}
        current_page={currentPage}
        studentsPagination={false}
      />

      {/* Confirmation Dialog */}
      <AlertDialog open={showConfirmDialog} onOpenChange={setShowConfirmDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              {action === "archive"
                ? "Complete Report"
                : "Complete Coaching Session"}
            </AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to mark this{" "}
              {action === "archive" ? "report" : "coaching session"} as
              completed?
              <br />
              <br />
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="font-medium">
                    {action === "archive" ? "Student:" : "Teacher:"}
                  </span>
                  <span>
                    {action === "archive"
                      ? selectedCoaching?.lesson?.student?.name || "N/A"
                      : selectedCoaching?.teacher?.name || "N/A"}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium">ID:</span>
                  <span>{selectedCoaching?.id}</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium">Date:</span>
                  <span>
                    {action === "archive"
                      ? selectedCoaching?.lesson?.created_at
                        ? new Date(selectedCoaching.lesson.created_at)
                            .toLocaleString()
                            .split(",")[0]
                        : "N/A"
                      : selectedCoaching?.date ||
                        selectedCoaching?.created_at ||
                        "N/A"}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium">
                    {action === "archive" ? "Target:" : "Purpose:"}
                  </span>
                  <span>{selectedCoaching?.purpose || "N/A"}</span>
                </div>
              </div>
              <br />
              <span className="text-orange-600 font-medium">
                ⚠️ This action cannot be undone once completed.
              </span>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={completeMutation.isPending}>
              Cancel
            </AlertDialogCancel>
            <LoadingButton
              onClick={handleConfirmComplete}
              loading={completeMutation.isPending}
            >
              {action === "archive" ? "Mark as Done" : "Complete"}
            </LoadingButton>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export default CoachingTableStatus;
