import { Card, CardContent, CardTitle, CardHeader } from "@/components/ui/card";
import { DollarSign } from "lucide-react";
import { PurchaseRequestDetailItem } from "@/dtos/pr.dto";
import { useCurrency } from "@/hooks/useCurrency";
import { useVendor } from "@/hooks/useVendor";
import { formType } from "@/dtos/form.dto";
import PricingField from "./PricingField";
import PricingCardSummary from "./PricingCardSummary";

interface PricingCardProps {
    readonly item: PurchaseRequestDetailItem;
    readonly onItemUpdate: (field: keyof PurchaseRequestDetailItem, value: any) => void;
    readonly mode: formType
}

export default function PricingCard({ item, onItemUpdate, mode }: PricingCardProps) {
    const { getCurrencyCode } = useCurrency();
    const { getVendorName } = useVendor();

    return (
        <Card>
            <CardHeader>
                <CardTitle >
                    <DollarSign className="text-green-500" />
                    Pricing
                </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="grid grid-cols-4 gap-4">
                    <PricingField
                        label="Vendor"
                        value={getVendorName(item.vendor_id)}
                        onChange={(e) => onItemUpdate("vendor_id", e.target.value)}
                        placeholder="Vendor"
                    />
                    <PricingField
                        label="Pricelist Number"
                        value={item.pricelist_detail_id || ""}
                        onChange={(e) => onItemUpdate("pricelist_detail_id", e.target.value)}
                        placeholder="Pricelist Number"
                    />
                    <PricingField
                        label="Order Currency"
                        value={getCurrencyCode(item.currency_id)}
                        onChange={(e) => onItemUpdate("currency_id", e.target.value)}
                        placeholder="Order Currency" />
                    <PricingField
                        label="Price per Unit"
                        value={item.price.toString()}
                        onChange={(e) => onItemUpdate("price", e.target.value)}
                        placeholder="Price per Unit"
                    />
                </div>
                <div className="grid grid-cols-4 gap-4">
                    <PricingCardSummary
                        label="Discount"
                        currencyCode={getCurrencyCode(item.currency_id)}
                        value={item.discount_rate.toString()}
                        placeholder="Discount Rate"
                        color="green"
                        isAmount
                        mode={mode}
                    />
                    <PricingCardSummary
                        label="Tax"
                        currencyCode={getCurrencyCode(item.currency_id)}
                        value={item.tax_rate.toString()}
                        placeholder="Tax Rate"
                        color="yellow"
                        isAmount
                        mode={mode}
                    />
                    <PricingCardSummary
                        label="Net Total"
                        currencyCode={getCurrencyCode(item.currency_id)}
                        value="(mock) USD 100.00"
                        placeholder="Net Total"
                        color="blue"
                        isAmount
                        mode={mode}
                    />
                    <PricingCardSummary
                        label="Total Amount"
                        currencyCode={getCurrencyCode(item.currency_id)}
                        value="(mock) USD 100.00"
                        placeholder="Total Amount"
                        color="green"
                        isAmount
                        mode={mode}
                    />
                </div>
            </CardContent>
        </Card>
    );
};

