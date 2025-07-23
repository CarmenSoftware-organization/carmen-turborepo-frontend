import { Label } from "@/components/ui/label";
import { useAuth } from "@/context/AuthContext";
import { formType } from "@/dtos/form.dto";
import { PurchaseRequestCreateFormDto, PurchaseRequestDetail, PurchaseRequestUpdateFormDto } from "@/dtos/purchase-request.dto";
import { useUnitQuery } from "@/hooks/use-unit";
import { useCurrency } from "@/hooks/useCurrency";
import { cn } from "@/lib/utils";
import { UseFormReturn } from "react-hook-form";
import PriceListDialog from "./PriceListDialog";

interface ItemDetailAccordionProps {
    readonly index: number;
    readonly item: PurchaseRequestDetail;
    readonly mode: formType;
    readonly form: UseFormReturn<PurchaseRequestCreateFormDto | PurchaseRequestUpdateFormDto>;
}

const FieldsVendor = ({ label, value, color }: { label: string, value: string, color?: string }) => {
    return (
        <div className="space-y-1">
            <Label className={cn(color && `text-${color}-700 font-semibold`)}>{label}</Label>
            <p className={cn(color && `text-${color}-700 font-bold`)}>{value}</p>
        </div>
    );
};

export default function VendorRow({
    index,
    item,
    mode,
    form
}: ItemDetailAccordionProps) {
    const { token, tenantId } = useAuth();
    const { getCurrencyCode } = useCurrency();
    const { getUnitName } = useUnitQuery({
        token: token,
        tenantId: tenantId,
    });

    const subTotal = +item.pricelist_price * item.approved_qty;
    const netAmount = subTotal - item.discount_amount;
    const taxRate = item.tax_rate;
    const total = netAmount + taxRate;
    return (
        <div className="grid grid-cols-8 pt-1">
            <div className="col-span-2 space-y-1">
                <Label className="text-xs font-semibold">VENDOR</Label>
                <p>{item.vendor_name}</p>
            </div>
            <FieldsVendor label="Currency" value={getCurrencyCode(item.currency_id)} />
            <FieldsVendor label="Sub Total" value={subTotal.toString()} />
            <FieldsVendor label="Net Amount" value={netAmount.toString()} color="blue" />
            <FieldsVendor label="Tax" value={taxRate.toString()} />
            <FieldsVendor label="Total" value={total.toString()} color="green" />
            <div className="space-y-1 pb-2">
                <Label className="text-xs font-semibold">Compare</Label>
                <PriceListDialog />
            </div>
        </div>
    );
}