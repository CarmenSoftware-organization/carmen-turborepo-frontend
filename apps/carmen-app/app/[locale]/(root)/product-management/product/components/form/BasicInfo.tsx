import { formType } from "@/dtos/form.dto";
import { Control, useFormContext, useWatch } from "react-hook-form";
import { ProductFormValues } from "../../pd-schema";
import {
  FormField,
  FormItem,
  FormControl,
  FormMessage,
  FormLabel,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/context/AuthContext";
import { getCategoryListByItemGroup } from "@/services/product.service";
import { useEffect, useState, useRef, useCallback, useMemo } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ChevronLeft, Save, X, Edit } from "lucide-react";
import ItemGroupLookup from "@/components/lookup/ItemGroupLookup";
import UnitLookup from "@/components/lookup/UnitLookup";
import { useUnitQuery } from "@/hooks/use-unit";
import ButtonLink from "@/components/ButtonLink";
import { cn } from "@/lib/utils";
import { Label } from "@/components/ui/label";
import { useTranslations } from "next-intl";
import { StatusCustom } from "@/components/ui-custom/StatusCustom";

interface BasicInfoProps {
  readonly control: Control<ProductFormValues>;
  readonly currentMode: formType;
  readonly handleEditClick?: (e: React.MouseEvent) => void;
  readonly handleCancelClick?: (e: React.MouseEvent) => void;
}

interface CategoryData {
  category: { id: string; name: string };
  subCategory: { id: string; name: string };
}

export default function BasicInfo({
  control,
  currentMode,
  handleEditClick,
  handleCancelClick,
}: BasicInfoProps) {
  const { token, buCode } = useAuth();
  const tCommon = useTranslations("Common");
  const tProducts = useTranslations("Products");
  const { getUnitName } = useUnitQuery({
    token,
    buCode,
    params: {
      perpage: -1,
    }
  });

  const { watch, setValue } = useFormContext<ProductFormValues>();

  const [categoryData, setCategoryData] = useState<CategoryData>({
    category: { id: "", name: "" },
    subCategory: { id: "", name: "" },
  });

  const status = watch("product_status_type");
  const productItemGroupId = watch("product_info.product_item_group_id");
  const hasInitialized = useRef(false);

  useEffect(() => {
    if (!hasInitialized.current) {
      setValue("product_status_type", "active", { shouldValidate: false });
      hasInitialized.current = true;
    }
  }, [setValue]);

  const fetchAndSetCategoryData = useCallback(async (itemGroupId: string, shouldUpdateForm = true) => {
    if (!itemGroupId) return;

    setCategoryData({
      category: { id: "", name: "" },
      subCategory: { id: "", name: "" },
    });

    try {
      const response = await getCategoryListByItemGroup(token, buCode, itemGroupId);

      const newCategoryData = {
        category: {
          id: response.category.id,
          name: response.category.name,
        },
        subCategory: {
          id: response.sub_category.id,
          name: response.sub_category.name,
        },
      };

      setCategoryData(newCategoryData);

      if (shouldUpdateForm) {
        setValue("product_category", newCategoryData.category, { shouldValidate: false });
        setValue("product_sub_category", newCategoryData.subCategory, { shouldValidate: false });
      }
    } catch (error) {
      console.error("Error fetching category data:", error);
      setCategoryData({
        category: { id: "", name: "" },
        subCategory: { id: "", name: "" },
      });
    }
  }, [token, buCode, setValue]);

  const handleItemGroupChange = useCallback((value: string) => {
    fetchAndSetCategoryData(value, true);
  }, [fetchAndSetCategoryData]);

  useEffect(() => {
    if (productItemGroupId && currentMode === formType.VIEW) {
      fetchAndSetCategoryData(productItemGroupId, false);
    }
  }, [productItemGroupId, currentMode, fetchAndSetCategoryData]);

  // Watch required fields
  const watchedFields = useWatch({
    control,
    name: [
      "name",
      "code",
      "local_name",
      "inventory_unit_id",
      "product_info.price",
      "product_info.price_deviation_limit",
      "product_info.qty_deviation_limit",
      "product_info.product_item_group_id",
    ],
  });

  const orderUnits = watch("order_units");

  const defaultUnit = useMemo(() =>
    Array.isArray(orderUnits)
      ? orderUnits.find((unit) => unit.is_default === true)
      : orderUnits?.data?.find((unit) => unit.is_default === true),
    [orderUnits]
  );

  const isFormValid = useMemo(() => {
    const [
      name,
      code,
      localName,
      inventoryUnitId,
      price,
      priceDeviation,
      qtyDeviation,
      itemGroupId,
    ] = watchedFields;

    return Boolean(
      name &&
      code &&
      localName &&
      inventoryUnitId &&
      price >= 0.01 &&
      priceDeviation >= 1 &&
      qtyDeviation >= 1 &&
      itemGroupId
    );
  }, [watchedFields]);

  return (
    <div className="space-y-2">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <ButtonLink
                href="/product-management/product"
              >
                <ChevronLeft className="h-4 w-4" />
              </ButtonLink>

              <div className="flex items-center gap-6">
                <FormField
                  control={control}
                  name="code"
                  render={({ field }) => (
                    <FormItem>
                      {currentMode === formType.VIEW ? (
                        <h1 className="text-lg font-semibold text-foreground leading-tight">
                          {field.value || "Untitled Product"}
                        </h1>
                      ) : (
                        <>
                          <FormLabel className="font-medium">
                            {tProducts("product_code")}
                          </FormLabel>
                          <FormControl>
                            <Input
                              placeholder={tProducts("product_code")}
                              {...field}
                            />
                          </FormControl>
                        </>
                      )}
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div className="flex items-center gap-2">
                  <FormField
                    control={control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        {currentMode === formType.VIEW ? (
                          <h1 className="text-lg font-semibold text-foreground leading-tight">
                            {field.value || "Untitled Product"}
                          </h1>
                        ) : (
                          <>
                            <FormLabel>
                              {tProducts("product_name")}
                            </FormLabel>
                            <FormControl>
                              <Input
                                placeholder={tProducts("product_name")}
                                {...field}
                              />
                            </FormControl>
                          </>
                        )}
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {status && currentMode === formType.VIEW && (
                    <StatusCustom is_active={status === "active"}>
                      {status === "active" ? tCommon("active") : tCommon("inactive")}
                    </StatusCustom>
                  )}
                </div>

              </div>
            </div>

            {/* Right Section */}
            <div className="flex items-center gap-1.5">
              {currentMode === formType.VIEW ? (
                <Button
                  variant="outlinePrimary"
                  size="sm"
                  onClick={handleEditClick}
                >
                  <Edit />
                  {tCommon("edit")}
                </Button>
              ) : (
                <>
                  <Button
                    variant="outlinePrimary"
                    size="sm"
                    onClick={handleCancelClick}
                  >
                    <X />
                    {tCommon("cancel")}
                  </Button>
                  <Button
                    variant="outlinePrimary"
                    size="sm"
                    type="submit"
                    disabled={!isFormValid}
                  >
                    <Save />
                    {tCommon("save")}
                  </Button>
                </>
              )}
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4 pt-0">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            <FormField
              control={control}
              name="local_name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    {tProducts("local_name")}
                  </FormLabel>
                  <FormControl>
                    <Input
                      placeholder={tProducts("local_name")}
                      {...field}
                      disabled={currentMode === formType.VIEW}
                      className={cn(
                        currentMode === formType.VIEW && "bg-muted",
                        ""
                      )}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={control}
              name="description"
              render={({ field }) => (
                <FormItem
                  className="col-span-2"
                >
                  <FormLabel>
                    {tProducts("description")}
                  </FormLabel>
                  <FormControl>
                    <Input
                      placeholder={tProducts("description")}
                      {...field}
                      disabled={currentMode === formType.VIEW}
                      className={cn(
                        currentMode === formType.VIEW && "bg-muted",
                        ""
                      )}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Local Name */}


            {/* <FormField
              control={control}
              name="product_info.is_ingredients"
              render={({ field }) => (
                <FormItem className="mt-2">
                  <FormControl>
                    <FormBoolean
                      value={field.value}
                      onChange={field.onChange}
                      label={tProducts("use_for_ingredient")}
                      positionLabel="top"
                      type="checkbox"
                      disabled={currentMode === formType.VIEW}
                      classNames={cn(
                        currentMode === formType.VIEW && "bg-muted",
                        ""
                      )}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            /> */}
          </div>

          <div className="space-y-2">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
              {/* Product Item Group */}
              <FormField
                control={control}
                name="product_info.product_item_group_id"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      {tProducts("item_group")}
                    </FormLabel>
                    <FormControl>
                      <ItemGroupLookup
                        value={field.value}
                        onValueChange={(value) => {
                          handleItemGroupChange(value);
                          field.onChange(value);
                        }}
                        disabled={currentMode === formType.VIEW}
                        classNames={cn(
                          currentMode === formType.VIEW && "bg-muted",
                          ""
                        )}
                        placeholder={tProducts("item_group")}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="space-y-2">
                <Label>
                  {tProducts("sub_category")}
                </Label>
                <Input
                  placeholder={tProducts("sub_category")}
                  value={categoryData.subCategory.name}
                  disabled
                  className="bg-muted"
                />
              </div>

              <div className="space-y-2">
                <Label>
                  {tProducts("category")}
                </Label>
                <Input
                  placeholder={tProducts("category")}
                  value={categoryData.category.name}
                  disabled
                  className="bg-muted"
                />
              </div>


              <FormField
                control={control}
                name="inventory_unit_id"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      {tProducts("inventory_unit")}
                    </FormLabel>
                    {currentMode === formType.VIEW ? (
                      <Badge
                        variant="outline"
                        className="bg-muted border-border ml-2"
                      >
                        {getUnitName(field.value)}
                      </Badge>
                    ) : (
                      <FormControl>
                        <UnitLookup
                          value={field.value}
                          onValueChange={(value) => {
                            field.onChange(value);
                          }}
                          placeholder={tProducts("inventory_unit")}
                        />
                      </FormControl>
                    )}
                    <FormMessage />
                  </FormItem>
                )}
              />
              {defaultUnit && (
                <div className="flex items-center gap-2">
                  <Label>{tProducts("order_unit")}</Label>
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className="bg-muted border-border">
                      {defaultUnit.from_unit_name}
                    </Badge>
                  </div>
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
