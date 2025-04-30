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
import {data} from "../../(tables)/data-table/data";
import { Icon } from "@iconify/react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useState } from "react";
import { cn } from "@/lib/utils"
import { Slider } from "@/components/ui/slider"
import { PlusCircle } from "lucide-react";
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea";

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"

const BoradTableStatus = () => {
  const [percent, setPercent] = useState(50);
  console.log(percent);
  

  const columns = [
    {
      key: "Student Name",
      label: "Student Name",
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
      key: "action",
      label: "action",
    },
  ];

  const [sorting, setSorting] = useState([]);
  const [columnFilters, setColumnFilters] = useState([]);
  const [columnVisibility, setColumnVisibility] = useState({});
  const [rowSelection, setRowSelection] = useState({});

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
      <Card>
        <Table>
          <TableHeader>
            <TableRow>
              {columns.map((column) => (
                <TableHead key={column.key}> {column.label}</TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {users.map((item) => (
              <TableRow key={item.id} className="hover:bg-default-100">
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
                <TableCell>
                  {/* <span className="text-primary hover:text-success cursor-pointer transition-all duration-200 ease-in-out">
                        <PlusCircle className="size-10" />
                      </span> */}
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        size="icon"
                        variant="outline"
                        className=" h-7 w-7"
                        color="primary"
                      >
                        <Icon icon="heroicons:plus" className="h-4 w-4" />
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-80">
                      <div className="grid gap-4">
                        {/* <div className="space-y-2">
                          <h4 className="font-medium leading-none">
                            Edit Salary Adjustment
                          </h4>
                          <p className="text-sm text-muted-foreground">
                            Set the Salary Adjustment for the layer.
                          </p>
                        </div> */}
                        <div className="grid gap-2 w-full space-y-5">
                          <div className="space-y-2">
                            <Label htmlFor="debit">Admin File</Label>
                            <Input
                              id="debit"
                              type="file"
                              className="col-span-2 h-8 w-full"
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="raise">Teacher File</Label>
                            <Input
                              id="raise"
                              type="file"
                              className="col-span-2 h-8"
                            />
                          </div>
                          <div className="space-y-3">
                            <div className="flex items-center justify-between">
                              <Label htmlFor="reason">Target</Label>
                              <Label htmlFor="reason">{percent}%</Label>
                            </div>
                            <Slider
                              defaultValue={[percent]}
                              max={100}
                              step={1}
                              className={"w-full"}
                              onValueChange={(value) => {
                                setPercent(value[0]);
                              }}
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
                </TableCell>
              </TableRow>
            ))}
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

export default BoradTableStatus;
