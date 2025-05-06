import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { data } from "./data";
import { Button } from "@/components/ui/button";
import { Icon } from "@iconify/react";

const NotesTable = () => {
  const columns = [
    {
      key: "money",
      label: "Money",
    },
    {
      key: "reason",
      label: "Reason",
    },
    {
      key: "action",
      label: "action",
    },
  ];
  return (
    <Table >
      <TableHeader>
        <TableRow>
          {columns.map((column, index) => (
            <TableHead key={column.key} className={` ${index === -1 ? "text-right!" : ""}`}>
              {column.label}
            </TableHead>
          ))}
        </TableRow>
      </TableHeader>
      <TableBody>
        {data.map((item) => (
          <TableRow key={item.id} className="hover:bg-default-100 ">
            <TableCell>{item.count}</TableCell>
            <TableCell>{item.page}</TableCell>
            <TableCell className="">
              <Button
                size="icon"
                variant="outline"
                color="destructive"
                className=" h-7 w-7 border-none"
              >
                <Icon icon="heroicons:trash" className=" h-5 w-5  " />
              </Button>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

export default NotesTable;
