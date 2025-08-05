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
import { useGetData } from "@/hooks/useGetData";
import { useDebounce } from "@/hooks/use-debounce";
import { SharedAlertDialog } from "@/components/Shared/Drawer/shared-dialog";
import Pagination from "@/components/Shared/Pagination/Pagination";

const columns = [
  {
    accessorKey: "student",
    header: "Student",
    cell: ({ row }) => {
      const student = row?.original?.student;
      if (!student) return <Skeleton className="h-10 w-32" />;

      return (
        <div className="font-medium text-card-foreground/80">
          <div className="flex space-x-3 rtl:space-x-reverse items-center">
            <Avatar className="rounded-full">
              <AvatarImage src={student.image} />
              <AvatarFallback>
                {student.name?.charAt(0)?.toUpperCase() || "S"}
              </AvatarFallback>
            </Avatar>
            <span className="text-sm opacity-70 font-[400] text-card-foreground whitespace-nowrap">
              {student.name}
            </span>
          </div>
        </div>
      );
    },
  },
  {
    accessorKey: "user_id",
    header: "ID",
    cell: ({ row }) => {
      if (!row?.original?.user_id) return <Skeleton className="h-4 w-8" />;

      return (
        <div className="font-medium text-card-foreground/80">
          <span className="text-sm opacity-70 font-[400] text-card-foreground whitespace-nowrap">
            {row.original.user_id}
          </span>
        </div>
      );
    },
  },
  {
    accessorKey: "count",
    header: "Booked",
    cell: ({ row }) => {
      if (!row?.original?.count) return <Skeleton className="h-4 w-8" />;

      return (
        <div className="font-medium text-card-foreground/80">
          <span className="text-sm opacity-70 font-[400] text-card-foreground whitespace-nowrap">
            {row.original.count > 1
              ? `${row.original.count} Sessions`
              : "1 Session"}
          </span>
        </div>
      );
    },
  },
  {
    accessorKey: "type",
    header: "Type",
    cell: ({ row }) => {
      if (!row?.original?.type) return <Skeleton className="h-4 w-16" />;

      return (
        <div className="font-medium text-card-foreground/80">
          <span className="text-sm opacity-70 font-[400] text-card-foreground whitespace-nowrap capitalize">
            {row.original.type}
          </span>
        </div>
      );
    },
  },
  {
    accessorKey: "teacher_name",
    header: "Teacher Name",
    cell: ({ row }) => {
      // Teacher name might be null, show placeholder
      return (
        <div className="font-medium text-card-foreground/80">
          <span className="text-sm opacity-70 font-[400] text-card-foreground whitespace-nowrap">
            {row.original.teacher_id
              ? `Teacher ${row.original.teacher_id}`
              : "Not Assigned"}
          </span>
        </div>
      );
    },
  },
  {
    accessorKey: "price",
    header: "Payed",
    cell: ({ row }) => {
      if (!row?.original?.price) return <Skeleton className="h-4 w-12" />;

      return (
        <div className="font-medium text-card-foreground/80">
          <span className="text-sm opacity-70 font-[400] text-card-foreground whitespace-nowrap">
            {row.original.price}$
          </span>
        </div>
      );
    },
  },
  {
    accessorKey: "payment_type",
    header: "Method",
    cell: ({ row }) => {
      // if (!row?.original?.payment_type)
      //   return <Skeleton className="h-4 w-16" />;

      return (
        <div className="font-medium text-card-foreground/80">
          <span className="text-sm opacity-70 font-[400] text-card-foreground whitespace-nowrap capitalize">
            {row.original.payment_type || "No Method"}
          </span>
        </div>
      );
    },
  },
];

export function ReservationDataTable() {
  const [sorting, setSorting] = React.useState([]);
  const [columnFilters, setColumnFilters] = React.useState([]);
  const [columnVisibility, setColumnVisibility] = React.useState({});
  const [rowSelection, setRowSelection] = React.useState({});
  const [currentPage, setCurrentPage] = React.useState(1);
  // Local state for search input
  const [localSearchValue, setLocalSearchValue] = React.useState("");

  // Debounce the search value to avoid excessive API calls
  const debouncedSearchValue = useDebounce(localSearchValue, 500);

  // Get reservations data with debounced search parameter
  const {
    data: reservationsData,
    isLoading: reservationsLoading,
    error: reservationsError,
  } = useGetData({
    endpoint: `dashboard/reservations?type[0]=paybefore&type[1]=trail&page=${currentPage}${
      debouncedSearchValue ? `&search=${debouncedSearchValue}` : ""
    }`,
    queryKey: ["reservations", "trail", debouncedSearchValue, currentPage],
  });

  const reservations = reservationsData?.data?.items || [];

  const table = useReactTable({
    data: reservations,
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

  // Update local search value immediately for responsive UI
  const handleTrailSearch = (value) => {
    setLocalSearchValue(value);
  };

  return (
    <>
      <div className="flex items-center flex-wrap gap-2 mb-5">
        <Input
          placeholder="Search by student name..."
          value={localSearchValue}
          onChange={(event) => handleTrailSearch(event.target.value)}
          className="max-w-sm min-w-[200px] h-10"
        />
      </div>

      <Card title="Trail Reservations">
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
            {reservationsLoading ? (
              // Loading skeleton rows
              Array.from({ length: 4 }).map((_, index) => (
                <TableRow key={`skeleton-${index}`}>
                  {columns.map((column, colIndex) => (
                    <TableCell key={`skeleton-cell-${colIndex}`}>
                      <Skeleton className="h-4 w-full" />
                    </TableCell>
                  ))}
                </TableRow>
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
                  {reservationsError
                    ? "Error loading data"
                    : "No reservations found."}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </Card>

      {/* Pagination */}
      <Pagination
        last_page={reservationsData?.data?.last_page}
        setCurrentPage={setCurrentPage}
        current_page={currentPage}
        studentsPagination={false}
      />
    </>
  );
}

export default ReservationDataTable;
