import { useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Trash2 } from "lucide-react";
import { useTranslations } from "next-intl";
import SearchInput from "@/components/ui-custom/SearchInput";
import DeleteConfirmDialog from "@/components/ui-custom/DeleteConfirmDialog";
import { ProductCard } from "./ProductCard";
import { MoqItem } from "./types";

interface SelectedProduct {
  id: string;
  name: string;
  local_name?: string;
  code?: string;
  isInitial: boolean;
  product_category?: { id: string; name: string };
  product_sub_category?: { id: string; name: string };
  product_item_group?: { id: string; name: string };
  inventory_unit_id?: string;
  inventory_unit_name?: string;
}

interface Props {
  readonly allProducts: SelectedProduct[];
  readonly onRemoveProduct: (productId: string) => void;
  readonly onRemoveAll: () => void;
  readonly hasSelectedProducts: boolean;
  readonly moqData: Record<string, MoqItem[]>;
  readonly onMoqChange: (productId: string, items: MoqItem[]) => void;
}

export function ProductsMoqSelect({
  allProducts,
  onRemoveProduct,
  onRemoveAll,
  hasSelectedProducts,
  moqData,
  onMoqChange,
}: Props) {
  const [selectedSearchQuery, setSelectedSearchQuery] = useState("");
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
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
                <>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    data-id="remove-all-selected-products"
                    className="text-destructive"
                    onClick={() => setShowDeleteDialog(true)}
                  >
                    <Trash2 />
                    {tCommon("un_select_all")}
                  </Button>
                  <DeleteConfirmDialog
                    open={showDeleteDialog}
                    onOpenChange={setShowDeleteDialog}
                    onConfirm={() => {
                      onRemoveAll();
                      setShowDeleteDialog(false);
                    }}
                    title={tCommon("confirm_delete")}
                    description={tCommon("confirm_delete_all_products")}
                  />
                </>
              )}
            </div>
            <ScrollArea className="flex-1 max-h-[calc(100vh-250px)]">
              <div className="space-y-2">
                {filteredSelectedProducts.map((product) => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    onRemove={onRemoveProduct}
                    moqItems={moqData[product.id] || []}
                    onMoqChange={(items) => onMoqChange(product.id, items)}
                  />
                ))}
              </div>
            </ScrollArea>
          </div>
        )}
      </div>
    </div>
  );
}
