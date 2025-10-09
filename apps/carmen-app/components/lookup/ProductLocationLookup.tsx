import { useAuth } from "@/context/AuthContext";
import { useProductLocation } from "@/hooks/useProductLocation";
import { useState } from "react";
import { Check, ChevronsUpDown, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
} from "@/components/ui/command";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";

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
    const [open, setOpen] = useState(false);

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
        setOpen(false);
    };

    const selectedProduct = productLocationData.find(p => p.id === value);

    // Determine button label
    const getButtonLabel = () => {
        if (isLoading) {
            return (
                <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Loading...
                </>
            );
        }
        if (selectedProduct) {
            return selectedProduct.name;
        }
        return placeholder;
    };

    // Determine empty message
    const getEmptyMessage = () => {
        if (productLocationData.length === 0) {
            return "No products found for this location";
        }
        return "No product found.";
    };

    // Error state
    if (error) {
        return (
            <Button
                variant="outline"
                disabled
                className={cn("justify-between", classNames)}
            >
                Error loading data
                <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
            </Button>
        );
    }

    // No location selected
    if (!location_id) {
        return (
            <Button
                variant="outline"
                disabled
                className={cn("justify-between", classNames)}
            >
                Please select a location first
                <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
            </Button>
        );
    }

    return (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
                <Button
                    variant="outline"
                    aria-expanded={open}
                    aria-haspopup="listbox"
                    disabled={disabled || isLoading}
                    className={cn("justify-between", classNames)}
                >
                    {getButtonLabel()}
                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-[300px] p-0" align="start">
                <Command>
                    <CommandInput placeholder="Search product..." />
                    <CommandList>
                        <CommandEmpty>
                            {getEmptyMessage()}
                        </CommandEmpty>
                        <CommandGroup>
                            {productLocationData.map((productLocationItem: ProductLocation) => (
                                <CommandItem
                                    key={productLocationItem.id}
                                    value={productLocationItem.name}
                                    onSelect={() => handleValueChange(productLocationItem.id)}
                                >
                                    <Check
                                        className={cn(
                                            "mr-2 h-4 w-4",
                                            value === productLocationItem.id ? "opacity-100" : "opacity-0"
                                        )}
                                    />
                                    {productLocationItem.name}
                                </CommandItem>
                            ))}
                        </CommandGroup>
                    </CommandList>
                </Command>
            </PopoverContent>
        </Popover>
    );
}
