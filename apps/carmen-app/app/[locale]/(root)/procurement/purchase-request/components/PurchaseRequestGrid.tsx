import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { PurchaseRequestDto } from "@/dtos/procurement.dto";
import { useState } from "react";
import { MobileView } from "./MobileView";
import { ActionButtons, prStatusColor, formatCurrency } from "./SharePrComponent";
import { useTranslations } from "next-intl";

interface PurchaseRequestGridProps {
    readonly purchaseRequests: PurchaseRequestDto[];
}

export default function PurchaseRequestGrid({ purchaseRequests }: PurchaseRequestGridProps) {
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
            <div className="hidden md:grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
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
                {purchaseRequests.map((pr) => (
                    <Card key={pr.id} className="transition-all duration-200 hover:shadow-lg hover:border-primary/50">
                        <CardHeader className="p-2 border-b bg-muted">
                            <div className="flex justify-between items-start">
                                <div className="flex items-center gap-2">
                                    <Checkbox
                                        id={`grid-checkbox-${pr.id}`}
                                        checked={selectedItems.includes(pr.id ?? '')}
                                        onCheckedChange={() => handleSelectItem(pr.id ?? '')}
                                        aria-label={`Select ${pr.title}`}
                                        className="mt-1"
                                    />
                                    <div>
                                        <p className="text-sm font-semibold text-primary">{pr.pr_no}</p>
                                        <p className="text-xs text-muted-foreground">{pr.date_created}</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-2">
                                    <div className="mt-1">
                                        {prStatusColor(pr.status ?? '')}
                                    </div>
                                </div>
                            </div>
                        </CardHeader>
                        <CardContent className="p-4 pt-2">
                            <div className="space-y-4">
                                <div className="space-y-1">
                                    <p className="text-xs text-muted-foreground">{t('description')}</p>
                                    <p className="text-xs font-medium line-clamp-2">{pr.description}</p>
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-1">
                                        <p className="text-xs text-muted-foreground">{t('type')}</p>
                                        <p className="text-xs font-medium">{pr.type}</p>
                                    </div>
                                    <div className="space-y-1">
                                        <p className="text-xs text-muted-foreground">{t('requestor')}</p>
                                        <p className="text-xs font-medium">{pr.requestor}</p>
                                    </div>
                                    <div className="space-y-1">
                                        <p className="text-xs text-muted-foreground">{t('department')}</p>
                                        <p className="text-xs font-medium">{pr.department}</p>
                                    </div>
                                    <div className="space-y-1">
                                        <p className="text-xs text-muted-foreground">{t('amount')}</p>
                                        <p className="text-xs font-medium">{formatCurrency(pr.amount)}</p>
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                        <div className="flex items-center justify-end p-2 border-t bg-muted">
                            <ActionButtons prId={pr.id ?? ''} />
                        </div>
                    </Card>
                ))}
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
