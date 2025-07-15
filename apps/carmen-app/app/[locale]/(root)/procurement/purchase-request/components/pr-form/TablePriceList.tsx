import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { mockPricelistItems } from "./mock-budget";
import { ScrollArea } from "@/components/ui/scroll-area";

export default function TablePriceList() {
    return (
        <Table>
            <TableHeader>
                <TableRow>
                    <TableHead>#</TableHead>
                    <TableHead>Vendor</TableHead>
                    <TableHead>Preferred</TableHead>
                    <TableHead>Rating</TableHead>
                    <TableHead>Description</TableHead>
                    <TableHead className="text-center w-[150px]">Valid Period</TableHead>
                    <TableHead># Price List</TableHead>
                    <TableHead>Currency</TableHead>
                    <TableHead>Unit Price</TableHead>
                    <TableHead>Min Qty</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {mockPricelistItems.map((item, index) => (
                    <TableRow key={item.id}>
                        <TableCell>{index + 1}</TableCell>
                        <TableCell>{item.vendor_name}</TableCell>
                        <TableCell>{item.preferred ? "Yes" : "No"}</TableCell>
                        <TableCell>{item.rating}</TableCell>
                        <TableCell>{item.description}</TableCell>
                        <TableCell>
                            <div className="flex flex-col items-center text-xs">
                                <p>{item.start_date}</p>
                                <p>to</p>
                                <p>{item.end_date}</p>
                            </div>
                        </TableCell>
                        <TableCell>{item.pl_no}</TableCell>
                        <TableCell>{item.currency}</TableCell>
                        <TableCell>{item.price} {item.unit}</TableCell>
                        <TableCell>
                            <div className="flex items-center text-xs gap-1">
                                <p>{item.min_qty}</p>
                                <p>{item.base_unit}</p>
                            </div>
                            <p className="text-xs text-blue-500">{item.expire_date} days</p>
                        </TableCell>
                    </TableRow>
                ))}
            </TableBody>

        </Table>
    );
}