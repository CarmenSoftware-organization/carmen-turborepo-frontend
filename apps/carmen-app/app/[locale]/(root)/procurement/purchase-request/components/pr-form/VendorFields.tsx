import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { TrendingUp } from "lucide-react";
import { PurchaseRequestDetailItem } from "@/dtos/pr.dto";
import { useCurrency } from "@/hooks/useCurrency";

interface VendorFieldsProps {
    readonly item: PurchaseRequestDetailItem;
}

export default function VendorFields({ item }: VendorFieldsProps) {
    const { getCurrencyCode } = useCurrency();

    return (
        <div className="px-4 grid grid-cols-10 gap-4 py-4">
            <div className="col-span-2 space-y-1">
                <Label>Vendor</Label>
                <p>{item.vendor_name}</p>
            </div>
            <div className="space-y-1">
                <Label>Currency</Label>
                <p className="font-semibold">{getCurrencyCode(item.currency_id)}</p>
            </div>
            <div className="space-y-1">
                <Label>Price/Unit</Label>
                <p>{item.price} wait unit</p>
            </div>
            <div className="space-y-1">
                <p>Sub Total</p>
                <p>price * qty</p>
            </div>
            <div className="space-y-1">
                <p>Discount</p>
                <p>{item.discount_amount}</p>
            </div>
            <div className="space-y-1">
                <p>Net Amount</p>
                <p>sub total - discount</p>
            </div>
            <div className="space-y-1">
                <p>Tax</p>
                <p>sub total * tax rate</p>
            </div>
            <div className="space-y-1">
                <p>Total</p>
                <p>net amount + tax</p>
            </div>
            <div className="space-y-1">
                <p>Compare</p>
                <Button variant="outline" size="sm" className="w-fit h-7">
                    <TrendingUp /> Compare
                </Button>
            </div>
        </div>
    );
}