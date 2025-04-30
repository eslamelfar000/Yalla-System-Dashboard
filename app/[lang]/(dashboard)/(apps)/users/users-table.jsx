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
import { Card } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { SharedSheet } from "@/components/Shared/Drawer/shared-sheet";
import { SharedAlertDialog } from "@/components/Shared/Drawer/shared-dialog";

const UsersTableStatus = ({type}) => {
  const columns = [
    {
      key: "Name",
      label: "Name",
    },
    {
      key: "ID",
      label: "ID",
    },
    {
      key: "Phone Number",
      label: "Phone Number",
    },
    {
      key: "Email",
      label: "Email",
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
              <TableHead key={column.key}> {column.label}</TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {users.map((item) => (
            <TableRow key={item.email} className="hover:bg-default-100">
              <TableCell className=" font-medium  text-card-foreground/80">
                <div className="flex gap-3 items-center">
                  <Avatar className="rounded-lg">
                    <AvatarImage src={item.avatar} />
                    <AvatarFallback>AB</AvatarFallback>
                  </Avatar>
                  <span className="text-sm  text-default-600">{item.name}</span>
                </div>
              </TableCell>
              <TableCell>{item.id}</TableCell>
              <TableCell>{item.name}</TableCell>
              <TableCell>{item.email}</TableCell>

              <TableCell className="flex gap-3  justify-end">
                <SharedSheet type={`edit-${type}`} user={item} />
                <SharedSheet type={`show-${type}`} user={item} />
                <SharedAlertDialog type={`delete-${type}`} info={item} />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Card>
  );
};

export default UsersTableStatus;
