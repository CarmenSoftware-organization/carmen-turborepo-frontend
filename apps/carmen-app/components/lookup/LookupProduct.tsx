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
import { useProductQuery } from "@/hooks/use-product-query";
import { Badge } from "../ui/badge";

interface LookupProductProps {
  readonly value?: string;
  readonly onValueChange: (value: string, selectedProduct?: any) => void;
  readonly placeholder?: string;
  readonly disabled?: boolean;
  readonly classNames?: string;
  readonly initialDisplayName?: string;
  readonly token: string;
  readonly buCode: string;
}

export default function LookupProduct({
  value,
  onValueChange,
  disabled = false,
  classNames,
  initialDisplayName,
  token,
  buCode,
}: Readonly<LookupProductProps>) {
  const { products, isLoading } = useProductQuery({
    token,
    buCode,
    params: { perpage: -1 },
  });

  const [open, setOpen] = useState(false);

  const selectedProductName = useMemo(() => {
    if (!value || !products?.data || !Array.isArray(products.data)) {
      return initialDisplayName || null;
    }
    const found = products.data.find((product: any) => product.id === value);
    if (!found) return initialDisplayName || null;
    return `${found.code} - ${found.name}`;
  }, [value, products, initialDisplayName]);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          aria-expanded={open}
          className={cn("w-full justify-between", classNames)}
          disabled={disabled}
        >
          <span className="truncate">
            {value && selectedProductName ? selectedProductName : "Select product"}
          </span>
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
          <CommandInput placeholder="Search products..." className="w-full pr-10" />
          <CommandList>
            {isLoading ? (
              <div className="flex items-center justify-center py-6">
                <Loader2 className="h-6 w-6 animate-spin text-gray-400" />
              </div>
            ) : (
              <>
                <CommandEmpty>No products found.</CommandEmpty>
                <CommandGroup>
                  {products?.data && products.data.length > 0 ? (
                    products.data.map((product: any) => (
                      <CommandItem
                        key={product.id}
                        value={product.id}
                        onSelect={() => {
                          if (product.id) {
                            onValueChange(product.id, product);
                          }
                          setOpen(false);
                        }}
                        className="flex items-center justify-between"
                      >
                        <span className="truncate flex-1 mr-2">
                          <Badge variant={"product_badge"}>{product.code}</Badge>- {product.name}
                        </span>
                        <Check
                          className={cn(
                            "h-4 w-4 shrink-0",
                            value === product.id ? "opacity-100" : "opacity-0"
                          )}
                        />
                      </CommandItem>
                    ))
                  ) : (
                    <CommandItem disabled>No products available.</CommandItem>
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
