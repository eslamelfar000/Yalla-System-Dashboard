"use client";
import * as React from "react";
import { useState, useEffect } from "react";
import {
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
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
import { useGetData } from "@/hooks/useGetData";
import { Skeleton } from "@/components/ui/skeleton";
import { fixImageUrl, getAvatarInitials } from "@/lib/image-utils";
import Pagination from "@/components/Shared/Pagination/Pagination";
import SalaryAdjustmentPopover from "./salary-adjustment-popover";
import { TrendingDown, TrendingUp } from "lucide-react";

const columns = (type, selectedTeacher, onAddAdjustment) => [
  {
    accessorKey: "teacher-name",
    header: "Teacher Name",
    cell: ({ row }) => (
      <div className="font-medium text-card-foreground/80">
        <div className="flex space-x-3 rtl:space-x-reverse items-center">
          <Avatar className="rounded-full">
            <AvatarImage src={fixImageUrl(row?.original?.teacher?.image)} />
            <AvatarFallback>
              {getAvatarInitials(row?.original?.teacher?.name)}
            </AvatarFallback>
          </Avatar>
          <span className="text-sm opacity-70 font-[400] text-card-foreground whitespace-nowrap">
            {row?.original?.teacher?.name}
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
            {row?.original?.teacher?.id}
          </span>
        </div>
      </div>
    ),
  },
  // {
  //   accessorKey: "booked",
  //   header: "Booked",
  //   cell: ({ row }) => (
  //     <div className="font-medium text-card-foreground/80">
  //       <div className="flex space-x-3 rtl:space-x-reverse items-center">
  //         <span className="text-sm opacity-70 font-[400] text-card-foreground whitespace-nowrap">
  //           {row?.original?.teacher?.sessions_count || 0} Sessions
  //         </span>
  //       </div>
  //     </div>
  //   ),
  // },
  {
    accessorKey: "type",
    header: "Type",
    cell: ({ row }) => (
      <div className="font-medium text-card-foreground/80">
        <div className="flex space-x-3 rtl:space-x-reverse items-center">
          <span className="text-sm opacity-70 font-[400] text-card-foreground whitespace-nowrap">
            {/* {row?.original?.type || "N/A"} */}
            Coaching
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
        <span className="text-sm opacity-70 font-[400] text-card-foreground whitespace-nowrap">
          {row?.original?.payment?.created_at || "N/A"}
        </span>
      </div>
    ),
  },
  // {
  //   accessorKey: "price",
  //   header: "Price",
  //   cell: ({ row }) => (
  //     <div className="font-medium text-card-foreground/80">
  //       <span className="text-sm opacity-70 font-[400] text-card-foreground whitespace-nowrap">
  //         {row?.original?.price || "N/A"} $
  //       </span>
  //     </div>
  //   ),
  // },
  {
    accessorKey: "ded-raise",
    header: "Ded. | Raise",
    cell: ({ row }) => {
      const payment = row?.original?.payment;
      if (!payment) {
        return (
          <div className="font-medium text-card-foreground/80">
            <span className="text-sm opacity-70 font-[400] text-card-foreground whitespace-nowrap">
              No data provided
            </span>
          </div>
        );
      }

      const isDeduction = payment.type === "reduction";
      const isRaise = payment.type === "raise";

      return (
        <div className="font-medium text-card-foreground/80">
          <div className="flex space-x-3 rtl:space-x-reverse items-center">
            <span
              className={cn(
                "text-sm font-[400] whitespace-nowrap flex items-center gap-1",
                {
                  "text-red-600": isDeduction,
                  "text-green-600": isRaise,
                  "text-muted-foreground": !isDeduction && !isRaise,
                }
              )}
            >
              {payment.type === "reduction" ? "Deduction" : "Raise"}: $
              {payment.amount}{" "}
              <span className="text-xs">
                {payment.type === "reduction" ? (
                  <TrendingDown className="w-4 h-4 text-red-600" />
                ) : (
                  <TrendingUp className="w-4 h-4 text-green-600" />
                )}
              </span>
            </span>
          </div>
        </div>
      );
    },
  },
  {
    accessorKey: "reason",
    header: "Reason",
    cell: ({ row }) => (
      <div className="font-medium text-card-foreground/80">
        <div className="flex space-x-3 rtl:space-x-reverse items-center">
          <span className="text-sm opacity-70 font-[400] text-card-foreground whitespace-nowrap">
            {row?.original?.payment?.note || "No reason provided"}
          </span>
        </div>
      </div>
    ),
  },
  ...(type === "admin-payrolls"
    ? [
        {
          accessorKey: "actions",
          header: "Actions",
          cell: ({ row }) => (
            <div className="flex items-center gap-2">
              {row?.original?.payment === null ? (
                <SalaryAdjustmentPopover
                  teacherId={selectedTeacher}
                  lessonId={row?.original?.id}
                  onSuccess={onAddAdjustment}
                />
              ) : (
                <Icon
                  icon="heroicons:check-circle"
                  className="w-8 h-8 text-green-500"
                />
              )}
            </div>
          ),
        },
      ]
    : []),
];

// Skeleton component for loading state
const TableRowSkeleton = ({ type }) => (
  <TableRow>
    <TableCell>
      <div className="flex items-center space-x-3">
        <Skeleton className="w-10 h-10 rounded-full" />
        <Skeleton className="h-4 w-24" />
      </div>
    </TableCell>
    <TableCell>
      <Skeleton className="h-4 w-16" />
    </TableCell>
    <TableCell>
      <Skeleton className="h-4 w-24" />
    </TableCell>
    <TableCell>
      <Skeleton className="h-4 w-24" />
    </TableCell>
    <TableCell>
      <Skeleton className="h-4 w-24" />
    </TableCell>
    <TableCell>
      <Skeleton className="h-4 w-24" />
    </TableCell>
    <TableCell>
      <Skeleton className="h-4 w-24" />
    </TableCell>
    <TableCell>
      <Skeleton className="h-4 w-24" />
    </TableCell>
    {type === "admin-payrolls" && (
      <TableCell>
        <Skeleton className="h-4 w-24" />
      </TableCell>
    )}
  </TableRow>
);

export function IncomeQualityDataTable({ type, selectedQuality, selectedMonth }) {
  const [sorting, setSorting] = React.useState([]);
  const [columnFilters, setColumnFilters] = React.useState([]);
  const [columnVisibility, setColumnVisibility] = React.useState({});
  const [rowSelection, setRowSelection] = React.useState({});
  const [currentPage, setCurrentPage] = useState(1);
  const user = JSON.parse(localStorage.getItem("user_data"));
  // Fetch data using custom useGetData hook
  const {
    data: data,
    isLoading,
    error,
    refetch,
  } = useGetData({
    endpoint: `dashboard/quailty-financial/${
      selectedQuality || user?.user_id || user?.id
    }/user-payments?page=${currentPage}${
      selectedMonth !== "" ? `&month=${selectedMonth}` : ""
    }`,
    queryKey: [
      "quality-income",
      selectedQuality || user?.user_id || user?.id,
      currentPage,
      selectedMonth,
    ],
  });

  const incomeData = data?.data?.lessons || [];

  const handleAddAdjustment = () => {
    refetch();
  };

  const table = useReactTable({
    data: incomeData,
    columns: columns(type, selectedQuality, handleAddAdjustment),
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
      <Card title="Teacher Income">
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
              // Show skeleton loading for 4 rows
              Array.from({ length: 4 }).map((_, index) => (
                <TableRowSkeleton key={`skeleton-${index}`} type={type} />
              ))
            ) : error ? (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  <div className="flex items-center justify-center text-default-500">
                    <Icon
                      icon="heroicons:exclamation-triangle"
                      className="w-6 h-6 mr-2"
                    />
                    Failed to load income data
                  </div>
                </TableCell>
              </TableRow>
            ) : !incomeData || incomeData.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={columns(type, selectedQuality).length}
                  className="h-24 text-center"
                >
                  <div className="flex items-center justify-center text-default-500">
                    <Icon
                      icon="heroicons:document-text"
                      className="w-6 h-6 mr-2"
                    />
                    {type === "admin-payrolls"
                      ? selectedQuality
                        ? "No income data found"
                        : "No Quality Selected"
                      : "No income data found"}
                  </div>
                </TableCell>
              </TableRow>
            ) : (
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
            )}
          </TableBody>
        </Table>
      </Card>

      {/* Pagination */}
      <Pagination
        last_page={data?.data?.pagination?.last_page}
        setCurrentPage={setCurrentPage}
        current_page={currentPage}
        studentsPagination={false}
      />
    </>
  );
}

export default IncomeQualityDataTable;
