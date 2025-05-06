"use client";
import { Fragment, useState } from "react";
import { cn } from "@/lib/utils";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { users } from "../../../../(tables)/tailwindui-table/data";
import { Icon } from "@iconify/react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import {
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";

const AdminArchiveTable = () => {
  const [collapsedRows, setCollapsedRows] = useState([]);
  const toggleRow = (id) => {
    if (collapsedRows.includes(id)) {
      setCollapsedRows(collapsedRows.filter((rowId) => rowId !== id));
    } else {
      setCollapsedRows([...collapsedRows, id]);
    }
  };
  const columns = [
    {
      key: "stud-name",
      label: "Student Name",
    },
    {
      key: "id",
      label: "ID",
    },
    {
      key: "type",
      label: "Type",
    },
    {
      key: "booked",
      label: "Booked",
    },
    {
      key: "teacher",
      label: "Teacher",
    },
    {
      key: "action",
      label: "action",
    },
  ];

  const [columnFilters, setColumnFilters] = useState([]);
  const [columnVisibility, setColumnVisibility] = useState({});
  const [rowSelection, setRowSelection] = useState({});

  const table = useReactTable({
    data: users,
    columns,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    state: {
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
                <TableHead key={column.key}>{column.label}</TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {users.map((item) => (
              <Fragment key={item.id}>
                <TableRow
                  onClick={() => toggleRow(item.id)}
                  className={`cursor-pointer select-none hover:bg-default-100 ${
                    collapsedRows.includes(item.id) ? "bg-default-100" : ""
                  }`}
                >
                  <TableCell>
                    <div className="flex items-center gap-4">
                      <div className="flex gap-3 items-center">
                        <Avatar className=" rounded-full">
                          <AvatarImage src={item.avatar} />
                          <AvatarFallback>AB</AvatarFallback>
                        </Avatar>
                        <div>
                          <span className=" text-sm  block  text-card-foreground">
                            {item.name}
                          </span>
                          <span className=" text-xs mt-1  block   font-normal">
                            {item.email}
                          </span>
                        </div>
                      </div>
                    </div>
                  </TableCell>

                  <TableCell>{item.title}</TableCell>
                  <TableCell>
                    <Badge
                      variant="soft"
                      color="success"
                      className="capitalize rounded-md"
                    >
                      Active
                    </Badge>
                  </TableCell>
                  <TableCell>{item.title}</TableCell>
                  <TableCell>
                    {" "}
                    <div className="flex items-center gap-4">
                      <div className="flex gap-3 items-center">
                        <Avatar className=" rounded-full">
                          <AvatarImage src={item.avatar} />
                          <AvatarFallback>AB</AvatarFallback>
                        </Avatar>
                        <div>
                          <span className=" text-sm  block  text-card-foreground">
                            {item.name}
                          </span>
                          <span className=" text-xs mt-1  block   font-normal">
                            {item.email}
                          </span>
                        </div>
                      </div>
                    </div>
                  </TableCell>

                  <TableCell className="">
                    <Button
                      size="icon"
                      variant="outline"
                      color="secondary"
                      className=" h-7 w-7 border-none rounded-full "
                    >
                      <Icon
                        icon="heroicons:chevron-down"
                        className={cn("h-5 w-5 transition-all duration-300 ", {
                          "rotate-180": collapsedRows.includes(item.id),
                        })}
                      />
                    </Button>
                  </TableCell>
                </TableRow>
                {collapsedRows.includes(item.id) && (
                  <TableRow>
                    <TableCell colSpan={7}>
                      <div className="pl-12 space-y-2">
                        <p className="flex items-center gap-1 text-sm">
                          <Icon
                            icon="heroicons:arrow-right-circle"
                            className="h-7 w-7 text-primary"
                          />
                          <span className="font-bold text-md">Date :</span>{" "}
                          {item.details.city}
                        </p>
                        <p className="flex items-center gap-1 text-sm">
                          <Icon
                            icon="heroicons:arrow-right-circle"
                            className="h-7 w-7 text-primary"
                          />
                          <span className="font-bold text-md">Pay :</span>
                          {item.details.experience}
                        </p>
                        <p className="flex items-center gap-1 text-sm">
                          <Icon
                            icon="heroicons:arrow-right-circle"
                            className="h-7 w-7 text-primary"
                          />
                          <span className="font-bold text-md">
                            Payment Method :
                          </span>
                          {item.details.post}
                        </p>
                        <p className="flex items-center gap-1 text-sm">
                          <Icon
                            icon="heroicons:arrow-right-circle"
                            className="h-7 w-7 text-primary"
                          />
                          <span className="font-bold text-md">Mobile :</span>
                          {item.details.post}
                        </p>
                      </div>
                    </TableCell>
                  </TableRow>
                )}
              </Fragment>
            ))}
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
};

export default AdminArchiveTable;
