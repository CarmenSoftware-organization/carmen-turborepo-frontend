import React from 'react';
import { TableBody } from '@/components/ui/table';
import { TableRowSkeleton } from './TableRowSkeleton';

interface TableBodySkeletonProps {
    rows?: number;
    columns: number;
    withAction?: boolean;
}

export const TableBodySkeleton: React.FC<TableBodySkeletonProps> = ({
    rows = 10,
    columns,
    withAction
}) => (
    <TableBody>
        {Array(rows).fill(0).map((_, index) => (
            <TableRowSkeleton
                key={index}
                columns={columns}
                withAction={withAction}
            />
        ))}
    </TableBody>
);