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
import { Toggle } from "@/components/ui/toggle";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { data } from "../../(tables)/data-table/data";
import { Icon } from "@iconify/react";
import { cn } from "@/lib/utils";
import { Card } from "@/components/ui/card";
import { ArrowBigRightDash, Check } from "lucide-react";
import Link from "next/link";

const columns = [
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
    accessorKey: "admin report",
    header: "Admin Report",
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
  {
    accessorKey: "Teacher report",
    header: "Teacher Report",
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
  {
    accessorKey: "action",
    header: "Action",
    cell: ({ row }) => (
      <div className="  font-medium  text-card-foreground/80">
        <div className="rtl:space-x-reverse items-center">
            <Toggle aria-label="Toggle italic" size="icon" className="w-6 h-6 p-1 rounded-full bg-transparent text-primary border border-solid border-primary">
              <Check className="w-6 h-6" />
            </Toggle>
        </div>
      </div>
    ),
  },
];

export function ReportsDataTable() {
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
      <div className="flex items-center flex-wrap gap-2 mb-5">
        <Select className="w-[280px]">
          <SelectTrigger className="w-[200px]">
            <SelectValue
              placeholder="Select Teacher"
              className="whitespace-nowrap"
            />
          </SelectTrigger>
          <SelectContent className="h-[300px] overflow-y-auto ">
            {data?.map((item) => (
              <SelectItem key={item?.user?.name} value={item?.user?.name}>
                {item?.user?.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select className="w-[280px]">
          <SelectTrigger className="w-[200px]">
            <SelectValue
              placeholder="Select Month"
              className="whitespace-nowrap"
            />
          </SelectTrigger>
          <SelectContent className="h-[300px] overflow-y-auto ">
            {data?.map((item) => (
              <SelectItem key={item?.user?.name} value={item?.user?.name}>
                {item?.user?.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
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
              table
                .getRowModel()
                .rows.slice(0, 4)
                .map((row) => (
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

      <div className="flex items-center flex-wrap gap-4 px-4 pb-5">
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

export default ReportsDataTable;
