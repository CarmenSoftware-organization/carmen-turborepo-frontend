import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { PurchaseRequestDetail } from "@/dtos/purchase-request.dto";
import { useOnHandOrder } from "@/hooks/useOnHandOrder";
import { useTranslations } from "next-intl";

interface Props {
    item: PurchaseRequestDetail;
    token: string;
    buCode: string;
}

interface InventoryData {
    on_hand_qty: number;
    on_order_qty: number;
    re_order_qty: number;
    re_stock_qty: number;
}

export default function InventoryInfo({ item, token, buCode }: Props) {
    const tPr = useTranslations("PurchaseRequest");
    const locationId = item.location_id;
    const productId = item.product_id;

    const { data: onHandData, isLoading } = useOnHandOrder(
        token,
        buCode,
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

        // หากไม่มี API data ให้ใช้ข้อมูลจาก item
        return {
            on_hand_qty: item.on_hand_qty || 0,
            on_order_qty: item.on_order_qty || 0,
            re_order_qty: item.re_order_qty || 0,
            re_stock_qty: item.re_stock_qty || 0,
        };
    };

    if (isLoading) {
        return <SkeletonInventoryItem />
    }

    const inventoryData = getInventoryData();

    return (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2 px-2">
            <InventoryItem
                label={tPr("on_hand")}
                value={inventoryData.on_hand_qty}
                unit={item.inventory_unit_name}
                isPrimary={true}
            />
            <InventoryItem
                label={tPr("on_order")}
                value={inventoryData.on_order_qty}
                unit={item.inventory_unit_name}
                isPrimary={true}
            />
            <InventoryItem
                label={tPr("reorder")}
                value={inventoryData.re_order_qty}
                unit={item.inventory_unit_name}
                isPrimary={false}
            />
            <InventoryItem
                label={tPr("restock")}
                value={inventoryData.re_stock_qty}
                unit={item.inventory_unit_name}
                isPrimary={false}
            />
        </div>
    );
}

// Component ย่อยสำหรับแสดงข้อมูล inventory แต่ละรายการ
interface InventoryItemProps {
    label: string;
    value: number;
    unit?: string;
    isPrimary?: boolean;
}

function InventoryItem({ label, value, unit, isPrimary = false }: InventoryItemProps) {
    const labelClass = isPrimary
        ? "text-primary text-xs"
        : "text-muted-foreground/80 text-xs";

    return (
        <div className="text-right">
            <Label className={labelClass}>{label}</Label>
            <p className="text-sm font-semibold">{value}</p>
            <p className="text-xs text-muted-foreground/80">{unit || "-"}</p>
        </div>
    );
};

const SkeletonInventoryItem = () => {
    return (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2 px-2">
            <div className="text-right space-y-1">
                <Skeleton className="h-3 w-12 ml-auto" />
                <Skeleton className="h-4 w-8 ml-auto" />
                <Skeleton className="h-3 w-6 ml-auto" />
            </div>
            <div className="text-right space-y-1">
                <Skeleton className="h-3 w-12 ml-auto" />
                <Skeleton className="h-4 w-8 ml-auto" />
                <Skeleton className="h-3 w-6 ml-auto" />
            </div>
            <div className="text-right space-y-1">
                <Skeleton className="h-3 w-12 ml-auto" />
                <Skeleton className="h-4 w-8 ml-auto" />
                <Skeleton className="h-3 w-6 ml-auto" />
            </div>
            <div className="text-right space-y-1">
                <Skeleton className="h-3 w-12 ml-auto" />
                <Skeleton className="h-4 w-8 ml-auto" />
                <Skeleton className="h-3 w-6 ml-auto" />
            </div>
        </div>
    );
};