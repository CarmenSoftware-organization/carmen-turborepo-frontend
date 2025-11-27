import { useCallback, useEffect, useRef } from "react";
import { useProductSelection } from "./hooks/useProductSelection";
import { TreeNodeData } from "./types";
import { useTree } from "@headless-tree/react";
import { ProductsMoqSelect } from "./ProductsMoqSelect";
import { ProductTreeMoqView } from "./ProductTreeMoqView";
import { hotkeysCoreFeature, syncDataLoaderFeature } from "@headless-tree/core";

interface ProductTreeMoqContentProps {
  items: Record<string, TreeNodeData>;
  rootItems: string[];
  onSelect?: (productIds: { id: string }[]) => void;
  selectedIds: Set<string>;
  setSelectedIds: React.Dispatch<React.SetStateAction<Set<string>>>;
  selectedItemsCache: Record<string, TreeNodeData>;
  setSelectedItemsCache: React.Dispatch<React.SetStateAction<Record<string, TreeNodeData>>>;
  initialProducts: { key: string; title: string }[];
}

export default function ProductTreeMoqContent({
  items,
  rootItems,
  onSelect,
  selectedIds,
  setSelectedIds,
  selectedItemsCache,
  setSelectedItemsCache,
  initialProducts,
}: ProductTreeMoqContentProps) {
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

  return (
    <div className="flex flex-col">
      <div className="grid grid-cols-2 gap-4 flex-1 overflow-hidden">
        {/* Left Panel: Selected Products */}
        <ProductsMoqSelect
          allProducts={allProducts}
          onRemoveProduct={handleRemoveProduct}
          onRemoveAll={handleRemoveAll}
          hasSelectedProducts={selectedIds.size > 0}
        />

        {/* Right Panel: Tree View */}
        <ProductTreeMoqView
          tree={tree}
          getCheckboxState={getCheckboxState}
          handleCheckboxChange={handleCheckboxChange}
        />
      </div>
    </div>
  );
}
