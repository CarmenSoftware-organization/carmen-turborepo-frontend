import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { PurchaseRequestDto } from "@/dtos/procurement.dto";
import { useTranslations } from "next-intl";
import { ActionButtons, prStatusColor, formatCurrency, SelectionProps } from "./SharePrComponent";

interface MobileViewProps extends SelectionProps {
    readonly purchaseRequests: PurchaseRequestDto[];
}

export const MobileView = ({
    purchaseRequests,
    selectedItems,
    onSelectItem,
    onSelectAll,
    isAllSelected,
}: MobileViewProps) => {
    const t = useTranslations('TableHeader');

    return (
        <div className="grid gap-4 md:hidden">
            <div className="flex items-center justify-between">
                <Button
                    variant="outline"
                    size="sm"
                    onClick={onSelectAll}
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
                                    id={`mobile-checkbox-${pr.id}`}
                                    checked={selectedItems.includes(pr.id ?? '')}
                                    onCheckedChange={() => onSelectItem(pr.id ?? '')}
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
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-1 col-span-2">
                                <p className="text-xs text-muted-foreground">{t('description')}</p>
                                <p className="text-xs font-medium line-clamp-2">{pr.description}</p>
                            </div>
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
                    </CardContent>
                    <div className="flex items-center justify-end p-2 border-t bg-muted">
                        <ActionButtons prId={pr.id ?? ''} />
                    </div>
                </Card>
            ))}
        </div>
    );
}; 