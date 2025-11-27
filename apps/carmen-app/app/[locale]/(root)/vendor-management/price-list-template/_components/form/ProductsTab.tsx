"use client";

import ProductTreeMoq from "@/components/lookup/product-tree-moq/ProductTreeMoq";
import TableProductView from "./TableProductView";
import { InitialProduct } from "@/components/lookup/product-tree-moq/types";

interface Props {
  onProductSelect?: (products: { id: string; moq?: any[] }[]) => void;
  initialProducts?: InitialProduct[];
  isViewMode: boolean;
}

export default function ProductsTab({ onProductSelect, initialProducts = [], isViewMode }: Props) {
  const initProductKeys = initialProducts.map((product) => product.id);

  return (
    <>
      {isViewMode ? (
        <TableProductView initialProducts={initialProducts} />
      ) : (
        <ProductTreeMoq
          key={initProductKeys.join("-")}
          onSelect={onProductSelect}
          initialSelectedIds={initProductKeys}
          initialProducts={initialProducts}
        />
      )}
    </>
  );
}
