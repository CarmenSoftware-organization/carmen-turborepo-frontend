import { useMemo, useState } from "react";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Check, ChevronsUpDown, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { PropsLookup } from "@/dtos/lookup.dto";
import { useAuth } from "@/context/AuthContext";
import { useLocationQuery } from "@/hooks/use-locations";
import { StoreLocationDto } from "@/dtos/location.dto";
import { useTranslations } from "next-intl";

interface LocationLookupProps extends Omit<PropsLookup, "onValueChange"> {
  onValueChange: (value: string, selectedLocation?: StoreLocationDto) => void;
  excludeIds?: string[];
}

export default function LookupLocation({
  value,
  onValueChange,
  disabled = false,
  classNames = "",
  bu_code,
  excludeIds = [],
}: Readonly<LocationLookupProps>) {
  const [open, setOpen] = useState(false);
  const { token, buCode } = useAuth();
  const currentBuCode = bu_code ?? buCode;
  const t = useTranslations("StoreLocation");
  const { data, isLoading } = useLocationQuery(token, currentBuCode, { perpage: -1 });

  const storeLocations = data?.data;

  const filteredLocations = useMemo(() => {
    if (!storeLocations || !Array.isArray(storeLocations)) return [];
    if (excludeIds.length === 0) return storeLocations;
    return storeLocations.filter((location) => !excludeIds.includes(location.id));
  }, [storeLocations, excludeIds]);

  const selectedLocationName = useMemo(() => {
    if (!value || !storeLocations || !Array.isArray(storeLocations)) return null;
    const found = storeLocations.find((location) => location.id === value);
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
          title={value && selectedLocationName ? selectedLocationName : t("select_location")}
        >
          <span className="truncate text-muted-foreground/90">
            {selectedLocationName ?? t("select_location")}
          </span>
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-full p-0">
        <Command
          filter={(value, search) => {
            if (!search) return 1;
            if (value.toLowerCase().includes(search.toLowerCase())) return 1;
            return 0;
          }}
        >
          <CommandInput placeholder={t("search_location")} className="w-full pr-10" />
          <CommandList>
            {isLoading ? (
              <div className="flex items-center justify-center py-3">
                <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
              </div>
            ) : (
              <>
                <CommandEmpty>{t("location_not_found")}</CommandEmpty>
                <CommandGroup>
                  {filteredLocations && filteredLocations.length > 0 ? (
                    filteredLocations.map((storeLocation: StoreLocationDto) => (
                      <CommandItem
                        key={storeLocation.id}
                        value={`${storeLocation.code || ""} ${storeLocation.name}`}
                        onSelect={() => {
                          if (storeLocation.id) {
                            onValueChange(storeLocation.id, storeLocation);
                          }
                          setOpen(false);
                        }}
                      >
                        {storeLocation.code} - {storeLocation.name}
                        <Check
                          className={cn(
                            "ml-auto h-4 w-4",
                            value === storeLocation.id ? "opacity-100" : "opacity-0"
                          )}
                        />
                      </CommandItem>
                    ))
                  ) : (
                    <CommandItem disabled>{t("no_locations_available")}</CommandItem>
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
