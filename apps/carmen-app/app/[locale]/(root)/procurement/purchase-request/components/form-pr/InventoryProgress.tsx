import { StockLevelProgress } from "@/components/ui-custom/StockLevelProgress";
import { Skeleton } from "@/components/ui/skeleton";
import { PurchaseRequestDetail } from "@/dtos/purchase-request.dto";
import { useOnHandOrder } from "@/hooks/useOnHandOrder";
import { useTranslations } from "next-intl";

interface Props {
    item: PurchaseRequestDetail;
    token: string;
    tenantId: string;
}

interface InventoryData {
    on_hand_qty: number;
    on_order_qty: number;
    re_order_qty: number;
    re_stock_qty: number;
}

export default function InventoryProgress({ item, token, tenantId }: Props) {
    const tPr = useTranslations("PurchaseRequest");
    const locationId = item.location_id;
    const productId = item.product_id;

    const { data: onHandData, isLoading } = useOnHandOrder(
        token,
        tenantId,
        locationId || "",
        productId || ""
    );

    const getInventoryData = (): InventoryData => {
        if (locationId && productId && onHandData) {
            return {
                on_hand_qty: onHandData.on_hand_qty || 0,
                on_order_qty: onHandData.on_order_qty || 0,
                re_order_qty: onHandData.re_order_qty || 0,
                re_stock_qty: onHandData.re_stock_qty || 0,
            };
        }
        return {
            on_hand_qty: item.on_hand_qty || 0,
            on_order_qty: item.on_order_qty || 0,
            re_order_qty: item.re_order_qty || 0,
            re_stock_qty: item.re_stock_qty || 0,
        };
    };

    const calculateStockLevel = (inventoryData: InventoryData): number => {
        const { on_hand_qty, on_order_qty, re_order_qty, re_stock_qty } = inventoryData;
        const totalQty = on_hand_qty + on_order_qty + re_order_qty + re_stock_qty;

        if (totalQty <= 0) return 0;

        const stockLevel = (on_hand_qty / totalQty) * 100;
        return Number(stockLevel.toFixed(2));
    };

    if (isLoading) {
        return <SkeletonInventoryProgress />;
    }

    const inventoryData = getInventoryData();
    const stockLevel = calculateStockLevel(inventoryData);

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