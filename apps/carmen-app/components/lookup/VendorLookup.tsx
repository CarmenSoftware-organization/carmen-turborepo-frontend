import { PropsLookup } from "@/dtos/lookup.dto";
import { useVendor } from "@/hooks/useVendor";
import { useMemo, useState } from "react";
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
import { Check, ChevronsUpDown, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useAuth } from "@/context/AuthContext";
import { VendorGetDto } from "@/dtos/vendor-management";

export default function VendorLookup({
    value,
    onValueChange,
    placeholder = "Select vendor",
    disabled = false
}: Readonly<PropsLookup>) {
    const { token, tenantId } = useAuth();
    const { vendors, isLoading } = useVendor(token, tenantId);
    const [open, setOpen] = useState(false);

    const vendorsData = vendors?.data ?? [];

    const selectedVendorName = useMemo(() => {
        if (!value || !vendorsData || !Array.isArray(vendorsData)) return null;
        const found = vendorsData?.find((vendor: VendorGetDto) => vendor.id === value);
        return found?.name ?? null;
    }, [value, vendorsData, onValueChange]);

    return (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
                <Button
                    variant="outline"
                    aria-expanded={open}
                    className="w-full justify-between"
                    disabled={disabled}
                >
                    {value && selectedVendorName ? selectedVendorName : placeholder}
                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-full p-0">
                <Command filter={(value, search) => {
                    if (!search) return 1;
                    if (value.toLowerCase().includes(search.toLowerCase())) return 1;
                    return 0;
                }}>
                    <CommandInput placeholder="Search vendor..." className="w-full pr-10" />
                    <CommandList>
                        {isLoading ? (
                            <div className="flex items-center justify-center py-6">
                                <Loader2 className="h-6 w-6 animate-spin text-gray-400" />
                            </div>
                        ) : (
                            <>
                                <CommandEmpty>No vendors found.</CommandEmpty>
                                <CommandGroup>
                                    {vendorsData && vendorsData.length > 0 ? (
                                        vendorsData.map((vendor: VendorGetDto) => (
                                            <CommandItem
                                                key={vendor.id}
                                                value={vendor.name}
                                                onSelect={() => {
                                                    if (vendor.id) {
                                                        onValueChange(vendor.id);
                                                    }
                                                    setOpen(false);
                                                }}
                                            >
                                                {vendor.name}
                                                <Check
                                                    className={cn(
                                                        "ml-auto h-4 w-4",
                                                        value === vendor.id ? "opacity-100" : "opacity-0"
                                                    )}
                                                />
                                            </CommandItem>
                                        ))
                                    ) : (
                                        <CommandItem disabled>No vendors available.</CommandItem>
                                    )}
                                </CommandGroup>
                            </>
                        )}
                    </CommandList>
                </Command>
            </PopoverContent>
        </Popover>
    )
}