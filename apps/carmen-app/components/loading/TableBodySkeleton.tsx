import { Skeleton } from "../ui/skeleton";
import { TableBody, TableCell, TableRow } from "../ui/table";

interface TableBodySkeletonProps {
    rows: number; // จำนวนเซลล์แนวนอนในแต่ละแถว
}

export const TableBodySkeleton = ({ rows }: TableBodySkeletonProps) => (
    <TableBody>
        {[...Array(10)].map((_, rowIndex) => (
            <TableRow key={`skeleton-row-${rowIndex}`}>
                {[...Array(rows)].map((_, cellIndex) => (
                    <TableCell key={`skeleton-cell-${rowIndex}-${cellIndex}`}>
                        <Skeleton className="w-full h-6" />
                    </TableCell>
                ))}
            </TableRow>
        ))}
    </TableBody>
);
