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
import { data } from "../../(tables)/data-table/data";
import { Icon } from "@iconify/react";
import { cn } from "@/lib/utils";
import { Card } from "@/components/ui/card";
import { ArrowBigRightDash } from "lucide-react";
import Link from "next/link";

const columns = [
  {
    accessorKey: "session",
    header: "Session",
    cell: ({ row }) => (
      <div className="  font-medium  text-card-foreground/80">
        <div className="flex space-x-3  rtl:space-x-reverse items-center">
          <span className=" text-sm opacity-70 font-[400]  text-card-foreground whitespace-nowrap">
            {row?.original?.user.name}
          </span>
        </div>
      </div>
    ),
  },
  {
    accessorKey: "student-name",
    header: "Student Name",
    cell: ({ row }) => (
      <div className="  font-medium  text-card-foreground/80">
        <div className="flex space-x-3  rtl:space-x-reverse items-center">
          <span className=" text-sm opacity-70 font-[400]  text-card-foreground whitespace-nowrap">
            {row?.original?.user.name}
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
          <span className=" text-sm opacity-70 font-[400] text-card-foreground whitespace-nowrap">
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
      <div className="  font-medium  text-card-foreground/80">
        <div className="flex space-x-3  rtl:space-x-reverse items-center">
          <span className=" text-sm opacity-70 font-[400]  text-card-foreground whitespace-nowrap">
            {row?.original?.user.name}
          </span>
        </div>
      </div>
    ),
  },
  {
    accessorKey: "target",
    header: "Target",
    cell: ({ row }) => (
      <div className="  font-medium  text-card-foreground/80">
        <div className="flex space-x-3  rtl:space-x-reverse items-center">
          <span className=" text-sm opacity-70 font-[400]  text-card-foreground whitespace-nowrap">
            {row?.original?.user.name}
          </span>
        </div>
      </div>
    ),
  },
  {
    accessorKey: "report",
    header: "Report",
    cell: ({ row }) => (
      <div className="  font-medium  text-card-foreground/80">
        <div className="flex space-x-3  rtl:space-x-reverse items-center">
          <span className=" text-sm opacity-70 font-[400]  text-card-foreground whitespace-nowrap">
            <Link href={""} className="">
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
];

export function TargetDataTable() {
  const [sorting, setSorting] = React.useState([]);
  const [columnFilters, setColumnFilters] = React.useState([]);
  const [columnVisibility, setColumnVisibility] = React.useState({});
  const [rowSelection, setRowSelection] = React.useState({});

  const table = useReactTable({
    data,
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
              table
                .getRowModel()
                .rows.map((row) => (
                  <TableRow
                    key={row.id}
                    data-state={row.getIsSelected() && "selected"}
                    className="hover:bg-gray-100"
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
                .slice(0, 8)
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  No results.
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

        <div className="flex gap-2  items-center">
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
              key={`basic-data-table-${pageIdx}`}
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
    </>
  );
}

export default TargetDataTable;
