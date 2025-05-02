"use client";

import { StockMovementDto } from "@/dtos/store-operation.dto";
import { formType } from "@/dtos/form.dto";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Filter, Plus, Printer } from "lucide-react";
import SearchInput from "@/components/ui-custom/SearchInput";
import { useState } from "react";
import { Card } from "@/components/ui/card";

interface StockMovementProps {
    readonly items: StockMovementDto[];
    readonly mode: formType;
}

export default function StockMovement({ items, mode }: StockMovementProps) {
    const [search, setSearch] = useState('');
    return (
        <Card className="p-2 space-y-2">
            <div className="flex justify-between items-center p-2">
                <p className="text-base font-medium">Stock Movement</p>
                <div className="flex items-center gap-2">
                    <Button
                        type="button"
                        variant="outline"
                        size="sm"
                    >
                        <Filter />
                        Filter
                    </Button>
                    <Button
                        type="button"
                        variant="outline"
                        size="sm"
                    >
                        <Printer />
                        Print
                    </Button>
                    <Button
                        type="button"
                        size="sm"
                        disabled={mode === formType.VIEW}
                    >
                        <Plus />
                        Add Movement
                    </Button>
                </div>
            </div>
            <SearchInput
                defaultValue={search}
                onSearch={setSearch}
                placeholder="Search Stock Movement..."
                data-id="grn-list-search-input"
            />

            <Table className="border">
                <TableHeader className="bg-muted">
                    <TableRow>
                        <TableHead>Location</TableHead>
                        <TableHead>Product</TableHead>
                        <TableHead>Lot No.</TableHead>
                        <TableHead>Unit</TableHead>
                        <TableHead>Stock In</TableHead>
                        <TableHead>Stock Out</TableHead>
                        <TableHead>Unit Cost</TableHead>
                        <TableHead>Total Cost</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {items.map((item) => (
                        <TableRow key={item.id}>
                            <TableCell>
                                <div className="flex flex-col gap-1">
                                    <p className="text-xs font-medium">{item.location}</p>
                                    <p className="text-xs text-muted-foreground">{item.location_code}</p>
                                </div>
                            </TableCell>
                            <TableCell>{item.product_name}</TableCell>
                            <TableCell>{item.lot_no}</TableCell>
                            <TableCell>{item.unit}</TableCell>
                            <TableCell>{item.stock_in}</TableCell>
                            <TableCell>{item.stock_out}</TableCell>
                            <TableCell>{item.unit_cost}</TableCell>
                            <TableCell>{item.total_cost}</TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </Card>
    )
}
