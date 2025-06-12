import { PropsLookup } from "@/dtos/lookup.dto";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Loader2 } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { useCreditTermQuery } from "@/hooks/useCreditTerm";
import { CreditTermGetAllDto } from "@/dtos/credit-term.dto";

export default function CreditTermLookup({
    value,
    onValueChange,
    placeholder = "Select credit term",
    disabled = false,
}: Readonly<PropsLookup>) {
    const { token, tenantId } = useAuth();

    const { creditTerms, isLoading } = useCreditTermQuery(
        token,
        tenantId
    );
    const creditTermsData = creditTerms?.data;

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
    };

    return (
        <Select value={value} onValueChange={onValueChange} disabled={disabled}>
            <SelectTrigger className="w-full">
                <SelectValue placeholder={placeholder} />
            </SelectTrigger>
            <SelectContent>
                {creditTermsData && creditTermsData.length > 0 ? (
                    creditTermsData?.map((item: CreditTermGetAllDto) => (
                        <SelectItem key={item.id} value={item.id}>
                            {item.name}
                        </SelectItem>
                    ))
                ) : (
                    <SelectItem value="empty" disabled>
                        No credit terms available.
                    </SelectItem>
                )}
            </SelectContent>
        </Select>
    );
}
