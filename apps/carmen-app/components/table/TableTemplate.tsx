"use client";

import { ReactNode } from "react";
import PaginationComponent from "../PaginationComponent";
import { TableBodySkeleton } from "../loading/TableBodySkeleton";
import { useTranslations } from "next-intl";
import { cn } from "@/lib/utils";
import { Table, TableBody, TableCell, TableFooter, TableHead, TableHeader, TableRow } from "../ui-custom/table";
import { FileX } from "lucide-react";

type Align = 'left' | 'center' | 'right';

const getAlignClass = (align?: Align): string => {
    switch (align) {
        case 'center':
            return 'text-center';
        case 'right':
            return 'text-right';
        case 'left':
        default:
            return 'text-left';
    }
};

const getFlexAlignClass = (align?: Align): string => {
    switch (align) {
        case 'center':
            return 'justify-center';
        case 'right':
            return 'justify-end';
        case 'left':
        default:
            return 'justify-start';
    }
};

export interface TableColumn {
    readonly title: string | ReactNode;
    readonly icon?: ReactNode;
    readonly dataIndex: string;
    readonly key: string;
    readonly width?: string;
    readonly align?: 'left' | 'center' | 'right';
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    readonly render?: (value: any, record: TableDataSource, index: number) => ReactNode;
}

export interface TableDataSource {
    readonly key: string;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    readonly [key: string]: any;
}

export interface TableProps {
    readonly columns: TableColumn[];
    readonly dataSource: TableDataSource[];
    readonly totalItems?: number;
    readonly totalPages?: number;
    readonly currentPage?: number;
    readonly onPageChange?: (page: number) => void;
    readonly isLoading?: boolean;
}

const TableTemplate = ({
    columns,
    dataSource,
    totalItems,
    totalPages,
    currentPage,
    onPageChange,
    isLoading = false,
}: TableProps) => {
    const tCommon = useTranslations("Common");
    const colLength = columns.length;
    const colSpan = colLength;

    return (
        <Table>
            <TableHeader className={cn(
                "bg-muted"
            )}>
                <TableRow>
                    {columns.map((column) => (
                        <TableHead
                            key={column.key}
                            className={cn(getAlignClass(column.align), column.width)}
                        >
                            <div className={cn("flex items-center gap-1", getFlexAlignClass(column.align))}>
                                {column.icon}
                                {column.title}
                            </div>
                        </TableHead>
                    ))}
                </TableRow>
            </TableHeader>

            {/* Table Body */}
            {isLoading ? (
                <TableBodySkeleton rows={colLength} />
            ) : (
                <TableBody>
                    {dataSource.length > 0 ? (
                        dataSource.map((record, index) => (
                            <TableRow key={record.key}>
                                {columns.map((column) => (
                                    <TableCell
                                        key={`${record.key}-${column.key}`}
                                        className={cn(getAlignClass(column.align), column.width)}
                                    >
                                        {column.render
                                            ? column.render(record[column.dataIndex], record, index)
                                            : record[column.dataIndex]
                                        }
                                    </TableCell>
                                ))}
                            </TableRow>
                        ))
                    ) : (
                        <TableRow>
                            <TableCell colSpan={colSpan} className="text-center">
                                <div className="flex flex-col items-center justify-center py-8 gap-4 text-gray-500">
                                    <FileX className="w-12 h-12 text-gray-400" />
                                    <p className="text-sm">No data found matching your filters.</p>
                                </div>
                            </TableCell>
                        </TableRow>
                    )}
                </TableBody>
            )}

            {totalItems! > 0 && (
                <TableFooter>
                    <TableRow>
                        <TableCell colSpan={colSpan} className="px-4">
                            <div className="flex items-center justify-between w-full">
                                <p className="text-sm text-muted-foreground">
                                    {totalItems} {tCommon("itemFound")}
                                </p>
                                <div>
                                    {totalPages && totalPages > 1 && currentPage && onPageChange && (
                                        <PaginationComponent
                                            currentPage={currentPage}
                                            totalPages={totalPages}
                                            onPageChange={onPageChange}
                                        />
                                    )}
                                </div>
                            </div>
                        </TableCell>
                    </TableRow>
                </TableFooter>
            )}
        </Table>
    );
};

export default TableTemplate;

export type { TableColumn as ColumnType, TableDataSource as DataSourceType };

TableTemplate.displayName = "TableTemplate";