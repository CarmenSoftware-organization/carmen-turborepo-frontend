import { CreditNoteDto } from "@/dtos/procurement.dto";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Eye, SquarePen, Trash } from "lucide-react";
import { useState } from "react";
import { Checkbox } from "@/components/ui/checkbox";

const creditNoteStatusColor = (status: string) => {
    if (status === 'Pending') {
        return 'bg-yellow-100 text-yellow-800';
    } else if (status === 'Draft') {
        return 'bg-blue-100 text-blue-800';
    } else if (status === 'Rejected') {
        return 'bg-red-100 text-red-800';
    } else if (status === 'Approved') {
        return 'bg-green-100 text-green-800';
    }
}

interface CreditNoteListProps {
    readonly creditNotes: CreditNoteDto[];
}

export default function CreditNoteList({ creditNotes }: CreditNoteListProps) {

    const [selectedItems, setSelectedItems] = useState<string[]>([]);

    const handleSelectItem = (id: string) => {
        setSelectedItems(prev =>
            prev.includes(id)
                ? prev.filter(item => item !== id)
                : [...prev, id]
        );
    };

    const handleSelectAll = () => {
        if (selectedItems.length === creditNotes.length) {
            // If all items are selected, unselect all
            setSelectedItems([]);
        } else {
            // Otherwise, select all items
            const allIds = creditNotes.map(cn => cn.id ?? '').filter(Boolean);
            setSelectedItems(allIds);
        }
    };

    const isAllSelected = creditNotes.length > 0 && selectedItems.length === creditNotes.length;
    return (
        <div className="space-y-4">
            {/* Desktop Table View */}
            <div className="hidden md:block">
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
                            <TableHead>Reference #</TableHead>
                            <TableHead>Description</TableHead>
                            <TableHead>Date</TableHead>
                            <TableHead>Vendor</TableHead>
                            <TableHead>Doc #</TableHead>
                            <TableHead>Doc Date</TableHead>
                            <TableHead>Net Amount</TableHead>
                            <TableHead>Tax Amount</TableHead>
                            <TableHead>Total Amount</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead className="text-right">Action</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {creditNotes.map((cn) => (
                            <TableRow key={cn.id}>
                                <TableCell className="text-center w-10">
                                    <Checkbox
                                        id={`checkbox-${cn.id}`}
                                        checked={selectedItems.includes(cn.id ?? '')}
                                        onCheckedChange={() => handleSelectItem(cn.id ?? '')}
                                        aria-label={`Select ${cn.cdn_number}`}
                                    />
                                </TableCell>
                                <TableCell className="font-medium">{cn.cdn_number}</TableCell>
                                <TableCell>{cn.title}</TableCell>
                                <TableCell>{cn.date_created}</TableCell>
                                <TableCell>{cn.vendor}</TableCell>
                                <TableCell>{cn.doc_no}</TableCell>
                                <TableCell>{cn.doc_date}</TableCell>
                                <TableCell>{cn.net_amount.toLocaleString('en-US', { style: 'currency', currency: 'USD' })}</TableCell>
                                <TableCell>{cn.tax_amount.toLocaleString('en-US', { style: 'currency', currency: 'USD' })}</TableCell>
                                <TableCell>{cn.amount.toLocaleString('en-US', { style: 'currency', currency: 'USD' })}</TableCell>
                                <TableCell>
                                    <Badge variant="outline" className={`${creditNoteStatusColor(cn.status)} rounded-full`}>
                                        {cn.status}
                                    </Badge>
                                </TableCell>
                                <TableCell>
                                    <div className="flex items-center justify-end">
                                        <Button variant="ghost" size={'sm'} className="h-7 w-7">
                                            <Eye className="h-4 w-4" />
                                        </Button>
                                        <Button variant="ghost" size={'sm'} className="h-7 w-7">
                                            <SquarePen className="h-4 w-4" />
                                        </Button>
                                        <Button variant="ghost" size={'sm'} className="h-7 w-7 text-destructive hover:text-destructive/80">
                                            <Trash className="h-4 w-4" />
                                        </Button>
                                    </div>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>

            {/* Mobile Card View */}
            <div className="grid gap-4 md:hidden">
                <div className="flex items-center justify-between">
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={handleSelectAll}
                    >
                        {isAllSelected ? 'Unselect All' : 'Select All'}
                    </Button>
                    {selectedItems.length > 0 && (
                        <span className="text-xs text-muted-foreground">
                            {selectedItems.length} Items Selected
                        </span>
                    )}
                </div>
                {creditNotes.map((cn) => (
                    <Card key={cn.id} className="transition-all duration-200 hover:shadow-lg hover:border-primary/50">
                        <CardHeader className="p-4">
                            <div className="flex justify-between items-start">

                                <div className="flex items-center gap-2">
                                    <Checkbox
                                        id={`mobile-checkbox-${cn.id}`}
                                        checked={selectedItems.includes(cn.id ?? '')}
                                        onCheckedChange={() => handleSelectItem(cn.id ?? '')}
                                        aria-label={`Select ${cn.cdn_number}`}
                                        className="mt-1"
                                    />
                                    <CardTitle className="text-base">{cn.cdn_number}</CardTitle>
                                    <Badge variant="outline" className={`${creditNoteStatusColor(cn.status)} rounded-full`}>
                                        {cn.status}
                                    </Badge>
                                </div>
                                <div className="flex items-center">
                                    <Button variant="ghost" size={'sm'} className="h-7 w-7">
                                        <Eye className="h-4 w-4" />
                                    </Button>
                                    <Button variant="ghost" size={'sm'} className="h-7 w-7">
                                        <SquarePen className="h-4 w-4" />
                                    </Button>
                                    <Button variant="ghost" size={'sm'} className="h-7 w-7 text-destructive hover:text-destructive/80">
                                        <Trash className="h-4 w-4" />
                                    </Button>
                                </div>
                            </div>
                        </CardHeader>
                        <CardContent className="p-4 pt-0">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-1">
                                    <p className="text-sm text-muted-foreground">Title</p>
                                    <p className="text-sm font-medium">{cn.title}</p>
                                </div>
                                <div className="space-y-1">
                                    <p className="text-sm text-muted-foreground">Date Created</p>
                                    <p className="text-sm font-medium">{cn.date_created}</p>
                                </div>
                                <div className="space-y-1">
                                    <p className="text-sm text-muted-foreground">Vendor</p>
                                    <p className="text-sm font-medium">{cn.vendor}</p>
                                </div>
                                <div className="space-y-1">
                                    <p className="text-sm text-muted-foreground">Document No.</p>
                                    <p className="text-sm font-medium">{cn.doc_no}</p>
                                </div>
                                <div className="space-y-1">
                                    <p className="text-sm text-muted-foreground">Document Date</p>
                                    <p className="text-sm font-medium">{cn.doc_date}</p>
                                </div>
                                <div className="space-y-1">
                                    <p className="text-sm text-muted-foreground">Net Amount</p>
                                    <p className="text-sm font-medium">{cn.net_amount.toLocaleString('en-US', { style: 'currency', currency: 'USD' })}</p>
                                </div>
                                <div className="space-y-1">
                                    <p className="text-sm text-muted-foreground">Tax Amount</p>
                                    <p className="text-sm font-medium">{cn.tax_amount.toLocaleString('en-US', { style: 'currency', currency: 'USD' })}</p>
                                </div>
                                <div className="space-y-1">
                                    <p className="text-sm text-muted-foreground">Amount</p>
                                    <p className="text-sm font-medium">{cn.amount.toLocaleString('en-US', { style: 'currency', currency: 'USD' })}</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>
    )
} 