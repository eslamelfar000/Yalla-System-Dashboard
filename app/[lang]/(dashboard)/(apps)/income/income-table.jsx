"use client";
import * as React from "react";

import { ArrowUpDown, ChevronDown, MoreHorizontal, TrendingDown, TrendingUp } from "lucide-react";
import {
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
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
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { data } from "../../(tables)/data-table/data";
import { Icon } from "@iconify/react";
import { cn } from "@/lib/utils";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { useGetData } from "@/hooks/useGetData";
import DownloadButton from "@/components/Shared/DownloadButton";
import { useCallback } from "react";
import Pagination from "@/components/Shared/Pagination/Pagination";

const columns = [
  {
    accessorKey: "teacher_name",
    header: "Teacher Name",
    cell: ({ row }) => (
      <div className="font-medium text-card-foreground/80">
        <div className="flex space-x-3 rtl:space-x-reverse items-center">
          <Avatar className="rounded-full">
            <AvatarFallback>
              {row?.original?.teacher_name?.charAt(0) || "T"}
            </AvatarFallback>
          </Avatar>
          <span className="text-sm text-card-foreground whitespace-nowrap">
            {row?.original?.teacher_name || "N/A"}
          </span>
        </div>
      </div>
    ),
  },
  {
    accessorKey: "gross_total",
    header: "Salary",
    cell: ({ row }) => (
      <div className="font-sm opacity-70 text-card-foreground/80">
        <div className="flex space-x-3 rtl:space-x-reverse items-center">
          <span className="text-sm text-card-foreground whitespace-nowrap">
            ${row?.original?.gross_total || 0}
          </span>
        </div>
      </div>
    ),
  },
  {
    accessorKey: "total_reduction",
    header: "Deduction",
    cell: ({ row }) => (
      <div className="font-sm opacity-70 text-card-foreground/80">
        <div className="flex space-x-3 rtl:space-x-reverse items-center">
          <span className="text-sm text-card-foreground whitespace-nowrap">
            <Badge
              variant="soft"
              color={"destructive"}
              className="capitalize flex items-center gap-1"
            >
              $ {row?.original?.total_reduction || 0}{" "}
              <TrendingDown className="w-4 h-4 text-red-600" />
            </Badge>
          </span>
        </div>
      </div>
    ),
  },
  {
    accessorKey: "total_raise",
    header: "Raise",
    cell: ({ row }) => (
      <div className="font-sm opacity-70 text-card-foreground/80">
        <div className="flex space-x-3 rtl:space-x-reverse items-center">
          <span className="text-sm text-card-foreground whitespace-nowrap">
            <Badge
              variant="soft"
              color={"success"}
              className="capitalize flex items-center gap-1"
            >
              $ {row?.original?.total_raise || 0}{" "}
              <TrendingUp className="w-4 h-4 text-green-600" />
            </Badge>
          </span>
        </div>
      </div>
    ),
  },
  {
    accessorKey: "debt",
    header: "Debt",
    cell: ({ row }) => (
      <div className="font-sm opacity-70 text-card-foreground/80">
        <div className="flex space-x-3 rtl:space-x-reverse items-center">
          <span className="text-sm text-card-foreground whitespace-nowrap">
            ${row?.original?.debt || 0}
          </span>
        </div>
      </div>
    ),
  },
];

export function SalariesDataTable() {
  const [sorting, setSorting] = React.useState([]);
  const [columnFilters, setColumnFilters] = React.useState([]);
  const [columnVisibility, setColumnVisibility] = React.useState({});
  const [rowSelection, setRowSelection] = React.useState({});
  const [currentPage, setCurrentPage] = React.useState(1);
  const [searchQuery, setSearchQuery] = React.useState("");

  const buildQueryParams = () => {
    const params = [];
    if (searchQuery) {
      params.push(`name=${searchQuery}`);
    }
    return params.join("&");
  };

  const {
    data: incomeData,
    isLoading,
    isError,
  } = useGetData({
    endpoint: `dashboard/get-all-teachers?page=${currentPage}&${buildQueryParams()}`,
    queryKey: ["income", currentPage, searchQuery],
  });

  const teachers = incomeData?.data?.teachers || [];

  // Prepare data for export
  const prepareExportData = useCallback(() => {
    return teachers.map((teacher) => ({
      "Teacher Name": teacher.teacher_name || "N/A",
      "Teacher ID": teacher.teacher_id || "N/A",
      "Salary (Gross Total)": `$${teacher.gross_total || 0}`,
      Deduction: `$${teacher.total_reduction || 0}`,
      Raise: `$${teacher.total_raise || 0}`,
      Debt: `$${teacher.debt || 0}`,
      "Final Amount": `$${teacher.final_amount || 0}`,
    }));
  }, [teachers]);

  const table = useReactTable({
    data: teachers,
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

  // Loading skeleton component
  const LoadingSkeleton = () => (
    <TableRow>
      {columns.map((_, index) => (
        <TableCell key={index}>
          <div className="flex items-center space-x-3">
            <Skeleton className="h-4 w-full" />
          </div>
        </TableCell>
      ))}
    </TableRow>
  );

  return (
    <>
      <Card className="">
        <CardHeader>
          <div className="flex items-center justify-between gap-2">
            <CardTitle>Salary</CardTitle>
            <div className="flex items-center gap-2">
              <Input
                placeholder="Filter teacher name..."
                value={searchQuery}
                onChange={(event) => setSearchQuery(event.target.value)}
                className="max-w-sm min-w-[300px] h-10"
              />
              <DownloadButton
                data={teachers}
                prepareExportData={prepareExportData}
                fileName="salary-data"
                disabled={isLoading}
              />
            </div>
          </div>
        </CardHeader>
        <div>
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
              {isLoading ? (
                // Show loading skeletons
                Array.from({ length: 3 }).map((_, index) => (
                  <LoadingSkeleton key={index} />
                ))
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
                    {isError ? "Error loading data" : "No results found."}
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </Card>

      {/* pagination */}
      <Pagination
        last_page={incomeData?.data?.pagination?.last_page}
        setCurrentPage={setCurrentPage}
        current_page={currentPage}
        studentsPagination={false}
      />
    </>
  );
}

export default SalariesDataTable;
