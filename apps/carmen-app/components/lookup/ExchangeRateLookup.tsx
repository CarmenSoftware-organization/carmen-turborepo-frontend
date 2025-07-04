"use client";

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
import { Check, ChevronsUpDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { PropsLookup } from "@/dtos/lookup.dto";
import { useExchangeRate } from "@/hooks/useExchangeRate";
import currenciesIso from "@/constants/currency";

type ExchangeRateLookupProps = PropsLookup & {
  baseCurrency?: string;
  showExchangeRate?: boolean;
};

export default function ExchangeRateLookup({
  value,
  onValueChange,
  placeholder = "Select currency",
  disabled = false,
  baseCurrency = "THB",
  showExchangeRate = false,
}: Readonly<ExchangeRateLookupProps>) {
  const { exchangeRates, isLoading } = useExchangeRate({ baseCurrency });
  const [open, setOpen] = useState(false);

  const selectedCurrency = useMemo(() => {
    if (!value || !currenciesIso) return null;
    const found = currenciesIso.find((currency) => currency.code === value);
    return found ?? null;
  }, [value]);

  const availableCurrencies = useMemo(() => {
    if (!currenciesIso) return [];

    // Sort currencies by code for better UX
    return [...currenciesIso].sort((a, b) => a.code.localeCompare(b.code));
  }, []);

  const getSelectedDisplayText = () => {
    if (!value || !selectedCurrency) return placeholder;
    return selectedCurrency.code;
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          aria-expanded={open}
          className="w-full justify-between"
          disabled={disabled || isLoading}
        >
          {getSelectedDisplayText()}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-full p-0">
        <Command
          filter={(value, search) => {
            if (!search) return 1;
            const searchLower = search.toLowerCase();
            if (value.toLowerCase().includes(searchLower)) return 1;
            return 0;
          }}
        >
          <CommandInput
            placeholder="Search currency..."
            className="w-full pr-10"
          />
          <CommandList>
            <CommandEmpty>No currencies found.</CommandEmpty>
            <CommandGroup>
              {availableCurrencies && availableCurrencies.length > 0 ? (
                availableCurrencies.map((currency) => (
                  <CommandItem
                    key={currency.code}
                    value={`${currency.code} ${currency.name} ${currency.country}`}
                    onSelect={() => {
                      onValueChange(currency.code);
                      setOpen(false);
                    }}
                    className="flex items-center justify-between"
                  >
                    <div className="flex flex-col">
                      <div className="flex items-center gap-2">
                        <span className="font-medium">{currency.code}</span>
                        <span className="text-sm text-muted-foreground">
                          {currency.symbol}
                        </span>
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {currency.name} • {currency.country}
                      </div>
                      {showExchangeRate && exchangeRates[currency.code] && (
                        <div className="text-xs text-blue-600 font-mono">
                          Rate: {exchangeRates[currency.code].toFixed(4)}
                        </div>
                      )}
                    </div>
                    <Check
                      className={cn(
                        "ml-auto h-4 w-4",
                        value === currency.code ? "opacity-100" : "opacity-0"
                      )}
                    />
                  </CommandItem>
                ))
              ) : (
                <CommandItem disabled>No currencies available.</CommandItem>
              )}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
