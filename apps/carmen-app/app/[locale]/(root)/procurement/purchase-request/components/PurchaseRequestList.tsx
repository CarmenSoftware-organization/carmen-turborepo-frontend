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
import { MobileView } from "./MobileView";
import { ActionButtons, prStatusColor, formatCurrency } from "./SharePrComponent";

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
            setSelectedItems([]);
        } else {
            const allIds = purchaseRequests.map(pr => pr.id ?? '').filter(Boolean);
            setSelectedItems(allIds);
        }
    };

    const isAllSelected = purchaseRequests.length > 0 && selectedItems.length === purchaseRequests.length;

    return (
        <div className="space-y-4">
            <div className="hidden md:block">
                <Table className="border">
                    <TableHeader className="bg-muted">
                        <TableRow>
                            <TableHead className="w-10 text-center">
                                <Checkbox
                                    id="select-all"
                                    checked={isAllSelected}
                                    onCheckedChange={handleSelectAll}
                                    aria-label="Select all purchase requests"
                                />
                            </TableHead>
                            <TableHead>{t('pr_no')}</TableHead>
                            <TableHead>{t('date')}</TableHead>
                            <TableHead>{t('type')}</TableHead>
                            <TableHead>{t('requestor')}</TableHead>
                            <TableHead>{t('department')}</TableHead>
                            <TableHead>{t('amount')}</TableHead>
                            <TableHead>{t('status')}</TableHead>
                            <TableHead className="w-[100px] text-right">{t('action')}</TableHead>
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
                                <TableCell>
                                    <div className="flex flex-col">
                                        <p className="text-xs font-semibold">{pr.type}</p>
                                        <p className="text-xs text-muted-foreground">{pr.description}</p>
                                    </div>
                                </TableCell>
                                <TableCell>{pr.requestor}</TableCell>
                                <TableCell>{pr.department}</TableCell>
                                <TableCell>{formatCurrency(pr.amount)}</TableCell>
                                <TableCell>
                                    {prStatusColor(pr.status ?? '')}
                                </TableCell>
                                <TableCell className="text-right">
                                    <ActionButtons prId={pr.id ?? ''} />
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>

            <MobileView
                purchaseRequests={purchaseRequests}
                selectedItems={selectedItems}
                onSelectItem={handleSelectItem}
                onSelectAll={handleSelectAll}
                isAllSelected={isAllSelected}
            />
        </div>
    );
}
