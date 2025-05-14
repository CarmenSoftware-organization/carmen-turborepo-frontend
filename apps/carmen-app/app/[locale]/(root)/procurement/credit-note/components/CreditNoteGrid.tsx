import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { useState } from "react";
import { CreditNoteDto } from "@/dtos/procurement.dto";
import { Badge } from "@/components/ui/badge";
import { FileText, SquarePen, Trash2 } from "lucide-react";
import { creditNoteStatusColor } from "./CreditNoteComponent";
import { ScrollArea } from "@/components/ui/scroll-area";

interface CreditNoteGridProps {
    readonly creditNotes: CreditNoteDto[];
}

export default function CreditNoteGrid({ creditNotes }: CreditNoteGridProps) {

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
            setSelectedItems([]);
        } else {
            const allIds = creditNotes.map(cn => cn.id ?? '').filter(Boolean);
            setSelectedItems(allIds);
        }
    };

    const isAllSelected = creditNotes.length > 0 && selectedItems.length === creditNotes.length;

    return (
        <div className="space-y-4">
            <div className="col-span-full flex items-center justify-between mb-4">
                <Button
                    variant="outline"
                    size="sm"
                    onClick={handleSelectAll}
                >
                    {isAllSelected ? 'Unselect All' : 'Select All'}
                </Button>
                {selectedItems.length > 0 && (
                    <span className="text-sm text-muted-foreground">
                        {selectedItems.length} Items Selected
                    </span>
                )}
            </div>
            <ScrollArea className="h-[calc(100vh-200px)]">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                    {creditNotes.map((cn) => (
                        <Card key={cn.id} className="transition-all duration-200 hover:shadow-lg hover:border-primary/50">
                            <CardHeader className="p-2 border-b bg-muted">
                                <div className="flex justify-between items-start">
                                    <div className="flex items-center gap-2">
                                        <Checkbox
                                            id={`grid-checkbox-${cn.id}`}
                                            checked={selectedItems.includes(cn.id ?? '')}
                                            onCheckedChange={() => handleSelectItem(cn.id ?? '')}
                                            aria-label={`Select ${cn.title}`}
                                            className="mt-1"
                                        />
                                        <div>
                                            <p className="text-sm font-semibold text-primary">{cn.cdn_number}</p>
                                            <p className="text-xs text-muted-foreground">{cn.date_created}</p>
                                        </div>
                                    </div>
                                    <Badge variant="outline" className={`${creditNoteStatusColor(cn.status)} rounded-full`}>
                                        {cn.status}
                                    </Badge>
                                </div>
                            </CardHeader>
                            <CardContent className="p-4 pt-2">
                                <div className="space-y-4">
                                    <div className="space-y-1">
                                        <p className="text-xs text-muted-foreground">Description</p>
                                        <p className="text-xs font-medium line-clamp-2">{cn.title}</p>
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="space-y-1">
                                            <p className="text-xs text-muted-foreground">Vendor</p>
                                            <p className="text-xs font-medium">{cn.vendor}</p>
                                        </div>
                                        <div className="space-y-1">
                                            <p className="text-xs text-muted-foreground">Doc #</p>
                                            <p className="text-xs font-medium">{cn.doc_no}</p>
                                        </div>
                                        <div className="space-y-1">
                                            <p className="text-xs text-muted-foreground">Doc Date</p>
                                            <p className="text-xs font-medium">{cn.doc_date}</p>
                                        </div>
                                        <div className="space-y-1">
                                            <p className="text-xs text-muted-foreground">Net Amount</p>
                                            <p className="text-xs font-medium">{cn.net_amount}</p>
                                        </div>
                                        <div className="space-y-1">
                                            <p className="text-xs text-muted-foreground">Tax Amount</p>
                                            <p className="text-xs font-medium">{cn.tax_amount}</p>
                                        </div>
                                        <div className="space-y-1">
                                            <p className="text-xs text-muted-foreground">Total Amount</p>
                                            <p className="text-xs font-medium">{cn.amount}</p>
                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                            <div className="flex items-center justify-end p-2 border-t bg-muted">
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    className="h-7 w-7"
                                    aria-label="View purchase request"
                                    data-id={`view-pr-${cn.id}`}
                                >
                                    <FileText className="h-4 w-4" />
                                </Button>
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    className="h-7 w-7"
                                    aria-label="Edit purchase request"
                                    data-id={`edit-pr-${cn.id}`}
                                >
                                    <SquarePen className="h-4 w-4" />
                                </Button>
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    className="h-7 w-7"
                                    aria-label="Delete purchase request"
                                    data-id={`delete-pr-${cn.id}`}
                                >
                                    <Trash2 />
                                </Button>
                            </div>
                        </Card>
                    ))}
                </div>
            </ScrollArea>
        </div>
    );
}
