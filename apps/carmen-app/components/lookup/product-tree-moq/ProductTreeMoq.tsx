"use client";

import { useState, useMemo } from "react";
import { useProductQuery } from "@/hooks/use-product-query";
import { useAuth } from "@/context/AuthContext";
import { TreeNodeData, MoqItem, InitialProduct } from "./types";
import { buildTreeStructure } from "./tree-builder";
import TreeProductLoading from "./TreeProductLoading";
import ProductTreeMoqContent from "./ProductTreeMoqContent";

interface Props {
  onSelect?: (products: { id: string; moq?: MoqItem[] }[]) => void;
  initialSelectedIds?: string[];
  initialProducts?: InitialProduct[];
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
  const [selectedItemsCache, setSelectedItemsCache] = useState<Record<string, TreeNodeData>>(() => {
    const cache: Record<string, TreeNodeData> = {};
    initialProducts.forEach((p) => {
      const id = `product-${p.id}`;
      cache[id] = {
        id,
        name: p.name,
        type: "product",
        children: [],
      } as TreeNodeData;
    });
    return cache;
  });

  // 1. Fetch Data
  const { products, isLoading } = useProductQuery({
    token,
    buCode,
    params: {
      perpage: -1,
    },
  });

  // 2. Build Tree Structure
  const { items, rootItems } = useMemo(() => {
    if (isLoading || !products?.data) {
      return { items: {}, rootItems: [] };
    }

    // We pass empty array for selectedProductIds for now as we are not handling search yet
    return buildTreeStructure(products.data, products.data, [], false);
  }, [products?.data, isLoading]);

  if (isLoading) {
    return <TreeProductLoading />;
  }

  return (
    <ProductTreeMoqContent
      items={items}
      rootItems={rootItems}
      onSelect={onSelect}
      selectedIds={selectedIds}
      setSelectedIds={setSelectedIds}
      selectedItemsCache={selectedItemsCache}
      setSelectedItemsCache={setSelectedItemsCache}
      initialProducts={initialProducts}
    />
  );
}
