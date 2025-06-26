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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";

const ReportsTable = () => {
  const [selectedReport, setSelectedReport] = useState(null);
  const [sendConfirmOpen, setSendConfirmOpen] = useState(false);

  // Get reports data using custom hook
  const {
    data: reportsData,
    isLoading,
    error,
    refetch,
  } = useGetData({
    endpoint: "dashboard/reports",
    queryKey: ["reports"],
  });

  const reports = reportsData?.data || [];

  // Send report mutation using custom hook
  const sendReportMutation = useMutate({
    method: "POST",
    endpoint: `dashboard/send-report/${selectedReport?.id}`,
    queryKeysToInvalidate: [["reports"]],
    text: "Report sent successfully",
    onSuccess: (data) => {
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

  const getStatusBadge = (status) => {
    switch (status?.toLowerCase()) {
      case "sent":
        return <Badge className="bg-green-100 text-green-800">Sent</Badge>;
      case "pending":
        return <Badge className="bg-yellow-100 text-yellow-800">Pending</Badge>;
      case "draft":
        return <Badge className="bg-gray-100 text-gray-800">Draft</Badge>;
      default:
        return <Badge className="bg-gray-100 text-gray-800">Unknown</Badge>;
    }
  };

  const columns = [
    {
      key: "id",
      label: "Report ID",
    },
    {
      key: "teacher",
      label: "Teacher",
    },
    {
      key: "lesson",
      label: "Lesson",
    },
    {
      key: "target",
      label: "Target",
    },
    {
      key: "status",
      label: "Status",
    },
    {
      key: "created_at",
      label: "Created",
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
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-center">
          <p className="text-red-500 mb-4">Error loading reports</p>
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
            {reports?.length > 0 ? (
              reports?.map((report) => (
                <TableRow key={report.id} className="hover:bg-default-100">
                  <TableCell className="font-medium text-card-foreground/80">
                    #{report.id}
                  </TableCell>
                  <TableCell className="font-medium text-card-foreground/80">
                    <div className="flex gap-3 items-center">
                      <Avatar className="rounded-lg">
                        <AvatarImage
                          src={report.teacher?.avatar || report.teacher?.image}
                        />
                        <AvatarFallback>
                          {report.teacher?.name?.charAt(0) || "T"}
                        </AvatarFallback>
                      </Avatar>
                      <span className="text-sm text-default-600">
                        {report.teacher?.name ||
                          report.teacher_id ||
                          "Unknown Teacher"}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <span className="text-sm text-default-600">
                      Lesson #{report.lesson_id}
                    </span>
                  </TableCell>
                  <TableCell>
                    <span className="text-sm text-default-600">
                      {report.target}%
                    </span>
                  </TableCell>
                  <TableCell>{getStatusBadge(report.status)}</TableCell>
                  <TableCell>
                    <span className="text-sm text-default-600">
                      {new Date(report.created_at).toLocaleDateString()}
                    </span>
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleSendReport(report)}
                        disabled={report.status?.toLowerCase() === "sent"}
                        className="h-7"
                      >
                        <Icon
                          icon="heroicons:paper-airplane"
                          className="h-4 w-4 mr-1"
                        />
                        Send
                      </Button>
                      <Button size="sm" variant="outline" className="h-7">
                        <Icon icon="heroicons:eye" className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length} className="text-center">
                  No reports found
                </TableCell>
              </TableRow>
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
              key={`reports-table-${pageIdx}`}
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
              Are you sure you want to send report #{selectedReport?.id}? This
              action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setSendConfirmOpen(false)}
              disabled={sendReportMutation.isPending}
            >
              Cancel
            </Button>
            <LoadingButton
              onClick={confirmSendReport}
              loading={sendReportMutation.isPending}
              variant="default"
            >
              {sendReportMutation.isPending ? "Sending..." : "Send Report"}
            </LoadingButton>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default ReportsTable;
