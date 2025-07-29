"use client";

import { useMemo, useState, forwardRef } from "react";
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
import { useCurrency } from "@/hooks/useCurrency";
import { CurrencyGetDto } from "@/dtos/currency.dto";

type ExchangeRateLookupProps = PropsLookup & {
  baseCurrency?: string;
  showExchangeRate?: boolean;
};

const ExchangeRateLookup = forwardRef<HTMLButtonElement, ExchangeRateLookupProps>(({
  value,
  onValueChange,
  placeholder = "Select currency",
  disabled = false,
  baseCurrency = "THB",
  showExchangeRate = false,
}, ref) => {
  const { exchangeRates, isLoading } = useExchangeRate({ baseCurrency });
  const { currencies } = useCurrency();

  const [open, setOpen] = useState(false);

  const selectedCurrency = useMemo(() => {
    if (!value || !currenciesIso) return null;
    const found = currenciesIso.find((currency) => currency.code === value);
    return found ?? null;
  }, [value]);

  const availableCurrencies = useMemo(() => {
    if (!currenciesIso) return [];

    const existingCodes = new Set(currencies?.map((currency: CurrencyGetDto) => currency.code) || []);

    return [...currenciesIso]
      .filter(currency => !existingCodes.has(currency.code))
      .sort((a, b) => a.code.localeCompare(b.code));
  }, [currencies]);

  const getSelectedDisplayText = () => {
    if (!value || !selectedCurrency) return placeholder;
    return selectedCurrency.code;
  };


  return (
    <Popover open={open} onOpenChange={setOpen} modal={true}>
      <PopoverTrigger asChild>
        <Button
          ref={ref}
          variant="outline"
          aria-expanded={open}
          className="w-full justify-between"
          disabled={disabled || isLoading}
        >
          {getSelectedDisplayText()}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent
        className="w-full p-0 z-[9999]"
        align="start"
        side="bottom"
        avoidCollisions={true}
        collisionPadding={8}
      >
        <Command
          filter={(value, search) => {
            if (!search) return 1;
            const searchLower = search.toLowerCase();
            if (value.toLowerCase().includes(searchLower)) return 1;
            return 0;
          }}
          className="w-full"
        >
          <CommandInput
            placeholder="Search currency..."
            className="w-full border-0 focus:ring-0"
          />
          <CommandList className="max-h-[280px] overflow-y-auto overscroll-contain">
            <CommandEmpty className="py-6 text-center text-sm">
              No currencies found.
            </CommandEmpty>
            <CommandGroup className="p-0">
              {availableCurrencies && availableCurrencies.length > 0 ? (
                availableCurrencies.map((currency) => (
                  <CommandItem
                    key={currency.code}
                    value={`${currency.code} ${currency.name} ${currency.country}`}
                    onSelect={() => {
                      onValueChange(currency.code);
                      setOpen(false);
                    }}
                    className="flex items-start justify-between p-3 cursor-pointer hover:bg-accent data-[selected=true]:bg-accent"
                  >
                    <div className="flex flex-col gap-1 flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="font-medium text-sm">{currency.code}</span>
                        <span className="text-xs text-muted-foreground bg-muted px-1.5 py-0.5 rounded">
                          {currency.symbol}
                        </span>
                      </div>
                      <div className="text-xs text-muted-foreground truncate">
                        {currency.name} • {currency.country}
                      </div>
                      {!!(showExchangeRate && exchangeRates[currency.code]) && (
                        <div className="text-xs text-blue-600 font-mono bg-blue-50 dark:bg-blue-950 px-1.5 py-0.5 rounded">
                          Rate: {exchangeRates[currency.code].toFixed(4)}
                        </div>
                      )}
                    </div>
                    <Check
                      className={cn(
                        "ml-2 h-4 w-4 flex-shrink-0",
                        value === currency.code ? "opacity-100" : "opacity-0"
                      )}
                    />
                  </CommandItem>
                ))
              ) : (
                <CommandItem disabled className="text-center py-6">
                  No currencies available.
                </CommandItem>
              )}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
});

ExchangeRateLookup.displayName = "ExchangeRateLookup";

export default ExchangeRateLookup;
