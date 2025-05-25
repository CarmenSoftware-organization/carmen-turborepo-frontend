import { PropsLookup } from "@/dtos/lookup.dto";
import { useState, useMemo } from "react";
import { Check, ChevronsUpDown, Loader2 } from "lucide-react";
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
import { Button } from "../ui/button";
import { cn } from "@/lib/utils";

type PriceList = {
    value: string;
    label: string;
    min: number;
    max: number;
}

const mockPriceList: PriceList[] = [
    { value: '14562d9e-b043-4bde-a410-1c1e1246f345', label: 'ต่ำกว่า 500 บาท', min: 0, max: 499 }
];

export default function PriceListLookup({
    value,
    onValueChange,
    placeholder = "Select price range",
    disabled = false,
}: Readonly<PropsLookup>) {
    const [open, setOpen] = useState(false);
    const [isLoading] = useState(false);

    const selectedPriceList = useMemo(() => {
        if (!value || !mockPriceList || !Array.isArray(mockPriceList)) return null;
        const found = mockPriceList.find(price => price.value === value);
        return found?.label ?? null;
    }, [value]);

    return (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
                <Button
                    variant="outline"
                    aria-expanded={open}
                    className="w-full justify-between"
                    disabled={disabled}
                >
                    {value && selectedPriceList ? selectedPriceList : placeholder}
                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-full p-0">
                <Command filter={(value: string, search: string) => {
                    if (!search) return 1;
                    if (value.toLowerCase().includes(search.toLowerCase())) return 1;
                    return 0;
                }}>
                    <CommandInput placeholder="Search price range..." className="w-full pr-10" />
                    <CommandList>
                        {isLoading ? (
                            <div className="flex items-center justify-center py-6">
                                <Loader2 className="h-6 w-6 animate-spin text-gray-400" />
                            </div>
                        ) : (
                            <>
                                <CommandEmpty>No price ranges found.</CommandEmpty>
                                <CommandGroup>
                                    {mockPriceList && mockPriceList.length > 0 ? (
                                        mockPriceList.map((priceItem) => (
                                            <CommandItem
                                                key={priceItem.value}
                                                value={priceItem.label}
                                                onSelect={() => {
                                                    onValueChange(priceItem.value);
                                                    setOpen(false);
                                                }}
                                            >
                                                {priceItem.label}
                                                <Check
                                                    className={cn(
                                                        "ml-auto h-4 w-4",
                                                        value === priceItem.value ? "opacity-100" : "opacity-0"
                                                    )}
                                                />
                                            </CommandItem>
                                        ))
                                    ) : (
                                        <CommandItem disabled>No price ranges available.</CommandItem>
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
