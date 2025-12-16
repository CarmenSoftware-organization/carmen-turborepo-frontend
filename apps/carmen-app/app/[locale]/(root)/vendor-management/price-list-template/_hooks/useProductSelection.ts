import { useMemo, useCallback, useRef } from "react";
import { UseFormReturn } from "react-hook-form";
import { PriceListTemplateDetailsDto } from "@/dtos/price-list-template.dto";
import { FormValues } from "../_schema/price-list-template.schema";

export const useProductSelection = (
  templateData: PriceListTemplateDetailsDto | undefined,
  form: UseFormReturn<FormValues>
) => {
  const initProducts = useMemo(() => {
    return (
      templateData?.products?.map((product) => ({
        id: product.id,
        name: product.product_name || "",
        moq:
          product.moq?.map((m) => ({
            ...m,
            note: m.note || "",
          })) || [],
      })) || []
    );
  }, [templateData?.products]);

  const initProductKeys = useMemo(() => {
    return initProducts.map((product) => product.id);
  }, [initProducts]);

  const previousDataRef = useRef<string>("");

  const handleTreeProductSelect = useCallback(
    (products: { id: string; moq?: any[] }[]) => {
      // Deep compare to avoid infinite loops
      const currentDataString = JSON.stringify(products);
      if (currentDataString === previousDataRef.current) {
        return;
      }
      previousDataRef.current = currentDataString;

      const currentProductIds = initProductKeys.map((key) => key.toString());
      const newProductIds = products.map((p) => p.id);

      const toAdd = products
        .filter((p) => !currentProductIds.includes(p.id))
        .map((p) => ({
          product_id: p.id,
          moq: p.moq || [],
        }));

      const toRemove = currentProductIds
        .filter((id) => !newProductIds.includes(id))
        .map((id) => ({ id }));

      const toUpdate = products
        .filter((p) => {
          if (!currentProductIds.includes(p.id)) return false;
          const initialProduct = initProducts.find((ip) => ip.id === p.id);
          if (!initialProduct) return false;

          // Compare MOQ
          const initialMoq = initialProduct.moq || [];
          const currentMoq = p.moq || [];
          return JSON.stringify(initialMoq) !== JSON.stringify(currentMoq);
        })
        .map((p) => ({
          product_id: p.id,
          moq: p.moq || [],
        }));

      form.setValue("products", {
        add: toAdd,
        remove: toRemove,
        update: toUpdate,
      });
    },
    [initProductKeys, initProducts, form]
  );

  return {
    initProducts,
    handleTreeProductSelect,
  };
};
