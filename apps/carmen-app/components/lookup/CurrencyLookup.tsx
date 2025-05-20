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
import { useCurrency } from "@/hooks/useCurrency";
import { CurrencyDto } from "@/dtos/config.dto";
import { PropsLookup } from "@/dtos/lookup.dto";

export default function CurrencyLookup({
    value,
    onValueChange,
    placeholder = "Select currency",
    disabled = false
}: Readonly<PropsLookup>) {
    const { currencies, isLoading } = useCurrency();
    const [open, setOpen] = useState(false);

    const selectedCurrencyName = useMemo(() => {
        if (!value || !currencies || !Array.isArray(currencies)) return null;
        const found = currencies.find(currency => currency.id === value);
        return found?.code ?? null;
    }, [value, currencies]);

    return (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
                <Button
                    variant="outline"
                    aria-expanded={open}
                    className="w-full justify-between"
                    disabled={disabled}
                >
                    {value && selectedCurrencyName ? selectedCurrencyName : placeholder}
                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-full p-0">
                <Command filter={(value, search) => {
                    if (!search) return 1;
                    if (value.toLowerCase().includes(search.toLowerCase())) return 1;
                    return 0;
                }}>
                    <CommandInput placeholder="Search currency..." className="w-full pr-10" />
                    <CommandList>
                        {isLoading ? (
                            <div className="flex items-center justify-center py-6">
                                <Loader2 className="h-6 w-6 animate-spin text-gray-400" />
                            </div>
                        ) : (
                            <>
                                <CommandEmpty>No currencies found.</CommandEmpty>
                                <CommandGroup>
                                    {currencies && currencies.length > 0 ? (
                                        currencies.map((currency: CurrencyDto) => (
                                            <CommandItem
                                                key={currency.id}
                                                value={currency.id}
                                                onSelect={() => {
                                                    if (currency.id) {
                                                        onValueChange(currency.id);
                                                    }
                                                    setOpen(false);
                                                }}
                                            >
                                                {currency.code}
                                                <Check
                                                    className={cn(
                                                        "ml-auto h-4 w-4",
                                                        value === currency.id ? "opacity-100" : "opacity-0"
                                                    )}
                                                />
                                            </CommandItem>
                                        ))
                                    ) : (
                                        <CommandItem disabled>No currencies available.</CommandItem>
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