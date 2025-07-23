import { useAuth } from "@/context/AuthContext";
import { useProductLocation } from "@/hooks/useProductLocation";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Loader2 } from "lucide-react";

interface ProductLocationLookupProps {
    location_id: string;
    value: string;
    onValueChange: (value: string, inventoryUnit?: { id: string; name: string }) => void;
    placeholder?: string;
    disabled?: boolean;
}

export default function ProductLocationLookup({
    location_id,
    value,
    onValueChange,
    placeholder = "Select product location",
    disabled = false,
}: ProductLocationLookupProps) {
    const { token, tenantId } = useAuth();

    const { productLocation, isLoading } = useProductLocation(
        token,
        tenantId,
        location_id
    );

    const productLocationData = productLocation?.data?.data;

    return (
        <Select
            value={value}
            onValueChange={(selectedValue) => {
                const selectedProduct = productLocation?.data?.data.find((p: any) => p.id === selectedValue);
                onValueChange(selectedValue, selectedProduct?.inventory_unit);
            }}
            disabled={disabled}
        >
            <SelectTrigger className="w-full">
                <SelectValue placeholder={placeholder} />
            </SelectTrigger>
            <SelectContent>
                {isLoading ? (
                    <SelectItem value="loading" disabled>
                        <Loader2 className="h-4 w-4 animate-spin text-gray-400" />
                    </SelectItem>
                ) : productLocationData?.length === 0 ? (
                    <SelectItem value="empty" disabled>
                        No data
                    </SelectItem>
                ) : (
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    productLocationData?.map((productLocation: any) => (
                        <SelectItem key={productLocation.id} value={productLocation.id}>
                            {productLocation.name}
                        </SelectItem>
                    ))
                )}
            </SelectContent>
        </Select>
    );
}