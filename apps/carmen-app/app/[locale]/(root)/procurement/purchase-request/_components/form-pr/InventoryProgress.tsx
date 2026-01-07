import { StockLevelProgress } from "@/components/ui-custom/StockLevelProgress";
import { Skeleton } from "@/components/ui/skeleton";
import { useTranslations } from "next-intl";

interface Props {
    stockLevel: number;
    isLoading: boolean;
}

export default function InventoryProgress({ stockLevel, isLoading }: Props) {
    const tPr = useTranslations("PurchaseRequest");

    if (isLoading) {
        return <SkeletonInventoryProgress />;
    }

    return (
        <div className="px-2">
            <StockLevelProgress value={stockLevel} />
            <div className="flex items-center justify-between mt-2">
                <p className="text-xs text-muted-foreground/80">{tPr("need_reorder")}</p>
                <p className="text-xs text-muted-foreground/80">
                    {tPr("stock_level")}: {stockLevel}%
                </p>
            </div>
        </div>
    );
}

const SkeletonInventoryProgress = () => {
    return (
        <div className="px-2 space-y-2">
            <div className="relative w-full h-2 bg-secondary rounded-full overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-pulse" />
                <Skeleton className="h-full w-3/5 rounded-full" />
            </div>
            <div className="flex items-center justify-between">
                <Skeleton className="h-3 w-20" />
                <Skeleton className="h-3 w-16" />
            </div>
        </div>
    );
};