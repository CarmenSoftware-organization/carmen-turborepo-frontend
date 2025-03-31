import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Table, TableCell, TableBody, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { mockItemDetailPrData } from "@/mock-data/procurement";
import { PlusIcon } from "lucide-react";
export default function ItemPr() {
    return (
        <div className="space-y-4">
            <div className="flex justify-end">
                <Button size={'sm'}>
                    <PlusIcon className="w-4 h-4" />
                    Add Item
                </Button>
            </div>
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Location</TableHead>
                        <TableHead>Product</TableHead>
                        <TableHead>
                            <p className="text-xs">Order unit</p>
                            <Separator />
                            <p className="text-xs">Inventory unit</p>
                        </TableHead>
                        <TableHead>
                            <p className="text-xs">Request</p>
                            <Separator />
                            <p className="text-xs">On Order</p>
                        </TableHead>
                        <TableHead>
                            <p className="text-xs">Approved</p>
                            <Separator />
                            <p className="text-xs">On Hand</p>
                        </TableHead>
                        <TableHead>Base Currency</TableHead>
                        <TableHead>Price</TableHead>
                        <TableHead>Total Price</TableHead>
                        <TableHead>Status</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {mockItemDetailPrData.map((item) => (
                        <TableRow key={item.id}>
                            <TableCell>{item.location}</TableCell>
                            <TableCell>
                                <div className="flex flex-col gap-1">
                                    <span className="text-xs font-medium">{item.product_name}</span>
                                    <span className="text-xs text-muted-foreground">{item.description}</span>
                                </div>
                            </TableCell>
                            <TableCell>
                                <div className="flex flex-col">
                                    <span className="text-xs font-medium">{item.order_unit}</span>
                                    <span className="text-xs text-muted-foreground">{item.inv_unit}</span>
                                </div>
                            </TableCell>
                            <TableCell>
                                <div className="flex flex-col">
                                    <span className="text-xs font-medium">{item.request_qty}</span>
                                    <span className="text-xs text-muted-foreground">{item.on_order_qty}</span>
                                </div>
                            </TableCell>
                            <TableCell>
                                <div className="flex flex-col">
                                    <span className="text-xs font-medium">{item.approved_qty}</span>
                                    <span className="text-xs text-muted-foreground">{item.on_hand_qty}</span>
                                </div>
                            </TableCell>
                            <TableCell>{item.base_currency}</TableCell>
                            <TableCell>{item.price}</TableCell>
                            <TableCell>{item.total_price}</TableCell>
                            <TableCell>
                                <Badge variant={'outline'}>{item.status}</Badge>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </div>
    )
}

