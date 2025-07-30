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
import { useEffect, useState, useRef } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ChevronLeft, Save, X, Edit } from "lucide-react";
import ItemGroupLookup from "@/components/lookup/ItemGroupLookup";
import UnitLookup from "@/components/lookup/UnitLookup";
import { useUnitQuery } from "@/hooks/use-unit";
import ButtonLink from "@/components/ButtonLink";
import { cn } from "@/lib/utils";
import FormBoolean from "@/components/form-custom/form-boolean";
import { Label } from "@/components/ui/label";

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
  const { token, tenantId } = useAuth();

  const { getUnitName } = useUnitQuery({
    token,
    tenantId,
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

  // Store selectedValue for change detection
  const [selectedItemGroup, setSelectedItemGroup] = useState<string>("");
  const productItemGroupId = watch("product_info.product_item_group_id");

  // Always ensure product_status_type is set to 'active' as required by the schema
  useEffect(() => {
    setValue("product_status_type", "active");
  }, [setValue]);

  // Fetch data when selectedItemGroup changes (user interaction)
  useEffect(() => {
    if (!selectedItemGroup) return;

    const fetchCategoryData = async () => {
      try {
        // Clear previous values first
        setCategoryData({
          category: { id: "", name: "" },
          subCategory: { id: "", name: "" },
        });

        const response = await getCategoryListByItemGroup(
          token,
          tenantId,
          selectedItemGroup
        );

        // Update local state
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
        setValue("product_category", newCategoryData.category);
        setValue("product_sub_category", newCategoryData.subCategory);
      } catch (error) {
        console.error("Error fetching category data:", error);
        setCategoryData({
          category: { id: "", name: "" },
          subCategory: { id: "", name: "" },
        });
      }
    };

    fetchCategoryData();
  }, [selectedItemGroup, token, tenantId, setValue]);

  // Initial data fetch on view mode
  const initialLoadRef = useRef(false);

  useEffect(() => {
    if (initialLoadRef.current) return;

    if (
      productItemGroupId &&
      currentMode === formType.VIEW &&
      !initialLoadRef.current
    ) {
      initialLoadRef.current = true;

      const fetchInitialData = async () => {
        try {
          const response = await getCategoryListByItemGroup(
            token,
            tenantId,
            productItemGroupId
          );


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
        } catch (error) {
          console.error("Error fetching initial category data:", error);
        }
      };

      fetchInitialData();
    }
  }, [productItemGroupId, currentMode, token, tenantId]);

  const handleItemGroupChange = (value: string) => {
    setSelectedItemGroup(value);
  };

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

  const isFormValid = () => {
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
  };

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
                            Product Code{" "}
                            <span className="text-destructive">*</span>
                          </FormLabel>
                          <FormControl>
                            <Input
                              placeholder="Product Code"
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
                              Product Name
                            </FormLabel>
                            <FormControl>
                              <Input
                                placeholder="Product Name"
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
                    <Badge
                      variant={status === "active" ? "active" : "inactive"}
                    >
                      {status === "active" ? "Active" : "Inactive"}
                    </Badge>
                  )}
                </div>

              </div>
            </div>

            {/* Right Section */}
            <div className="flex items-center gap-1.5">
              {currentMode === formType.VIEW ? (
                <>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleCancelClick}
                  >
                    <ChevronLeft className="h-3 w-3" />
                    Back
                  </Button>
                  <Button
                    variant="default"
                    size="sm"
                    onClick={handleEditClick}
                  >
                    <Edit />
                    Edit
                  </Button>
                </>
              ) : (
                <>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleCancelClick}
                  >
                    <X />
                    Cancel
                  </Button>
                  <Button
                    variant="default"
                    size="sm"
                    type="submit"
                    disabled={!isFormValid()}
                  >
                    <Save />
                    Save
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
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Description
                  </FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Enter description"
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
            <FormField
              control={control}
              name="local_name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Local Name <span className="text-destructive">*</span>
                  </FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Local name"
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
              name="product_info.is_ingredients"
              render={({ field }) => (
                <FormItem className="mt-2">
                  <FormControl>
                    <FormBoolean
                      value={field.value}
                      onChange={field.onChange}
                      label="Use for Ingredients"
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
            />
          </div>

          {/* Classification Section */}
          <div className="space-y-3">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
              {/* Product Item Group */}
              <FormField
                control={control}
                name="product_info.product_item_group_id"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      Item Group
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
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="space-y-2">
                <Label>
                  Category
                </Label>
                <Input
                  placeholder="Category"
                  value={categoryData.category.name}
                  disabled
                />
              </div>

              {/* Sub Category */}
              <div className="space-y-2">
                <Label>
                  Sub Category
                </Label>
                <Input
                  placeholder="Sub category"
                  value={categoryData.subCategory.name}
                  disabled
                />
              </div>

              {/* Primary Inventory Unit */}
              <FormField
                control={control}
                name="inventory_unit_id"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      Inventory Unit
                    </FormLabel>
                    {currentMode === formType.VIEW ? (
                      <div className="h-8 p-2 bg-muted/30 rounded border border-border/30 flex items-center mt-1.5">
                        {getUnitName(field.value)}
                      </div>
                    ) : (
                      <FormControl>
                        <UnitLookup
                          value={field.value}
                          onValueChange={(value) => {
                            field.onChange(value);
                          }}
                        />
                      </FormControl>
                    )}
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
