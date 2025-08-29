"use client";

import { useState } from "react";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { ProductPriceListCompareDto } from "@/dtos/price-list.dto";
import { mockProductPriceListCompare } from "@/mock-data/priceList";
import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableFooter,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { formatDate } from "date-fns";
import { formatDateFns } from "@/utils/config-system";
import { useAuth } from "@/context/AuthContext";
import { Card } from "@/components/ui/card";
import { Clock10 } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface Props {
    req_qty: number;
    req_unit: string;
    apv_qty: number;
    apv_unit: string;
    pricelist_detail_id?: string;
    itemId: string; // เพิ่ม itemId เพื่อระบุ purchase item ที่ต้องการ update
    onItemUpdate: (itemId: any, fieldName: string, value: any, selectedProduct?: any) => void;
}

export default function VendorComparison(
    {
        req_qty,
        req_unit,
        apv_qty,
        apv_unit,
        pricelist_detail_id,
        itemId,
        onItemUpdate
    }: Props
) {
    const { dateFormat } = useAuth();
    const [selectedVendorId, setSelectedVendorId] = useState<string | null>(null);
    const [isOpen, setIsOpen] = useState(false);

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger
                className="hover:bg-transparent text-primary hover:text-primary/70 text-sm font-semibold pr-4"
                onClick={() => setIsOpen(true)}
            >
                Compare
            </DialogTrigger>
            <DialogContent className="max-w-6xl">
                <DialogHeader>
                    <DialogTitle>Vendor Comparison</DialogTitle>
                </DialogHeader>
                <Card className="p-2 space-y-2">
                    <div className="flex items-center justify-between gap-2">
                        <div>
                            <p className="text-sm font-semibold">Professional Stand Mixer</p>
                            <p className="text-xs">Heavy-duty commercial stand mixer, 20 quart capacity</p>
                        </div>
                        <Badge variant={'outline'}>Status</Badge>
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                        <div className="text-right p-2 border border-border rounded-md">
                            <p className="text-xs text-muted-foreground">Requested</p>
                            <p className="text-xs">{req_qty} {req_unit}</p>
                        </div>
                        <div className="text-right p-2 border border-border rounded-md">
                            <p className="text-xs text-muted-foreground">Approved</p>
                            <p className="text-xs">{apv_qty} {apv_unit}</p>
                        </div>
                    </div>
                </Card>
                <Card className="p-2 space-y-2">
                    <div className="flex items-center gap-2">
                        <Clock10 className="w-4 h-4" />
                        <p className="text-sm font-semibold">Purchase History</p>
                    </div>
                    <div className="grid grid-cols-4 gap-2">
                        <div className="text-right p-2 border border-border rounded-md">
                            <p className="text-xs text-muted-foreground">Last Vendor</p>
                            <p className="text-xs">Seasonal Gourmet Supplies</p>
                        </div>
                        <div className="text-right p-2 border border-border rounded-md">
                            <p className="text-xs text-muted-foreground">Last Purchase Date</p>
                            <p className="text-xs">2025-08-29</p>
                        </div>
                        <div className="text-right p-2 border border-border rounded-md">
                            <p className="text-xs text-muted-foreground">Last Price</p>
                            <p className="text-xs">100,000.00</p>
                        </div>
                        <div className="text-right p-2 border border-border rounded-md">
                            <p className="text-xs text-muted-foreground">Unit</p>
                            <p className="text-xs">KG</p>
                        </div>
                    </div>
                </Card>
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead></TableHead>
                            <TableHead>Vendor</TableHead>
                            <TableHead>Preferred</TableHead>
                            <TableHead>Rating</TableHead>
                            <TableHead>Description</TableHead>
                            <TableHead>Pricelist #</TableHead>
                            <TableHead className="text-center">Valid Period</TableHead>
                            <TableHead className="text-center">Currency</TableHead>
                            <TableHead className="text-right">Unit Price</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {mockProductPriceListCompare.map((item: ProductPriceListCompareDto) => (
                            <TableRow key={item.pricelist_detail_id}>
                                <TableCell>
                                    <Checkbox
                                        checked={selectedVendorId === item.pricelist_detail_id}
                                        onCheckedChange={() => setSelectedVendorId(item.pricelist_detail_id)}
                                    />
                                </TableCell>
                                <TableCell className="font-medium">{item.vendor_name}</TableCell>
                                <TableCell>{item.is_prefer ? 'Yes' : 'No'}</TableCell>
                                <TableCell>{item.rating}</TableCell>
                                <TableCell className="whitespace-normal">
                                    <div className="flex flex-col w-40">
                                        <p className="truncate">{item.pricelist_name}</p>
                                        <p className="truncate text-xs">{item.pricelist_description}</p>
                                    </div>
                                </TableCell>
                                <TableCell>{item.pricelist_no}</TableCell>
                                <TableCell className="text-center">
                                    <div className="flex flex-col items-center">
                                        <p className="text-xs">{formatDateFns(item.valid_from, dateFormat || 'yyyy-MM-dd')}</p>
                                        <p className="text-xs">to</p>
                                        <p className="text-xs">{formatDateFns(item.valid_to, dateFormat || 'yyyy-MM-dd')}</p>
                                    </div>
                                </TableCell>
                                <TableCell className="text-center">{item.currency_code}</TableCell>
                                <TableCell className="text-right">{item.pricelist_price.toFixed(2)}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
                <div className="flex justify-end">
                    <Button
                        size={'sm'}
                        onClick={() => {
                            if (selectedVendorId) {
                                const selectedItem = mockProductPriceListCompare.find(item => item.pricelist_detail_id === selectedVendorId);
                                if (selectedItem) {
                                    onItemUpdate(itemId, 'pricelist_detail_id', selectedItem.pricelist_detail_id);
                                    onItemUpdate(itemId, 'vendor_id', selectedItem.vendor_id);
                                    onItemUpdate(itemId, 'vendor_name', selectedItem.vendor_name);
                                    onItemUpdate(itemId, 'pricelist_no', selectedItem.pricelist_no);
                                    onItemUpdate(itemId, 'pricelist_unit', selectedItem.pricelist_unit);
                                    onItemUpdate(itemId, 'pricelist_price', selectedItem.pricelist_price);
                                    onItemUpdate(itemId, 'discount_amount', selectedItem.discount_amount);
                                    onItemUpdate(itemId, 'tax_rate', selectedItem.tax_rate);
                                    onItemUpdate(itemId, 'currency_id', selectedItem.currency_id);
                                    onItemUpdate(itemId, 'currency_name', selectedItem.currency_name);
                                    onItemUpdate(itemId, 'currency_code', selectedItem.currency_code);
                                }
                            }
                            setSelectedVendorId(null);
                            setIsOpen(false);
                        }}
                        disabled={!selectedVendorId}
                    >
                        Select This Vendor
                    </Button>
                </div>

            </DialogContent>
        </Dialog>

    )
}