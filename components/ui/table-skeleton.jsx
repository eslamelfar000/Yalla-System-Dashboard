import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

const TableSkeleton = ({ columns = [], rows = 3 }) => {
  // Ensure columns is always an array
  const safeColumns = Array.isArray(columns) ? columns : [];

  return (
    <Table>
      <TableHeader>
        <TableRow>
          {safeColumns.map((column, colIndex) => (
            <TableHead
              key={colIndex}
              className="font-semibold text-default-800 bg-default-50 dark:bg-default-100"
            >
              {column?.label || `Column ${colIndex + 1}`}
            </TableHead>
          ))}
        </TableRow>
      </TableHeader>
      <TableBody>
        {Array.from({ length: rows }).map((_, rowIndex) => (
          <TableRow key={rowIndex}>
            {Array.from({ length: safeColumns.length }).map((_, colIndex) => (
              <TableCell key={colIndex}>
                <Skeleton className="h-4 w-full" />
              </TableCell>
            ))}
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

export { TableSkeleton };
