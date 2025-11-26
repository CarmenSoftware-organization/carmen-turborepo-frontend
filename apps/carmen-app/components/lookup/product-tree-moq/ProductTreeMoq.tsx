"use client";

import { useState, useMemo, useRef, useEffect, useCallback } from "react";
import { useTree } from "@headless-tree/react";
import { syncDataLoaderFeature, hotkeysCoreFeature } from "@headless-tree/core";
import { useProductQuery } from "@/hooks/use-product-query";
import { useAuth } from "@/context/AuthContext";
import { TreeNodeData } from "../tree-product/types";
import { buildTreeStructure } from "../tree-product/tree-builder";
import { Tree as TreeStructure, TreeItem, TreeItemLabel } from "@/components/ui/tree";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ItemInstance } from "@headless-tree/core";
import { Checkbox } from "@/components/ui/checkbox";
import { ProductsMoqSelect } from "./ProductsMoqSelect";
import { useProductSelection } from "./hooks/useProductSelection";
import TreeProductLoading from "./TreeProductLoading";

interface Props {
  onSelect?: (productIds: { id: string }[]) => void;
  initialSelectedIds?: string[];
  initialProducts?: { key: string; title: string }[];
}

export default function ProductTreeMoq({
  onSelect,
  initialSelectedIds = [],
  initialProducts = [],
}: Props) {
  const { token, buCode } = useAuth();
  const [selectedIds, setSelectedIds] = useState<Set<string>>(
    new Set(initialSelectedIds.map((id) => `product-${id}`))
  );
  const [selectedItemsCache, setSelectedItemsCache] = useState<Record<string, TreeNodeData>>({});

  // 1. Fetch Data
  const { products, isLoading } = useProductQuery({
    token,
    buCode,
    params: {
      perpage: -1,
    },
  });

  console.log("products", products);

  // 2. Build Tree Structure
  const { items, rootItems } = useMemo(() => {
    if (isLoading || !products?.data) {
      return { items: {}, rootItems: [] };
    }

    // We pass empty array for selectedProductIds for now as we are not handling search yet
    return buildTreeStructure(products.data, products.data, [], false);
  }, [products?.data, isLoading]);

  // 3. Handle Selection Logic
  const { handleCheckboxChange, getCheckboxState, allProducts } = useProductSelection({
    items,
    selectedIds,
    selectedItemsCache,
    setSelectedIds,
    setSelectedItemsCache,
    initialProducts,
  });

  // 4. Sync onSelect
  const previousSelectedIdsRef = useRef<string>("");
  const onSelectRef = useRef(onSelect);

  useEffect(() => {
    onSelectRef.current = onSelect;
  }, [onSelect]);

  useEffect(() => {
    if (!onSelectRef.current) return;

    const allProductIds = Array.from(selectedIds)
      .filter((id) => {
        const item = items[id] || selectedItemsCache[id];
        return item?.type === "product";
      })
      .map((id) => ({ id: id.replace("product-", "") }));

    const currentIdsString = allProductIds
      .map((p) => p.id)
      .sort()
      .join(",");

    if (currentIdsString !== previousSelectedIdsRef.current) {
      previousSelectedIdsRef.current = currentIdsString;
      onSelectRef.current(allProductIds);
    }
  }, [selectedIds, items, selectedItemsCache]);

  // 5. Initialize Tree
  const tree = useTree<TreeNodeData>({
    rootItemId: "root",
    getItemName: (item) => item.getItemData().name,
    isItemFolder: (item) => {
      const children = item.getItemData()?.children ?? [];
      return children.length > 0;
    },
    dataLoader: {
      getItem: (itemId) => {
        if (itemId === "root") {
          return {
            id: "root",
            name: "Root",
            type: "category" as const,
            children: rootItems,
          } as TreeNodeData;
        }
        const item = items[itemId];
        if (!item) {
          return { id: itemId, name: "", type: "product" as const, children: [] } as TreeNodeData;
        }
        return item;
      },
      getChildren: (itemId) => {
        if (itemId === "root") return rootItems;
        const item = items[itemId];
        return item?.children ?? [];
      },
    },
    initialState: {
      expandedItems: rootItems.slice(0, 3).filter((id) => items[id]),
    },
    features: [syncDataLoaderFeature, hotkeysCoreFeature],
  });

  const handleRemoveProduct = useCallback(
    (productId: string) => {
      handleCheckboxChange(`product-${productId}`, false);
    },
    [handleCheckboxChange]
  );

  const handleRemoveAll = useCallback(() => {
    setSelectedIds(new Set<string>());
    setSelectedItemsCache({});
  }, [setSelectedIds, setSelectedItemsCache]);

  if (isLoading) {
    return <TreeProductLoading />;
  }

  const allItems = tree.getItems();

  return (
    <div className="h-[500px] flex flex-col">
      <div className="grid grid-cols-2 gap-4 flex-1 overflow-hidden">
        {/* Left Panel: Selected Products */}
        <ProductsMoqSelect
          allProducts={allProducts}
          onRemoveProduct={handleRemoveProduct}
          onRemoveAll={handleRemoveAll}
          hasSelectedProducts={selectedIds.size > 0}
        />

        {/* Right Panel: Tree View */}
        <div className="border rounded-md p-4 flex flex-col h-full">
          <h3 className="font-semibold mb-4">Product Tree (MOQ)</h3>
          <ScrollArea className="flex-1">
            <TreeStructure tree={tree} indent={24} toggleIconType="chevron" className="pr-4">
              {allItems.map((item: ItemInstance<TreeNodeData>) => {
                const data = item.getItemData();
                if (!data.name) return null;
                const checkboxState = getCheckboxState(data.id);

                return (
                  <TreeItem key={item.getId()} item={item}>
                    <TreeItemLabel>
                      {data.type === "product" ? (
                        <div className="flex items-center space-x-2 ml-4 w-full">
                          <div
                            className="cursor-pointer"
                            onClick={(e) => {
                              e.preventDefault();
                              e.stopPropagation();
                            }}
                          >
                            <Checkbox
                              checked={checkboxState.checked}
                              onCheckedChange={(checked) => {
                                handleCheckboxChange(data.id, checked === true);
                              }}
                            />
                          </div>
                          <p className="text-sm">
                            {data.name} {data.local_name ? `- ${data.local_name}` : ""}
                          </p>
                          <Badge variant="outline">{data.code}</Badge>
                        </div>
                      ) : (
                        <div className="flex items-center gap-2 w-full">
                          <div
                            className="cursor-pointer"
                            onClick={(e) => {
                              e.preventDefault();
                              e.stopPropagation();
                            }}
                          >
                            <Checkbox
                              checked={
                                checkboxState.indeterminate
                                  ? "indeterminate"
                                  : checkboxState.checked
                              }
                              onCheckedChange={(checked) => {
                                handleCheckboxChange(data.id, checked === true);
                              }}
                            />
                          </div>
                          <p className="text-sm font-medium">{data.name}</p>
                          <Badge variant="secondary">{data.children?.length || 0}</Badge>
                        </div>
                      )}
                    </TreeItemLabel>
                  </TreeItem>
                );
              })}
            </TreeStructure>
          </ScrollArea>
        </div>
      </div>
    </div>
  );
}
