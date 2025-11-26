import { useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Trash2 } from "lucide-react";
import { useTranslations } from "next-intl";
import SearchInput from "@/components/ui-custom/SearchInput";

interface SelectedProduct {
  id: string;
  name: string;
  local_name?: string;
  code?: string;
  isInitial: boolean;
  product_category?: { id: string; name: string };
  product_sub_category?: { id: string; name: string };
  product_item_group?: { id: string; name: string };
  inventory_unit_name?: string;
}

interface Props {
  readonly allProducts: SelectedProduct[];
  readonly onRemoveProduct: (productId: string) => void;
  readonly onRemoveAll: () => void;
  readonly hasSelectedProducts: boolean;
}

export function ProductsMoqSelect({
  allProducts,
  onRemoveProduct,
  onRemoveAll,
  hasSelectedProducts,
}: Props) {
  const [selectedSearchQuery, setSelectedSearchQuery] = useState("");
  const tCommon = useTranslations("Common");

  const filteredSelectedProducts = useMemo(() => {
    if (!selectedSearchQuery.trim()) return allProducts;

    const query = selectedSearchQuery.toLowerCase();
    return allProducts.filter((product) => {
      const nameMatch = product.name?.toLowerCase().includes(query);
      const localNameMatch = product.local_name?.toLowerCase().includes(query);
      const codeMatch = product.code?.toLowerCase().includes(query);
      return nameMatch || localNameMatch || codeMatch;
    });
  }, [allProducts, selectedSearchQuery]);

  return (
    <div className="border border-border rounded-lg p-4 flex flex-col h-full">
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-sm font-semibold">{tCommon("init_products")}</h3>
      </div>

      <div className="mt-2">
        <SearchInput
          defaultValue={selectedSearchQuery}
          onSearch={setSelectedSearchQuery}
          placeholder={tCommon("search")}
          data-id="product-location-search-input"
          containerClassName="w-full"
          inputClassName="h-8"
        />
      </div>

      <div className="flex-1 overflow-hidden pt-4">
        {filteredSelectedProducts.length === 0 ? (
          <div className="flex items-center justify-center h-full">
            <p className="text-xs text-muted-foreground">
              {selectedSearchQuery ? tCommon("no_data") : tCommon("not_product_selected")}
            </p>
          </div>
        ) : (
          <div className="flex flex-col h-full">
            <div className="flex items-center justify-between border-b border-border pb-2 mb-2">
              <Badge variant={"active"} className="text-xs">
                {tCommon("selected")} {filteredSelectedProducts.length}
              </Badge>
              {hasSelectedProducts && (
                <Button
                  variant="ghost"
                  size="sm"
                  data-id="remove-all-selected-products"
                  onClick={onRemoveAll}
                  className="text-destructive"
                >
                  <Trash2 />
                  {tCommon("un_select_all")}
                </Button>
              )}
            </div>
            <ScrollArea className="flex-1 max-h-[calc(80vh-250px)]">
              <div className="space-y-2 pr-4">
                {filteredSelectedProducts.map((product) => (
                  <div
                    key={product.id}
                    className="flex items-start justify-between p-3 border rounded-md bg-card"
                  >
                    <div className="flex-1 space-y-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <p className="text-sm font-medium">
                          {product.name}
                          {product.local_name && ` - ${product.local_name}`}
                        </p>
                        {product.code && (
                          <Badge variant={"product_badge"} className="text-xs">
                            {product.code}
                          </Badge>
                        )}
                        {product.inventory_unit_name && (
                          <Badge variant="outline" className="text-xs">
                            {product.inventory_unit_name}
                          </Badge>
                        )}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {product.product_category?.name} {">"} {product.product_sub_category?.name}{" "}
                        {">"} {product.product_item_group?.name}
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onRemoveProduct(product.id)}
                      data-id="remove-selected-product"
                      className="text-destructive h-8 w-8 p-0"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            </ScrollArea>
          </div>
        )}
      </div>
    </div>
  );
}
