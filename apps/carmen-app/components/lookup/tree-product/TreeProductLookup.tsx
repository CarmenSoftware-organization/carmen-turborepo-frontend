"use client";

import { useState, useCallback, useMemo, memo, useEffect, useRef } from "react";
import { useTree } from "@headless-tree/react";
import { syncDataLoaderFeature, hotkeysCoreFeature } from "@headless-tree/core";
import { useProductQuery } from "@/hooks/use-product-query";
import { useAuth } from "@/context/AuthContext";
import { useTranslations } from "next-intl";
import SearchInput from "@/components/ui-custom/SearchInput";
import { TreeNodeData, ProductData } from "./types";
import { buildTreeStructure, getAllItemIds } from "./tree-builder";
import { useProductSelection } from "./hooks/useProductSelection";
import { SelectedProductsPanel } from "./_components/SelectedProductsPanel";
import { AvailableProductsPanel } from "./_components/AvailableProductsPanel";
interface TreeProductLookupProps {
  readonly onSelect?: (productIds: { id: string }[]) => void;
  readonly initialSelectedIds?: string[];
  readonly initialProducts?: { key: string; title: string }[];
}
export default function TreeProductLookup({
  onSelect,
  initialSelectedIds = [],
  initialProducts = [],
}: TreeProductLookupProps) {
  const { token, buCode } = useAuth();
  const tCommon = useTranslations("Common");
  const [searchTrigger, setSearchTrigger] = useState("");
  const [viewMode, setViewMode] = useState<"tree" | "list">("list");
  const [selectedIds, setSelectedIds] = useState<Set<string>>(
    new Set(initialSelectedIds.map((id) => `product-${id}`))
  );
  const [selectedItemsCache, setSelectedItemsCache] = useState<Record<string, TreeNodeData>>({});

  const handleSearch = useCallback((value: string) => {
    setSearchTrigger(value.trim());
  }, []);

  const { products, isLoading } = useProductQuery({
    token,
    buCode,
    params: {
      perpage: -1,
    },
  });

  const filteredProducts = useMemo(() => {
    if (!products?.data || !searchTrigger.trim()) {
      return products?.data || [];
    }

    const query = searchTrigger.toLowerCase().trim();
    return products.data.filter((product: ProductData) => {
      const nameLC = product.name?.toLowerCase();
      const localNameLC = product.local_name?.toLowerCase();
      return nameLC?.includes(query) || localNameLC?.includes(query);
    });
  }, [products?.data, searchTrigger]);

  const selectedProductIdsArray = useMemo(() => {
    return Array.from(selectedIds)
      .filter((id) => id.startsWith("product-"))
      .sort((a, b) => a.localeCompare(b));
  }, [selectedIds]);

  const { items, rootItems } = useMemo(() => {
    if (isLoading || !filteredProducts) {
      return { items: {}, rootItems: [] };
    }

    return buildTreeStructure(
      filteredProducts,
      products?.data,
      selectedProductIdsArray,
      !!searchTrigger.trim()
    );
  }, [filteredProducts, isLoading, selectedProductIdsArray, products?.data, searchTrigger]);

  const searchInput = (
    <div className="mt-2">
      <SearchInput
        defaultValue={searchTrigger}
        onSearch={handleSearch}
        placeholder={tCommon("search")}
        containerClassName="mb-2 w-full"
        inputClassName="h-8"
      />
    </div>
  );

  if (isLoading) {
    return (
      <div className="p-6 space-y-4">
        {searchInput}
        <p className="text-muted-foreground">{tCommon("loading")}</p>
      </div>
    );
  }

  return (
    <TreeProductLookupContent
      items={items}
      rootItems={rootItems}
      searchInput={searchInput}
      hasSearch={!!searchTrigger.trim()}
      onSelect={onSelect}
      selectedIds={selectedIds}
      setSelectedIds={setSelectedIds}
      selectedItemsCache={selectedItemsCache}
      setSelectedItemsCache={setSelectedItemsCache}
      initialProducts={initialProducts}
      viewMode={viewMode}
      setViewMode={setViewMode}
    />
  );
}

const TreeProductLookupContent = memo(function TreeProductLookupContent({
  items,
  rootItems,
  searchInput,
  hasSearch,
  onSelect,
  selectedIds,
  setSelectedIds,
  selectedItemsCache,
  setSelectedItemsCache,
  initialProducts = [],
  viewMode,
  setViewMode,
}: {
  items: Record<string, TreeNodeData>;
  rootItems: string[];
  searchInput: React.ReactNode;
  hasSearch: boolean;
  onSelect?: (productIds: { id: string }[]) => void;
  selectedIds: Set<string>;
  setSelectedIds: React.Dispatch<React.SetStateAction<Set<string>>>;
  selectedItemsCache: Record<string, TreeNodeData>;
  setSelectedItemsCache: React.Dispatch<React.SetStateAction<Record<string, TreeNodeData>>>;
  initialProducts?: { key: string; title: string }[];
  viewMode: "tree" | "list";
  setViewMode: React.Dispatch<React.SetStateAction<"tree" | "list">>;
}) {
  const { handleCheckboxChange, getCheckboxState, allProducts } = useProductSelection({
    items,
    selectedIds,
    selectedItemsCache,
    setSelectedIds,
    setSelectedItemsCache,
    initialProducts,
  });

  const previousSelectedIdsRef = useRef<string>("");

  useEffect(() => {
    if (onSelect) {
      const allProductIds = Array.from(selectedIds)
        .filter((id) => {
          const item = items[id] || selectedItemsCache[id];
          return item?.type === "product";
        })
        .map((id) => ({ id: id.replace("product-", "") }));

      // Create a string representation for comparison
      const currentIdsString = allProductIds.map((p) => p.id).sort().join(",");

      // Only call onSelect if the selected products have actually changed
      if (currentIdsString !== previousSelectedIdsRef.current) {
        previousSelectedIdsRef.current = currentIdsString;
        onSelect(allProductIds);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedIds]);

  const tree = useTree<TreeNodeData>({
    rootItemId: "root",
    getItemName: (item) => {
      const data = item.getItemData();
      if (data?.type === "product" && data.code && data.description) {
        return `${data.name} (${data.code}) - ${data.description}`;
      }
      return data?.name || "";
    },
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
        if (!item) {
          return [];
        }
        const children = item.children ?? [];
        return children;
      },
    },
    initialState: {
      expandedItems: hasSearch
        ? rootItems
            .flatMap((id) => getAllItemIds(id, items, selectedItemsCache))
            .filter((id) => items[id] && items[id]?.type !== "product")
        : rootItems.slice(0, 3).filter((id) => items[id]),
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

  return (
    <div className="h-full flex flex-col">
      <div className="grid grid-cols-2 gap-4 flex-1 overflow-hidden">
        <SelectedProductsPanel
          allProducts={allProducts}
          onRemoveProduct={handleRemoveProduct}
          onRemoveAll={handleRemoveAll}
          hasSelectedProducts={selectedIds.size > 0}
        />
        <AvailableProductsPanel
          searchInput={searchInput}
          viewMode={viewMode}
          setViewMode={setViewMode}
          rootItems={rootItems}
          items={items}
          tree={tree}
          selectedIds={selectedIds}
          getCheckboxState={getCheckboxState}
          handleCheckboxChange={handleCheckboxChange}
        />
      </div>
    </div>
  );
});
