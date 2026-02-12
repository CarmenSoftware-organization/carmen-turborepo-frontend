import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/table/table";

interface DataGridLoadingProps {
  rows?: number;
  columns?: number;
  showHeader?: boolean;
}

export default function DataGridLoading({
  rows = 10,
  columns = 5,
  showHeader = true,
}: DataGridLoadingProps) {
  return (
    <Table>
      {showHeader && (
        <TableHeader>
          <TableRow>
            {Array.from({ length: columns }).map((_, colIndex) => (
              <TableHead key={`header-${colIndex}`}>
                <Skeleton className="h-3 w-3/4" />
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>
      )}
      <TableBody>
        {Array.from({ length: rows }).map((_, rowIndex) => (
          <TableRow key={`row-${rowIndex}`}>
            {Array.from({ length: columns }).map((_, colIndex) => (
              <TableCell key={`cell-${rowIndex}-${colIndex}`}>
                <Skeleton className={colIndex === 0 ? "h-3 w-1/2" : "h-3 w-full"} />
              </TableCell>
            ))}
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
