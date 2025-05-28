"use client";

import { TableBodySkeleton } from "@/components/loading/TableBodySkeleton";
import { CreditTermGetAllDto } from "@/dtos/credit-term.dto";
import { useState } from "react";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { FileText, SquarePen, Trash2 } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";

interface CreditTermListProps {
    readonly creditTerms: CreditTermGetAllDto[];
    readonly isLoading: boolean;
}

export default function CreditTermList({ creditTerms, isLoading }: CreditTermListProps) {

    const [selectedItems, setSelectedItems] = useState<string[]>([]);

    const handleSelectItem = (id: string) => {
        setSelectedItems(prev =>
            prev.includes(id)
                ? prev.filter(item => item !== id)
                : [...prev, id]
        );
    };

    const handleSelectAll = () => {
        if (selectedItems.length === creditTerms.length) {
            // If all items are selected, unselect all
            setSelectedItems([]);
        } else {
            // Otherwise, select all items
            const allIds = creditTerms.map(ct => ct.id ?? '').filter(Boolean);
            setSelectedItems(allIds);
        }
    };

    const isAllSelected = creditTerms.length > 0 && selectedItems.length === creditTerms.length;

    if (isLoading) {
        return <TableBodySkeleton rows={7} />
    }

    return (
        <div className="space-y-4">
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead className="w-10 text-center">
                            <Checkbox
                                id="select-all"
                                checked={isAllSelected}
                                onCheckedChange={handleSelectAll}
                                aria-label="Select all purchase requests"
                            />
                        </TableHead>
                        <TableHead>Name</TableHead>
                        <TableHead>Value</TableHead>
                        <TableHead>Description</TableHead>
                        <TableHead>Note</TableHead>
                        <TableHead>Info</TableHead>
                        <TableHead>Is Active</TableHead>
                        <TableHead>Actions</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {creditTerms?.map(creditTerm => (
                        <TableRow key={creditTerm.id}>
                            <TableCell className="text-center">
                                <Checkbox
                                    id={creditTerm.id}
                                    checked={selectedItems.includes(creditTerm.id ?? '')}
                                    onCheckedChange={() => handleSelectItem(creditTerm.id ?? '')}
                                />
                            </TableCell>
                            <TableCell>{creditTerm.name}</TableCell>
                            <TableCell>{creditTerm.value}</TableCell>
                            <TableCell>{creditTerm.description}</TableCell>
                            <TableCell>{creditTerm.note}</TableCell>
                            <TableCell>{creditTerm.info}</TableCell>
                            <TableCell>
                                <Badge variant={creditTerm.is_active ? 'active' : 'inactive'}>
                                    {creditTerm.is_active ? 'Active' : 'Inactive'}
                                </Badge>
                            </TableCell>
                            <TableCell>
                                <Button variant="ghost" size="sm" className="w-7 h-7">
                                    <FileText />
                                </Button>
                                <Button variant="ghost" size="sm" className="w-7 h-7">
                                    <SquarePen />
                                </Button>
                                <Button variant="ghost" size="sm" className="w-7 h-7">
                                    <Trash2 />
                                </Button>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </div>
    );
}
