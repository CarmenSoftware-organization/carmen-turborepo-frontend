import { useCallback, useMemo } from "react";
import { InitialProduct, TreeNodeData } from "../types";
import { getAllProductIds } from "../tree-builder";

interface UseProductSelectionProps {
  items: Record<string, TreeNodeData>;
  selectedIds: Set<string>;
  selectedItemsCache: Record<string, TreeNodeData>;
  setSelectedIds: React.Dispatch<React.SetStateAction<Set<string>>>;
  setSelectedItemsCache: React.Dispatch<React.SetStateAction<Record<string, TreeNodeData>>>;
  initialProducts: InitialProduct[];
}

export function useProductSelection({
  items,
  selectedIds,
  selectedItemsCache,
  setSelectedIds,
  setSelectedItemsCache,
  initialProducts,
}: UseProductSelectionProps) {
  const handleProductSelection = useCallback(
    (itemId: string, item: TreeNodeData, checked: boolean, newSet: Set<string>) => {
      if (checked) {
        newSet.add(itemId);
        setSelectedItemsCache((prevCache) => ({
          ...prevCache,
          [itemId]: item,
        }));
      } else {
        newSet.delete(itemId);
      }
    },
    [setSelectedItemsCache]
  );

  const handleGroupSelection = useCallback(
    (itemId: string, checked: boolean, newSet: Set<string>) => {
      const productIds = getAllProductIds(itemId, items, selectedItemsCache);

      if (checked) {
        const newCache: Record<string, TreeNodeData> = {};
        for (const id of productIds) {
          newSet.add(id);
          const productItem = items[id] || selectedItemsCache[id];
          if (productItem) {
            newCache[id] = productItem;
          }
        }
        setSelectedItemsCache((prevCache) => ({
          ...prevCache,
          ...newCache,
        }));
      } else {
        for (const id of productIds) {
          newSet.delete(id);
        }
      }
    },
    [items, selectedItemsCache, setSelectedItemsCache]
  );

  const handleCheckboxChange = useCallback(
    (itemId: string, checked: boolean) => {
      const item = items[itemId] || selectedItemsCache[itemId];
      if (!item) return;

      setSelectedIds((prev) => {
        const newSet = new Set(prev);

        if (item.type === "product") {
          handleProductSelection(itemId, item, checked, newSet);
        } else {
          handleGroupSelection(itemId, checked, newSet);
        }

        return newSet;
      });
    },
    [items, selectedItemsCache, setSelectedIds, handleProductSelection, handleGroupSelection]
  );

  const getCheckboxState = useCallback(
    (itemId: string): { checked: boolean; indeterminate: boolean } => {
      const item = items[itemId] || selectedItemsCache[itemId];
      if (!item) return { checked: false, indeterminate: false };

      if (item.type === "product") {
        return { checked: selectedIds.has(itemId), indeterminate: false };
      }

      const productIds = getAllProductIds(itemId, items, selectedItemsCache);
      const selectedCount = productIds.filter((id) => selectedIds.has(id)).length;

      if (selectedCount === 0) {
        return { checked: false, indeterminate: false };
      } else if (selectedCount === productIds.length) {
        return { checked: true, indeterminate: false };
      } else {
        return { checked: false, indeterminate: true };
      }
    },
    [items, selectedItemsCache, selectedIds]
  );

  const allProducts = useMemo(() => {
    // Convert initial products - only show if still selected
    const initial = initialProducts
      .filter((p) => selectedIds.has(`product-${p.id}`))
      .map((p) => {
        const item = items[`product-${p.id}`] || selectedItemsCache[`product-${p.id}`];
        return {
          id: p.id,
          name: item?.name || p.name,
          local_name: item?.local_name,
          code: item?.code,
          isInitial: true,
          product_category: item?.product_category,
          product_sub_category: item?.product_sub_category,
          product_item_group: item?.product_item_group,
          inventory_unit_id: item?.inventory_unit_id,
          inventory_unit_name: item?.inventory_unit_name,
        };
      });

    // Get newly selected products (not in initial)
    const initialIds = new Set(initialProducts.map((p) => p.id));
    const newlySelected = Array.from(selectedIds)
      .filter((id) => {
        const item = items[id] || selectedItemsCache[id];
        const productId = id.replace("product-", "");
        return item?.type === "product" && !initialIds.has(productId);
      })
      .map((id) => {
        const item = items[id] || selectedItemsCache[id];
        return {
          id: id.replace("product-", ""),
          name: item?.name || "",
          local_name: item?.local_name,
          code: item?.code,
          isInitial: false,
          product_category: item?.product_category,
          product_sub_category: item?.product_sub_category,
          product_item_group: item?.product_item_group,
          inventory_unit_id: item?.inventory_unit_id,
          inventory_unit_name: item?.inventory_unit_name,
        };
      });

    return [...newlySelected.reverse(), ...initial];
  }, [selectedIds, items, selectedItemsCache, initialProducts]);

  return {
    handleCheckboxChange,
    getCheckboxState,
    allProducts,
  };
}
