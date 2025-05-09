"use client";

import { CurrencyDto } from "@/dtos/config.dto";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useTranslations } from "next-intl";
import { SquarePen, Trash } from "lucide-react";
import { TableBodySkeleton } from "@/components/loading/TableBodySkeleton";
import PaginationComponent from "@/components/PaginationComponent";
import { ScrollArea } from "@/components/ui/scroll-area";
import { SortConfig, getSortableColumnProps, renderSortIcon } from "@/utils/table-sort";

interface CurrencyListProps {
    readonly isLoading: boolean;
    readonly currencies: CurrencyDto[];
    readonly onEdit: (currency: CurrencyDto) => void;
    readonly onToggleStatus: (currency: CurrencyDto) => void;
    readonly currentPage: number;
    readonly totalPages: number;
    readonly onPageChange: (page: number) => void;
    readonly sort?: SortConfig;
    readonly onSort?: (field: string) => void;
}

export default function CurrencyList({
    isLoading,
    currencies = [],
    onEdit,
    onToggleStatus,
    currentPage,
    totalPages,
    onPageChange,
    sort,
    onSort
}: CurrencyListProps) {
    const t = useTranslations('TableHeader');
    const tCommon = useTranslations('Common');
    const tCurrency = useTranslations('Currency');
    const handleEdit = (currency: CurrencyDto) => {
        onEdit(currency);
    };

    const handleToggleStatus = (currency: CurrencyDto) => {
        onToggleStatus(currency);
    };

    const renderTableContent = () => {
        if (isLoading) return <TableBodySkeleton columns={7} />;

        if (!currencies || currencies.length === 0) {
            return (
                <TableBody>
                    <TableRow>
                        <TableCell colSpan={7} className="h-24 text-center">
                            <div className="flex flex-col items-center justify-center gap-2">
                                <p className="text-sm text-muted-foreground">{tCurrency("notFoundCurrency")}</p>
                            </div>
                        </TableCell>
                    </TableRow>
                </TableBody>
            );
        }

        return (
            <TableBody>
                {currencies.map((currency: CurrencyDto, index: number) => (
                    <TableRow
                        key={currency.id}
                    >
                        <TableCell>{index + 1}</TableCell>
                        <TableCell className="text-left">{currency.name}</TableCell>
                        <TableCell>{currency.code}</TableCell>
                        <TableCell>{currency.symbol}</TableCell>
                        <TableCell>{currency.exchange_rate}</TableCell>
                        <TableCell>
                            <Badge variant={currency.is_active ? "active" : "inactive"}>
                                {currency.is_active ? tCommon("active") : tCommon("inactive")}
                            </Badge>
                        </TableCell>
                        <TableCell className="text-right">
                            <div className="flex items-center justify-end">
                                <Button
                                    variant="ghost"
                                    size={'sm'}
                                    onClick={() => handleEdit(currency)}
                                    aria-label="Edit currency"
                                    className="h-7 w-7"
                                >
                                    <SquarePen className="h-4 w-4" />
                                </Button>
                                <Button
                                    variant="ghost"
                                    size={'sm'}
                                    onClick={() => handleToggleStatus(currency)}
                                    aria-label={currency.is_active ? "Deactivate currency" : "Activate currency"}
                                    disabled={!currency.is_active}
                                    className="h-7 w-7 text-destructive hover:text-destructive/80"
                                >
                                    <Trash className="h-4 w-4" />
                                </Button>
                            </div>
                        </TableCell>
                    </TableRow>
                ))}
            </TableBody>
        );
    };

    return (
        <div className="space-y-4">
            <div className="relative">
                <Table className="border">
                    <TableHeader className="sticky top-0 bg-muted">
                        <TableRow>
                            <TableHead className="w-10">#</TableHead>
                            <TableHead
                                {...getSortableColumnProps('name', sort, onSort)}
                                className="text-left"
                            >
                                <div className="flex items-center gap-2">
                                    {t('name')}
                                    {renderSortIcon('name', sort)}
                                </div>
                            </TableHead>
                            <TableHead
                                {...getSortableColumnProps('code', sort, onSort)}
                            >
                                <div className="flex items-center">
                                    {t('code')}
                                    {renderSortIcon('code', sort)}
                                </div>
                            </TableHead>
                            <TableHead>{t('symbol')}</TableHead>
                            <TableHead
                                {...getSortableColumnProps('exchange_rate', sort, onSort)}
                            >
                                <div className="flex items-center justify-center">
                                    {t('exchangeRate')}
                                    {renderSortIcon('exchange_rate', sort)}
                                </div>
                            </TableHead>
                            <TableHead
                                {...getSortableColumnProps('is_active', sort, onSort)}
                            >
                                <div className="flex items-center justify-center">
                                    {t('status')}
                                    {renderSortIcon('is_active', sort)}
                                </div>
                            </TableHead>
                            <TableHead className="text-right">{t('action')}</TableHead>
                        </TableRow>
                    </TableHeader>
                </Table>
                <ScrollArea className="h-[calc(102vh-300px)] w-full">
                    <Table>
                        {renderTableContent()}
                    </Table>
                </ScrollArea>
            </div>

            <PaginationComponent
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={onPageChange}
                position="right"
            />
        </div>
    );
}
