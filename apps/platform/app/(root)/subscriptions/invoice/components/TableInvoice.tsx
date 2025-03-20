import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Table, TableHeader, TableRow, TableHead, TableCell, TableBody } from "@/components/ui/table";
import { mockInvoices } from "@/mock-data/subscription";
import { Download, File } from "lucide-react";

export default function TableInvoice() {
    return (
        <Table>
            <TableHeader>
                <TableRow>
                    <TableHead>Invoice</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Hotel</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {mockInvoices.map((invoice) => (
                    <TableRow key={invoice.id}>
                        <TableCell>{invoice.invoice_number}</TableCell>
                        <TableCell>{invoice.date}</TableCell>
                        <TableCell>{invoice.hotel_name}</TableCell>
                        <TableCell>{invoice.amount}</TableCell>
                        <TableCell>
                            <Badge variant={'default'}>{invoice.status}</Badge>
                        </TableCell>
                        <TableCell className="flex">
                            <Button variant={'ghost'} size={'sm'}>
                                <Download className="w-4 h-4" />
                            </Button>
                            <Button variant={'ghost'} size={'sm'}>
                                <File className="w-4 h-4" />
                            </Button>
                        </TableCell>
                    </TableRow>
                ))}
            </TableBody>
        </Table>
    )
}
