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
import { PropsLookup } from "@/dtos/lookup.dto";
import useProduct from "@/hooks/useProduct";
import { ProductGetDto } from "@/dtos/product.dto";


export default function ProductLookup({
    value,
    onValueChange,
    placeholder = "Select Product",
    disabled = false
}: Readonly<PropsLookup>) {
    const { products, isLoading } = useProduct();
    const [open, setOpen] = useState(false);

    const selectedProductName = useMemo(() => {
        if (!value || !products || !Array.isArray(products)) return null;
        const found = products.find(product => product.id === value);
        const productName = found?.code + ' - ' + found?.name;
        return productName ?? null;
    }, [value, products]);


    console.log('selectedProductName', selectedProductName);

    return (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
                <Button
                    variant="outline"
                    aria-expanded={open}
                    className="w-full justify-between"
                    disabled={disabled}
                >
                    {value && selectedProductName ? selectedProductName : placeholder}
                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-full p-0">
                <Command filter={(value, search) => {
                    if (!search) return 1;
                    const searchLower = search.toLowerCase();
                    // Search in both the display value and individual code/name
                    if (value.toLowerCase().includes(searchLower)) return 1;
                    return 0;
                }}>
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
                                    {products && products.length > 0 ? (
                                        products.map((product: ProductGetDto) => (
                                            <CommandItem
                                                key={product.id}
                                                value={product.id}
                                                onSelect={() => {
                                                    if (product.id) {
                                                        onValueChange(product.id);
                                                    }
                                                    setOpen(false);
                                                }}
                                            >
                                                {product.code} - {product.name}
                                                <Check
                                                    className={cn(
                                                        "ml-auto h-4 w-4",
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
    )
}