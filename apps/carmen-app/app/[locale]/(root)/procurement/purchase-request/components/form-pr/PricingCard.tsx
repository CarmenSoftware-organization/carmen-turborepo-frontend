import { Card, CardContent, CardTitle, CardHeader } from "@/components/ui/card";
import { DollarSign } from "lucide-react";
import { useVendor } from "@/hooks/useVendor";
import { formType } from "@/dtos/form.dto";
import PricingField from "./PricingField";
import PricingCardSummary from "./PricingCardSummary";
import { PurchaseRequestDetail } from "@/dtos/purchase-request.dto";
import { useAuth } from "@/context/AuthContext";
import { useCurrenciesQuery } from "@/hooks/useCurrencie";

interface PricingCardProps {
    readonly item: PurchaseRequestDetail;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    onFieldUpdate: (item: any, fieldName: string, value: any, selectedProduct?: any) => void;
    readonly mode: formType
}

export default function PricingCard({ item, onFieldUpdate, mode }: PricingCardProps) {
    const { token, tenantId } = useAuth();
    const { getCurrencyCode } = useCurrenciesQuery(token, tenantId);
    const { getVendorName } = useVendor(token, tenantId);

    return (
        <Card>
            <CardHeader>
                <CardTitle>
                    <div className="flex items-center gap-1">
                        <DollarSign className="text-green-500" />
                        Pricing
                    </div>
                </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="grid grid-cols-4 gap-4">
                    <PricingField
                        label="Vendor"
                        value={getVendorName(item.vendor_id)}
                        onChange={(value) => onFieldUpdate(item, "vendor_id", value)}
                        placeholder="Vendor"
                    />
                    <PricingField
                        label="Pricelist Number"
                        value={item.pricelist_detail_id || ""}
                        onChange={(value) => onFieldUpdate(item, "pricelist_detail_id", value)}
                        placeholder="Pricelist Number"
                    />
                    <PricingField
                        label="Order Currency"
                        value={getCurrencyCode(item.currency_id)}
                        onChange={(value) => onFieldUpdate(item, "currency_id", value)}
                        placeholder="Order Currency" />
                    <PricingField
                        label="Price per Unit"
                        value={item.pricelist_price}
                        onChange={(value) => onFieldUpdate(item, "pricelist_price", value)}
                        placeholder="Price per Unit"
                    />
                </div>
                <div className="grid grid-cols-4 gap-4">
                    <PricingCardSummary
                        label="Discount"
                        currencyCode={getCurrencyCode(item.currency_id)}
                        value={item.discount_rate}
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

