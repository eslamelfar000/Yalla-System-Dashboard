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
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { SharedSheet } from "../../../../../components/Shared/Drawer/shared-sheet";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Icon } from "@iconify/react";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { useStudents } from "@/hooks/useUsers";
import { Skeleton } from "@/components/ui/skeleton";
import { useState, useEffect } from "react";
import Pagination from "@/components/Shared/Pagination/Pagination";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";

const columns = [
  {
    accessorKey: "user",
    header: "User",
    cell: ({ row }) => (
      <div className="  font-medium  text-card-foreground/80">
        <div className="flex space-x-3  rtl:space-x-reverse items-center">
          <Avatar className=" rounded-full">
            <AvatarImage src={row?.original?.image || ""} />
            <AvatarFallback>{row?.original?.name?.charAt(0)}</AvatarFallback>
          </Avatar>
          <span className=" text-sm opacity-70 font-[400]  text-card-foreground whitespace-nowrap">
            {row?.original?.name || "N/A"}
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
          <span className=" text-sm opacity-70 font-[400]  text-card-foreground whitespace-nowrap">
            {row?.original?.id}
          </span>
        </div>
      </div>
    ),
  },
  {
    accessorKey: "booked",
    header: "Booked",
    cell: ({ row }) => (
      <div className="  font-medium  text-card-foreground/80">
        <div className="flex space-x-3  rtl:space-x-reverse items-center">
          <span className=" text-sm opacity-70 font-[400] text-card-foreground whitespace-nowrap">
            {row?.original?.sessions > 1
              ? `${row?.original?.sessions} Sessions`
              : `${row?.original?.sessions} Session`}
          </span>
        </div>
      </div>
    ),
  },
  {
    accessorKey: "type",
    header: "Type",
    cell: ({ row }) => (
      <div className="  font-medium  text-card-foreground/80">
        <div className="flex space-x-3  rtl:space-x-reverse items-center">
          <span className=" text-sm opacity-70 font-[400]  text-card-foreground whitespace-nowrap">
            {row?.original?.type === "trail_lesson"
              ? "Trail Lesson"
              : row?.original?.type === "pay_after_lesson"
              ? "Pay After Lesson"
              : row?.original?.type === "pay_before_lesson"
              ? "Pay Before Lesson"
              : "N/A"}
          </span>
        </div>
      </div>
    ),
  },
  {
    accessorKey: "progress",
    header: "Progress",
    cell: ({ row }) => (
      <div className="font-medium  text-card-foreground/80">
        <div className="flex space-x-3  rtl:space-x-reverse items-center">
          {/* <Button className="text-xs rounded-full h-8 bg-transparent hover:bg-transparent text-primary hover:text-black">
            <EyeIcon className="w-6 h-6" />
          </Button> */}
          <div className="cover w-full">
            <div className="head text-gray-600">
              <h2 className="text-sm">
                {row?.original?.sessions_count_done || 0} /{" "}
                {row?.original?.sessions_count || 0}
              </h2>
            </div>
            <Progress
              value={
                (row?.original?.sessions_count_done /
                  row?.original?.sessions_count) *
                  100 || 0
              }
              // showValue={true}
              color="primary"
              isStripe
              isAnimate
            />
          </div>
        </div>
      </div>
    ),
  },
];

export function StudentsDataTable() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // Get current page from URL
  const pageFromUrl = searchParams.get("page");
  const initialPage = pageFromUrl ? parseInt(pageFromUrl) : 1;

  // State for search and filters
  const [search, setSearch] = useState("");
  const [filters, setFilters] = useState({
    types: [],
    sessions: [],
  });
  const [currentPage, setCurrentPage] = useState(initialPage);

  // Update URL when page changes
  useEffect(() => {
    const params = new URLSearchParams(searchParams);
    params.set("page", currentPage.toString());
    router.push(`${pathname}?${params.toString()}`);
  }, [currentPage, pathname, router, searchParams]);

  // Fetch students with filters/search
  const { data, isLoading, isError, error, refetch } = useStudents(
    {
      search,
      ...filters,
    },
    currentPage
  );

  // Handle filter apply
  const handleFilterApply = (newFilters) => {
    setFilters(newFilters);
  };

  // Handle filter reset
  const handleFilterReset = () => {
    setFilters({
      types: [],
      sessions: [],
    });
    setSearch("");
  };

  // Handle search change
  const handleSearchChange = (value) => {
    setSearch(value);
  };

  // Handle page change
  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  // Table state
  const [sorting, setSorting] = React.useState([]);
  const [columnFilters, setColumnFilters] = React.useState([]);
  const [columnVisibility, setColumnVisibility] = React.useState({});
  const [rowSelection, setRowSelection] = React.useState({});

  // Table instance
  const table = useReactTable({
    data: data?.data?.data || [],
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

  return (
    <>
      <div className="flex justify-between items-center flex-wrap gap-2 mb-5">
        <div className="flex items-center gap-2">
          <Input
            placeholder="Search students..."
            value={search}
            onChange={(e) => handleSearchChange(e.target.value)}
            className="max-w-sm min-w-[250px] h-10"
          />
          {(filters.types?.length > 0 ||
            filters.sessions?.length > 0 ||
            search !== "") && (
            <Button variant="outline" onClick={handleFilterReset}>
              <Icon icon="mdi:filter-remove" className="w-4 h-4" />
              Clear Filters
            </Button>
          )}
        </div>
        <SharedSheet
          type="filter-students"
          onSuccess={handleFilterApply}
          onReset={handleFilterReset}
          initialFilters={filters}
        />
      </div>
      <Card title="Simple">
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
            {isLoading ? (
              <TableRow>
                <TableCell className="h-8 text-center">
                  <Skeleton className="w-full h-8" />
                </TableCell>
                <TableCell className="h-8 text-center">
                  <Skeleton className="w-full h-8" />
                </TableCell>
                <TableCell className="h-8 text-center">
                  <Skeleton className="w-full h-8" />
                </TableCell>
                <TableCell className="h-8 text-center">
                  <Skeleton className="w-full h-8" />
                </TableCell>
                <TableCell className="h-8 text-center">
                  <Skeleton className="w-full h-8" />
                </TableCell>
              </TableRow>
            ) : isError ? (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center text-red-500"
                >
                  {error?.message || "Error loading students"}
                </TableCell>
              </TableRow>
            ) : table.getRowModel().rows?.length ? (
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
                  No results found
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </Card>

      {/* Pagination */}
      <Pagination
        last_page={data?.data?.last_page}
        setCurrentPage={handlePageChange}
        current_page={currentPage}
        studentsPagination={true}
      />
    </>
  );
}

export default StudentsDataTable;
