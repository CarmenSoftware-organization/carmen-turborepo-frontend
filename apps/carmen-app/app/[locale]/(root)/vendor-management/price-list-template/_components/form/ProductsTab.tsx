"use client";

import { TreeProductLookup } from "@/components/lookup/tree-product";

import { PriceListTemplateDetailsDto } from "@/dtos/price-list-template.dto";

type ProductDto = PriceListTemplateDetailsDto["products"][0];

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
