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

import { users } from "./data";
import { Icon } from "@iconify/react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import LessonsStepsLineSpace from "./lessons-steps";

const LessonBoardTable = () => {
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
  return (
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
              className={`cursor-pointer hover:bg-gray-100 transition-all duration-300 ${
                collapsedRows.includes(item.id) ? "bg-gray-100" : ""
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
                <span className="text-sm bg-gray-100 text-primary border border-primary rounded-full px-4 py-1 font-medium select-none">
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
  );
};

export default LessonBoardTable;
