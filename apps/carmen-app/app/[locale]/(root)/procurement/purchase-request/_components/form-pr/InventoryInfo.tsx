import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { useTranslations } from "next-intl";
import { InventoryData } from "../../_hooks/use-inventory-data";

interface Props {
    inventoryData: InventoryData;
    inventoryUnitName?: string;
    isLoading: boolean;
}

export default function InventoryInfo({ inventoryData, inventoryUnitName, isLoading }: Props) {
    const tPr = useTranslations("PurchaseRequest");

    if (isLoading) {
        return <SkeletonInventoryItem />
    }

    return (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2 px-2">
            <InventoryItem
                label={tPr("on_hand")}
                value={inventoryData.on_hand_qty}
                unit={inventoryUnitName}
                isPrimary={true}
            />
            <InventoryItem
                label={tPr("on_order")}
                value={inventoryData.on_order_qty}
                unit={inventoryUnitName}
                isPrimary={true}
            />
            <InventoryItem
                label={tPr("reorder")}
                value={inventoryData.re_order_qty}
                unit={inventoryUnitName}
                isPrimary={false}
            />
            <InventoryItem
                label={tPr("restock")}
                value={inventoryData.re_stock_qty}
                unit={inventoryUnitName}
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