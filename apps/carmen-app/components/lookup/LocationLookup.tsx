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
import { useAuth } from "@/context/AuthContext";
import { useLocationQuery } from "@/hooks/use-location";
import { StoreLocationDto } from "@/dtos/config.dto";

interface LocationLookupProps extends Omit<PropsLookup, 'onValueChange'> {
    onValueChange: (value: string, selectedLocation?: StoreLocationDto) => void;
}

export default function LocationLookup({
    value,
    onValueChange,
    placeholder = "Select location",
    disabled = false,
    classNames = ""
}: Readonly<LocationLookupProps>) {
    const [open, setOpen] = useState(false);
    const { token, buCode } = useAuth();

    const { data, isLoading } = useLocationQuery(token, buCode);

    const storeLocations = data?.data;

    const selectedLocationName = useMemo(() => {
        if (!value || !storeLocations || !Array.isArray(storeLocations)) return null;
        const found = storeLocations.find(location => location.id === value);
        return found?.name ?? null;
    }, [value, storeLocations]);

    return (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild className={classNames}>
                <Button
                    variant="outline"
                    aria-expanded={open}
                    className="w-full justify-between"
                    disabled={disabled}
                    title={value && selectedLocationName ? selectedLocationName : placeholder}
                >
                    <span className="truncate">
                        {value && selectedLocationName ? selectedLocationName : placeholder}
                    </span>
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
                            <div className="flex items-center justify-center py-6">
                                <Loader2 className="h-6 w-6 animate-spin text-gray-400" />
                            </div>
                        ) : (
                            <>
                                <CommandEmpty>No locations found.</CommandEmpty>
                                <CommandGroup>
                                    {storeLocations && storeLocations.length > 0 ? (
                                        storeLocations.map((storeLocation: StoreLocationDto) => (
                                            <CommandItem
                                                key={storeLocation.id}
                                                value={storeLocation.name}
                                                onSelect={() => {
                                                    if (storeLocation.id) {
                                                        onValueChange(storeLocation.id, storeLocation);
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