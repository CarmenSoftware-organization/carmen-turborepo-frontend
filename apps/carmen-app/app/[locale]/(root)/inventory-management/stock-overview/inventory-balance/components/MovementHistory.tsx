import {
    InventoryBalanceItemDto,
    mockMovementHistoryList,
} from "@/mock-data/inventory-balance";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { useState } from "react";
import { ArrowDown, ArrowUp, ArrowRight } from "lucide-react";
import SummaryMovementHistoryCard from "./SummaryMovementHistoryCard";

export default function MovementHistory() {
    const [sortField, setSortField] = useState<keyof InventoryBalanceItemDto | null>(null);
    const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc");

    const handleSort = (field: keyof InventoryBalanceItemDto) => {
        if (sortField === field) {
            setSortDirection(sortDirection === "asc" ? "desc" : "asc");
        } else {
            setSortField(field);
            setSortDirection("asc");
        }
    };

    const getSortIcon = (field: keyof InventoryBalanceItemDto) => {
        if (sortField !== field) return <ArrowRight className="h-4 w-4 text-muted-foreground opacity-50" />;
        return sortDirection === "asc" ?
            <ArrowUp className="h-4 w-4 text-primary" /> :
            <ArrowDown className="h-4 w-4 text-primary" />;
    };

    const formatNumber = (num: number) => {
        return num.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
    };

    const formatDate = (dateStr: string) => {
        const date = new Date(dateStr);
        return new Intl.DateTimeFormat('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        }).format(date);
    };

    const sortedData = [...mockMovementHistoryList].sort((a, b) => {
        if (!sortField) return 0;

        let valueA, valueB;

        if (sortField === 'date') {
            valueA = a.date;
            valueB = b.date;
        } else if (sortField === 'time') {
            valueA = a.time;
            valueB = b.time;
        } else if (sortField === 'type') {
            valueA = a.type;
            valueB = b.type;
        } else if (sortField === 'product') {
            valueA = a.product.name;
            valueB = b.product.name;
        } else if (sortField === 'location') {
            valueA = a.location;
            valueB = b.location;
        } else if (sortField === 'quantity') {
            valueA = a.quantity.diff;
            valueB = b.quantity.diff;
        } else if (sortField === 'value') {
            valueA = a.value.diff;
            valueB = b.value.diff;
        } else {
            return 0;
        }

        if (valueA < valueB) return sortDirection === "asc" ? -1 : 1;
        if (valueA > valueB) return sortDirection === "asc" ? 1 : -1;
        return 0;
    });

    const getTypeColor = (type: string) => {
        switch (type) {
            case 'IN':
                return 'text-green-600 bg-green-50 border-green-200';
            case 'OUT':
                return 'text-red-600 bg-red-50 border-red-200';
            case 'ADJUSTMENT':
                return 'text-amber-600 bg-amber-50 border-amber-200';
            default:
                return 'text-slate-600 bg-slate-50 border-slate-200';
        }
    };

    return (
        <div className="space-y-4">
            <SummaryMovementHistoryCard />

            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead
                            className="w-[100px] cursor-pointer"
                            onClick={() => handleSort("date")}
                        >
                            <div className="fxr-c gap-1">
                                Date
                                {getSortIcon("date")}
                            </div>
                        </TableHead>
                        <TableHead
                            className="w-[80px] cursor-pointer"
                            onClick={() => handleSort("time")}
                        >
                            <div className="fxr-c gap-1">
                                Time
                                {getSortIcon("time")}
                            </div>
                        </TableHead>
                        <TableHead className="w-[100px]">Reference</TableHead>
                        <TableHead
                            className="cursor-pointer"
                            onClick={() => handleSort("product")}
                        >
                            <div className="fxr-c gap-1">
                                Product
                                {getSortIcon("product")}
                            </div>
                        </TableHead>
                        <TableHead
                            className="cursor-pointer"
                            onClick={() => handleSort("location")}
                        >
                            <div className="fxr-c gap-1">
                                Location
                                {getSortIcon("location")}
                            </div>
                        </TableHead>
                        <TableHead
                            className="w-[120px] cursor-pointer"
                            onClick={() => handleSort("type")}
                        >
                            <div className="fxr-c gap-1">
                                Type
                                {getSortIcon("type")}
                            </div>
                        </TableHead>
                        <TableHead>Reason</TableHead>
                        <TableHead
                            className="text-right cursor-pointer"
                            onClick={() => handleSort("quantity")}
                        >
                            <div className="fxr-c gap-1 justify-end">
                                Quantity
                                {getSortIcon("quantity")}
                            </div>
                        </TableHead>
                        <TableHead
                            className="text-right cursor-pointer"
                            onClick={() => handleSort("value")}
                        >
                            <div className="fxr-c gap-1 justify-end">
                                Value
                                {getSortIcon("value")}
                            </div>
                        </TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {sortedData.map((item) => (
                        <TableRow key={item.id}>
                            <TableCell>{formatDate(item.date)}</TableCell>
                            <TableCell>{item.time}</TableCell>
                            <TableCell>
                                <div className="flex flex-col">
                                    <span className="font-medium">{item.ref.code}</span>
                                    <span className="text-xs text-muted-foreground">{item.ref.no}</span>
                                </div>
                            </TableCell>
                            <TableCell>
                                <div className="flex flex-col">
                                    <span className="font-medium">{item.product.name}</span>
                                    <span className="text-xs text-muted-foreground">{item.product.code}</span>
                                </div>
                            </TableCell>
                            <TableCell>{item.location}</TableCell>
                            <TableCell>
                                <span className={`text-xs px-2 py-1 rounded-md border ${getTypeColor(item.type)}`}>
                                    {item.type}
                                </span>
                            </TableCell>
                            <TableCell>{item.reason}</TableCell>
                            <TableCell className="text-right">
                                <span className={item.quantity.diff >= 0 ? 'text-green-600' : 'text-red-600'}>
                                    {item.quantity.diff >= 0 ? '+' : ''}{formatNumber(item.quantity.diff)}
                                </span>
                            </TableCell>
                            <TableCell className="text-right">
                                <span className={item.value.diff >= 0 ? 'text-green-600' : 'text-red-600'}>
                                    {item.value.diff >= 0 ? '+' : ''}{formatNumber(item.value.diff)}
                                </span>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </div>
    );
}
