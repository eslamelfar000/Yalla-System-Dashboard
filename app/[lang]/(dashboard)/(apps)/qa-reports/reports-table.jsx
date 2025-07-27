"use client";
import * as React from "react";
import {
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { Toggle } from "@/components/ui/toggle";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Icon } from "@iconify/react";
import { cn } from "@/lib/utils";
import { Card } from "@/components/ui/card";
import { ArrowBigRightDash, Check } from "lucide-react";
import Link from "next/link";
import { useGetData } from "@/hooks/useGetData";
import { useMutate } from "@/hooks/useMutate";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import LoadingButton from "@/components/Shared/loading-button";
import TeacherFilter from "@/components/Shared/TeacherFilter";
import Pagination from "@/components/Shared/Pagination/Pagination";
import { Skeleton } from "@/components/ui/skeleton";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const columns = [
  {
    accessorKey: "student-name",
    header: "Student Name",
    cell: ({ row }) => (
      <div className="font-medium text-card-foreground/80">
        <div className="flex space-x-3 rtl:space-x-reverse items-center">
          <Avatar className="rounded-full">
            <AvatarImage src={row?.original?.lesson?.student?.image} />
            <AvatarFallback>
              {row?.original?.lesson?.student?.name?.charAt(0) || "S"}
            </AvatarFallback>
          </Avatar>
          <span className="text-sm text-card-foreground whitespace-nowrap">
            {row?.original?.lesson?.student?.name || "N/A"}
          </span>
        </div>
      </div>
    ),
  },
  {
    accessorKey: "id",
    header: "ID",
    cell: ({ row }) => (
      <div className="font-medium text-card-foreground/80">
        <div className="flex space-x-3 rtl:space-x-reverse items-center">
          <span className="text-sm opacity-70 font-[400] text-card-foreground whitespace-nowrap">
            {row?.original?.id}
          </span>
        </div>
      </div>
    ),
  },
  {
    accessorKey: "date",
    header: "Date",
    cell: ({ row }) => (
      <div className="font-medium text-card-foreground/80">
        <div className="flex space-x-3 rtl:space-x-reverse items-center">
          <span className="text-sm opacity-70 font-[400] text-card-foreground whitespace-nowrap">
            {row?.original?.date || row?.original?.created_at || "N/A"}
          </span>
        </div>
      </div>
    ),
  },
  {
    accessorKey: "target",
    header: "Target",
    cell: ({ row }) => (
      <div className="font-medium text-card-foreground/80">
        <div className="flex space-x-3 rtl:space-x-reverse items-center">
          <span className="text-sm opacity-70 font-[400] text-card-foreground whitespace-nowrap">
            {row?.original?.target || "N/A"}%
          </span>
        </div>
      </div>
    ),
  },
  {
    accessorKey: "admin report",
    header: "Admin Report",
    cell: ({ row }) => (
      <div className="font-medium text-card-foreground/80">
        <div className="flex space-x-3 rtl:space-x-reverse items-center">
          <span className="text-sm opacity-70 font-[400] text-card-foreground whitespace-nowrap">
            <Link
              href={row?.original?.admin_report || ""}
              target="_blank"
              className=""
            >
              <button className="text-primary flex items-center text-[12px] border px-4 py-1 border-solid border-primary rounded-full">
                <span className="text-sm font-bold">Check</span>
                <ArrowBigRightDash className="inline-block ml-1 w-6 h-6" />
              </button>
            </Link>{" "}
          </span>
        </div>
      </div>
    ),
  },
  {
    accessorKey: "Teacher report",
    header: "Teacher Report",
    cell: ({ row }) => (
      <div className="font-medium">
        <div className="flex space-x-3 rtl:space-x-reverse items-center">
          <span className="text-sm opacity-70 font-[400] whitespace-nowrap">
            <Link
              href={row?.original?.teacher_report || ""}
              target="_blank"
              className=""
            >
              <button className="text-primary flex items-center text-[12px] border px-4 py-1 border-solid border-primary rounded-full">
                <span className="text-sm font-bold">Check</span>
                <ArrowBigRightDash className="inline-block ml-1 w-6 h-6" />
              </button>
            </Link>{" "}
          </span>
        </div>
      </div>
    ),
  },
  {
    accessorKey: "action",
    header: "Action",
    cell: ({ row }) => {
      return (
        <div className="font-medium text-card-foreground/80">
          <div className="rtl:space-x-reverse items-center">
            {row?.original?.admin_status === "done" ? (
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
              <Toggle
                aria-label="Toggle italic"
                size="icon"
                className="w-6 h-6 p-1 rounded-full bg-transparent text-primary border border-solid border-primary hover:bg-primary hover:text-white transition-colors"
                pressed={false}
                disabled={false}
                onClick={() =>
                  row.original.onToggle && row.original.onToggle(row.original)
                }
              >
                <Check className="w-6 h-6" />
              </Toggle>
            )}
          </div>
        </div>
      );
    },
  },
];

// Custom loading skeleton for QA reports table
const QAReportsSkeleton = () => {
  return (
    <Card>
      <div className="flex items-center flex-wrap gap-2 mb-5">
        <Skeleton className="h-10 w-[200px]" />
        <Skeleton className="h-10 w-[200px]" />
      </div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="font-semibold text-default-800 bg-default-50 dark:bg-default-100">
              Student Name
            </TableHead>
            <TableHead className="font-semibold text-default-800 bg-default-50 dark:bg-default-100">
              ID
            </TableHead>
            <TableHead className="font-semibold text-default-800 bg-default-50 dark:bg-default-100">
              Date
            </TableHead>
            <TableHead className="font-semibold text-default-800 bg-default-50 dark:bg-default-100">
              Target
            </TableHead>
            <TableHead className="font-semibold text-default-800 bg-default-50 dark:bg-default-100">
              Admin Report
            </TableHead>
            <TableHead className="font-semibold text-default-800 bg-default-50 dark:bg-default-100">
              Teacher Report
            </TableHead>
            <TableHead className="font-semibold text-default-800 bg-default-50 dark:bg-default-100">
              Action
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {Array.from({ length: 8 }).map((_, rowIndex) => (
            <TableRow key={rowIndex}>
              <TableCell>
                <div className="flex items-center space-x-3 rtl:space-x-reverse">
                  <Skeleton className="h-8 w-8 rounded-full" />
                  <Skeleton className="h-4 w-32" />
                </div>
              </TableCell>
              <TableCell>
                <Skeleton className="h-4 w-12" />
              </TableCell>
              <TableCell>
                <Skeleton className="h-4 w-24" />
              </TableCell>
              <TableCell>
                <Skeleton className="h-4 w-16" />
              </TableCell>
              <TableCell>
                <Skeleton className="h-8 w-20 rounded-full" />
              </TableCell>
              <TableCell>
                <Skeleton className="h-8 w-20 rounded-full" />
              </TableCell>
              <TableCell>
                <Skeleton className="h-6 w-6 rounded-full" />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Card>
  );
};

const ReportsDataTableComponent = () => {
  const [sorting, setSorting] = React.useState([]);
  const [columnFilters, setColumnFilters] = React.useState([]);
  const [columnVisibility, setColumnVisibility] = React.useState({});
  const [rowSelection, setRowSelection] = React.useState({});
  const [selectedReport, setSelectedReport] = React.useState(null);
  const [showConfirmDialog, setShowConfirmDialog] = React.useState(false);
  const [selectedTeacher, setSelectedTeacher] = React.useState(null);
  const [selectedMonth, setSelectedMonth] = React.useState("");
  const [currentPage, setCurrentPage] = React.useState(1);
  const [loadingRows, setLoadingRows] = React.useState(new Set());

  const handleTeacherChange = React.useCallback((teacherId) => {
    setSelectedTeacher(teacherId);
    setCurrentPage(1);
  }, []);

  const handleMonthChange = React.useCallback((month) => {
    setSelectedMonth(month);
    setCurrentPage(1);
  }, []);

  const handleClearFilter = React.useCallback(() => {
    setSelectedTeacher(null);
    setSelectedMonth("");
  }, []);

  // Generate all 12 months
  const months = React.useMemo(() => {
    const months = [];
    const currentYear = new Date().getFullYear();

    for (let month = 1; month <= 12; month++) {
      const date = new Date(currentYear, month - 1, 1); // month - 1 because getMonth() is 0-based
      const monthNumber = month.toString().padStart(2, "0"); // 01-12 format
      const monthLabel = date.toLocaleDateString("en-US", {
        month: "long",
      });
      months.push({ value: monthNumber, label: monthLabel });
    }
    return months;
  }, []);

  // Build API endpoint with filters - memoized for performance
  const buildEndpoint = React.useMemo(() => {
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

  // Mutation for updating report status
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

  const handleToggleReport = React.useCallback((report) => {
    if (report.status === "completed") {
      return; // Don't allow changes if already completed
    }
    setSelectedReport(report);
    setShowConfirmDialog(true);
  }, []);

  const handleConfirmStatusUpdate = React.useCallback(async () => {
    if (selectedReport) {
      setLoadingRows((prev) => new Set(prev).add(selectedReport.id));
      await updateReportStatusMutation.mutateAsync();
    }
  }, [selectedReport, updateReportStatusMutation]);

  // Add onToggle function and loading state to each report item - memoized for performance
  const reportsWithActions = React.useMemo(() => {
    return reportsList.map((report) => ({
      ...report,
      onToggle: handleToggleReport,
      isLoading: loadingRows.has(report.id),
    }));
  }, [reportsList, loadingRows, handleToggleReport]);

  const table = useReactTable({
    data: reportsWithActions,
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
      <>
        <div className="flex items-center flex-wrap gap-2 mb-5">
          <TeacherFilter
            selectedTeacher={selectedTeacher}
            onTeacherChange={handleTeacherChange}
            clearButton={false}
          />
          <Select value={selectedMonth} onValueChange={handleMonthChange}>
            <SelectTrigger className="w-[200px]">
              <SelectValue
                placeholder="Select Month"
                className="whitespace-nowrap"
              />
            </SelectTrigger>
            <SelectContent className="h-[300px] overflow-y-auto">
              <SelectItem value="">All Months</SelectItem>
              {months.map((month) => (
                <SelectItem key={month.value} value={month.value}>
                  {month.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <Card title="Simple">
          <Table>
            <TableHeader>
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id}>
                  {headerGroup.headers.map((header) => {
                    return (
                      <TableHead key={header.id}>
                        {header.isPlaceholder
                          ? null
                          : flexRender(
                              header.column.columnDef.header,
                              header.getContext()
                            )}
                      </TableHead>
                    );
                  })}
                </TableRow>
              ))}
            </TableHeader>
            <TableBody>
              {Array.from({ length: 3 }).map((_, rowIndex) => (
                <TableRow key={rowIndex}>
                  <TableCell>
                    <div className="flex items-center space-x-3 rtl:space-x-reverse">
                      <Skeleton className="h-8 w-8 rounded-full" />
                      <Skeleton className="h-4 w-32" />
                    </div>
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-4 w-12" />
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-4 w-24" />
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-4 w-16" />
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-8 w-20 rounded-full" />
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-8 w-20 rounded-full" />
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-6 w-6 rounded-full" />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Card>
      </>
    );
  }

  if (error) {
    return (
      <Card>
        <div className="flex items-center justify-center p-8">
          <div className="text-center">
            <Icon
              icon="material-symbols:error-outline"
              className="w-8 h-8 text-red-500 mx-auto mb-2"
            />
            <p className="text-red-500">Error loading reports data</p>
            <Button onClick={() => refetch()} className="mt-2">
              Retry
            </Button>
          </div>
        </div>
      </Card>
    );
  }

  return (
    <>
      <div className="flex items-center flex-wrap gap-2">
        <TeacherFilter
          selectedTeacher={selectedTeacher}
          onTeacherChange={handleTeacherChange}
          clearButton={false}
        />
        <Select value={selectedMonth} onValueChange={handleMonthChange}>
          <SelectTrigger className="w-[200px]">
            <SelectValue
              placeholder="Select Month"
              className="whitespace-nowrap"
            />
          </SelectTrigger>
          <SelectContent className="h-[300px] overflow-y-auto">
            <SelectItem value="">All Months</SelectItem>
            {months.map((month) => (
              <SelectItem key={month.value} value={month.value}>
                {month.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {(selectedMonth || selectedTeacher) && (
          <Button variant="outline" onClick={handleClearFilter}>
            <Icon icon="heroicons:x-mark" className="w-4 h-4" />
            Clear Filters
          </Button>
        )}
      </div>
      <Card title="Simple">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                  className="hover:bg-default-100"
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  No reports available
                </TableCell>
              </TableRow>
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
              Are you sure you want to mark this report as completed?
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
                    {selectedReport?.date ||
                      selectedReport?.created_at ||
                      "N/A"}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium">Target:</span>
                  <span>{selectedReport?.target || "N/A"}</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium">Teacher:</span>
                  <span>{selectedReport?.teacher?.name || "N/A"}</span>
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
              Mark as Completed
            </LoadingButton>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

const ReportsDataTable = React.memo(ReportsDataTableComponent);

export { ReportsDataTable };
export default ReportsDataTable;
