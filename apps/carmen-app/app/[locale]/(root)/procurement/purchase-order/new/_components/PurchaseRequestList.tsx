import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { PurchaseRequestDto } from "@/dtos/procurement.dto";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { useTranslations } from "next-intl";
import { useState } from "react";

interface PurchaseRequestListProps {
    readonly purchaseRequests: PurchaseRequestDto[];
}

export default function PurchaseRequestList({ purchaseRequests }: PurchaseRequestListProps) {
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
        if (selectedItems.length === purchaseRequests.length) {
            // If all items are selected, unselect all
            setSelectedItems([]);
        } else {
            // Otherwise, select all items
            const allIds = purchaseRequests.map(pr => pr.id ?? '').filter(Boolean);
            setSelectedItems(allIds);
        }
    };

    const isAllSelected = purchaseRequests.length > 0 && selectedItems.length === purchaseRequests.length;

    return (
        <div className="space-y-4">

            {/* <pre>{JSON.stringify(selectedItems, null, 2)}</pre> */}
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
                            <TableHead>Ref#</TableHead>
                            <TableHead>{t('date')}</TableHead>
                            <TableHead>{t('vendor')}</TableHead>
                            <TableHead>{t('description')}</TableHead>
                            <TableHead>{t('delivery_date')}</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {purchaseRequests.map((pr) => (
                            <TableRow key={pr.id}>
                                <TableCell className="text-center w-10">
                                    <Checkbox
                                        id={`checkbox-${pr.id}`}
                                        checked={selectedItems.includes(pr.id ?? '')}
                                        onCheckedChange={() => handleSelectItem(pr.id ?? '')}
                                        aria-label={`Select ${pr.title}`}
                                    />
                                </TableCell>
                                <TableCell>{pr.pr_no}</TableCell>
                                <TableCell>{pr.date_created}</TableCell>
                                <TableCell>{pr.department}</TableCell>
                                <TableCell>{pr.description}</TableCell>
                                <TableCell>{pr.delivery_date}</TableCell>
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
                        <span className="text-sm text-muted-foreground">
                            {selectedItems.length} Selected
                        </span>
                    )}
                </div>
                {purchaseRequests.map((pr) => (
                    <Card key={pr.id} className="transition-all duration-200 hover:shadow-lg hover:border-primary/50">
                        <CardHeader className="p-4">
                            <div className="flex justify-between items-start">
                                <div className="flex items-center gap-2">
                                    <Checkbox
                                        id={`mobile-checkbox-${pr.id}`}
                                        checked={selectedItems.includes(pr.id ?? '')}
                                        onCheckedChange={() => handleSelectItem(pr.id ?? '')}
                                        aria-label={`Select ${pr.title}`}
                                        className="mt-1"
                                    />
                                </div>
                            </div>
                        </CardHeader>
                        <CardContent className="p-4 pt-0">
                            <div className="grid gap-4">
                                <div className="space-y-1">
                                    <p className="text-xs text-muted-foreground">{t('pr_no')}</p>
                                    <p className="text-sm font-medium">{pr.pr_no}</p>
                                </div>
                                <div className="space-y-1">
                                    <p className="text-xs text-muted-foreground">{t('date')}</p>
                                    <p className="text-sm font-medium">{pr.date_created}</p>
                                </div>
                                <div className="space-y-1">
                                    <p className="text-xs text-muted-foreground">{t('vendor')}</p>
                                    <p className="text-sm font-medium">{pr.department}</p>
                                </div>
                                <div className="space-y-1">
                                    <p className="text-xs text-muted-foreground">{t('delivery_date')}</p>
                                    <p className="text-sm font-medium">{pr.delivery_date}</p>
                                </div>
                                <div className="space-y-1">
                                    <p className="text-xs text-muted-foreground">{t('description')}</p>
                                    <p className="text-sm font-medium line-clamp-2">{pr.description}</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>
    )
}
