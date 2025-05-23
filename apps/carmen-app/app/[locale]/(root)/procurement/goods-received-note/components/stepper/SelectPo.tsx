"use client";

import { NewPoDto } from "../../type.dto";
import { Checkbox } from "@/components/ui/checkbox";
import { useMemo, useCallback, useState } from "react";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import SearchInput from "@/components/ui-custom/SearchInput";
import { Button } from "@/components/ui/button";

interface SelectPoProps {
    readonly po: NewPoDto[];
    readonly selectedPo: NewPoDto[];
    readonly onPoSelect: (po: NewPoDto[]) => void;
    readonly selectedVendor: string;
    readonly onNext?: () => void;
}

export default function SelectPo({ po, selectedPo, onPoSelect, selectedVendor, onNext }: SelectPoProps) {
    const [search, setSearch] = useState('');

    const isAllSelected = useMemo(() => selectedPo.length === po.length, [selectedPo.length, po.length]);

    const handlePoToggle = useCallback((po: NewPoDto) => {
        const isSelected = selectedPo.some(p => p.id === po.id);
        const newSelected = isSelected
            ? selectedPo.filter(p => p.id !== po.id)
            : [...selectedPo, po];
        onPoSelect(newSelected);
    }, [selectedPo, onPoSelect]);

    const handleSelectAll = useCallback(() => {
        const newSelected = isAllSelected ? [] : [...po];
        onPoSelect(newSelected);
    }, [isAllSelected, po, onPoSelect]);

    return (
        <Card>
            <CardHeader>
                <CardTitle>Select Purchase Order</CardTitle>
                <CardDescription>Select POs from vendor: <span className="font-bold underline">{selectedVendor}</span></CardDescription>
                <SearchInput
                    defaultValue={search}
                    onSearch={setSearch}
                    placeholder="Search Purchase Order..."
                    data-id="grn-list-search-input"
                />
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
                            <TableHead>PO Number</TableHead>
                            <TableHead>Pr Reference(s)</TableHead>
                            <TableHead>Order Date</TableHead>
                            <TableHead>Items</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead>Total Amount</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {po.map((po) => {
                            const isSelected = selectedPo.some(p => p.id === po.id);
                            return (
                                <TableRow key={`${po.id}-${isSelected}`}>
                                    <TableCell>
                                        <Checkbox
                                            id={`po-${po.id}`}
                                            checked={isSelected}
                                            onCheckedChange={() => handlePoToggle(po)}
                                        />
                                    </TableCell>
                                    <TableCell>{po.no}</TableCell>
                                    <TableCell>{po.pr_ref}</TableCell>
                                    <TableCell>{po.order_date}</TableCell>
                                    <TableCell>{po.items}</TableCell>
                                    <TableCell>{po.status}</TableCell>
                                    <TableCell>{po.total_amount}</TableCell>
                                </TableRow>
                            );
                        })}
                    </TableBody>
                </Table>
                <div className="mt-4 flex justify-end">
                    <Button
                        onClick={onNext}
                        disabled={selectedPo.length === 0}
                    >
                        Next
                    </Button>
                </div>
            </CardContent>
        </Card>
    )
}
