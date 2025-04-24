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
import {
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { users, data } from "./data";
import { Icon } from "@iconify/react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import LessonsStepsLineSpace from "./lessons-steps";
import { Card } from "@/components/ui/card";

const LessonBoardTable = () => {
  const [sorting, setSorting] = useState([]);
  const [columnFilters, setColumnFilters] = useState([]);
  const [columnVisibility, setColumnVisibility] = useState({});
  const [rowSelection, setRowSelection] = useState({});

  const columns = [
    {
      key: "user",
      label: "user",
    },
    {
      key: "title",
      label: "title",
    },
    {
      key: "role",
      label: "role",
    },
    {
      key: "action",
      label: "action",
    },
    {
      key: "action",
      label: "action",
    },
    {
      key: "action",
      label: "action",
    },
  ];


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

  const [collapsedRows, setCollapsedRows] = useState([]);
  const toggleRow = (id) => {
    if (collapsedRows.includes(id)) {
      setCollapsedRows(collapsedRows.filter((rowId) => rowId !== id));
    } else {
      setCollapsedRows([...collapsedRows, id]);
    }
  };
  return (
    <>
      <Card title="Simple">
        <Table className="min-w-[150%] md:min-w-full">
          {/* <TableHeader>
        <TableRow>
          {columns.map((column) => (
            <TableHead key={column.key}>{column.label}</TableHead>
          ))}
        </TableRow>
      </TableHeader> */}
          <TableBody>
            {users.map((item) => (
              <Fragment key={item.id}>
                <TableRow
                  onClick={() => toggleRow(item.id)}
                  className={`cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 transition-all duration-300 ${
                    collapsedRows.includes(item.id)
                      ? "bg-gray-100 dark:bg-gray-700"
                      : ""
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
                        </div>
                      </div>
                    </div>
                  </TableCell>

                  <TableCell>{item.id}8687</TableCell>
                  <TableCell>{item.role}</TableCell>
                  <TableCell>8 Sessions</TableCell>
                  <TableCell>
                    <span className="text-sm bg-gray-100 dark:bg-gray-900 text-primary border border-primary rounded-full px-4 py-1 font-medium select-none">
                      1 o 8 is done
                    </span>
                  </TableCell>

                  <TableCell>
                    <Button
                      onClick={() => toggleRow(item.id)}
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
                    <TableCell colSpan={6} className="">
                      {/* <div className="ltr:pl-12 rtl:pr-12 flex flex-col items-start">
                    <p>City: {item.details.city}</p>
                    <p>Experience:{item.details.experience}</p>
                    <p>Post: {item.details.post}</p>
                  </div> */}
                      <LessonsStepsLineSpace />
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

export default LessonBoardTable;
