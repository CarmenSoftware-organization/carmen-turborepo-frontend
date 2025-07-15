import { Label } from "@/components/ui/label";
import { PurchaseRequestDetailItem } from "@/dtos/pr.dto";
import { useCurrency } from "@/hooks/useCurrency";
import PriceListDialog from "./PriceListDialog";
import { cn } from "@/lib/utils";

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
    const { getCurrencyCode } = useCurrency();
    return (
        <div className="px-4 grid grid-cols-10 gap-4 py-4">
            <div className="col-span-2 space-y-1">
                <Label className="text-xs font-semibold">VENDOR</Label>
                <p>{item.vendor_name}</p>
            </div>
            <FieldsVendor label="Currency" value={getCurrencyCode(item.currency_id)} />
            <FieldsVendor label="Price/Unit" value={`${item.price.toString()} / pricelist_unit`} />
            <FieldsVendor label="Sub Total" value="pricelist_price * approved_qty" />
            <FieldsVendor label="Discount" value={item.discount_amount.toString()} />
            <FieldsVendor label="Net Amount" value="sub total - discount" color="blue" />
            <FieldsVendor label="Tax" value="tax rate" />
            <FieldsVendor label="Total" value="net amount + tax" color="green" />
            <div className="space-y-1">
                <Label className="text-xs font-semibold">Compare</Label>
                <PriceListDialog />
            </div>
        </div>
    );
}
