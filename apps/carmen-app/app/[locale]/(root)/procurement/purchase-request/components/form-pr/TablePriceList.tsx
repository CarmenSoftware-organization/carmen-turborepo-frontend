import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ScrollArea } from "@/components/ui/scroll-area";
import { mockPricelistItems } from "./mock-budget";

export default function TablePriceList() {
    return (
        <div className="border rounded-lg">
            {/* Fixed Table Header */}
            <div className="border-b bg-muted/50">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead className="w-[50px]">#</TableHead>
                            <TableHead className="w-[120px]">Vendor</TableHead>
                            <TableHead className="w-[80px]">Preferred</TableHead>
                            <TableHead className="w-[80px]">Rating</TableHead>
                            <TableHead className="w-[200px]">Description</TableHead>
                            <TableHead className="w-[150px] text-center">Valid Period</TableHead>
                            <TableHead className="w-[100px]"># Price List</TableHead>
                            <TableHead className="w-[80px]">Currency</TableHead>
                            <TableHead className="w-[120px]">Unit Price</TableHead>
                            <TableHead className="w-[120px]">Min Qty</TableHead>
                        </TableRow>
                    </TableHeader>
                </Table>
            </div>

            {/* Scrollable Table Body */}
            <ScrollArea className="h-[200px]">
                <Table>
                    <TableBody>
                        {mockPricelistItems.map((item, index) => (
                            <TableRow key={item.id}>
                                <TableCell className="w-[50px]">{index + 1}</TableCell>
                                <TableCell className="w-[120px]">{item.vendor_name}</TableCell>
                                <TableCell className="w-[80px]">{item.preferred ? "Yes" : "No"}</TableCell>
                                <TableCell className="w-[80px]">{item.rating}</TableCell>
                                <TableCell className="w-[200px]">
                                    <div className="flex flex-col gap-1">
                                        <p className="text-xs font-semibold">{item.products}</p>
                                        <p className="text-xs text-muted-foreground">{item.description}</p>
                                    </div>
                                </TableCell>
                                <TableCell className="w-[150px]">
                                    <div className="flex flex-col items-center text-xs">
                                        <p className="text-xs font-semibold">{item.start_date}</p>
                                        <p className="text-xs text-muted-foreground">to</p>
                                        <p className="text-xs font-semibold">{item.end_date}</p>
                                    </div>
                                </TableCell>
                                <TableCell className="w-[100px]">{item.pl_no}</TableCell>
                                <TableCell className="w-[80px]">{item.currency}</TableCell>
                                <TableCell className="w-[120px]">{item.price} {item.unit}</TableCell>
                                <TableCell className="w-[120px]">
                                    <div className="fxr-c text-xs gap-1">
                                        <p>{item.min_qty}</p>
                                        <p>{item.base_unit}</p>
                                    </div>
                                    <p className="text-xs text-blue-500">{item.expire_date} days</p>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </ScrollArea>
        </div>
    );
}