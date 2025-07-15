import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardTitle, CardHeader } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { DollarSign, TrendingUp } from "lucide-react";
import { PurchaseRequestDetailItem } from "@/dtos/pr.dto";
import { useCurrency } from "@/hooks/useCurrency";
import { useVendor } from "@/hooks/useVendor";
import { formType } from "@/dtos/form.dto";

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
                <CardTitle className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <DollarSign className="text-green-500" />
                        Pricing
                    </div>
                    <Button variant="outline" size="sm" className="w-fit h-7">
                        <TrendingUp /> Vendor Comparison
                    </Button>
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
                    <div className="space-y-1">
                        <Label>Net Total</Label>
                        <div className="bg-blue-50 p-2 rounded-md h-20 flex items-center justify-center">
                            <p className="text-blue-700 font-bold text-xl">(mock) USD 100.00</p>
                        </div>
                    </div>

                    <div className="space-y-1">
                        <Label>Total Amount</Label>
                        <div className="bg-green-50 p-2 rounded-md h-20 flex items-center justify-center">
                            <p className="text-green-700 font-bold text-xl">(mock) USD 100.00</p>
                        </div>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
};

interface PricingProps {
    label: string;
    value: string;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    placeholder: string;
}

const PricingField = ({ label, value, onChange, placeholder }: PricingProps) => {
    return (
        <div className="space-y-1">
            <Label>{label}</Label>
            <Input
                value={value}
                onChange={onChange}
                placeholder={placeholder}
                className="text-sm h-8 border-blue-300 focus:border-blue-500"
            />
        </div>
    );
};

interface PricingCardSummaryProps {
    label: string;
    currencyCode: string;
    value: string;
    placeholder: string;
    color: string;
    isAmount?: boolean;
    mode: formType;
}

const PricingCardSummary = ({ label, currencyCode, value, placeholder, color, isAmount = false, mode }: PricingCardSummaryProps) => {

    return (
        <div className="space-y-1">
            {mode !== formType.VIEW ? (
                <>
                    <Label>{label}</Label>
                    <div className={`bg-${color}-50 p-2 rounded-md h-20 grid grid-cols-2 gap-2`}>
                        <div className="space-y-1">
                            <Label className={`text-${color}-700 font-semibold`}>{currencyCode}</Label>
                            <Input value={value} placeholder={placeholder} />
                        </div>
                        {isAmount && (
                            <div className="space-y-1">
                                <Label className={`flex items-center gap-2 my-1 text-${color}-700 font-semibold`}>
                                    <Checkbox />
                                    Amount
                                </Label>
                                <Input />
                            </div>
                        )}
                    </div>
                </>
            ) : (
                <>
                    <Label>{label}</Label>
                    <div className={`bg-${color}-50 rounded-md h-20 flex items-center justify-center gap-2`}>
                        <p className={`text-${color}-700 font-semibold`}>{currencyCode}</p>
                        <p className={`text-${color}-700 font-semibold`}>{value}</p>
                    </div>
                </>
            )}
        </div>
    )
}
