import { ProductLocationDto } from "@/dtos/config.dto";
import { useTranslations } from "next-intl";
import { useState, useMemo } from "react";
import { Search, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface Props {
    products: ProductLocationDto[];
}

export default function TabUsersProduct({ products }: Props) {
    const tCommon = useTranslations("Common");
    const [searchQuery, setSearchQuery] = useState("");

    const filteredProducts = useMemo(() => {
        if (!searchQuery.trim()) return products;

        const query = searchQuery.toLowerCase();
        return products.filter((product) =>
            product.name.toLowerCase().includes(query)
        );
    }, [products, searchQuery]);

    const highlightText = (text: string, query: string, itemId: string) => {
        if (!query.trim()) return text;

        const regex = new RegExp(`(${query})`, "gi");
        const parts = text.split(regex);

        return parts.map((part, index) => {
            const uniqueKey = `${itemId}-${part}-${index}`;
            if (part.toLowerCase() === query.toLowerCase()) {
                return (
                    <mark
                        key={uniqueKey}
                        className="bg-yellow-200 dark:bg-yellow-900/50 text-foreground font-medium rounded px-0.5"
                    >
                        {part}
                    </mark>
                );
            }
            return <span key={uniqueKey}>{part}</span>;
        });
    };

    const handleClearSearch = () => {
        setSearchQuery("");
    };

    return (
        <div className="space-y-2">
            <div className="flex items-center justify-between gap-2">
                <h2 className="text-sm font-semibold">
                    {tCommon("products")} ({filteredProducts.length})
                </h2>

                <div className="relative w-64">
                    <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                        type="text"
                        placeholder={`${tCommon("search")}...`}
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-8 pr-8 h-8 text-sm"
                    />
                    {searchQuery && (
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={handleClearSearch}
                            className="absolute right-0 top-1/2 -translate-y-1/2 h-8 w-8 hover:bg-transparent"
                        >
                            <X className="h-3.5 w-3.5 text-muted-foreground hover:text-foreground" />
                        </Button>
                    )}
                </div>
            </div>

            {filteredProducts.length > 0 ? (
                <ul className="space-y-0.5 h-[300px] overflow-y-auto text-sm border border-border rounded-md">
                    {filteredProducts.map((product, index) => (
                        <li
                            key={product.id}
                            className={`text-xs p-2 hover:bg-muted/50 transition-colors ${index === filteredProducts.length - 1 ? "" : "border-b border-border/50"
                                }`}
                        >
                            {highlightText(product.name, searchQuery, product.id)}
                        </li>
                    ))}
                </ul>
            ) : (
                <div className="h-[300px] border border-border rounded-md flex items-center justify-center">
                    <p className="text-muted-foreground text-xs">
                        {tCommon("data_not_found")}
                    </p>
                </div>
            )}
        </div>
    );
}
