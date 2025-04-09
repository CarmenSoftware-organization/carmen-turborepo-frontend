import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { PurchaseOrderlDto } from "@/dtos/procurement.dto";
import { Eye, Pencil, Trash } from "lucide-react";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { useTranslations } from "next-intl";
import { Checkbox } from "@/components/ui/checkbox";
import { useState } from "react";

interface PurchaseOrderListProps {
    readonly purchaseOrders: PurchaseOrderlDto[];
}

const poStatusColor = (status: string) => {
    if (status === 'Pending') {
        return 'bg-yellow-100 text-yellow-800';
    } else if (status === 'Approved') {
        return 'bg-green-100 text-green-800';
    } else if (status === 'Rejected') {
        return 'bg-red-100 text-red-800';
    } else {
        return 'bg-blue-100 text-blue-800';
    }
}

export default function PurchaseOrderList({ purchaseOrders }: PurchaseOrderListProps) {
    const t = useTranslations('TableHeader');
    const [selectedItems, setSelectedItems] = useState<string[]>([]);


    const handleSelectItem = (id: string) => {
        setSelectedItems(prev =>
            prev.includes(id)
                ? prev.filter(item => item !== id)
                : [...prev, id]
        );
    };

    const handleSelectAll = () => {
        if (selectedItems.length === purchaseOrders.length) {
            // If all items are selected, unselect all
            setSelectedItems([]);
        } else {
            // Otherwise, select all items
            const allIds = purchaseOrders.map(po => po.id ?? '').filter(Boolean);
            setSelectedItems(allIds);
        }
    };

    const isAllSelected = purchaseOrders.length > 0 && selectedItems.length === purchaseOrders.length;

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
                            <TableHead>{t('po_number')}</TableHead>
                            <TableHead>{t('vendor')}</TableHead>
                            <TableHead>{t('date')}</TableHead>
                            <TableHead>{t('delivery_date')}</TableHead>
                            <TableHead>{t('currency')}</TableHead>
                            <TableHead>{t('net_amount')}</TableHead>
                            <TableHead>{t('tax_amount')}</TableHead>
                            <TableHead>{t('amount')}</TableHead>
                            <TableHead>{t('status')}</TableHead>
                            <TableHead className="w-[100px] text-right">{t('action')}</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {purchaseOrders.map((po) => (
                            <TableRow key={po.id}>
                                <TableCell className="text-center w-10">
                                    <Checkbox
                                        id={`checkbox-${po.id}`}
                                        checked={selectedItems.includes(po.id ?? '')}
                                        onCheckedChange={() => handleSelectItem(po.id ?? '')}
                                        aria-label={`Select ${po.po_number}`}
                                    />
                                </TableCell>
                                <TableCell className="font-medium">{po.po_number}</TableCell>
                                <TableCell>{po.vendor}</TableCell>
                                <TableCell>{po.date_created}</TableCell>
                                <TableCell>{po.delivery_date}</TableCell>
                                <TableCell>{po.currency}</TableCell>
                                <TableCell>{po.net_amount.toLocaleString('en-US', { style: 'currency', currency: 'USD' })}</TableCell>
                                <TableCell>{po.tax_amount.toLocaleString('en-US', { style: 'currency', currency: 'USD' })}</TableCell>
                                <TableCell>{po.amount.toLocaleString('en-US', { style: 'currency', currency: 'USD' })}</TableCell>
                                <TableCell>
                                    <Badge variant="outline" className={`${poStatusColor(po.status)} rounded-full`}>
                                        {po.status}
                                    </Badge>
                                </TableCell>
                                <TableCell>
                                    <div className="flex items-center justify-end">
                                        <Button variant="ghost" size={'sm'}>
                                            <Eye className="h-4 w-4" />
                                        </Button>
                                        <Button variant="ghost" size={'sm'}>
                                            <Pencil className="h-4 w-4" />
                                        </Button>
                                        <Button variant="ghost" size={'sm'}>
                                            <Trash className="h-4 w-4 text-destructive" />
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
                {purchaseOrders.map((po) => (
                    <Card key={po.id} className="transition-all duration-200 hover:shadow-lg hover:border-primary/50">
                        <CardHeader className="p-4">
                            <div className="flex justify-between items-start">
                                <div className="flex items-center gap-2">
                                    <Checkbox
                                        id={`mobile-checkbox-${po.id}`}
                                        checked={selectedItems.includes(po.id ?? '')}
                                        onCheckedChange={() => handleSelectItem(po.id ?? '')}
                                        aria-label={`Select ${po.po_number}`}
                                        className="mt-1"
                                    />
                                    <div className="flex items-center gap-2">
                                        <span className="text-xs text-muted-foreground">{po.po_number}</span>
                                        <Badge variant="outline" className={`${poStatusColor(po.status)} rounded-full`}>
                                            {po.status}
                                        </Badge>
                                    </div>
                                </div>
                                <div className="flex items-center gap-1">
                                    <Button variant="ghost" size={'sm'} className="h-8 w-8 hover:bg-accent">
                                        <Eye className="h-4 w-4" />
                                    </Button>
                                    <Button variant="ghost" size={'sm'} className="h-8 w-8 hover:bg-accent">
                                        <Pencil className="h-4 w-4" />
                                    </Button>
                                    <Button variant="ghost" size={'sm'} className="h-8 w-8 hover:bg-destructive/10 hover:text-destructive">
                                        <Trash className="h-4 w-4" />
                                    </Button>
                                </div>
                            </div>
                        </CardHeader>
                        <CardContent className="p-4 pt-0">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-1">
                                    <p className="text-xs text-muted-foreground">{t('date')}</p>
                                    <p className="text-xs font-medium">{po.date_created}</p>
                                </div>
                                <div className="space-y-1">
                                    <p className="text-xs text-muted-foreground">{t('delivery_date')}</p>
                                    <p className="text-xs font-medium">{po.delivery_date}</p>
                                </div>
                                <div className="space-y-1">
                                    <p className="text-xs text-muted-foreground">{t('vendor')}</p>
                                    <p className="text-xs font-medium">{po.vendor}</p>
                                </div>
                                <div className="space-y-1">
                                    <p className="text-xs text-muted-foreground">{t('currency')}</p>
                                    <p className="text-xs font-medium">{po.currency}</p>
                                </div>
                                <div className="space-y-1">
                                    <p className="text-xs text-muted-foreground">{t('net_amount')}</p>
                                    <p className="text-xs font-medium">{po.net_amount}</p>
                                </div>
                                <div className="space-y-1">
                                    <p className="text-xs text-muted-foreground">{t('tax_amount')}</p>
                                    <p className="text-xs font-medium">{po.tax_amount}</p>
                                </div>
                                <div className="space-y-1">
                                    <p className="text-xs text-muted-foreground">{t('amount')}</p>
                                    <p className="text-xs font-medium">{po.amount}</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>
    )
} 