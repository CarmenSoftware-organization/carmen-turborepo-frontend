import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { formType } from "@/dtos/form.dto";

interface PricingCardSummaryProps {
    label: string;
    currencyCode?: string;
    value: string | number;
    placeholder: string;
    color: string;
    isAmount?: boolean;
    mode: formType;
}

export default function PricingCardSummary({ label, currencyCode, value, placeholder, color, isAmount, mode }: PricingCardSummaryProps) {
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
                                <Label className={`fxr-c gap-2 my-1 text-${color}-700 font-semibold`}>
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
                    <div className={`bg-${color}-50 rounded-md h-20 fxr-c justify-center gap-2`}>
                        <p className={`text-${color}-700 font-semibold`}>{currencyCode}</p>
                        <p className={`text-${color}-700 font-semibold`}>{value}</p>
                    </div>
                </>
            )}
        </div>
    )
}