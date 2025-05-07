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

interface CurrencyListProps {
    readonly isLoading: boolean;
    readonly currencies: CurrencyDto[];
    readonly onEdit: (currency: CurrencyDto) => void;
    readonly onToggleStatus: (currency: CurrencyDto) => void;
    readonly currentPage: number;
    readonly totalPages: number;
    readonly onPageChange: (page: number) => void;
}

export default function CurrencyList({
    isLoading,
    currencies = [],
    onEdit,
    onToggleStatus,
    currentPage,
    totalPages,
    onPageChange
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
                        <TableCell className="w-10 hidden md:table-cell">{index + 1}</TableCell>
                        <TableCell className="w-10 md:w-24 md:table-cell">{currency.name}</TableCell>
                        <TableCell className="w-10 hidden md:table-cell">{currency.code}</TableCell>
                        <TableCell className="w-10 md:w-24 hidden md:table-cell">{currency.symbol}</TableCell>
                        <TableCell className="w-32 md:text-center">{currency.exchange_rate}</TableCell>
                        <TableCell className="w-10 md:w-24 md:text-center">
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
            <Table className="border">
                <TableHeader className="sticky top-0 bg-muted">
                    <TableRow>
                        <TableHead className="w-10 hidden md:table-cell">#</TableHead>
                        <TableHead className="w-10 md:w-24 md:table-cell">{t('name')}</TableHead>
                        <TableHead className="w-10 hidden md:table-cell">{t('code')}</TableHead>
                        <TableHead className="w-10 md:w-24 hidden md:table-cell">{t('symbol')}</TableHead>
                        <TableHead className="w-32 md:text-center">{t('exchangeRate')}</TableHead>
                        <TableHead className="w-10 md:w-24 md:text-center">{t('status')}</TableHead>
                        <TableHead className="text-right">{t('action')}</TableHead>
                    </TableRow>
                </TableHeader>
                {renderTableContent()}
            </Table>

            <PaginationComponent
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={onPageChange}
                position="right"
            />
        </div>
    );
}
