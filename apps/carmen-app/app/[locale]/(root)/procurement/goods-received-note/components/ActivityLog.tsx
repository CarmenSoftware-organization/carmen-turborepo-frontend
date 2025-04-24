import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"

const invoices = [
    {
        id: "INV001",
        date: "2023-01-15",
        user: "Daew",
        action: "Credit Card",
    },
    {
        id: "INV002",
        date: "2023-01-15",
        user: "Weng",
        action: "PayPal",
    },
    {
        id: "INV003",
        date: "2023-01-15",
        user: "P Aof",
        action: "Bank Transfer",
    },
    {
        id: "INV004",
        date: "2023-01-15",
        user: "P Oat",
        action: "Credit Card",
    },
]

export default function ActivityLog() {
    return (
        <Card className="p-4">
            <p className="font-semibold text-base mb-4">Activity Log</p>
            <Input className="h-7" placeholder="Search Activity log..." />
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead className="w-[100px]">Invoice</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Method</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {invoices.map((invoice) => (
                        <TableRow key={invoice.id}>
                            <TableCell className="font-medium">{invoice.date}</TableCell>
                            <TableCell>{invoice.user}</TableCell>
                            <TableCell>{invoice.action}</TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </Card>
    );
}
