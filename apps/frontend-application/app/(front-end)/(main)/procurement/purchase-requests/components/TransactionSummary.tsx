import React, { useEffect, useState } from 'react'
import {
    Table,
    TableBody,
    TableCell,
    TableRow,
    TableHead,
    TableHeader,
} from "@/components/ui/table";
import { Skeleton } from '@/components/ui/skeleton';
interface TransactionItem {
    Label: string;
    localAmt: number;
}


const TransactionSummary = () => {
    const [data, setData] = useState<TransactionItem[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchTransactionSummary = async () => {
            try {
                setIsLoading(true);
                const response = await fetch('/api/procurement/purchase-requests/transaction-summary');

                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }

                const result = await response.json();
                setData(result.data);
            } catch (err) {
                console.error('Error fetching transaction summary:', err);
            } finally {
                setIsLoading(false);
            }
        };

        fetchTransactionSummary();
    }, []);

    if (isLoading) {
        return (
            <div className="space-y-3">
                <Skeleton className="h-8 w-full" />
                <Skeleton className="h-8 w-full" />
                <Skeleton className="h-8 w-full" />
            </div>
        )
    }

    return (
        <Table>
            <TableHeader>
                <TableRow className='text-xs'>
                    <TableHead className="font-bold whitespace-nowrap">Description</TableHead>
                    <TableHead className="text-right text-gray-500  whitespace-nowrap hidden md:table-cell">Base Amount USD</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {data.map((item) => (
                    <TableRow key={item.Label} className='text-xs'>
                        <TableCell className="whitespace-nowrap">{item.Label}</TableCell>

                        <TableCell className="hidden md:table-cell text-right  text-gray-500 whitespace-nowrap">
                            {item.localAmt.toFixed(2)}
                        </TableCell>
                    </TableRow>
                ))}
            </TableBody>
        </Table>
    )
}

export default TransactionSummary;