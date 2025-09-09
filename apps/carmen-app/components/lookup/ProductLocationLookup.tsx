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
    readonly location_id: string;
    readonly value: string;
    readonly onValueChange: (value: string, selectedProduct?: ProductLocation) => void;
    readonly placeholder?: string;
    readonly disabled?: boolean;
    readonly classNames?: string;
}

export default function ProductLocationLookup({
    location_id,
    value,
    onValueChange,
    placeholder = "Select Product",
    disabled = false,
    classNames = "max-w-40"
}: ProductLocationLookupProps) {
    const { token, buCode } = useAuth();

    const { productLocation, isLoading, error } = useProductLocation(
        token,
        buCode,
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

    // Render content based on state
    let selectContent;

    if (!location_id) {
        selectContent = (
            <SelectItem value="no-location" disabled>
                Please select a location first
            </SelectItem>
        );
    } else if (isLoading) {
        selectContent = (
            <SelectItem value="loading" disabled>
                <div className="flex items-center gap-2">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    <span>Loading...</span>
                </div>
            </SelectItem>
        );
    } else if (productLocationData.length === 0) {
        selectContent = (
            <SelectItem value="empty" disabled>
                No products found for this location
            </SelectItem>
        );
    } else {
        selectContent = productLocationData.map((productLocationItem: ProductLocation) => (
            <SelectItem
                key={productLocationItem.id}
                value={productLocationItem.id}
            >
                {productLocationItem.name}
            </SelectItem>
        ));
    };

    return (
        <Select
            key={location_id}
            value={value}
            onValueChange={handleValueChange}
            disabled={disabled || isLoading}
        >
            <SelectTrigger className={cn(classNames)}>
                <SelectValue placeholder={placeholder} />
            </SelectTrigger>
            <SelectContent>
                {selectContent}
            </SelectContent>
        </Select>
    );
}