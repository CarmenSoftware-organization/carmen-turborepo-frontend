import { formType } from "@/dtos/form.dto";
import { Control, useFormContext, useWatch } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/context/AuthContext";
import { useEffect, useRef, useMemo } from "react";
import { useCategoryByItemGroupQuery } from "@/hooks/use-product";
import { useItemGroup } from "@/hooks/use-item-group";
import { ItemGroupDto } from "@/dtos/category.dto";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ChevronLeft, Save, X, Edit, Info } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import LookupItemGroup from "@/components/lookup/LookupItemGroup";
import UnitLookup from "@/components/lookup/LookupUnit";
import { cn } from "@/lib/utils";
import { Label } from "@/components/ui/label";
import { useTranslations } from "next-intl";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/form-custom/form";
import { Textarea } from "@/components/ui/textarea";
import { ProductFormValues } from "@/dtos/product.dto";
import { useRouter } from "@/lib/navigation";
import { useSearchParams } from "next/navigation";
import LookupTaxProfile from "@/components/lookup/LookupTaxProfile";

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
  const router = useRouter();
  const tCommon = useTranslations("Common");
  const tProducts = useTranslations("Products");
  const searchParams = useSearchParams();

  const { watch, setValue } = useFormContext<ProductFormValues>();

  const status = watch("product_status_type");
  const productItemGroupId = watch("product_info.product_item_group_id");
  const hasInitialized = useRef(false);

  const { itemGroups } = useItemGroup();

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
    if (!categoryResponse?.data) {
      return {
        data: {
          category: { id: "", name: "" },
          subCategory: { id: "", name: "" },
        },
      };
    }

    return {
      data: {
        category: {
          id: categoryResponse.data.category?.id || "",
          name: categoryResponse.data.category?.name || "",
        },
        subCategory: {
          id: categoryResponse.data.sub_category?.id || "",
          name: categoryResponse.data.sub_category?.name || "",
        },
      },
    };
  }, [categoryResponse]);

  useEffect(() => {
    if (categoryResponse && productItemGroupId) {
      setValue("product_category", categoryData.data.category, { shouldValidate: false });
      setValue("product_sub_category", categoryData.data.subCategory, { shouldValidate: false });
    }
  }, [categoryResponse, categoryData, productItemGroupId, setValue]);

  const watchedFields = useWatch({
    control,
    name: ["name", "code", "local_name", "inventory_unit_id", "product_info.product_item_group_id"],
  });

  const orderUnits = watch("order_units");

  const defaultUnit = useMemo(
    () =>
      Array.isArray(orderUnits)
        ? orderUnits.find((unit) => unit.is_default === true)
        : orderUnits?.data?.find((unit) => unit.is_default === true),
    [orderUnits]
  );

  const isFormValid = useMemo(() => {
    const [name, code, localName, inventoryUnitId, itemGroupId] = watchedFields;

    return Boolean(name && code && localName && inventoryUnitId && itemGroupId);
  }, [watchedFields]);

  const onBack = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    e.stopPropagation();
    const returnUrl = searchParams.get("returnUrl");
    const backUrl = returnUrl || "/product-management/product";
    router.push(backUrl);
  };

  return (
    <div className="space-y-4">
      <div className="pb-4 border-b border-border">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Button variant={"outline"} size={"sm"} className="w-8 h-8" onClick={onBack}>
              <ChevronLeft className="h-4 w-4" />
            </Button>

            {currentMode === formType.VIEW ? (
              <div className="flex items-center gap-3">
                <h1 className="text-xl font-semibold text-foreground">
                  {watch("code") || "N/A"} - {watch("name") || "Untitled Product"}
                </h1>
                {status && (
                  <Badge variant={status}>
                    {status === "active" ? tCommon("active") : tCommon("inactive")}
                  </Badge>
                )}
              </div>
            ) : (
              <h1 className="text-xl font-semibold text-foreground">
                {currentMode === formType.ADD
                  ? tProducts("add_product")
                  : tProducts("edit_product")}
              </h1>
            )}
          </div>

          <div className="flex items-center gap-1.5">
            {currentMode === formType.VIEW ? (
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button type="button" size="sm" onClick={handleEditClick} className="h-8 w-8">
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
                        type="button"
                        variant="outlinePrimary"
                        size="sm"
                        onClick={handleCancelClick}
                        className="h-8 w-8"
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
                        className={cn(
                          !isFormValid && "bg-muted-foreground/60 cursor-not-allowed",
                          "h-8 w-8"
                        )}
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
      </div>
      <div className="space-y-2">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
          <FormField
            control={control}
            name="code"
            required
            render={({ field }) => (
              <FormItem>
                <FormLabel>{tProducts("product_code")}</FormLabel>
                <FormControl>
                  <Input
                    placeholder={tProducts("product_code")}
                    {...field}
                    disabled={currentMode === formType.VIEW}
                    className={cn(currentMode === formType.VIEW && "bg-muted")}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={control}
            name="name"
            required
            render={({ field }) => (
              <FormItem>
                <FormLabel>{tProducts("product_name")}</FormLabel>
                <FormControl>
                  <Input
                    placeholder={tProducts("product_name")}
                    {...field}
                    disabled={currentMode === formType.VIEW}
                    className={cn(currentMode === formType.VIEW && "bg-muted")}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={control}
            name="local_name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{tProducts("local_name")}</FormLabel>
                <FormControl>
                  <Input
                    placeholder={tProducts("local_name")}
                    {...field}
                    disabled={currentMode === formType.VIEW}
                    className={cn(currentMode === formType.VIEW && "bg-muted")}
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
                  <FormItem className="col-span-full">
                    <FormLabel>{tProducts("item_group")}</FormLabel>
                    <FormControl>
                      <LookupItemGroup
                        value={field.value}
                        onValueChange={(value) => {
                          field.onChange(value);
                          const selectedItemGroup = itemGroups.find(
                            (ig: ItemGroupDto) => ig.id === value
                          );
                          if (selectedItemGroup) {
                            setValue(
                              "product_item_group",
                              {
                                id: selectedItemGroup.id,
                                name: selectedItemGroup.name,
                              },
                              { shouldValidate: false }
                            );

                            if (selectedItemGroup.tax_profile_id) {
                              setValue("tax_profile_id", selectedItemGroup.tax_profile_id);
                              setValue("tax_profile_name", selectedItemGroup.tax_profile_name);
                              setValue("tax_rate", selectedItemGroup.tax_rate ?? 0);
                            }
                          }
                        }}
                        disabled={currentMode === formType.VIEW}
                        classNames={cn(currentMode === formType.VIEW && "bg-muted")}
                        placeholder={tProducts("item_group")}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

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
                      <p className="text-xs">{tProducts("auto_fill_from_item_group")}</p>
                    </TooltipContent>
                  </Tooltip>
                </div>
              </TooltipProvider>
              <Input
                placeholder={tProducts("sub_category")}
                value={isCategoryLoading ? "Loading..." : categoryData.data.subCategory.name || "-"}
                disabled
                className="bg-muted"
              />
            </div>

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
                      <p className="text-xs">{tProducts("auto_fill_from_item_group")}</p>
                    </TooltipContent>
                  </Tooltip>
                </div>
              </TooltipProvider>
              <Input
                placeholder={tProducts("category")}
                value={isCategoryLoading ? "Loading..." : categoryData.data.category.name || "-"}
                disabled
                className="bg-muted"
              />
            </div>

            <div className="space-y-2">
              <FormField
                control={control}
                name="inventory_unit_id"
                required
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{tProducts("inventory_unit")}</FormLabel>
                    <FormControl>
                      <UnitLookup
                        value={field.value}
                        onValueChange={(value) => {
                          field.onChange(value);
                        }}
                        placeholder={tProducts("inventory_unit")}
                        disabled={currentMode === formType.VIEW}
                        classNames={cn(
                          "h-9 w-full text-xs",
                          currentMode === formType.VIEW && "bg-muted"
                        )}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className="space-y-2">
              <Label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                {tProducts("order_unit")}
              </Label>
              <div>
                {defaultUnit ? (
                  <Badge
                    variant="outline"
                    className="h-9 w-full bg-muted border-border text-muted-foreground rounded-md"
                  >
                    {defaultUnit.from_unit_name}
                  </Badge>
                ) : (
                  <p className="text-sm text-muted-foreground">{tProducts("no_order_unit_set")}</p>
                )}
              </div>
            </div>
            <div className="space-y-2">
              <FormField
                control={control}
                name="tax_profile_id"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{tProducts("tax_profile")}</FormLabel>
                    <FormControl>
                      <LookupTaxProfile
                        value={field.value}
                        displayName={watch("tax_profile_name")}
                        onValueChange={field.onChange}
                        onSelectObject={(selected) => {
                          setValue("tax_profile_name", selected.name);
                          setValue("tax_rate", Number(selected.tax_rate));
                        }}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <FormField
              control={control}
              name="description"
              render={({ field }) => (
                <FormItem className="col-span-full">
                  <FormLabel>{tProducts("description")}</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder={tProducts("description")}
                      {...field}
                      disabled={currentMode === formType.VIEW}
                      className={cn(currentMode === formType.VIEW && "bg-muted")}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
