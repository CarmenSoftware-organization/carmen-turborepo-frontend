import React from 'react';
import { TableCell, TableRow } from '@/components/ui/table';
import { Skeleton } from '@/components/ui/skeleton';

interface TableRowSkeletonProps {
    columns: number;
    withAction?: boolean;
}

export const TableRowSkeleton: React.FC<TableRowSkeletonProps> = ({
    columns,
    withAction = true
}) => (
    <TableRow>
        <TableCell>
            <Skeleton className="h-4 w-8" />
        </TableCell>
        {Array(columns).fill(0).map((_, index) => (
            <TableCell key={`skeleton-cell-${index}-${Math.random().toString(36).substr(2, 5)}`}>
                <Skeleton className="h-4 w-full" />
            </TableCell>
        ))}
        {withAction && (
            <TableCell className="text-right">
                <Skeleton className="h-8 w-8 ml-auto" />
            </TableCell>
        )}
    </TableRow>
);