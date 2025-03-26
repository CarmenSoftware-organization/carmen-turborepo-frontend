import { Skeleton } from "../ui/skeleton";
import { TableBody, TableCell, TableRow } from "../ui/table";

interface TableBodySkeletonProps {
    columns: number;
}

export const TableBodySkeleton = ({ columns }: TableBodySkeletonProps) => (
    <TableBody>
        {Array(10).fill(0).map((_, index) => (
            <TableRow key={index}>
                {Array(columns).fill(0).map((_, index) => (
                    <TableCell key={index}>
                        <Skeleton className="w-full h-10" />
                    </TableCell>
                ))}
            </TableRow>
        ))}
        <TableCell className="text-right">
            <Skeleton className="h-8 w-8 ml-auto" />
        </TableCell>
    </TableBody>
);
