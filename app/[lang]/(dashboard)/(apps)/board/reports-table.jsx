"use client";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { users } from "../../(tables)/tailwindui-table/data";
import { Icon } from "@iconify/react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import Link from "next/link";
import { ArrowBigRightDash } from "lucide-react";

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
  return (
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
  );
};

export default ReportsTableStatus;
