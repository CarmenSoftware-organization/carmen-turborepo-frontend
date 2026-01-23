"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form } from "@/components/ui/form";
import { useAuth } from "@/context/AuthContext";
import { useCreateProductMutation, useUpdateProductMutation } from "@/hooks/use-product";
import { formType } from "@/dtos/form.dto";
import BasicInfo from "./BasicInfo";
import LocationInfo from "./LocationInfo";
import OrderUnit from "./OrderUnit";
import IngredientUnit from "./IngredientUnit";
import { useState, useMemo, useCallback, useEffect } from "react";
import { useRouter } from "@/lib/navigation";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/animate-ui/components/radix/tabs";
import { toastError, toastSuccess } from "@/components/ui-custom/Toast";
import { useTranslations } from "next-intl";
import { productFormSchema, ProductFormValues, ProductInitialValues } from "@/dtos/product.dto";
import ProductAttribute from "./ProductAttribute";

interface Props {
  readonly mode: formType;
  readonly initialValues?: ProductInitialValues;
}

export default function FormProduct({ mode, initialValues }: Props) {
  const { token, buCode } = useAuth();
  const tProducts = useTranslations("Products");
  const [currentMode, setCurrentMode] = useState<formType>(mode);
  const router = useRouter();

  const createProductMutation = useCreateProductMutation();
  const updateProductMutation = useUpdateProductMutation();

  const transformInitialValues = useMemo(() => {
    if (!initialValues)
      return {
        name: "",
        code: "",
        local_name: "",
        description: "",
        inventory_unit_id: "",
        product_status_type: "active" as const,
        product_item_group_id: "",
        product_info: {
          is_ingredients: false,
          price: 0,
          tax_type: "none" as const,
          tax_profile_id: "",
          tax_profile_name: "",
          tax_rate: 0,
          price_deviation_limit: 0,
          qty_deviation_limit: 0,
          is_used_in_recipe: false,
          is_sold_directly: false,
          barcode: "",
          info: [],
        },
        locations: {
          data: [],
          add: [],
          remove: [],
        },
        order_units: {
          data: [],
          add: [],
          update: [],
          remove: [],
        },
        ingredient_units: {
          data: [],
          add: [],
          update: [],
          remove: [],
        },
        product_category: {
          id: "",
          name: "",
        },
        product_sub_category: {
          id: "",
          name: "",
        },
        product_item_group: {
          id: "",
          name: "",
        },
      };

    return {
      id: initialValues.id ?? "",
      name: initialValues.name ?? "",
      code: initialValues.code ?? "",
      local_name: initialValues.local_name ?? "",
      description: initialValues.description ?? "",
      inventory_unit_id: initialValues.inventory_unit?.id ?? "",
      product_item_group_id:
        initialValues.product_item_group?.id ?? initialValues.product_item_group_id ?? "",
      product_status_type: "active",
      product_info: {
        id: initialValues.product_info?.id ?? "",
        is_ingredients: initialValues.product_info?.is_ingredients ?? false,
        price: initialValues.product_info?.price ?? initialValues.price ?? 0,
        tax_type: initialValues.product_info?.tax_type ?? initialValues.tax_type ?? "none",
        tax_profile_id:
          initialValues.product_info?.tax_profile_id ?? initialValues.tax_profile_id ?? "",
        tax_profile_name:
          initialValues.product_info?.tax_profile_name ?? initialValues.tax_profile_name ?? "",
        tax_rate: initialValues.product_info?.tax_rate ?? initialValues.tax_rate ?? 0,
        price_deviation_limit:
          initialValues.product_info?.price_deviation_limit ??
          initialValues.price_deviation_limit ??
          0,
        qty_deviation_limit:
          initialValues.product_info?.qty_deviation_limit ?? initialValues.qty_deviation_limit ?? 0,
        is_used_in_recipe:
          initialValues.product_info?.is_used_in_recipe ?? initialValues.is_used_in_recipe ?? false,
        is_sold_directly:
          initialValues.product_info?.is_sold_directly ?? initialValues.is_sold_directly ?? false,
        barcode: initialValues.product_info?.barcode ?? initialValues.barcode ?? "",
        info: initialValues.product_info?.info ?? initialValues.info ?? [],
      },
      locations: {
        data: Array.isArray(initialValues.locations)
          ? initialValues.locations.map((location) => ({
              id: location.id ?? "",
              location_id: location.location_id ?? "",
            }))
          : [],
        add: [],
        remove: [],
      },
      order_units: {
        data: Array.isArray(initialValues.order_units)
          ? initialValues.order_units.map((unit) => ({
              id: unit.id ?? "",
              from_unit_id: unit.from_unit_id ?? "",
              from_unit_name: unit.from_unit_name ?? "",
              from_unit_qty: unit.from_unit_qty ?? 0,
              to_unit_id: unit.to_unit_id ?? "",
              to_unit_name: unit.to_unit_name ?? "",
              to_unit_qty: unit.to_unit_qty ?? 0,
              is_default: unit.is_default ?? false,
              is_active: unit.is_active ?? true,
              description: unit.description ?? "",
            }))
          : [],
        add: [],
        update: [],
        remove: [],
      },
      ingredient_units: {
        data: Array.isArray(initialValues.ingredient_units)
          ? initialValues.ingredient_units.map((unit) => ({
              id: unit.id ?? "",
              from_unit_id: unit.from_unit_id ?? "",
              from_unit_name: unit.from_unit_name ?? "",
              from_unit_qty: unit.from_unit_qty ?? 0,
              to_unit_id: unit.to_unit_id ?? "",
              to_unit_name: unit.to_unit_name ?? "",
              to_unit_qty: unit.to_unit_qty ?? 0,
              is_default: unit.is_default ?? false,
              is_active: unit.is_active ?? true,
              description: unit.description ?? "",
            }))
          : [],
        add: [],
        update: [],
        remove: [],
      },
      product_item_group: {
        id: initialValues.product_item_group?.id ?? "",
        name: initialValues.product_item_group?.name ?? "",
      },
    };
  }, [initialValues]);

  const form = useForm<ProductFormValues>({
    resolver: zodResolver(productFormSchema),
    defaultValues: transformInitialValues as ProductFormValues,
  });

  useEffect(() => {
    form.reset(transformInitialValues as ProductFormValues);
  }, [transformInitialValues, form]);

  const onSubmit = useCallback(
    async (data: ProductFormValues) => {
      try {
        const {
          locations,
          order_units,
          ingredient_units,
          product_category,
          product_sub_category,
          product_item_group,
          ...restData
        } = data;

        const submitData = {
          ...restData,
          locations: {
            add: locations.add,
            remove: locations.remove?.map((item) => ({
              product_location_id: item.id,
            })),
          },
          order_units: {
            add: order_units.add,
            update: order_units.update,
            remove: order_units.remove?.map((item) => ({
              product_order_unit_id: item.product_order_unit_id,
            })),
          },
          ingredient_units: {
            add: ingredient_units.add,
            update: ingredient_units.update,
            remove: ingredient_units.remove?.map((item) => ({
              product_ingredient_unit_id: item.product_ingredient_unit_id,
            })),
          },
        };

        if (mode === formType.ADD) {
          const result = (await createProductMutation.mutateAsync({
            token,
            buCode,
            product: submitData,
          })) as { id?: string; data?: { id?: string } };

          toastSuccess({ message: "Product created successfully" });
          setCurrentMode(formType.VIEW);
          const resultId = result?.id || result?.data?.id;
          if (resultId) {
            const newUrl = globalThis.location.pathname.replace("/new", `/${resultId}`);
            router.replace(newUrl);
          } else {
            console.warn("No ID found in create product response, redirecting to list");
            router.push("/product-management/product");
          }
        } else {
          if (!submitData.id) {
            throw new Error("Product ID is required for update");
          }

          const result = (await updateProductMutation.mutateAsync({
            token,
            buCode,
            id: submitData.id,
            product: submitData,
          })) as { id?: string; data?: { id?: string } };

          if (result) {
            toastSuccess({ message: "Product updated successfully" });
            setCurrentMode(formType.VIEW);
          }
        }
      } catch (error) {
        console.error("Error submitting form:", error);
        toastError({ message: "Error submitting form" });
      }
    },
    [mode, token, buCode, router, createProductMutation, updateProductMutation]
  );

  const handleEditClick = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setCurrentMode(formType.EDIT);
  }, []);

  const handleCancelClick = useCallback(
    (e: React.MouseEvent) => {
      e.preventDefault();
      e.stopPropagation();
      if (currentMode === formType.ADD || currentMode === formType.VIEW) {
        router.push("/product-management/product");
      } else {
        setCurrentMode(formType.VIEW);
      }
    },
    [currentMode, router]
  );

  const onInvalid = useCallback(() => {
    toastError({ message: "กรุณากรอกข้อมูลให้ครบถ้วน" });
  }, []);

  const isUseinRecipe = form.getValues("product_info.is_used_in_recipe");

  console.log("watch form", form.watch());
  console.log("form error", form.formState.errors);

  return (
    <div className="m-4 pb-10">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit, onInvalid)} className="space-y-2">
          <BasicInfo
            control={form.control}
            currentMode={currentMode}
            handleEditClick={handleEditClick}
            handleCancelClick={handleCancelClick}
          />
          <Tabs defaultValue="general" className="pt-4">
            <TabsList>
              <TabsTrigger value="general">{tProducts("general")}</TabsTrigger>
              <TabsTrigger value="location">{tProducts("location")}</TabsTrigger>
              <TabsTrigger value="orderUnit">{tProducts("order_unit")}</TabsTrigger>
              <TabsTrigger value="ingredientUnit">{tProducts("ingredient_unit")}</TabsTrigger>
            </TabsList>
            <TabsContent value="general">
              <ProductAttribute control={form.control} currentMode={currentMode} />
            </TabsContent>
            <TabsContent value="location">
              <LocationInfo control={form.control} currentMode={currentMode} />
            </TabsContent>
            <TabsContent value="orderUnit">
              <OrderUnit control={form.control} currentMode={currentMode} />
            </TabsContent>
            <TabsContent value="ingredientUnit">
              <IngredientUnit
                control={form.control}
                currentMode={currentMode}
                isUseinRecipe={isUseinRecipe}
              />
            </TabsContent>
          </Tabs>
        </form>
      </Form>
    </div>
  );
}
