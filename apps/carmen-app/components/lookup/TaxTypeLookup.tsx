import { PropsLookup } from "@/dtos/lookup.dto";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Loader2 } from "lucide-react";

type TaxType = {
    value: string;
    label: string;
}

const mockTaxType: TaxType[] = [
    { value: '589881fb-d16c-4c89-824c-f27e5c7ade46', label: 'ภาษีมูลค่าเพิ่ม 7%' },
    { value: '005491b8-acbf-4d52-b78f-2dfa62391e27', label: 'ยกเว้นภาษี' },
    { value: '4291dfbf-cad8-495f-9455-26a963e3a4c3  ', label: 'ภาษีศูนย์เปอร์เซ็นต์ (0%)' },
    { value: '462cc29d-8a9b-4d34-bc18-a6d179012fdf', label: 'ภาษีขายเฉพาะกิจ' },
    { value: 'ce4e0971-78d9-4385-9ecc-a25a77619902', label: 'ภาษีไม่ต้องหัก ณ ที่จ่าย' },
];

export default function TaxTypeLookup({
    value,
    onValueChange,
    placeholder = "Select tax type",
    disabled = false,
}: Readonly<PropsLookup>) {
    const isLoading = false;

    if (isLoading) {
        return (
            <div className="relative w-full">
                <Select disabled value={value} onValueChange={onValueChange}>
                    <SelectTrigger className="w-full">
                        <SelectValue placeholder={placeholder} />
                    </SelectTrigger>
                </Select>
                <div className="absolute right-3 top-1/2 -translate-y-1/2">
                    <Loader2 className="h-4 w-4 animate-spin text-gray-400" />
                </div>
            </div>
        );
    }

    return (
        <Select value={value} onValueChange={onValueChange} disabled={disabled}>
            <SelectTrigger className="w-full">
                <SelectValue placeholder={placeholder} />
            </SelectTrigger>
            <SelectContent>
                {mockTaxType && mockTaxType.length > 0 ? (
                    mockTaxType.map((item) => (
                        <SelectItem key={item.value} value={item.value}>
                            {item.label}
                        </SelectItem>
                    ))
                ) : (
                    <SelectItem value="empty" disabled>
                        No tax types available.
                    </SelectItem>
                )}
            </SelectContent>
        </Select>
    );
}
