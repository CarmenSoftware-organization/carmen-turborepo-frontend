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
import { Pencil, Power } from "lucide-react";
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
    currencies,
    onEdit,
    onToggleStatus,
    currentPage,
    totalPages,
    onPageChange
}: CurrencyListProps) {
    const t = useTranslations('TableHeader');

    const handleEdit = (currency: CurrencyDto) => {
        onEdit(currency);
    };

    const handleToggleStatus = (currency: CurrencyDto) => {
        onToggleStatus(currency);
    };

    return (
        <div className="space-y-4">
            <Table>
                <TableHeader className="sticky top-0">
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
                {isLoading ? (
                    <TableBodySkeleton columns={7} />
                ) : (
                    <TableBody>
                        {currencies.map((currency: CurrencyDto, index: number) => (
                            <TableRow
                                key={currency.id}
                                className={!currency.is_active ? "line-through opacity-70" : ""}
                            >
                                <TableCell className="w-10 hidden md:table-cell">{index + 1}</TableCell>
                                <TableCell className="w-10 md:w-24 md:table-cell">{currency.name}</TableCell>
                                <TableCell className="w-10 hidden md:table-cell">{currency.code}</TableCell>
                                <TableCell className="w-10 md:w-24 hidden md:table-cell">{currency.symbol}</TableCell>
                                <TableCell className="w-32 md:text-center">{currency.exchange_rate}</TableCell>
                                <TableCell className="w-10 md:w-24 md:text-center">
                                    <Badge variant={currency.is_active ? "default" : "destructive"}>
                                        {currency.is_active ? 'Active' : 'Inactive'}
                                    </Badge>
                                </TableCell>
                                <TableCell className="text-right">
                                    <div className="flex items-center justify-end">
                                        <Button
                                            variant="ghost"
                                            size={'sm'}
                                            onClick={() => handleEdit(currency)}
                                            aria-label="Edit currency"
                                            disabled={!currency.is_active}
                                        >
                                            <Pencil className="h-4 w-4" />
                                        </Button>
                                        <Button
                                            variant="ghost"
                                            size={'sm'}
                                            className={currency.is_active ? "hover:text-destructive" : "hover:text-green-600"}
                                            onClick={() => handleToggleStatus(currency)}
                                            aria-label={currency.is_active ? "Deactivate currency" : "Activate currency"}
                                            disabled={!currency.is_active}
                                        >
                                            <Power className="h-4 w-4" />
                                        </Button>
                                    </div>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                )}
            </Table>
            <PaginationComponent
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={onPageChange}
            />
        </div>
    );
}
