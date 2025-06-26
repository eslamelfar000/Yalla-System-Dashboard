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

const columns = [
  {
    accessorKey: "student-name",
    header: "Student Name",
    cell: ({ row }) => (
      <div className="  font-medium  text-card-foreground/80">
        <div className="flex space-x-3  rtl:space-x-reverse items-center">
          <span className=" text-sm opacity-70 font-[400]  text-card-foreground whitespace-nowrap">
            {row?.original?.student_name || row?.original?.user?.name || "N/A"}
          </span>
        </div>
      </div>
    ),
  },
  {
    accessorKey: "id",
    header: "ID",
    cell: ({ row }) => (
      <div className="  font-medium  text-card-foreground/80">
        <div className="flex space-x-3  rtl:space-x-reverse items-center">
          <span className=" text-sm opacity-70 font-[400] text-card-foreground whitespace-nowrap">
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
      <div className="  font-medium  text-card-foreground/80">
        <div className="flex space-x-3  rtl:space-x-reverse items-center">
          <span className=" text-sm opacity-70 font-[400]  text-card-foreground whitespace-nowrap">
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
      <div className="  font-medium  text-card-foreground/80">
        <div className="flex space-x-3  rtl:space-x-reverse items-center">
          <span className=" text-sm opacity-70 font-[400]  text-card-foreground whitespace-nowrap">
            {row?.original?.target || "N/A"}
          </span>
        </div>
      </div>
    ),
  },
  {
    accessorKey: "admin report",
    header: "Admin Report",
    cell: ({ row }) => (
      <div className="  font-medium  text-card-foreground/80">
        <div className="flex space-x-3  rtl:space-x-reverse items-center">
          <span className=" text-sm opacity-70 font-[400]  text-card-foreground whitespace-nowrap">
            <Link href={row?.original?.admin_report_url || ""} className="">
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
      <div className="  font-medium  text-card-foreground/80">
        <div className="flex space-x-3  rtl:space-x-reverse items-center">
          <span className=" text-sm opacity-70 font-[400]  text-card-foreground whitespace-nowrap">
            <Link href={row?.original?.teacher_report_url || ""} className="">
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
    cell: ({ row }) => (
      <div className="  font-medium  text-card-foreground/80">
        <div className="rtl:space-x-reverse items-center">
          <Toggle
            aria-label="Toggle italic"
            size="icon"
            className="w-6 h-6 p-1 rounded-full bg-transparent text-primary border border-solid border-primary"
            pressed={row?.original?.status === "completed"}
            disabled={row?.original?.status === "completed"}
            onClick={() =>
              row.original.onToggle && row.original.onToggle(row.original)
            }
          >
            <Check className="w-6 h-6" />
          </Toggle>
        </div>
      </div>
    ),
  },
];

export function ReportsDataTable() {
  const [sorting, setSorting] = React.useState([]);
  const [columnFilters, setColumnFilters] = React.useState([]);
  const [columnVisibility, setColumnVisibility] = React.useState({});
  const [rowSelection, setRowSelection] = React.useState({});
  const [selectedReport, setSelectedReport] = React.useState(null);
  const [showConfirmDialog, setShowConfirmDialog] = React.useState(false);

  // Fetch reports data from API
  const {
    data: reportsData,
    isLoading,
    error,
    refetch,
  } = useGetData({
    endpoint: "dashboard/reports",
    queryKey: ["reports"],
  });

  const reportsList = reportsData?.data || [];

  // Mutation for updating report status
  const updateReportStatusMutation = useMutate({
    method: "POST",
    endpoint: `dashboard/status-report/${selectedReport?.id}`,
    queryKeysToInvalidate: [["reports"]],
    text: "Report status updated successfully!",
    onSuccess: () => {
      setShowConfirmDialog(false);
      setSelectedReport(null);
      refetch();
    },
  });

  const handleToggleReport = (report) => {
    if (report.status === "completed") {
      return; // Don't allow changes if already completed
    }
    setSelectedReport(report);
    setShowConfirmDialog(true);
  };

  const handleConfirmStatusUpdate = async () => {
    if (selectedReport) {
      await updateReportStatusMutation.mutateAsync();
    }
  };

  // Add onToggle function to each report item
  const reportsWithActions = reportsList.map((report) => ({
    ...report,
    onToggle: handleToggleReport,
  }));

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
      <Card>
        <div className="flex items-center justify-center p-8">
          <div className="text-center">
            <Icon
              icon="eos-icons:loading"
              className="w-8 h-8 animate-spin mx-auto mb-2"
            />
            <p>Loading reports data...</p>
          </div>
        </div>
      </Card>
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
      <div className="flex items-center flex-wrap gap-2 mb-5">
        <Select className="w-[280px]">
          <SelectTrigger className="w-[200px]">
            <SelectValue
              placeholder="Select Teacher"
              className="whitespace-nowrap"
            />
          </SelectTrigger>
          <SelectContent className="h-[300px] overflow-y-auto ">
            {reportsList?.map((item) => (
              <SelectItem
                key={item?.id}
                value={item?.teacher_name || item?.user?.name}
              >
                {item?.teacher_name || item?.user?.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select className="w-[280px]">
          <SelectTrigger className="w-[200px]">
            <SelectValue
              placeholder="Select Month"
              className="whitespace-nowrap"
            />
          </SelectTrigger>
          <SelectContent className="h-[300px] overflow-y-auto ">
            {reportsList?.map((item) => (
              <SelectItem key={item?.id} value={item?.date || item?.created_at}>
                {item?.date || item?.created_at}
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
            {table.getRowModel().rows?.length ? (
              table
                .getRowModel()
                .rows.slice(0, 4)
                .map((row) => (
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

      <div className="flex items-center flex-wrap gap-4 px-4 pb-5">
        <div className="flex-1 text-sm text-muted-foreground whitespace-nowrap">
          {table.getFilteredSelectedRowModel().rows.length} of{" "}
          {table.getFilteredRowModel().rows.length} row(s) selected.
        </div>

        <div className="flex gap-2  items-center">
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

      {/* Confirmation Dialog */}
      <AlertDialog open={showConfirmDialog} onOpenChange={setShowConfirmDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirm Report Status Update</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to mark this report as completed?
              <br />
              <strong>Student:</strong>{" "}
              {selectedReport?.student_name || selectedReport?.user?.name}
              <br />
              <strong>ID:</strong> {selectedReport?.id}
              <br />
              <strong>Date:</strong>{" "}
              {selectedReport?.date || selectedReport?.created_at}
              <br />
              <strong>Target:</strong> {selectedReport?.target || "N/A"}
              <br />
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
}

export default ReportsDataTable;
