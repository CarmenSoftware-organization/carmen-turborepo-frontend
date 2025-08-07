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
    readonly perpage?: number;
    readonly setPerpage?: (perpage: number) => void;
}

const TableTemplate = ({
    columns,
    dataSource,
    totalItems = 0,
    totalPages = 1,
    currentPage = 1,
    onPageChange,
    perpage = 10,
    isLoading = false,
    setPerpage,
}: TableProps) => {

    const tCommon = useTranslations("Common");
    const colLength = columns.length;
    const colSpan = colLength;

    const startItem = totalItems > 0 && dataSource.length > 0 ? (currentPage - 1) * perpage + 1 : 0;
    const endItem = totalItems > 0 && dataSource.length > 0 ? Math.min(currentPage * perpage, totalItems) : 0;


    return (
        <Table>
            <TableHeader>
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

            {isLoading ? (
                <TableBodySkeleton rows={colLength} />
            ) : (
                <TableBody>
                    {dataSource?.length > 0 ? (
                        dataSource?.map((record, index) => (
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
                                    <p className="text-sm">{tCommon("no_data_found")}</p>
                                </div>
                            </TableCell>
                        </TableRow>
                    )}
                </TableBody>
            )}

            {totalItems > 0 && (
                <TableFooter className="h-14">
                    <TableRow>
                        <TableCell colSpan={colSpan} className="px-4">
                            <div className="flex items-center justify-between w-full">
                                <p className="text-sm">
                                    {dataSource.length > 0 ? (
                                        <>
                                            {startItem}-{endItem} {tCommon("of")} {totalItems} {tCommon("itemFound")}
                                        </>
                                    ) : (
                                        <>
                                            {totalItems} {tCommon("itemFound")} ({tCommon("filtered_out")})
                                        </>
                                    )}
                                </p>
                                <div>
                                    {totalPages > 1 && onPageChange && (
                                        <PaginationComponent
                                            currentPage={currentPage}
                                            totalPages={totalPages}
                                            onPageChange={onPageChange}
                                            setPerpage={setPerpage}
                                            perpage={perpage}
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