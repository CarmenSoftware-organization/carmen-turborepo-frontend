"use client";

import ProductTreeMoq from "@/components/lookup/product-tree-moq/ProductTreeMoq";
import { PriceListTemplateDetailsDto } from "@/dtos/price-list-template.dto";

type ProductDto = PriceListTemplateDetailsDto["products"][0];

interface Props {
  onProductSelect?: (products: { id: string; moq?: any[] }[]) => void;
  products?: ProductDto[];
  initialProducts?: { key: string; title: string; moq?: any[] }[];
  isViewMode?: boolean;
}

export default function ProductsTab({
  onProductSelect,
  products,
  initialProducts = [],
  isViewMode,
}: Props) {
  const initProductKeys = initialProducts.map((product) => product.key);

  return (
    <ProductTreeMoq
      key={initProductKeys.join("-")}
      onSelect={onProductSelect}
      initialSelectedIds={initProductKeys}
      initialProducts={initialProducts}
    />
  );
}
