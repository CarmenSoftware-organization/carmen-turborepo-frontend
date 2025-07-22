import { Label } from "@/components/ui/label";
import { PurchaseRequestDetailItem } from "@/dtos/pr.dto";
import { useCurrency } from "@/hooks/useCurrency";
import PriceListDialog from "./PriceListDialog";
import { cn } from "@/lib/utils";
import { useUnitQuery } from "@/hooks/use-unit";
import { useAuth } from "@/context/AuthContext";
import { formatPrice } from "@/utils/price";

interface VendorFieldsProps {
    readonly item: PurchaseRequestDetailItem;
}

const FieldsVendor = ({ label, value, color }: { label: string, value: string, color?: string }) => {
    return (
        <div className="space-y-1">
            <Label className={cn(color && `text-${color}-700 font-semibold`)}>{label}</Label>
            <p className={cn(color && `text-${color}-700 font-bold`)}>{value}</p>
        </div>
    );
};


export default function VendorFields({ item }: VendorFieldsProps) {
    const { token, tenantId, systemConfig } = useAuth();
    const { getCurrencyCode } = useCurrency();
    const { getUnitName } = useUnitQuery({
        token: token,
        tenantId: tenantId,
    });

    const subTotal = item.pricelist_price ? item.pricelist_price * item.approved_qty : 0;
    const netAmount = subTotal - item.discount_amount;
    const taxRate = item.tax_rate;
    const total = netAmount + taxRate;

    return (
        <div className="px-4 grid grid-cols-10 gap-4 py-4">
            <div className="col-span-2 space-y-1">
                <Label className="text-xs font-semibold">VENDOR</Label>
                <p>{item.vendor_name}</p>
            </div>
            <FieldsVendor label="Currency" value={getCurrencyCode(item.currency_id)} />
            {/* <FieldsVendor label="Price/Unit" value={`${formatPrice(item.pricelist_price ?? 0)} / ${getUnitName(item.pricelist_unit || 'N/A')}`} /> */}
            <FieldsVendor label="Sub Total" value={subTotal.toString()} />
            {/* <FieldsVendor label="Discount" value={formatPrice(item.discount_amount)} /> */}
            <FieldsVendor label="Net Amount" value={netAmount.toString()} color="blue" />
            <FieldsVendor label="Tax" value={taxRate.toString()} />
            <FieldsVendor label="Total" value={total.toString()} color="green" />
            <div className="space-y-1">
                <Label className="text-xs font-semibold">Compare</Label>
                <PriceListDialog />
            </div>
        </div>
    );
}
