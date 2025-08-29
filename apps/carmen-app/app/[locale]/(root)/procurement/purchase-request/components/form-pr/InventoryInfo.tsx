import { Label } from "@/components/ui/label";
import { PurchaseRequestDetail } from "@/dtos/purchase-request.dto";
import { useOnHandOrder } from "@/hooks/useOnHandOrder";

interface Props {
    item: PurchaseRequestDetail;
    token: string;
    tenantId: string;
}

export default function InventoryInfo({ item, token, tenantId }: Props) {

    const locationId = item.location_id;
    const productId = item.product_id;

    const { data: onHandData, isLoading } = useOnHandOrder(
        token,
        tenantId,
        locationId || "",
        productId || ""
    );

    if (!locationId || !productId) {
        return (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2 px-2">
                <div className="text-right">
                    <Label className="text-primary text-xs">On Hand</Label>
                    <p className="text-sm font-semibold">{item.on_hand_qty || 0}</p>
                    <p className="text-xs text-muted-foreground/80">{item.inventory_unit_name || "-"}</p>
                </div>
                <div className="text-right">
                    <Label className="text-primary text-xs">On Order</Label>
                    <p className="text-sm font-semibold">{item.on_order_qty || 0}</p>
                    <p className="text-xs text-muted-foreground/80">{item.inventory_unit_name || "-"}</p>
                </div>
                <div className="text-right">
                    <Label className="text-muted-foreground/80 text-xs">Reorder</Label>
                    <p className="text-sm font-semibold">{item.re_order_qty || 0}</p>
                    <p className="text-xs text-muted-foreground/80">{item.inventory_unit_name || "-"}</p>
                </div>
                <div className="text-right">
                    <Label className="text-muted-foreground/80 text-xs">Restock</Label>
                    <p className="text-sm font-semibold">{item.re_stock_qty || 0}</p>
                    <p className="text-xs text-muted-foreground/80">{item.inventory_unit_name || "-"}</p>
                </div>
            </div>
        );
    }

    if (isLoading) {
        return <div className="px-2">Loading inventory data...</div>;
    }

    if (onHandData) {
        const { on_hand_qty, on_order_qty, re_order_qty, re_stock_qty } = onHandData;
        return (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2 px-2">
                <div className="text-right">
                    <Label className="text-primary text-xs">On Hand</Label>
                    <p className="text-sm font-semibold">{on_hand_qty || 0}</p>
                    <p className="text-xs text-muted-foreground/80">{item.inventory_unit_name || "-"}</p>
                </div>
                <div className="text-right">
                    <Label className="text-primary text-xs">On Order</Label>
                    <p className="text-sm font-semibold">{on_order_qty || 0}</p>
                    <p className="text-xs text-muted-foreground/80">{item.inventory_unit_name || "-"}</p>
                </div>
                <div className="text-right">
                    <Label className="text-muted-foreground/80 text-xs">Reorder</Label>
                    <p className="text-sm font-semibold">{re_order_qty || 0}</p>
                    <p className="text-xs text-muted-foreground/80">{item.inventory_unit_name || "-"}</p>
                </div>
                <div className="text-right">
                    <Label className="text-muted-foreground/80 text-xs">Restock</Label>
                    <p className="text-sm font-semibold">{re_stock_qty || 0}</p>
                    <p className="text-xs text-muted-foreground/80">{item.inventory_unit_name || "-"}</p>
                </div>
            </div>
        );
    }
    return (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2 px-2">
            <div className="text-right">
                <Label className="text-primary text-xs">On Hand</Label>
                <p className="text-sm font-semibold">{item.on_hand_qty || 0}</p>
                <p className="text-xs text-muted-foreground/80">{item.inventory_unit_name || "-"}</p>
            </div>
            <div className="text-right">
                <Label className="text-primary text-xs">On Order</Label>
                <p className="text-sm font-semibold">{item.on_order_qty || 0}</p>
                <p className="text-xs text-muted-foreground/80">{item.inventory_unit_name || "-"}</p>
            </div>
            <div className="text-right">
                <Label className="text-muted-foreground/80 text-xs">Reorder</Label>
                <p className="text-sm font-semibold">{item.re_order_qty || 0}</p>
                <p className="text-xs text-muted-foreground/80">{item.inventory_unit_name || "-"}</p>
            </div>
            <div className="text-right">
                <Label className="text-muted-foreground/80 text-xs">Restock</Label>
                <p className="text-sm font-semibold">{item.re_stock_qty || 0}</p>
                <p className="text-xs text-muted-foreground/80">{item.inventory_unit_name || "-"}</p>
            </div>
        </div>
    );
}