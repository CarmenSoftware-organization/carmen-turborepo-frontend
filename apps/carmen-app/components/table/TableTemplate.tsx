"use client";

import { ReactNode } from "react";
import PaginationComponent from "../PaginationComponent";
import { TableBodySkeleton } from "../loading/TableBodySkeleton";
import { useTranslations } from "next-intl";
import { cn } from "@/lib/utils";
import { Table, TableBody, TableCell, TableFooter, TableHead, TableHeader, TableRow } from "../ui-custom/table";
import { FileX } from "lucide-react";

const getAlignClass = (align?: 'left' | 'center' | 'right'): string => {
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

export interface TableColumn {
    readonly title: string | ReactNode;
    readonly dataIndex: string;
    readonly key: string;
    readonly width?: string;
    readonly align?: 'left' | 'center' | 'right';
    readonly render?: (value: any, record: TableDataSource, index: number) => ReactNode;
}

export interface TableDataSource {
    readonly key: string;
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
        <div className="border rounded-lg">
            {/* Fixed Header */}
            <div className="bg-muted rounded-t-lg">
                <Table>
                    <TableHeader>
                        <TableRow>
                            {columns.map((column) => (
                                <TableHead
                                    key={column.key}
                                    className={cn(getAlignClass(column.align), column.width)}>
                                    {column.title}
                                </TableHead>
                            ))}
                        </TableRow>
                    </TableHeader>
                </Table>
            </div>

            {/* Scrollable Body */}
            <div className="max-h-screen overflow-y-auto">
                <Table>
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
                                    <TableCell className="text-center">
                                        <div className="flex flex-col items-center justify-center py-8 gap-4 text-gray-500">
                                            <FileX className="w-12 h-12 text-gray-400" />
                                            <p className="text-sm">No data found matching your filters.</p>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    )}
                </Table>
            </div>

            {totalItems!! > 0 && (
                <div>
                    <Table>
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
                    </Table>
                </div>
            )}
        </div>
    );
};

export default TableTemplate;

export type { TableColumn as ColumnType, TableDataSource as DataSourceType };

TableTemplate.displayName = "TableTemplate";