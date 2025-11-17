"use client";

import { TreeProductLookup } from "@/components/lookup/tree-product";

interface ProductDto {
  id: string;
  name: string;
  code: string;
}

interface Props {
  onProductSelect?: (productIds: { id: string }[]) => void;
  products?: ProductDto[];
  isViewMode?: boolean;
}

export default function TabProducts({ onProductSelect, products = [], isViewMode = false }: Props) {
  const initProducts = products.map((product) => ({
    key: product.id,
    title: product.name,
  }));

  const initProductKeys = products.map((product) => product.id);

  return (
    <TreeProductLookup
      onSelect={onProductSelect}
      initialSelectedIds={initProductKeys}
      initialProducts={initProducts}
    />
  );
}
