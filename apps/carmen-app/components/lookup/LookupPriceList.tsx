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
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "../ui/button";
import { cn } from "@/lib/utils";
import { useAuth } from "@/context/AuthContext";
import { usePriceList } from "@/hooks/use-price-list";
import { PriceListDto } from "@/dtos/price-list.dto";

export default function LookupPriceList({
  value,
  onValueChange,
  placeholder = "Select price range",
  disabled = false,
}: Readonly<PropsLookup>) {
  const { token, buCode } = useAuth();

  const { data, isLoading } = usePriceList(token, buCode);
  const priceLists = data?.data;

  const [open, setOpen] = useState(false);

  const selectedPriceList = useMemo(() => {
    if (!value || !priceLists || !Array.isArray(priceLists)) return null;
    const found = priceLists.find((price) => price.id === value);
    return found?.product_name ?? null;
  }, [value, priceLists]);

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
        <Command
          filter={(value: string, search: string) => {
            if (!search) return 1;
            if (value.toLowerCase().includes(search.toLowerCase())) return 1;
            return 0;
          }}
        >
          <CommandInput placeholder="Search price range..." className="w-full pr-10" />
          <CommandList>
            {isLoading ? (
              <div className="flex items-center justify-center py-3">
                <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
              </div>
            ) : (
              <>
                <CommandEmpty>No price ranges found.</CommandEmpty>
                <CommandGroup>
                  {priceLists && priceLists.length > 0 ? (
                    priceLists.map((priceItem: PriceListDto) => (
                      <CommandItem
                        key={priceItem.id}
                        value={priceItem.id}
                        onSelect={() => {
                          onValueChange(priceItem.id ?? "");
                          setOpen(false);
                        }}
                      >
                        {priceItem.vendor.name ?? ""}
                        <Check
                          className={cn(
                            "ml-auto h-4 w-4",
                            value === priceItem.id ? "opacity-100" : "opacity-0"
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
