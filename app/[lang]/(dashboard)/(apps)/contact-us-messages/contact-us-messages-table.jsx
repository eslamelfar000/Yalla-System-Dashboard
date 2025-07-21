"use client";
import * as React from "react";
import { useState, useCallback } from "react";
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
import { Skeleton } from "@/components/ui/skeleton";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import Pagination from "@/components/Shared/Pagination/Pagination";
import { formatTime } from "@/lib/utils";
import { useGetData } from "@/hooks/useGetData";
import { Fragment } from "react";

// Skeleton component for loading state
const TableSkeleton = () => (
  <div className="space-y-3">
    {[...Array(5)].map((_, index) => (
      <div key={index} className="flex items-center space-x-4">
        <Skeleton className="h-12 w-12 rounded-full" />
        <div className="space-y-2 flex-1">
          <Skeleton className="h-4 w-[200px]" />
          <Skeleton className="h-4 w-[150px]" />
        </div>
        <Skeleton className="h-4 w-[100px]" />
        <Skeleton className="h-4 w-[150px]" />
        <Skeleton className="h-4 w-[200px]" />
      </div>
    ))}
  </div>
);

const columns = [
  {
    accessorKey: "full_name",
    header: "Full Name",
    cell: ({ row }) => (
      <div className="font-medium text-card-foreground/80">
        <div className="flex space-x-3 rtl:space-x-reverse items-center">
          <Avatar className="rounded-full">
            <AvatarImage src={row?.original?.image || row?.original?.avatar} />
            <AvatarFallback>
              {row?.original?.full_name?.charAt(0) || "U"}
            </AvatarFallback>
          </Avatar>
          <span className="text-sm opacity-70 font-[400] text-card-foreground whitespace-nowrap">
            {row?.original?.full_name || "N/A"}
          </span>
        </div>
      </div>
    ),
  },
  {
    accessorKey: "email",
    header: "Email",
    cell: ({ row }) => (
      <div className="font-medium text-card-foreground/80">
        <div className="flex space-x-3 rtl:space-x-reverse items-center">
          <span className="text-sm opacity-70 font-[400] text-card-foreground whitespace-nowrap">
            {row?.original?.email || "N/A"}
          </span>
        </div>
      </div>
    ),
  },
  {
    accessorKey: "phone",
    header: "Phone",
    cell: ({ row }) => (
      <div className="font-medium text-card-foreground/80">
        <div className="flex space-x-3 rtl:space-x-reverse items-center">
          <span className="text-sm opacity-70 font-[400] text-card-foreground whitespace-nowrap">
            {row?.original?.phone || "N/A"}
          </span>
        </div>
      </div>
    ),
  },
  {
    accessorKey: "message",
    header: "Message",
    cell: ({ row }) => (
      <div className="font-medium text-card-foreground/80">
        <div className="flex space-x-3 rtl:space-x-reverse items-center">
          <Button className="" size="icon">
            <Icon icon="tabler:eye" className="w-4 h-4" />
          </Button>
        </div>
      </div>
    ),
  },
  {
    accessorKey: "created_at",
    header: "Date",
    cell: ({ row }) => (
      <div className="font-medium text-card-foreground/80">
        <div className="flex space-x-3 rtl:space-x-reverse items-center">
          <span className="text-sm opacity-70 font-[400] text-card-foreground whitespace-nowrap">
            {row?.original?.created_at
              ? formatTime(row.original.created_at)
              : "N/A"}
          </span>
        </div>
      </div>
    ),
  },
];

export function ContactUsMessagesTable() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [collapsedRows, setCollapsedRows] = useState([]);

  // Get current page from URL
  const pageFromUrl = searchParams.get("page");
  const initialPage = pageFromUrl ? parseInt(pageFromUrl) : 1;

  // State for search
  const [search, setSearch] = useState("");

  // Use useGetData hook for data fetching
  const {
    data: contactUsData,
    isLoading,
    error,
    refetch,
  } = useGetData({
    endpoint: `dashboard/contact?page=${initialPage}`,
    queryKey: ["contact-us-messages", initialPage],
    enabledKey: true,
  });

  const messages = contactUsData?.data?.data || [];
  const pagination = contactUsData?.data
    ? {
        currentPage: contactUsData.data.current_page || 1,
        totalPages: contactUsData.data.last_page || 1,
        total: contactUsData.data.total || 0,
        from: contactUsData.data.from || 0,
        to: contactUsData.data.to || 0,
        links: contactUsData.data.links || [],
      }
    : null;

  // Table state
  const [sorting, setSorting] = React.useState([]);
  const [columnFilters, setColumnFilters] = React.useState([]);
  const [columnVisibility, setColumnVisibility] = React.useState({});
  const [rowSelection, setRowSelection] = React.useState({});

  const table = useReactTable({
    data: messages,
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

  const handleRetry = useCallback(() => {
    refetch();
  }, [refetch]);

  const handleToggleCollapse = (rowId) => {
    setCollapsedRows((prev) =>
      prev.includes(rowId) ? prev.filter((id) => id !== rowId) : [...prev, rowId]
    );
  };

  // Handler for Pagination component
  const handleSetCurrentPage = useCallback(
    (page) => {
      const params = new URLSearchParams(searchParams);
      params.set("page", page.toString());
      router.push(`${pathname}?${params.toString()}`);
    },
    [pathname, router, searchParams]
  );

  if (isLoading) {
    return (
      <Card className="p-6">
        <div className="space-y-4">
          {/* <div className="flex items-center justify-between">
            <Skeleton className="h-8 w-[200px]" />
            <Skeleton className="h-10 w-[200px]" />
          </div> */}
          <TableSkeleton />
        </div>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="p-6">
        <div className="text-center space-y-4">
          <Icon
            icon="tabler:alert-circle"
            className="w-12 h-12 text-red-500 mx-auto"
          />
          <h3 className="text-lg font-semibold text-red-600">Error</h3>
          <p className="text-muted-foreground">
            {error?.message || "Failed to fetch contact us messages"}
          </p>
          <Button onClick={handleRetry} variant="outline">
            <Icon icon="tabler:refresh" className="w-4 h-4 mr-2" />
            Retry
          </Button>
        </div>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {/* Search and Actions */}
      {/* <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Input
            placeholder="Search messages..."
              value={search}
              onChange={handleSearchChange}
              className="w-[300px]"
            />
          </div>
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handleRetry}
              disabled={isLoading}
            >
            <Icon icon="tabler:refresh" className="w-4 h-4 mr-2" />
              Refresh
            </Button>
          </div>
          </div> */}

      {/* Table */}
      <Card className="">
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id}>
                  {headerGroup.headers.map((header) => (
                    <TableHead key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </TableHead>
                  ))}
                </TableRow>
              ))}
            </TableHeader>
            <TableBody>
              {table.getRowModel().rows?.length ? (
                table.getRowModel().rows.map((row) => (
                  <Fragment key={row.id}>
                  <TableRow
                    key={row.id}
                    data-state={row.getIsSelected() && "selected"}
                    onClick={() => handleToggleCollapse(row.id)}
                    className={`cursor-pointer hover:bg-default-100 transition-all duration-300 ${
                      collapsedRows.includes(row.id)
                        ? "bg-default-100"
                        : ""
                    }`}
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
                  {collapsedRows.includes(row.id) && (
                    <TableRow>
                      <TableCell colSpan={columns.length} className="p-8">
                        <div className="title text-lg font-medium text-primary mb-2">Message</div>
                        <div className="text-sm text-muted-foreground">
                          {row.original.message}
                        </div>
                      </TableCell>
                    </TableRow>
                  )}
                  </Fragment>
                ))
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={columns.length}
                    className="h-24 text-center"
                  >
                    No messages found.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </Card>

      {/* Pagination */}
      {pagination && pagination.total > 0 && (
        <div className="flex items-center justify-between">
          <div className="text-sm text-muted-foreground">
            Showing {pagination.from} to {pagination.to} of {pagination.total}{" "}
            messages
          </div>
          <Pagination
            currentPage={pagination.currentPage}
            totalPages={pagination.totalPages}
            onPageChange={handleSetCurrentPage}
            links={pagination.links}
          />
        </div>
      )}
    </div>
  );
}
