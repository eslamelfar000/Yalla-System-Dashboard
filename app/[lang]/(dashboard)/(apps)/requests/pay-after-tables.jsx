"use client";
import * as React from "react";
import { useState, useCallback, useMemo } from "react";

import {
  ArrowBigRightDash,
  ArrowUpDown,
  Check,
  CheckCircle2,
  ChevronDown,
  MoreHorizontal,
  PlusCircle,
  Trash,
  Trash2,
} from "lucide-react";
import {
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Icon } from "@iconify/react";
import { cn } from "@/lib/utils";
import { Card } from "@/components/ui/card";
import Link from "next/link";
import { Skeleton } from "@/components/ui/skeleton";
import { useGetData } from "@/hooks/useGetData";
import { useMutate } from "@/hooks/useMutate";
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

const columns = [
  {
    accessorKey: "user",
    header: "User",
    cell: ({ row }) => (
      <div className="font-medium text-card-foreground/80">
        <div className="flex space-x-3 rtl:space-x-reverse items-center">
          <Avatar className="rounded-full">
            <AvatarImage
              src={row?.original?.user?.image || row?.original?.user?.avatar}
            />
            <AvatarFallback>
              {row?.original?.user?.name?.charAt(0) || "U"}
            </AvatarFallback>
          </Avatar>
          <span className="text-sm opacity-70 font-[400] text-card-foreground whitespace-nowrap">
            {row?.original?.user?.name || "N/A"}
          </span>
        </div>
      </div>
    ),
  },
  {
    accessorKey: "booked",
    header: "Booked",
    cell: ({ row }) => (
      <div className="font-medium text-card-foreground/80">
        <div className="flex space-x-3 rtl:space-x-reverse items-center">
          <span className="text-sm opacity-70 font-[400] text-card-foreground whitespace-nowrap">
            {row?.original?.booked || "N/A"}
          </span>
        </div>
      </div>
    ),
  },
  {
    accessorKey: "teacher",
    header: "Teacher Name",
    cell: ({ row }) => (
      <div className="font-medium text-card-foreground/80">
        <div className="flex space-x-3 rtl:space-x-reverse items-center">
          <span className="text-sm opacity-70 font-[400] text-card-foreground whitespace-nowrap">
            {row?.original?.teacher?.name || "N/A"}
          </span>
        </div>
      </div>
    ),
  },
  {
    accessorKey: "should_pay",
    header: "Should Pay",
    cell: ({ row }) => (
      <div className="font-medium text-card-foreground/80">
        <div className="flex space-x-3 rtl:space-x-reverse items-center">
          <span className="text-sm opacity-70 font-[400] text-card-foreground whitespace-nowrap">
            {row?.original?.should_pay || "N/A"}
          </span>
        </div>
      </div>
    ),
  },
  {
    accessorKey: "payment_date",
    header: "Payment Date",
    cell: ({ row }) => (
      <div className="font-medium text-card-foreground/80">
        <div className="flex space-x-3 rtl:space-x-reverse items-center">
          <span className="text-sm opacity-70 font-[400] text-card-foreground whitespace-nowrap">
            {row?.original?.payment_date || "N/A"}
          </span>
        </div>
      </div>
    ),
  },
  {
    accessorKey: "action",
    header: "Action",
    cell: ({ row }) => (
      <div className="font-medium text-card-foreground/80">
        <div className="flex space-x-3 rtl:space-x-reverse items-center">
          <Button
            size="icon"
            variant="outline"
            className="h-7 w-7"
            color="success"
            title="Accept"
            onClick={() =>
              row.original.onAcceptClick &&
              row.original.onAcceptClick(row.original)
            }
          >
            <Icon icon="heroicons:check" className="h-4 w-4" />
          </Button>
          <Button
            size="icon"
            variant="outline"
            className="h-7 w-7"
            color="destructive"
            title="Delete"
            onClick={() =>
              row.original.onDeleteClick &&
              row.original.onDeleteClick(row.original)
            }
          >
            <Icon icon="heroicons:trash" className="h-4 w-4" />
          </Button>
        </div>
      </div>
    ),
  },
];

export function PayAfterDataTable() {
  const [sorting, setSorting] = React.useState([]);
  const [columnFilters, setColumnFilters] = React.useState([]);
  const [columnVisibility, setColumnVisibility] = React.useState({});
  const [rowSelection, setRowSelection] = React.useState({});
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [showAcceptDialog, setShowAcceptDialog] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  // Get pay-after requests data
  const {
    data: requestsData,
    isLoading,
    error,
    refetch,
  } = useGetData({
    endpoint: searchQuery
      ? `dashboard/requests?type=pay_after&search=${encodeURIComponent(
          searchQuery
        )}`
      : "dashboard/requests?type=pay_after",
    queryKey: ["pay-after-requests", searchQuery],
  });

  const requests = requestsData?.data || [];

  // Accept request mutation
  const acceptRequestMutation = useMutate({
    method: "POST",
    endpoint: `dashboard/accept-pay-after-request/${selectedRequest?.id}`,
    queryKeysToInvalidate: [["pay-after-requests"]],
    text: "Pay-after request accepted successfully!",
    onSuccess: () => {
      setShowAcceptDialog(false);
      setSelectedRequest(null);
      refetch();
    },
  });

  // Delete request mutation
  const deleteRequestMutation = useMutate({
    method: "DELETE",
    endpoint: `dashboard/delete-pay-after-request/${selectedRequest?.id}`,
    queryKeysToInvalidate: [["pay-after-requests"]],
    text: "Pay-after request deleted successfully!",
    onSuccess: () => {
      setShowDeleteDialog(false);
      setSelectedRequest(null);
      refetch();
    },
  });

  // Add action click handlers to each request
  const requestsWithActions = useMemo(() => {
    return requests.map((request) => ({
      ...request,
      onAcceptClick: (requestData) => {
        setSelectedRequest(requestData);
        setShowAcceptDialog(true);
      },
      onDeleteClick: (requestData) => {
        setSelectedRequest(requestData);
        setShowDeleteDialog(true);
      },
    }));
  }, [requests]);

  const table = useReactTable({
    data: requestsWithActions,
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

  // Memoize handlers to prevent recreation
  const handleSearchChange = useCallback((event) => {
    setSearchQuery(event.target.value);
  }, []);

  const handlePreviousPage = useCallback(() => {
    table.previousPage();
  }, [table]);

  const handleNextPage = useCallback(() => {
    table.nextPage();
  }, [table]);

  const handlePageChange = useCallback(
    (pageIdx) => {
      table.setPageIndex(pageIdx);
    },
    [table]
  );

  const handleRetry = useCallback(() => {
    refetch();
  }, [refetch]);

  const handleAcceptRequest = useCallback(() => {
    if (selectedRequest) {
      acceptRequestMutation.mutate();
    }
  }, [selectedRequest, acceptRequestMutation]);

  const handleDeleteRequest = useCallback(() => {
    if (selectedRequest) {
      deleteRequestMutation.mutate();
    }
  }, [selectedRequest, deleteRequestMutation]);

  // Loading skeleton
  if (isLoading) {
    return (
      <>
        <div className="flex items-center flex-wrap gap-2 mb-5">
          <Input
            placeholder="Search requests..."
            value={searchQuery}
            onChange={handleSearchChange}
            className="max-w-sm min-w-[200px] h-10"
          />
        </div>
        <Card>
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
              {Array.from({ length: 5 }).map((_, rowIndex) => (
                <TableRow key={rowIndex}>
                  {columns.map((column, colIndex) => (
                    <TableCell key={colIndex}>
                      <Skeleton className="h-4 w-full" />
                    </TableCell>
                  ))}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Card>
        <div className="flex items-center flex-wrap gap-4 px-4 py-4">
          <div className="flex-1 text-sm text-muted-foreground whitespace-nowrap">
            Loading...
          </div>
          <div className="flex gap-2 items-center">
            <Skeleton className="h-8 w-8" />
            <Skeleton className="h-8 w-8" />
            <Skeleton className="h-8 w-8" />
            <Skeleton className="h-8 w-8" />
          </div>
        </div>
      </>
    );
  }

  // Error state
  if (error) {
    return (
      <Card>
        <div className="p-6 text-center">
          <p className="text-red-500">
            Error loading pay-after requests:{" "}
            {error?.message || "Something went wrong"}
          </p>
          <Button onClick={handleRetry} className="mt-4" variant="outline">
            Retry
          </Button>
        </div>
      </Card>
    );
  }

  return (
    <>
      <div className="flex items-center flex-wrap gap-2 mb-5">
        <Input
          placeholder="Search requests..."
          value={searchQuery}
          onChange={handleSearchChange}
          className="max-w-sm min-w-[200px] h-10"
        />
      </div>
      <Card>
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
                  No pay-after requests found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </Card>

      <div className="flex items-center flex-wrap gap-4 px-4 py-4">
        <div className="flex-1 text-sm text-muted-foreground whitespace-nowrap">
          {table.getFilteredSelectedRowModel().rows.length} of{" "}
          {table.getFilteredRowModel().rows.length} row(s) selected.
        </div>

        <div className="flex gap-2 items-center">
          <Button
            variant="outline"
            size="icon"
            onClick={handlePreviousPage}
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
              key={`pay-after-table-${pageIdx}`}
              onClick={() => handlePageChange(pageIdx)}
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
            onClick={handleNextPage}
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

      {/* Accept Confirmation Dialog */}
      <AlertDialog open={showAcceptDialog} onOpenChange={setShowAcceptDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Accept Pay-After Request</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to accept this pay-after request?
              <br />
              <br />
              <div className="bg-blue-50 p-4 rounded-lg border">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <strong>User:</strong>{" "}
                    {selectedRequest?.user?.name || "N/A"}
                  </div>
                  <div>
                    <strong>Teacher:</strong>{" "}
                    {selectedRequest?.teacher?.name || "N/A"}
                  </div>
                  <div>
                    <strong>Booked:</strong> {selectedRequest?.booked || "N/A"}
                  </div>
                  <div>
                    <strong>Should Pay:</strong>{" "}
                    {selectedRequest?.should_pay || "N/A"}
                  </div>
                  <div>
                    <strong>Request ID:</strong> {selectedRequest?.id || "N/A"}
                  </div>
                  <div>
                    <strong>Type:</strong> Pay-After
                  </div>
                </div>
              </div>
              <br />
              <span className="text-green-600 font-medium">
                ✅ This will approve the payment request and notify the user.
              </span>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={acceptRequestMutation.isPending}>
              Cancel
            </AlertDialogCancel>
            <LoadingButton
              loading={acceptRequestMutation.isPending}
              onClick={handleAcceptRequest}
              variant="default"
            >
              Accept Request
            </LoadingButton>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Pay-After Request</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this pay-after request?
              <br />
              <br />
              <div className="bg-red-50 p-4 rounded-lg border">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <strong>User:</strong>{" "}
                    {selectedRequest?.user?.name || "N/A"}
                  </div>
                  <div>
                    <strong>Teacher:</strong>{" "}
                    {selectedRequest?.teacher?.name || "N/A"}
                  </div>
                  <div>
                    <strong>Booked:</strong> {selectedRequest?.booked || "N/A"}
                  </div>
                  <div>
                    <strong>Should Pay:</strong>{" "}
                    {selectedRequest?.should_pay || "N/A"}
                  </div>
                  <div>
                    <strong>Request ID:</strong> {selectedRequest?.id || "N/A"}
                  </div>
                  <div>
                    <strong>Type:</strong> Pay-After
                  </div>
                </div>
              </div>
              <br />
              <span className="text-red-600 font-medium">
                ⚠️ This action cannot be undone. The request will be permanently
                deleted.
              </span>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={deleteRequestMutation.isPending}>
              Cancel
            </AlertDialogCancel>
            <LoadingButton
              loading={deleteRequestMutation.isPending}
              onClick={handleDeleteRequest}
              variant="destructive"
            >
              Delete Request
            </LoadingButton>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}

export default PayAfterDataTable;
