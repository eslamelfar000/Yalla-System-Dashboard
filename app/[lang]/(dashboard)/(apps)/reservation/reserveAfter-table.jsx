"use client";
import * as React from "react";

import { ArrowUpDown, Check, ChevronDown, MoreHorizontal } from "lucide-react";
import {
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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
import { Badge } from "@/components/ui/badge";
import { Icon } from "@iconify/react";
import { cn } from "@/lib/utils";
import { Card } from "@/components/ui/card";
import { Toggle } from "@/components/ui/toggle";
import { SharedAlertDialog } from "@/components/Shared/Drawer/shared-dialog";
import { Skeleton } from "@/components/ui/skeleton";
import { useGetData } from "@/hooks/useGetData";
import { useAuth } from "@/hooks/use-auth";
import { useDebounce } from "@/hooks/use-debounce";
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
    header: "Should Pay",
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
    accessorKey: "created_at",
    header: "Payment Date",
    cell: ({ row }) => {
      if (!row?.original?.created_at) return <Skeleton className="h-4 w-20" />;

      const date = new Date(row.original.created_at);
      const formattedDate = date.toLocaleDateString();

      return (
        <div className="font-medium text-card-foreground/80">
          <span className="text-sm opacity-70 font-[400] text-card-foreground whitespace-nowrap">
            {formattedDate}
          </span>
        </div>
      );
    },
  },
  {
    accessorKey: "action",
    header: "Action",
    cell: ({ row }) => (
      <div className="font-medium text-card-foreground/80">
        <div className="rtl:space-x-reverse items-center">
          {row?.original?.accept === "done" ? (
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
            <SharedAlertDialog
              type={`accept-patAfter-reservation`}
              info={{
                id: row?.original?.id,
                name: row?.original?.student?.name || "Student",
                student: row?.original?.student,
                user_id: row?.original?.user_id,
                count: row?.original?.count,
                price: row?.original?.price,
                type: row?.original?.type,
                teacher_id: row?.original?.teacher_id,
              }}
            />
          )}
        </div>
      </div>
    ),
  },
];

export function ReserveAfterDataTable() {
  const [sorting, setSorting] = React.useState([]);
  const [columnFilters, setColumnFilters] = React.useState([]);
  const [columnVisibility, setColumnVisibility] = React.useState({});
  const [rowSelection, setRowSelection] = React.useState({});
  const [currentPage, setCurrentPage] = React.useState(1);
  // Local state for search input
  const [localSearchValue, setLocalSearchValue] = React.useState("");

  // Debounce the search value to avoid excessive API calls
  const debouncedSearchValue = useDebounce(localSearchValue, 500);

  // Get payAfter reservations data with debounced search parameter
  const {
    data: payAfterData,
    isLoading: payAfterLoading,
    error: payAfterError,
  } = useGetData({
    endpoint: `dashboard/reservations?type[0]=payafter${
      debouncedSearchValue ? `&search=${debouncedSearchValue}` : ""
    }`,
    queryKey: ["reservations", "payafter", debouncedSearchValue],
  });

  const payAfterReservations = payAfterData?.data || [];

  const table = useReactTable({
    data: payAfterReservations,
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
  const handlePayAfterSearch = (value) => {
    setLocalSearchValue(value);
  };

  return (
    <>
      <div className="flex items-center flex-wrap gap-2 mb-5">
        <Input
          placeholder="Search by student name..."
          value={localSearchValue}
          onChange={(event) => handlePayAfterSearch(event.target.value)}
          className="max-w-sm min-w-[200px] h-10"
        />
      </div>

      <Card title="Pay After Reservations">
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
            {payAfterLoading ? (
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
                  {payAfterError
                    ? "Error loading data"
                    : "No pay after reservations found."}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </Card>

      {/* Pagination */}
      <Pagination
        last_page={payAfterData?.data?.pagination?.last_page}
        setCurrentPage={setCurrentPage}
        current_page={currentPage}
        studentsPagination={false}
      />
    </>
  );
}

export default ReserveAfterDataTable;
