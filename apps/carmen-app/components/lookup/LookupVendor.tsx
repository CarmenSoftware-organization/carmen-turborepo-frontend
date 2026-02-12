import { PropsLookup } from "@/dtos/lookup.dto";
import { useVendor } from "@/hooks/use-vendor";
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
import { useAuth } from "@/context/AuthContext";
import { VendorGetDto } from "@/dtos/vendor-management";
import { useTranslations } from "next-intl";
import { Badge } from "../ui/badge";

interface LookupVendorProps extends PropsLookup {
  readonly onSelectObject?: (obj: VendorGetDto) => void;
  readonly initialDisplayName?: string;
}

export default function LookupVendor({
  value,
  onValueChange,
  disabled = false,
  classNames,
  excludeIds = [],
  onSelectObject,
  initialDisplayName,
}: Readonly<LookupVendorProps>) {
  const { token, buCode } = useAuth();
  const tCommon = useTranslations("Common");
  const tVendor = useTranslations("Vendor");
  const { vendors, isLoading } = useVendor(token, buCode, { perpage: -1 });
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");

  const vendorsData = useMemo(() => {
    const data = vendors?.data ?? [];
    if (excludeIds.length > 0) {
      return data.filter((v: VendorGetDto) => !excludeIds.includes(v.id));
    }
    return data;
  }, [vendors?.data, excludeIds]);

  const selectedVendorName = useMemo(() => {
    if (!value) return null;
    if (!vendorsData || !Array.isArray(vendorsData)) {
      return initialDisplayName || null;
    }
    const found = vendorsData?.find((vendor: VendorGetDto) => vendor.id === value);
    return found?.name ?? initialDisplayName ?? null;
  }, [value, vendorsData, initialDisplayName]);

  const filteredVendors = useMemo(() => {
    if (!vendorsData) return [];
    if (!search) return vendorsData.slice(0, 50);

    const lowerSearch = search.toLowerCase();
    return vendorsData
      .filter(
        (v: VendorGetDto) =>
          v.name.toLowerCase().includes(lowerSearch) || v.code.toLowerCase().includes(lowerSearch)
      )
      .slice(0, 50);
  }, [vendorsData, search]);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          aria-expanded={open}
          className={cn("w-full justify-between", classNames)}
          disabled={disabled}
        >
          {value && selectedVendorName ? (
            <span>{selectedVendorName}</span>
          ) : (
            <span className="text-muted-foreground/40">{tVendor("select_vendor")}</span>
          )}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-full p-0">
        <Command shouldFilter={false}>
          <CommandInput
            placeholder={tCommon("search")}
            className="w-full pr-10"
            value={search}
            onValueChange={setSearch}
          />
          <CommandList>
            {isLoading ? (
              <div className="flex items-center justify-center py-3">
                <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
              </div>
            ) : (
              <>
                {filteredVendors.length === 0 && (
                  <CommandEmpty>{tVendor("no_vendor_found")}</CommandEmpty>
                )}
                <CommandGroup>
                  {filteredVendors.map((vendor: VendorGetDto) => (
                    <CommandItem
                      key={vendor.id}
                      value={vendor.id} // Use ID as value since we manage filtering
                      onSelect={() => {
                        if (vendor.id) {
                          onValueChange(vendor.id);
                          if (onSelectObject) {
                            onSelectObject(vendor);
                          }
                        }
                        setOpen(false);
                      }}
                    >
                      <Badge variant={"product_badge"} className="text-xs">
                        {vendor.code}
                      </Badge>
                      - {vendor.name}
                      <Check
                        className={cn(
                          "ml-auto h-4 w-4",
                          value === vendor.id ? "opacity-100" : "opacity-0"
                        )}
                      />
                    </CommandItem>
                  ))}
                  {vendorsData.length > 50 && filteredVendors.length === 50 && (
                    <div className="p-2 text-xs text-center text-muted-foreground">
                      {search ? "Keep typing for more results..." : "Type to search..."}
                    </div>
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
