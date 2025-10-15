import { formType } from "@/dtos/form.dto";
import { Control, useFormContext, useWatch } from "react-hook-form";
import { ProductFormValues } from "../../pd-schema";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/context/AuthContext";
import { useEffect, useRef, useMemo } from "react";
import { useCategoryByItemGroupQuery } from "@/hooks/use-product";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ChevronLeft, Save, X, Edit, Info } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import ItemGroupLookup from "@/components/lookup/ItemGroupLookup";
import UnitLookup from "@/components/lookup/UnitLookup";
import ButtonLink from "@/components/ButtonLink";
import { cn } from "@/lib/utils";
import { Label } from "@/components/ui/label";
import { useTranslations } from "next-intl";
import { StatusCustom } from "@/components/ui-custom/StatusCustom";
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui-custom/FormCustom";

interface BasicInfoProps {
  readonly control: Control<ProductFormValues>;
  readonly currentMode: formType;
  readonly handleEditClick?: (e: React.MouseEvent) => void;
  readonly handleCancelClick?: (e: React.MouseEvent) => void;
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

  const { watch, setValue } = useFormContext<ProductFormValues>();

  const status = watch("product_status_type");
  const productItemGroupId = watch("product_info.product_item_group_id");
  const hasInitialized = useRef(false);

  useEffect(() => {
    if (!hasInitialized.current) {
      setValue("product_status_type", "active", { shouldValidate: false });
      hasInitialized.current = true;
    }
  }, [setValue]);

  const { data: categoryResponse, isLoading: isCategoryLoading } = useCategoryByItemGroupQuery({
    token,
    buCode,
    itemGroupId: productItemGroupId,
    enabled: !!productItemGroupId,
  });

  const categoryData = useMemo(() => {
    if (!categoryResponse) {
      return {
        category: { id: "", name: "" },
        subCategory: { id: "", name: "" },
      };
    }

    return {
      category: {
        id: categoryResponse.category?.id || "",
        name: categoryResponse.category?.name || "",
      },
      subCategory: {
        id: categoryResponse.sub_category?.id || "",
        name: categoryResponse.sub_category?.name || "",
      },
    };
  }, [categoryResponse]);

  useEffect(() => {
    if (categoryResponse && productItemGroupId) {
      setValue("product_category", categoryData.category, { shouldValidate: false });
      setValue("product_sub_category", categoryData.subCategory, { shouldValidate: false });
    }
  }, [categoryResponse, categoryData, productItemGroupId, setValue]);

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
            <div className="flex items-center gap-2">
              <ButtonLink
                href="/product-management/product"
              >
                <ChevronLeft className="h-4 w-4" />
              </ButtonLink>

              {currentMode === formType.VIEW ? (
                <div className="flex items-center gap-3">
                  <h1 className="text-lg font-semibold text-foreground">
                    {watch("code") || "N/A"} - {watch("name") || "Untitled Product"}
                  </h1>
                  {status && (
                    <StatusCustom is_active={status === "active"}>
                      {status === "active" ? tCommon("active") : tCommon("inactive")}
                    </StatusCustom>
                  )}
                </div>
              ) : (
                <h1 className="text-lg font-semibold text-foreground">
                  {currentMode === formType.ADD ? tProducts("add_product") : tProducts("edit_product")}
                </h1>
              )}
            </div>

            <div className="flex items-center gap-1.5">
              {currentMode === formType.VIEW ? (
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        size="sm"
                        onClick={handleEditClick}
                      >
                        <Edit />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>{tCommon("edit")}</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              ) : (
                <>
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          variant="outlinePrimary"
                          size="sm"
                          onClick={handleCancelClick}
                        >
                          <X />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>{tCommon("cancel")}</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          size="sm"
                          type="submit"
                          disabled={!isFormValid}
                        >
                          <Save />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>{tCommon("save")}</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </>
              )}
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-2 pt-0">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            <FormField
              control={control}
              name="code"
              required
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    {tProducts("product_code")}
                  </FormLabel>
                  <FormControl>
                    <Input
                      placeholder={tProducts("product_code")}
                      {...field}
                      disabled={currentMode === formType.VIEW}
                      className={cn(
                        currentMode === formType.VIEW && "bg-muted"
                      )}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Product Name */}
            <FormField
              control={control}
              name="name"
              required
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    {tProducts("product_name")}
                  </FormLabel>
                  <FormControl>
                    <Input
                      placeholder={tProducts("product_name")}
                      {...field}
                      disabled={currentMode === formType.VIEW}
                      className={cn(
                        currentMode === formType.VIEW && "bg-muted"
                      )}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Local Name */}
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
                        currentMode === formType.VIEW && "bg-muted"
                      )}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Description */}
            <FormField
              control={control}
              name="description"
              render={({ field }) => (
                <FormItem
                  className="col-span-full"
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
                        currentMode === formType.VIEW && "bg-muted"
                      )}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
              <div className="space-y-2">
                <FormField
                  control={control}
                  name="product_info.product_item_group_id"
                  required
                  render={({ field }) => (
                    <FormItem
                      className="col-span-full"
                    >
                      <FormLabel>
                        {tProducts("item_group")}
                      </FormLabel>
                      <FormControl>
                        <ItemGroupLookup
                          value={field.value}
                          onValueChange={(value) => {
                            field.onChange(value);
                          }}
                          disabled={currentMode === formType.VIEW}
                          classNames={cn(
                            currentMode === formType.VIEW && "bg-muted"
                          )}
                          placeholder={tProducts("item_group")}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* Sub Category */}
              <div className="space-y-3 mt-1.5">
                <TooltipProvider>
                  <div className="flex items-center gap-1">
                    <Label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                      {tProducts("sub_category")}
                    </Label>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Info className="h-3.5 w-3.5 text-muted-foreground cursor-help" />
                      </TooltipTrigger>
                      <TooltipContent>
                        <p className="text-xs">Auto-filled from Item Group</p>
                      </TooltipContent>
                    </Tooltip>
                  </div>
                </TooltipProvider>
                <Input
                  placeholder={tProducts("sub_category")}
                  value={isCategoryLoading ? "Loading..." : categoryData.subCategory.name || "-"}
                  disabled
                  className="bg-muted"
                />
              </div>

              {/* Category */}
              <div className="space-y-3 mt-1.5">
                <TooltipProvider>
                  <div className="flex items-center gap-1">
                    <Label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                      {tProducts("category")}
                    </Label>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Info className="h-3.5 w-3.5 text-muted-foreground cursor-help" />
                      </TooltipTrigger>
                      <TooltipContent>
                        <p className="text-xs">Auto-filled from Item Group</p>
                      </TooltipContent>
                    </Tooltip>
                  </div>
                </TooltipProvider>
                <Input
                  placeholder={tProducts("category")}
                  value={isCategoryLoading ? "Loading..." : categoryData.category.name || "-"}
                  disabled
                  className="bg-muted"
                />
              </div>

              {/* Inventory Unit */}
              <div className="space-y-2">
                <FormField
                  control={control}
                  name="inventory_unit_id"
                  required
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        {tProducts("inventory_unit")}
                      </FormLabel>
                      <FormControl>
                        <UnitLookup
                          value={field.value}
                          onValueChange={(value) => {
                            field.onChange(value);
                          }}
                          placeholder={tProducts("inventory_unit")}
                          disabled={currentMode === formType.VIEW}
                          classNames="h-7"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* Order Unit */}
              <div className="space-y-2">
                <Label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                  {tProducts("order_unit")}
                </Label>
                <div>
                  {defaultUnit ? (
                    <Badge variant="outline" className="bg-muted border-border text-muted-foreground">
                      {defaultUnit.from_unit_name}
                    </Badge>
                  ) : (
                    <p className="text-sm text-muted-foreground">
                      {currentMode === formType.VIEW ? "-" : "No order unit set"}
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
