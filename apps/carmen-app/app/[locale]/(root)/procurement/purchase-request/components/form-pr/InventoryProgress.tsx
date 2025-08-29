import { Progress } from "@/components/ui/progress";
import { PurchaseRequestDetail } from "@/dtos/purchase-request.dto";
import { useOnHandOrder } from "@/hooks/useOnHandOrder";

interface Props {
    item: PurchaseRequestDetail;
    token: string;
    tenantId: string;
}
export default function InventoryProgress({ item, token, tenantId }: Props) {
    const locationId = item.location_id;
    const productId = item.product_id;

    const calculateStockLevel = (onHandQty: number, onOrderQty: number, reOrderQty: number, reStockQty: number) => {
        const totalQty = onHandQty + onOrderQty + reOrderQty + reStockQty;
        const stockLevel = (onHandQty / totalQty) * 100;
        return Number(stockLevel.toFixed(2));
    };

    const { data: onHandData, isLoading } = useOnHandOrder(
        token,
        tenantId,
        locationId || "",
        productId || ""
    );

    if (isLoading) {
        return <div className="px-2">Loading inventory data...</div>;
    }

    if (onHandData) {
        const { on_hand_qty, on_order_qty, re_order_qty, re_stock_qty } = onHandData;
        const totalQty = (on_hand_qty || 0) + (on_order_qty || 0) + (re_order_qty || 0) + (re_stock_qty || 0);
        const stockLevel = totalQty > 0 ? ((on_hand_qty || 0) / totalQty) * 100 : 0;

        return (
            <div className="px-2">
                <Progress value={Number(stockLevel.toFixed(2))} />
                <div className="flex items-center justify-between">
                    <p className="text-xs text-muted-foreground/80">Needs Reorder</p>
                    <p className="text-xs text-muted-foreground/80">Stock Level: {Number(stockLevel.toFixed(2))}%</p>
                </div>
            </div>
        );
    }

    const stockLevel = calculateStockLevel(item.on_hand_qty, item.on_order_qty, item.re_order_qty, item.re_stock_qty);
    return (
        <div className="px-2">
            <Progress value={stockLevel} />
            <div className="flex items-center justify-between">
                <p className="text-xs text-muted-foreground/80">Needs Reorder</p>
                <p className="text-xs text-muted-foreground/80">Stock Level: {stockLevel}%</p>
            </div>
        </div>
    );
}