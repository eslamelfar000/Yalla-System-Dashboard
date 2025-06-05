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
      label: "Amount",
    },
    {
      key: "reason",
      label: "Reason",
    },
    {
      key: "action",
      label: "Action",
    },
  ];

  // Transform data to match expense structure
  const transformedData = data.map((item) => ({
    id: item.id,
    money: item.count, // Using count as money amount
    reason: item.page, // Using page as reason
    date: "2024-01-15", // Example date, this should come from real data
  }));

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  return (
    <Table>
      <TableHeader>
        <TableRow>
          {columns.map((column, index) => (
            <TableHead
              key={column.key}
              className={`${index === columns.length - 1 ? "text-right" : ""}`}
            >
              {column.label}
            </TableHead>
          ))}
        </TableRow>
      </TableHeader>
      <TableBody>
        {transformedData.map((item) => (
          <TableRow key={item.id} className="hover:bg-default-100">
            <TableCell className="font-semibold text-green-600">
              {formatCurrency(parseFloat(item.money.replace(/,/g, "")) || 0)}
            </TableCell>
            <TableCell className="max-w-xs">
              <div className="truncate" title={item.reason}>
                {item.reason}
              </div>
            </TableCell>
            <TableCell className="text-right">
              <div className="flex items-center justify-end gap-2">
                <Button
                  size="icon"
                  variant="outline"
                  className="h-7 w-7 border-none hover:bg-red-50"
                  title="Delete Expense"
                >
                  <Icon
                    icon="heroicons:trash"
                    className="h-4 w-4 text-red-500"
                  />
                </Button>
              </div>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

export default NotesTable;
