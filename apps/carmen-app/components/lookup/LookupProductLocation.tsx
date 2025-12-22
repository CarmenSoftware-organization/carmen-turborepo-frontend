import { useAuth } from "@/context/AuthContext";
import { useProductLocation } from "@/hooks/use-product-location";
import { useState } from "react";
import { Check, ChevronsUpDown, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { useTranslations } from "next-intl";
import { Badge } from "../ui/badge";

interface InventoryUnit {
  id: string;
  name: string;
}

interface ProductLocation {
  id: string;
  name: string;
  code?: string;
  inventory_unit?: InventoryUnit;
}

interface ProductLocationLookupProps {
  readonly location_id: string;
  readonly value: string;
  readonly onValueChange: (value: string, selectedProduct?: ProductLocation) => void;
  readonly disabled?: boolean;
  readonly classNames?: string;
  readonly excludeProductIds?: string[];
}

export default function LookupProductLocation({
  location_id,
  value,
  onValueChange,
  disabled = false,
  classNames = "max-w-40",
  excludeProductIds = [],
}: ProductLocationLookupProps) {
  const { token, buCode } = useAuth();
  const [open, setOpen] = useState(false);
  const t = useTranslations("Products");

  const { productLocation, isLoading, error } = useProductLocation(token, buCode, location_id, {
    perpage: -1,
  });

  const allProducts: ProductLocation[] = productLocation?.data?.data || [];

  // Filter out excluded products, but keep current selected product
  const productLocationData = allProducts.filter(
    (p) => !excludeProductIds.includes(p.id) || p.id === value
  );

  const handleValueChange = (selectedValue: string) => {
    const selectedProduct = productLocationData.find(
      (p: ProductLocation) => p.id === selectedValue
    );
    onValueChange(selectedValue, selectedProduct);
    setOpen(false);
  };

  const selectedProduct = productLocationData.find((p) => p.id === value);

  const getButtonLabel = () => {
    if (isLoading) {
      return (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          <span className="truncate text-muted-foreground/90">{t("loading")}</span>
        </>
      );
    }
    if (selectedProduct) {
      return <span className="truncate">{selectedProduct.name}</span>;
    }
    return <span className="truncate text-muted-foreground/90">{t("select_product")}</span>;
  };

  const getButtonTitle = () => {
    if (selectedProduct) {
      return selectedProduct.name;
    }
    return t("select_product");
  };

  // Determine empty message
  const getEmptyMessage = () => {
    if (productLocationData.length === 0) {
      return t("no_product_location");
    }
    return t("no_product_found");
  };

  if (error) {
    return (
      <Button
        variant="outline"
        disabled
        className={cn("justify-between", classNames)}
        title="Error loading data"
      >
        <span className="truncate  text-muted-foreground/90">{t("err_load_product")}</span>
        <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
      </Button>
    );
  }

  if (!location_id) {
    return (
      <Button
        variant="outline"
        disabled
        className={cn("justify-between", classNames)}
        title="Please select a location first"
      >
        <span className="truncate text-muted-foreground/90">{t("pls_select_location")}</span>
        <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
      </Button>
    );
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          aria-expanded={open}
          aria-haspopup="listbox"
          disabled={disabled || isLoading}
          className={cn("justify-between", classNames)}
          title={isLoading ? t("loading") : getButtonTitle()}
        >
          {getButtonLabel()}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[400px] p-0" align="start">
        <Command>
          <CommandInput placeholder={t("search_product")} />
          <CommandList>
            <CommandEmpty>{getEmptyMessage()}</CommandEmpty>
            <CommandGroup>
              {productLocationData.map((productLocationItem: ProductLocation) => (
                <CommandItem
                  key={productLocationItem.id}
                  value={`${productLocationItem.code || ""} ${productLocationItem.name}`}
                  onSelect={() => handleValueChange(productLocationItem.id)}
                >
                  {productLocationItem.name} -
                  <Badge variant="product_badge">{productLocationItem.code}</Badge>
                  <Check
                    className={cn(
                      "mr-2 h-4 w-4",
                      value === productLocationItem.id ? "opacity-100" : "opacity-0"
                    )}
                  />
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
