"use client";
import * as React from "react";
import { useState, useCallback, useMemo } from "react";

import { ArrowBigRightDash } from "lucide-react";
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
import Pagination from "@/components/Shared/Pagination/Pagination";

const columns = [
  {
    accessorKey: "user",
    header: "User",
    cell: ({ row }) => (
      <div className="font-medium text-card-foreground/80">
        <div className="flex space-x-3 rtl:space-x-reverse items-center">
          <Avatar className="rounded-full">
            <AvatarImage
              src={row?.original?.user_image || row?.original?.user_image}
            />
            <AvatarFallback>
              {row?.original?.user_name?.charAt(0) || "U"}
            </AvatarFallback>
          </Avatar>
          <span className="text-sm opacity-70 font-[400] text-card-foreground whitespace-nowrap">
            {row?.original?.user_name || "N/A"}
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
            {row?.original?.reservation_lessions_count > 1
              ? `${row?.original?.reservation_lessions_count} lessons`
              : `${row?.original?.reservation_lessions_count} lesson`}
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
            {row?.original?.teacher_name?.name || "N/A"}
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
            {row?.original?.reservation_price || "N/A"} $
          </span>
        </div>
      </div>
    ),
  },
  {
    accessorKey: "payment_invoice",
    header: "Payment Invoice",
    cell: ({ row }) => (
      <div className="font-medium text-card-foreground/80">
        <div className="flex space-x-3 rtl:space-x-reverse items-center">
          <span className="text-sm opacity-70 font-[400] text-card-foreground whitespace-nowrap">
            <Link
              href={row?.original?.file || "#"}
              target="_blank"
              className=""
            >
              <button className="text-primary flex items-center text-[12px] border px-4 py-1 border-solid border-primary rounded-full">
                <span className="text-sm font-bold">Check</span>
                <ArrowBigRightDash className="inline-block ml-1 w-6 h-6" />
              </button>
            </Link>
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
        {row?.original?.status === "accepted" ? (
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
              title="Reject"
              onClick={() =>
                row.original.onDeleteClick &&
                row.original.onDeleteClick(row.original)
              }
            >
              <Icon icon="heroicons:x-mark" className="h-4 w-4" />
            </Button>
          </div>
        )}
      </div>
    ),
  },
];

export function PayBoxDataTable() {
  const [sorting, setSorting] = React.useState([]);
  const [columnFilters, setColumnFilters] = React.useState([]);
  const [columnVisibility, setColumnVisibility] = React.useState({});
  const [rowSelection, setRowSelection] = React.useState({});
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [showAcceptDialog, setShowAcceptDialog] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);

  // Get paybox requests data
  const {
    data: requestsData,
    isLoading,
    error,
    refetch,
  } = useGetData({
    endpoint: searchQuery
      ? `dashboard/requests?type=paybox&name=${encodeURIComponent(searchQuery)}`
      : "dashboard/requests?type=paybox",
    queryKey: ["paybox-requests", searchQuery],
  });

  const requests = requestsData?.data?.items || [];

  // Accept request mutation
  const acceptRequestMutation = useMutate({
    method: "GET",
    endpoint: `dashboard/requests/accept/${selectedRequest?.id}`,
    queryKeysToInvalidate: [["paybox-requests"]],
    text: "Paybox request accepted successfully!",
    onSuccess: () => {
      setShowAcceptDialog(false);
      setSelectedRequest(null);
      refetch();
    },
  });

  // Delete request mutation
  const deleteRequestMutation = useMutate({
    method: "GET",
    endpoint: `dashboard/requests/reject/${selectedRequest?.id}`,
    queryKeysToInvalidate: [["paybox-requests"]],
    text: "Paybox request rejected successfully!",
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

  const handlePageChange = useCallback(
    (pageIdx) => {
      setCurrentPage(pageIdx);
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
            Error loading paybox requests:{" "}
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
                  No paybox requests found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </Card>
      {/* pagination */}{" "}
      <Pagination
        last_page={requestsData?.data?.pagination?.last_page}
        setCurrentPage={handlePageChange}
        current_page={currentPage}
        studentsPagination={false}
      />
      {/* Accept Confirmation Dialog */}
      <AlertDialog open={showAcceptDialog} onOpenChange={setShowAcceptDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Accept Paybox Request</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to accept this paybox request?
              <br />
              <br />
              <div className="bg-blue-50 p-4 rounded-lg border">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <strong>User:</strong>{" "}
                    {selectedRequest?.user_name || "N/A"}
                  </div>
                  <div>
                    <strong>Teacher:</strong>{" "}
                    {selectedRequest?.teacher_name?.name || "N/A"}
                  </div>
                  <div>
                    <strong>Booked:</strong>{" "}
                    {selectedRequest?.reservation_lessions_count > 1
                      ? `${selectedRequest?.reservation_lessions_count} lessons`
                      : `${selectedRequest?.reservation_lessions_count} lesson`}
                  </div>
                  <div>
                    <strong>Should Pay:</strong>{" "}
                    {selectedRequest?.reservation_price || "N/A"} $
                  </div>
                  <div>
                    <strong>Request ID:</strong> {selectedRequest?.id || "N/A"}
                  </div>
                  <div>
                    <strong>Type:</strong> Paybox
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
      {/* Reject Confirmation Dialog */}
      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Reject Paybox Request</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to reject this paybox request?
              <br />
              <br />
              <div className="bg-red-50 p-4 rounded-lg border">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <strong>User:</strong> {selectedRequest?.user_name || "N/A"}
                  </div>
                  <div>
                    <strong>Teacher:</strong>{" "}
                    {selectedRequest?.teacher_name?.name || "N/A"}
                  </div>
                  <div>
                    <strong>Booked:</strong>{" "}
                    {selectedRequest?.reservation_lessions_count > 1
                      ? `${selectedRequest?.reservation_lessions_count} lessons`
                      : `${selectedRequest?.reservation_lessions_count} lesson`}
                  </div>
                  <div>
                    <strong>Should Pay:</strong>{" "}
                    {selectedRequest?.reservation_price || "N/A"} $
                  </div>
                  <div>
                    <strong>Request ID:</strong> {selectedRequest?.id || "N/A"}
                  </div>
                  <div>
                    <strong>Type:</strong> Paybox
                  </div>
                </div>
              </div>
              <br />
              <span className="text-red-600 font-medium">
                ⚠️ This action cannot be undone. The request will be rejected.
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
              Reject Request
            </LoadingButton>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}

export default PayBoxDataTable;
