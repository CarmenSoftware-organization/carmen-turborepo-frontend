"use client";

import { CurrencyDto } from "@/dtos/currency.dto";
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
import { Pencil, Trash } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { TableBodySkeleton } from "@/components/loading/TableBodySkeleton";

interface CurrencyListProps {
    readonly isLoading: boolean;
    readonly currencies: CurrencyDto[];
    readonly onEdit: (currency: CurrencyDto) => void;
    readonly onDelete: (currency: CurrencyDto) => void;
}

export default function CurrencyList({ isLoading, currencies, onEdit, onDelete }: CurrencyListProps) {
    const t = useTranslations('TableHeader');

    const handleEdit = (currency: CurrencyDto) => {
        onEdit(currency);
    };

    const handleDelete = (currency: CurrencyDto) => {
        onDelete(currency);
    };

    return (
        <div className="space-y-4">
            <ScrollArea className="h-[calc(100vh-300px)]">
                <Table>
                    <TableHeader className="sticky top-0">
                        <TableRow>
                            <TableHead className="w-10 hidden md:table-cell">#</TableHead>
                            <TableHead className="w-10 md:w-24 hidden md:table-cell">{t('name')}</TableHead>
                            <TableHead className="w-10 hidden md:table-cell">{t('code')}</TableHead>
                            <TableHead className="w-10 md:w-24 md:text-center">{t('symbol')}</TableHead>
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
                                <TableRow key={currency.id}>
                                    <TableCell className="w-10 hidden md:table-cell">{index + 1}</TableCell>
                                    <TableCell className="w-10 md:w-24 hidden md:table-cell">{currency.name}</TableCell>
                                    <TableCell className="w-10 hidden md:table-cell">{currency.code}</TableCell>
                                    <TableCell className="w-10 md:w-24 md:text-center">{currency.symbol}</TableCell>
                                    <TableCell className="w-32 md:text-center">{currency.exchange_rate}</TableCell>
                                    <TableCell className="w-10 md:w-24 md:text-center">
                                        <Badge variant={currency.is_active ? "default" : "destructive"}>
                                            {currency.is_active ? 'Active' : 'Inactive'}
                                        </Badge>
                                    </TableCell>
                                    <TableCell className="text-right p-0 pr-2">
                                        <div className="flex items-center justify-end gap-2">
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                onClick={() => handleEdit(currency)}
                                                aria-label="Edit currency"
                                            >
                                                <Pencil className="h-4 w-4" />
                                            </Button>
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                className="hover:text-destructive"
                                                onClick={() => handleDelete(currency)}
                                                aria-label="Delete currency"
                                            >
                                                <Trash className="h-4 w-4" />
                                            </Button>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    )}
                </Table>
            </ScrollArea>
        </div>
    );
}
