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
import { PropsLookup } from "@/dtos/lookup.dto";
import { useStoreLocation } from "@/hooks/useStoreLocation";
export default function LocationLookup({
    value,
    onValueChange,
    placeholder = "Select location",
    disabled = false
}: Readonly<PropsLookup>) {
    const [open, setOpen] = useState(false);
    const { storeLocations, isLoading } = useStoreLocation();

    const selectedLocationName = useMemo(() => {
        if (!value || !storeLocations || !Array.isArray(storeLocations)) return null;
        const found = storeLocations.find(location => location.id === value);
        return found?.name ?? null;
    }, [value, storeLocations]);

    return (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
                <Button
                    variant="outline"
                    aria-expanded={open}
                    className="w-full justify-between"
                    disabled={disabled}
                >
                    {value && selectedLocationName ? selectedLocationName : placeholder}
                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-full p-0">
                <Command filter={(value, search) => {
                    if (!search) return 1;
                    if (value.toLowerCase().includes(search.toLowerCase())) return 1;
                    return 0;
                }}>
                    <CommandInput placeholder="Search location..." className="w-full pr-10" />
                    <CommandList>
                        {isLoading ? (
                            <div className="fxr-c justify-center py-6">
                                <Loader2 className="h-6 w-6 animate-spin text-gray-400" />
                            </div>
                        ) : (
                            <>
                                <CommandEmpty>No locations found.</CommandEmpty>
                                <CommandGroup>
                                    {storeLocations && storeLocations.length > 0 ? (
                                        storeLocations.map((storeLocation) => (
                                            <CommandItem
                                                key={storeLocation.id}
                                                value={storeLocation.name}
                                                onSelect={() => {
                                                    if (storeLocation.id) {
                                                        onValueChange(storeLocation.id);
                                                    }
                                                    setOpen(false);
                                                }}
                                            >
                                                {storeLocation.name}
                                                <Check
                                                    className={cn(
                                                        "ml-auto h-4 w-4",
                                                        value === storeLocation.id ? "opacity-100" : "opacity-0"
                                                    )}
                                                />
                                            </CommandItem>
                                        ))
                                    ) : (
                                        <CommandItem disabled>No locations available.</CommandItem>
                                    )}
                                </CommandGroup>
                            </>
                        )}
                    </CommandList>
                </Command>
            </PopoverContent>
        </Popover>
    );
}