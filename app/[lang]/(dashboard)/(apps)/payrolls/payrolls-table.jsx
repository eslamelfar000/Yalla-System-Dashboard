"use client";
import * as React from "react";

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea";

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
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
import { data } from "../../(tables)/data-table/data";
import { Icon } from "@iconify/react";
import { cn } from "@/lib/utils";
import { Card } from "@/components/ui/card";

const columns = [
  {
    accessorKey: "name",
    header: "Name",
    cell: ({ row }) => (
      <div className="  font-medium  text-card-foreground/80">
        <div className="flex space-x-3  rtl:space-x-reverse items-center">
          <Avatar className=" rounded-full">
            <AvatarImage src={row?.original?.user.avatar} />
            <AvatarFallback>AB</AvatarFallback>
          </Avatar>
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
    accessorKey: "booked",
    header: "Booked",
    cell: ({ row }) => (
      <div className="  font-medium  text-card-foreground/80">
        <div className="flex space-x-3  rtl:space-x-reverse items-center">
          <span className=" text-sm opacity-70 font-[400] text-card-foreground whitespace-nowrap">
            {row?.original?.user.name}
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
            {row?.original?.user.name}
          </span>
        </div>
      </div>
    ),
  },
  {
    accessorKey: "Ded-Raise",
    header: "Ded. | Raise",
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
    accessorKey: "reason",
    header: "Reason",
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
    accessorKey: "action",
    header: "Action",
    cell: ({ row }) => (
      <div className="  font-medium  text-card-foreground/80">
        <div className="flex space-x-3  rtl:space-x-reverse items-center">
          <Popover>
            <PopoverTrigger asChild>
              <Button
                size="icon"
                variant="outline"
                className=" h-7 w-7"
                color="primary"
              >
                <Icon icon="heroicons:pencil" className="h-4 w-4" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-80">
              <div className="grid gap-4">
                <div className="space-y-2">
                  <h4 className="font-medium leading-none">
                    Edit Salary Adjustment
                  </h4>
                  <p className="text-sm text-muted-foreground">
                    Set the Salary Adjustment for the layer.
                  </p>
                </div>
                <div className="grid gap-2 w-full">
                  <div className="">
                    <Label htmlFor="debit">Debit</Label>
                    <Input id="debit" className="col-span-2 h-8 w-full" />
                  </div>
                  <div className="">
                    <Label htmlFor="raise">Raise</Label>
                    <Input id="raise" className="col-span-2 h-8" />
                  </div>
                  <div className="">
                    <Label htmlFor="reason">Reason</Label>
                    <Textarea
                      placeholder="Type your reason here."
                      id="reason"
                      className="col-span-2 h-14"
                    />
                  </div>

                  <div className="space-y-2">
                    <Button type="submit" className="w-full h-8">
                      Submit
                    </Button>
                  </div>
                </div>
              </div>
            </PopoverContent>
          </Popover>
          {/* / */}
          <Popover>
            <PopoverTrigger asChild>
              <Button
                size="icon"
                variant="outline"
                className=" h-7 w-7 "
                color="primary"
              >
                <Icon icon="heroicons:plus" className="h-4 w-4" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-80">
              <div className="grid gap-4">
                <div className="space-y-2">
                  <h4 className="font-medium leading-none">
                    Add Salary Adjustment
                  </h4>
                  <p className="text-sm text-muted-foreground">
                    Set the Salary Adjustment for the layer.
                  </p>
                </div>
                <div className="grid gap-2 w-full">
                  <div className="">
                    <Label htmlFor="debit">Debit</Label>
                    <Input id="debit" className="col-span-2 h-8 w-full" />
                  </div>
                  <div className="">
                    <Label htmlFor="raise">Raise</Label>
                    <Input id="raise" className="col-span-2 h-8" />
                  </div>
                  <div className="">
                    <Label htmlFor="reason">Reason</Label>
                    <Textarea
                      placeholder="Type your reason here."
                      id="reason"
                      className="col-span-2 h-14"
                    />
                  </div>

                  <div className="space-y-2">
                    <Button type="submit" className="w-full h-8">
                      Submit
                    </Button>
                  </div>
                </div>
              </div>
            </PopoverContent>
          </Popover>
        </div>
      </div>
    ),
  },
];

export function PayrollsrDataTable() {
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
                .slice(0, 4)
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

export default PayrollsrDataTable;
