"use client";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { users } from "../../(tables)/tailwindui-table/data";
import { Icon } from "@iconify/react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import Link from "next/link";
import { ArrowBigRightDash } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";

const ReportsTableStatus = () => {
  const columns = [
    {
      key: "Student",
      label: "Student",
    },
    {
      key: "ID",
      label: "ID",
    },
    {
      key: "Date",
      label: "Date",
    },
    {
      key: "Target",
      label: "Target",
    },
    {
      key: "Admin Report",
      label: "Admin Report",
    },
    {
      key: "Teacher Reaport",
      label: "Teacher Reaport",
    },
    {
      key: "action",
      label: "action",
    },
  ];


  const [sorting, setSorting] = useState([]);
  const [columnFilters, setColumnFilters] = useState([]);
  const [columnVisibility, setColumnVisibility] = useState({});
  const [rowSelection, setRowSelection] = useState({});

  const table = useReactTable({
    data : users,
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
      <Card>
        <Table>
          <TableHeader>
            <TableRow>
              {columns.map((column) => (
                <TableHead key={column.key} className="text-right!">
                  {" "}
                  {column.label}
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {users
              .map((item) => (
                <TableRow key={item.email} className="hover:bg-default-100">
                  <TableCell className=" font-medium  text-card-foreground/80">
                    <div className="flex gap-3 items-center">
                      <Avatar className="rounded-lg">
                        <AvatarImage src={item.avatar} />
                        <AvatarFallback>AB</AvatarFallback>
                      </Avatar>
                      <span className="text-sm  text-default-600">
                        {item.name}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell>{item.id}</TableCell>
                  <TableCell>{item.name}</TableCell>
                  <TableCell>{item.email}</TableCell>
                  <TableCell>
                    <Link href={""} className="">
                      <button className="text-primary text-[12px] border px-4 py-1 border-solid border-primary rounded-full">
                        Check
                        <ArrowBigRightDash className="inline-block ml-1 w-6 h-6" />
                      </button>
                    </Link>
                  </TableCell>
                  <TableCell>
                    <Link href={""} className="">
                      <button className="text-primary text-[12px] border px-4 py-1 border-solid border-primary rounded-full">
                        Check
                        <ArrowBigRightDash className="inline-block ml-1 w-6 h-6" />
                      </button>
                    </Link>
                  </TableCell>

                  <TableCell className="flex gap-3 ">
                    <Button
                      className="px-5 text-xs h-8 rounded-full"
                      color="primary"
                    >
                      Send
                    </Button>
                  </TableCell>
                </TableRow>
              ))
              .slice(0, 4)}
          </TableBody>
        </Table>
      </Card>

      <div className="flex items-center flex-wrap gap-4">
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
};

export default ReportsTableStatus;
