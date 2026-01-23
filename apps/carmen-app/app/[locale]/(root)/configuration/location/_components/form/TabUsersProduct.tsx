import { ProductLocationDto } from "@/dtos/location.dto";
import { useTranslations } from "next-intl";
import { useState, useMemo } from "react";
import SearchInput from "@/components/ui-custom/SearchInput";
import { Badge } from "@/components/ui/badge";

interface Props {
  products: ProductLocationDto[];
}

export default function TabUsersProduct({ products }: Props) {
  const tCommon = useTranslations("Common");
  const [searchQuery, setSearchQuery] = useState("");

  const filteredProducts = useMemo(() => {
    if (!searchQuery.trim()) return products;

    const query = searchQuery.toLowerCase();
    return products.filter((product) => product.name.toLowerCase().includes(query));
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

  return (
    <div className="space-y-2 w-full">
      <div className="flex items-center justify-between gap-2">
        <h2 className="text-sm font-semibold">
          {tCommon("products")} ({filteredProducts.length})
        </h2>
        <SearchInput
          defaultValue={searchQuery}
          onSearch={setSearchQuery}
          placeholder={tCommon("search")}
          data-id="bu-type-search-input"
        />
      </div>

      {filteredProducts.length > 0 ? (
        <ul className="h-[240px] w-full overflow-y-auto border border-border rounded-md">
          {filteredProducts.map((product, index) => (
            <li
              key={product.id}
              className={`text-xs p-2 hover:bg-muted/50 transition-colors ${index === filteredProducts.length - 1 ? "" : "border-b border-border/50"}`}
            >
              <div className="flex items-center gap-2">
                <span>{highlightText(product.name, searchQuery, product.id)}</span>
                {product.code && (
                  <Badge variant={"product_badge"} className="text-xs">
                    {product.code}
                  </Badge>
                )}
              </div>
            </li>
          ))}
        </ul>
      ) : (
        <div className="h-[240px] border border-border rounded-md flex items-center justify-center">
          <p className="text-muted-foreground text-xs">{tCommon("data_not_found")}</p>
        </div>
      )}
    </div>
  );
}
