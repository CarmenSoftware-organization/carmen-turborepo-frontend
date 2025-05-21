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
    { value: 'd7780d8b-9712-4e32-9cc8-ac5b902ad40a', label: 'ต่ำกว่า 500 บาท', min: 0, max: 499 },
    { value: '977c658f-f7be-4b1b-962d-67bbe86b4289', label: '500 - 1,000 บาท', min: 500, max: 1000 },
    { value: '375ee3e3-2bde-4e3e-b73a-139f7b3dadba', label: '1,001 - 3,000 บาท', min: 1001, max: 3000 },
    { value: '01511c6c-9982-4ff3-8d1d-2c8607e10038', label: '3,001 - 5,000 บาท', min: 3001, max: 5000 },
    { value: 'fe6b5aa4-2d72-46f5-9e35-145a8a2fa5a6', label: 'มากกว่า 5,000 บาท', min: 5001, max: Infinity },
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
