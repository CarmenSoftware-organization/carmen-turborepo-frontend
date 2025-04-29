import { NewItemDto } from "../../type.dto";
import { Checkbox } from "@/components/ui/checkbox";
import { useMemo, useCallback } from "react";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

interface SelectItemAndLocationProps {
    readonly items: NewItemDto[];
    readonly selectedItems: NewItemDto[];
    readonly onItemSelect: (items: NewItemDto[]) => void;
    readonly onQtyChange: (itemId: string, value: string) => void;
    readonly vendorName: string;
    readonly poNo: string;
}

export default function SelectItemAndLocation({ items, selectedItems, onItemSelect, onQtyChange, vendorName, poNo }: SelectItemAndLocationProps) {
    const isAllSelected = useMemo(() => selectedItems.length === items.length, [selectedItems.length, items.length]);

    const handleItemToggle = useCallback((item: NewItemDto) => {
        const isSelected = selectedItems.some(i => i.id === item.id);
        const newSelected = isSelected
            ? selectedItems.filter(i => i.id !== item.id)
            : [...selectedItems, item];
        onItemSelect(newSelected);
    }, [selectedItems, onItemSelect]);

    const handleSelectAll = useCallback(() => {
        const newSelected = isAllSelected ? [] : [...items];
        onItemSelect(newSelected);
    }, [isAllSelected, items, onItemSelect]);

    return (
        <Card>
            <CardHeader>
                <CardTitle>Select Items and Locations</CardTitle>
                <CardDescription>
                    <div className="flex gap-2">
                        <p>Select items from PO: <span className="font-bold underline">{poNo}</span></p>
                        <p>from vendor: <span className="font-bold underline">{vendorName}</span></p>
                    </div>
                </CardDescription>
            </CardHeader>
            <CardContent>
                <Table className="border">
                    <TableHeader className="bg-muted">
                        <TableRow>
                            <TableHead className="w-[50px]">
                                <Checkbox
                                    id="select-all"
                                    checked={isAllSelected}
                                    onCheckedChange={handleSelectAll}
                                />
                            </TableHead>
                            <TableHead>Name</TableHead>
                            <TableHead>Description</TableHead>
                            <TableHead>Location</TableHead>
                            <TableHead>PO No.</TableHead>
                            <TableHead>Ordered</TableHead>
                            <TableHead>Received</TableHead>
                            <TableHead>Remaining</TableHead>
                            <TableHead>Receive Qty</TableHead>
                            <TableHead>Unit</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {items.map((item) => {
                            const isSelected = selectedItems.some(i => i.id === item.id);
                            return (
                                <TableRow key={`${item.id}-${isSelected}`}>
                                    <TableCell>
                                        <Checkbox
                                            id={`item-${item.id}`}
                                            checked={isSelected}
                                            onCheckedChange={() => handleItemToggle(item)}
                                        />
                                    </TableCell>
                                    <TableCell>{item.name}</TableCell>
                                    <TableCell>{item.description}</TableCell>
                                    <TableCell>{item.location}</TableCell>
                                    <TableCell>{item.po_no}</TableCell>
                                    <TableCell>{item.ordered}</TableCell>
                                    <TableCell>{item.received}</TableCell>
                                    <TableCell>{item.remaining_qty}</TableCell>
                                    <TableCell>
                                        <Input
                                            type="number"
                                            className="w-20"
                                            value={item.received_qty}
                                            onChange={(e) => onQtyChange(item.id, e.target.value)}
                                        />
                                    </TableCell>
                                    <TableCell>{item.unit}</TableCell>
                                </TableRow>
                            );
                        })}
                    </TableBody>
                </Table>
            </CardContent>
        </Card>
    )
}
