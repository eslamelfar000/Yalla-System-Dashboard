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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Icon } from "@iconify/react";
import { Card } from "@/components/ui/card";
import { ArrowBigRightDash, Check } from "lucide-react";
import Link from "next/link";
import { useGetData } from "@/hooks/useGetData";
import TeacherFilter from "@/components/Shared/TeacherFilter";
import Pagination from "@/components/Shared/Pagination/Pagination";
import { Skeleton } from "@/components/ui/skeleton";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useCallback } from "react";
import { useState } from "react";
import { useMemo } from "react";

const columns = [
  {
    accessorKey: "student-name",
    header: "Student Name",
    cell: ({ row }) => (
      <div className="font-medium text-card-foreground/80">
        <div className="flex space-x-3 rtl:space-x-reverse items-center">
          <Avatar className="rounded-full">
            <AvatarImage src={row?.original?.lesson?.student?.image} />
            <AvatarFallback>
              {row?.original?.lesson?.student?.name?.charAt(0) || "S"}
            </AvatarFallback>
          </Avatar>
          <span className="text-sm text-card-foreground whitespace-nowrap">
            {row?.original?.lesson?.student?.name || "N/A"}
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
      <div className="font-medium text-card-foreground/80">
        <div className="flex space-x-3 rtl:space-x-reverse items-center">
          <span className="text-sm opacity-70 font-[400] text-card-foreground whitespace-nowrap">
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
      <div className="font-medium text-card-foreground/80">
        <div className="flex space-x-3 rtl:space-x-reverse items-center">
          <span className="text-sm opacity-70 font-[400] text-card-foreground whitespace-nowrap">
            {row?.original?.target || "N/A"}%
          </span>
        </div>
      </div>
    ),
  },
  {
    accessorKey: "admin report",
    header: "Admin Report",
    cell: ({ row }) => (
      <div className="font-medium text-card-foreground/80">
        <div className="flex space-x-3 rtl:space-x-reverse items-center">
          <span className="text-sm opacity-70 font-[400] text-card-foreground whitespace-nowrap">
            <Link
              href={row?.original?.admin_report || ""}
              target="_blank"
              className=""
            >
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
  // {
  //   accessorKey: "Teacher report",
  //   header: "Teacher Report",
  //   cell: ({ row }) => (
  //     <div className="font-medium">
  //       <div className="flex space-x-3 rtl:space-x-reverse items-center">
  //         <span className="text-sm opacity-70 font-[400] whitespace-nowrap">
  //           <Link
  //             href={row?.original?.teacher_report || ""}
  //             target="_blank"
  //             className=""
  //           >
  //             <button className="text-primary flex items-center text-[12px] border px-4 py-1 border-solid border-primary rounded-full">
  //               <span className="text-sm font-bold">Check</span>
  //               <ArrowBigRightDash className="inline-block ml-1 w-6 h-6" />
  //             </button>
  //           </Link>{" "}
  //         </span>
  //       </div>
  //     </div>
  //   ),
  // },
];

// Custom loading skeleton for QA reports table
const TargetDataTableSkeleton = () => {
  return (
    <Card>
      <div className="flex items-center flex-wrap gap-2 mb-5">
        <Skeleton className="h-10 w-[200px]" />
        <Skeleton className="h-10 w-[200px]" />
      </div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="font-semibold text-default-800 bg-default-50 dark:bg-default-100">
              Student Name
            </TableHead>
            <TableHead className="font-semibold text-default-800 bg-default-50 dark:bg-default-100">
              ID
            </TableHead>
            <TableHead className="font-semibold text-default-800 bg-default-50 dark:bg-default-100">
              Date
            </TableHead>
            <TableHead className="font-semibold text-default-800 bg-default-50 dark:bg-default-100">
              Target
            </TableHead>
            <TableHead className="font-semibold text-default-800 bg-default-50 dark:bg-default-100">
              Admin Report
            </TableHead>
            {/* <TableHead className="font-semibold text-default-800 bg-default-50 dark:bg-default-100">
              Teacher Report
            </TableHead> */}
            <TableHead className="font-semibold text-default-800 bg-default-50 dark:bg-default-100">
              Action
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {Array.from({ length: 8 }).map((_, rowIndex) => (
            <TableRow key={rowIndex}>
              <TableCell>
                <div className="flex items-center space-x-3 rtl:space-x-reverse">
                  <Skeleton className="h-8 w-8 rounded-full" />
                  <Skeleton className="h-4 w-32" />
                </div>
              </TableCell>
              <TableCell>
                <Skeleton className="h-4 w-12" />
              </TableCell>
              <TableCell>
                <Skeleton className="h-4 w-24" />
              </TableCell>
              <TableCell>
                <Skeleton className="h-4 w-16" />
              </TableCell>
              <TableCell>
                <Skeleton className="h-4 w-16 rounded-full" />
              </TableCell>
              <TableCell>
                <Skeleton className="h-4 w-16 rounded-full" />
              </TableCell>
              {/* <TableCell>
                <Skeleton className="h-6 w-6 rounded-full" />
              </TableCell> */}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Card>
  );
};

const TargetDataTableComponent = () => {
  const [sorting, setSorting] = useState([]);
  const [columnFilters, setColumnFilters] = useState([]);
  const [columnVisibility, setColumnVisibility] = useState({});
  const [rowSelection, setRowSelection] = useState({});
  const [selectedTeacher, setSelectedTeacher] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  const handleTeacherChange = useCallback((teacherId) => {
    setSelectedTeacher(teacherId);
  }, []);

  const handleClearFilter = useCallback(() => {
    setSelectedTeacher("");
  }, []);

  // Build API endpoint with filters - memoized for performance
  const buildEndpoint = useMemo(() => {
    let endpoint = `dashboard/reports?page=${currentPage}`;
    const params = [];

    if (selectedTeacher) {
      params.push(`teacher_id=${selectedTeacher}`);
    }

    if (params.length > 0) {
      endpoint += `&${params.join("&")}`;
    }

    return endpoint;
  }, [currentPage, selectedTeacher]);

  // Fetch reports data from API
  const {
    data: reportsData,
    isLoading,
    error,
    refetch,
  } = useGetData({
    endpoint: buildEndpoint,
    queryKey: ["reports", selectedTeacher, currentPage],
  });

  const reportsList = reportsData?.data?.reports || [];

  const table = useReactTable({
    data: reportsList,
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
      <>
        <div className="flex items-center flex-wrap justify-between gap-2 mb-5">
          <div className="flex flex-wrap items-center gap-4">
            <div className="flex-1">
              <h3 className="text-xl font-medium text-default-700 opacity-60">
                Reports
              </h3>
            </div>
          </div>
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
              {Array.from({ length: 3 }).map((_, rowIndex) => (
                <TableRow key={rowIndex}>
                  <TableCell>
                    <div className="flex items-center space-x-3 rtl:space-x-reverse">
                      <Skeleton className="h-8 w-8 rounded-full" />
                      <Skeleton className="h-4 w-32" />
                    </div>
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-4 w-12" />
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-4 w-24" />
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-4 w-16" />
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-8 w-20 rounded-full" />
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-8 w-20 rounded-full" />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Card>
      </>
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
      <div className="flex items-center flex-wrap justify-between gap-2 mb-5">
        <div className="flex flex-wrap items-center gap-4">
          <div className="flex-1">
            <h3 className="text-xl font-medium text-default-700 opacity-60">
              Reports
            </h3>
          </div>
        </div>
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
                  No reports available
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </Card>

      {/* Pagination */}
      <Pagination
        last_page={reportsData?.data?.pagination?.last_page}
        setCurrentPage={setCurrentPage}
        current_page={currentPage}
        studentsPagination={false}
      />
    </>
  );
};

const TargetDataTable = React.memo(TargetDataTableComponent);

export { TargetDataTable };
export default TargetDataTable;
