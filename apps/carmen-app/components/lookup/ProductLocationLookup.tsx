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
import { cn } from "@/lib/utils";
interface InventoryUnit {
    id: string;
    name: string;
}

interface ProductLocation {
    id: string;
    name: string;
    inventory_unit?: InventoryUnit;
}

interface ProductLocationLookupProps {
    location_id: string;
    value: string;
    onValueChange: (value: string, selectedProduct?: ProductLocation) => void;
    placeholder?: string;
    disabled?: boolean;
    classNames?: string;
}

export default function ProductLocationLookup({
    location_id,
    value,
    onValueChange,
    placeholder = "Select product location",
    disabled = false,
    classNames
}: ProductLocationLookupProps) {
    const { token, tenantId } = useAuth();

    const { productLocation, isLoading, error } = useProductLocation(
        token,
        tenantId,
        location_id
    );

    const productLocationData: ProductLocation[] = productLocation?.data?.data || [];

    const handleValueChange = (selectedValue: string) => {
        const selectedProduct = productLocationData.find(
            (p: ProductLocation) => p.id === selectedValue
        );
        onValueChange(selectedValue, selectedProduct);
    };

    // ถ้ามี error ให้แสดง error message
    if (error) {
        return (
            <Select disabled>
                <SelectTrigger className="w-full">
                    <SelectValue placeholder="Error loading data" />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="error" disabled>
                        Failed to load product locations
                    </SelectItem>
                </SelectContent>
            </Select>
        );
    }

    return (
        <Select
            key={`${location_id}-${value}`}
            value={value}
            onValueChange={handleValueChange}
            disabled={disabled || isLoading}
        >
            <SelectTrigger className={cn(classNames)}>
                <SelectValue placeholder={placeholder} />
            </SelectTrigger>
            <SelectContent>
                {!location_id ? (
                    <SelectItem value="no-location" disabled>
                        Please select a location first
                    </SelectItem>
                ) : isLoading ? (
                    <SelectItem value="loading" disabled>
                        <div className="flex items-center gap-2">
                            <Loader2 className="h-4 w-4 animate-spin" />
                            <span>Loading...</span>
                        </div>
                    </SelectItem>
                ) : productLocationData.length === 0 ? (
                    <SelectItem value="empty" disabled>
                        No products found for this location
                    </SelectItem>
                ) : (
                    productLocationData.map((productLocationItem: ProductLocation) => {
                        return (
                            <SelectItem
                                key={productLocationItem.id}
                                value={productLocationItem.id}
                            >
                                {productLocationItem.name}
                            </SelectItem>
                        );
                    })
                )}
            </SelectContent>
        </Select>
    );
}