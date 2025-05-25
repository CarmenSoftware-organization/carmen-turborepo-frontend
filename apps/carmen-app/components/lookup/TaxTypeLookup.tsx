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
    { value: '462cc29d-8a9b-4d34-bc18-a6d179012fdf', label: 'add' },
    { value: '462cc29d-8a9b-4d34-bc18-a6d179012fdf', label: 'none' },
    { value: '462cc29d-8a9b-4d34-bc18-a6d179012fdf  ', label: 'include' },
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
