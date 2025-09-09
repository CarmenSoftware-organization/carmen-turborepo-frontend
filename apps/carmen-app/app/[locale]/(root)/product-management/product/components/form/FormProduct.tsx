"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form } from "@/components/ui/form";
import {
  createProductService,
  updateProductService,
} from "@/services/product.service";
import { useAuth } from "@/context/AuthContext";
import { formType } from "@/dtos/form.dto";
import BasicInfo from "./BasicInfo";
import LocationInfo from "./LocationInfo";
import OrderUnit from "./OrderUnit";
import IngredientUnit from "./IngredientUnit";
import ProductAttribute from "./ProductAttribute";
import {
  ProductFormValues,
  ProductInitialValues,
  productFormSchema,
} from "../../pd-schema";
import { useState } from "react";
import { useRouter } from "@/lib/navigation";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toastError, toastSuccess } from "@/components/ui-custom/Toast";
import { useTranslations } from "next-intl";

interface Props {
  readonly mode: formType;
  readonly initialValues?: ProductInitialValues;
}

export default function FormProduct({ mode, initialValues }: Props) {
  const { token, buCode } = useAuth();
  const tProducts = useTranslations("Products");
  const [currentMode, setCurrentMode] = useState<formType>(mode);
  const router = useRouter();

  const transformInitialValues = () => {
    if (!initialValues)
      return {
        name: "",
        code: "",
        local_name: "",
        description: "",
        inventory_unit_id: "",
        product_status_type: "active" as const,
        product_info: {
          product_item_group_id: "",
          is_ingredients: false,
          price: 0,
          tax_type: "none" as const,
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
      };

    return {
      id: initialValues.id ?? "",
      name: initialValues.name ?? "",
      code: initialValues.code ?? "",
      local_name: initialValues.local_name ?? "",
      description: initialValues.description ?? "",
      inventory_unit_id: initialValues.inventory_unit?.id ?? "",
      product_status_type: "active",
      product_info: {
        id: initialValues.product_info?.id ?? "",
        product_item_group_id: initialValues.product_item_group?.id ?? "",
        is_ingredients: initialValues.product_info?.is_ingredients ?? false,
        price: initialValues.product_info?.price ?? 0,
        tax_type:
          (initialValues.product_info?.tax_type as
            | "none"
            | "included"
            | "excluded") ?? "none",
        tax_rate: initialValues.product_info?.tax_rate ?? 0,
        price_deviation_limit:
          initialValues.product_info?.price_deviation_limit ?? 0,
        qty_deviation_limit:
          initialValues.product_info?.qty_deviation_limit ?? 0,
        is_used_in_recipe:
          initialValues.product_info?.is_used_in_recipe ?? false,
        is_sold_directly: initialValues.product_info?.is_sold_directly ?? false,
        barcode: initialValues.product_info?.barcode ?? "",
        info: initialValues.product_info?.info ?? [],
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
            from_unit_qty: unit.from_unit_qty ?? 0,
            to_unit_id: unit.to_unit_id ?? "",
            to_unit_qty: unit.to_unit_qty ?? 0,
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
            from_unit_qty: unit.from_unit_qty ?? 0,
            to_unit_id: unit.to_unit_id ?? "",
            to_unit_qty: unit.to_unit_qty ?? 0,
          }))
          : [],
        add: [],
        update: [],
        remove: [],
      },
      product_category: {
        id: initialValues.product_category?.id ?? "",
        name: initialValues.product_category?.name ?? "",
      },
      product_sub_category: {
        id: initialValues.product_sub_category?.id ?? "",
        name: initialValues.product_sub_category?.name ?? "",
      },
    };
  };

  const form = useForm<ProductFormValues>({
    resolver: zodResolver(productFormSchema),
    defaultValues: transformInitialValues() as ProductFormValues,
  });


  const onSubmit = async (data: ProductFormValues) => {
    try {
      // Create a copy of the data and remove .data properties
      const { locations, order_units, ingredient_units, ...restData } = data;
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
        const result = await createProductService(token, buCode, submitData);
        toastSuccess({ message: "Product created successfully" });
        setCurrentMode(formType.VIEW);

        if (result?.id) {
          const newUrl = window.location.pathname.replace(
            "/new",
            `/${result.id}`
          );
          router.replace(newUrl);
        } else {
          console.warn(
            "No ID found in create product response, redirecting to list"
          );
          router.push("/product-management/product");
        }
      } else {
        if (!submitData.id) {
          throw new Error("Product ID is required for update");
        }
        const result = await updateProductService(
          token,
          buCode,
          submitData.id,
          submitData
        );
        if (result?.id) {
          toastSuccess({ message: "Product updated successfully" });
          setCurrentMode(formType.VIEW);
        }
      }
    } catch (error) {
      console.error("Error submitting form:", error);
      toastError({ message: "Error submitting form" });
    }
  };

  const handleEditClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    console.log("Edit button clicked, current mode:", currentMode);
    setCurrentMode(formType.EDIT);
  };

  const handleCancelClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (currentMode === formType.ADD || currentMode === formType.VIEW) {
      router.push("/product-management/product");
    } else {
      setCurrentMode(formType.VIEW);
    }
  };

  return (
    <div className="container mx-auto">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-2">
          <ScrollArea className="h-[calc(100vh-160px)]">
            <BasicInfo
              control={form.control}
              currentMode={currentMode}
              handleEditClick={handleEditClick}
              handleCancelClick={handleCancelClick}
            />
            <Tabs defaultValue="general" className="mt-2">
              <TabsList>
                <TabsTrigger value="general">{tProducts("general")}</TabsTrigger>
                <TabsTrigger value="location">{tProducts("location")}</TabsTrigger>
                <TabsTrigger value="orderUnit">{tProducts("order_unit")}</TabsTrigger>
                <TabsTrigger value="ingredientUnit">
                  {tProducts("ingredient_unit")}
                </TabsTrigger>
              </TabsList>
              <TabsContent value="general">
                <ProductAttribute
                  control={form.control}
                  currentMode={currentMode}
                />
              </TabsContent>
              <TabsContent value="location">
                <LocationInfo
                  control={form.control}
                  currentMode={currentMode}
                />
              </TabsContent>
              <TabsContent value="orderUnit">
                <OrderUnit control={form.control} currentMode={currentMode} />
              </TabsContent>
              <TabsContent value="ingredientUnit">
                <IngredientUnit
                  control={form.control}
                  currentMode={currentMode}
                />
              </TabsContent>
            </Tabs>
          </ScrollArea>
        </form>
      </Form>
      {/* <JsonViewer data={formValues} title="Form Values" /> */}
    </div>
  );
}
