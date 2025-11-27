import { useCallback, useEffect, useRef, useState } from "react";
import { useProductSelection } from "./hooks/useProductSelection";
import { TreeNodeData, MoqItem } from "./types";
import { useTree } from "@headless-tree/react";
import { ProductsMoqSelect } from "./ProductsMoqSelect";
import { ProductTreeMoqView } from "./ProductTreeMoqView";
import { hotkeysCoreFeature, syncDataLoaderFeature } from "@headless-tree/core";

interface ProductTreeMoqContentProps {
  items: Record<string, TreeNodeData>;
  rootItems: string[];
  onSelect?: (products: { id: string; moq?: MoqItem[] }[]) => void;
  selectedIds: Set<string>;
  setSelectedIds: React.Dispatch<React.SetStateAction<Set<string>>>;
  selectedItemsCache: Record<string, TreeNodeData>;
  setSelectedItemsCache: React.Dispatch<React.SetStateAction<Record<string, TreeNodeData>>>;
  initialProducts: { key: string; title: string; moq?: MoqItem[] }[];
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

  const [moqData, setMoqData] = useState<Record<string, MoqItem[]>>(() => {
    const data: Record<string, MoqItem[]> = {};
    initialProducts.forEach((p) => {
      if (p.moq) {
        data[p.key] = p.moq;
      }
    });
    return data;
  });

  const handleMoqChange = useCallback((productId: string, items: MoqItem[]) => {
    setMoqData((prev) => ({ ...prev, [productId]: items }));
  }, []);

  // 4. Sync onSelect
  const previousDataRef = useRef<string>("");
  const onSelectRef = useRef(onSelect);

  useEffect(() => {
    onSelectRef.current = onSelect;
  }, [onSelect]);

  useEffect(() => {
    if (!onSelectRef.current) return;

    const allProductsData = Array.from(selectedIds)
      .filter((id) => {
        const item = items[id] || selectedItemsCache[id];
        return item?.type === "product";
      })
      .map((id) => {
        const cleanId = id.replace("product-", "");
        return {
          id: cleanId,
          moq: moqData[cleanId] || [],
        };
      });

    const currentDataString = JSON.stringify(allProductsData);

    if (currentDataString !== previousDataRef.current) {
      previousDataRef.current = currentDataString;
      onSelectRef.current(allProductsData);
    }
  }, [selectedIds, items, selectedItemsCache, moqData]);

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
      // Also remove MOQ data
      setMoqData((prev) => {
        const newState = { ...prev };
        delete newState[productId];
        return newState;
      });
    },
    [handleCheckboxChange]
  );

  const handleRemoveAll = useCallback(() => {
    setSelectedIds(new Set<string>());
    setSelectedItemsCache({});
    setMoqData({});
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
          moqData={moqData}
          onMoqChange={handleMoqChange}
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
