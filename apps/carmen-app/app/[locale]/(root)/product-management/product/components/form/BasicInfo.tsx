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
import { Textarea } from "@/components/ui/textarea";
import { useItemGroup } from "@/hooks/useItemGroup";
import { useAuth } from "@/context/AuthContext";
import { getCategoryListByItemGroup } from "@/services/product.service";
import { useEffect, useState, useRef } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ChevronLeft, Save, X, Edit, Info } from "lucide-react";
import { useRouter } from "@/lib/navigation";
import ItemGroupLookup from "@/components/lookup/ItemGroupLookup";
import UnitLookup from "@/components/lookup/UnitLookup";
import { Separator } from "@/components/ui/separator";
import { useUnitQuery } from "@/hooks/use-unit";
import { UnitDto } from "@/dtos/unit.dto";

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
  const { units } = useUnitQuery({
    token,
    tenantId,
  });
  const { itemGroups } = useItemGroup();
  const { watch, setValue } = useFormContext<ProductFormValues>();
  const router = useRouter();

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
            id: response.product_category.id,
            name: response.product_category.name,
          },
          subCategory: {
            id: response.product_subcategory.id,
            name: response.product_subcategory.name,
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
              id: response.product_category.id,
              name: response.product_category.name,
            },
            subCategory: {
              id: response.product_subcategory.id,
              name: response.product_subcategory.name,
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
  // Check if all required fields are filled
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
    <div className="space-y-3">
      {/* Header Section */}
      <Card className="border-border/20 shadow-sm">
        <CardHeader className="pb-2 pt-3">
          <div className="flex items-center justify-between">
            {/* Left Section */}
            <div className="flex items-center gap-3">
              <Button
                variant="ghost"
                size="sm"
                onClick={(e) => {
                  e.preventDefault();
                  router.push("/product-management/product");
                }}
                className="text-muted-foreground hover:text-foreground h-8 w-8 p-0"
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>

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
                          <FormLabel className="text-xs font-medium text-foreground">
                            Product Name{" "}
                            <span className="text-destructive">*</span>
                          </FormLabel>
                          <FormControl>
                            <Input
                              placeholder="Product Name"
                              className="font-semibold bg-transparent focus-visible:ring-0 leading-tight"
                              {...field}
                            />
                          </FormControl>
                        </>
                      )}
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={control}
                  name="code"
                  render={({ field }) => (
                    <FormItem>
                      {currentMode === formType.VIEW ? (
                        <p className="text-xs text-muted-foreground">
                          Code: {field.value || "N/A"}
                        </p>
                      ) : (
                        <>
                          <FormLabel className="text-xs font-medium text-foreground">
                            Product Code{" "}
                            <span className="text-destructive">*</span>
                          </FormLabel>
                          <FormControl>
                            <Input
                              placeholder="Product Code"
                              className="text-xs text-muted-foreground bg-transparent focus-visible:ring-0"
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
                    variant={status === "active" ? "default" : "secondary"}
                    className="bg-primary/10 text-primary border-primary/20 text-xs px-1.5 py-0.5"
                  >
                    {status === "active" ? "Active" : "Inactive"}
                  </Badge>
                )}
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
                    className="text-muted-foreground border-border/50 h-8 px-2.5"
                  >
                    <ChevronLeft className="h-3 w-3 mr-1" />
                    Back
                  </Button>
                  <Button
                    variant="default"
                    size="sm"
                    onClick={handleEditClick}
                    className="bg-primary text-primary-foreground h-8 px-2.5"
                  >
                    <Edit className="h-3 w-3 mr-1" />
                    Edit
                  </Button>
                </>
              ) : (
                <>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleCancelClick}
                    className="text-muted-foreground border-border/50 hover:border-destructive/50 hover:text-destructive h-8 px-2.5"
                  >
                    <X className="h-3 w-3 mr-1" />
                    Cancel
                  </Button>
                  <Button
                    variant="default"
                    size="sm"
                    type="submit"
                    disabled={!isFormValid()}
                    className="bg-primary text-primary-foreground h-8 px-2.5 disabled:opacity-50"
                  >
                    <Save className="h-3 w-3 mr-1" />
                    Save
                  </Button>
                </>
              )}
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Main Content */}
      <Card className="border-border/20 shadow-sm">
        <CardHeader className="pb-2 pt-3">
          <div className="flex items-center gap-1.5">
            <Info className="h-3.5 w-3.5 text-primary" />
            <h2 className="text-sm font-medium text-foreground">
              Basic Information
            </h2>
          </div>
        </CardHeader>
        <CardContent className="space-y-4 pt-0">
          {/* Basic Information Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {/* Description */}
            <FormField
              control={control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-xs font-medium text-foreground">
                    Description
                  </FormLabel>
                  {currentMode === formType.VIEW ? (
                    <div className="min-h-[32px] p-2 bg-muted/30 rounded border border-border/30 text-xs">
                      {field.value || "No description"}
                    </div>
                  ) : (
                    <FormControl>
                      <Textarea
                        placeholder="Product description"
                        className="resize-none min-h-[60px] text-xs bg-background border-border/50 focus:border-primary/50"
                        {...field}
                      />
                    </FormControl>
                  )}
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
                  <FormLabel className="text-xs font-medium text-foreground">
                    Local Name <span className="text-destructive">*</span>
                  </FormLabel>
                  {currentMode === formType.VIEW ? (
                    <div className="h-8 p-2 bg-muted/30 rounded border border-border/30 flex items-center text-xs">
                      {field.value || "N/A"}
                    </div>
                  ) : (
                    <FormControl>
                      <Input
                        placeholder="Local name"
                        className="h-8 text-xs bg-background border-border/50 focus:border-primary/50"
                        {...field}
                      />
                    </FormControl>
                  )}
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Use for Ingredients */}
            <FormField
              control={control}
              name="product_info.is_ingredients"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-xs font-medium text-foreground">
                    Use for Ingredients
                  </FormLabel>
                  <div className="h-8 flex items-center">
                    <FormControl>
                      <div className="flex items-center space-x-2">
                        <Switch
                          checked={field.value}
                          onCheckedChange={field.onChange}
                          disabled={currentMode === formType.VIEW}
                          className="data-[state=checked]:bg-primary scale-75"
                        />
                        <span className="text-xs text-muted-foreground">
                          {field.value ? "Yes" : "No"}
                        </span>
                      </div>
                    </FormControl>
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <Separator className="bg-border/30" />

          {/* Classification Section */}
          <div className="space-y-3">
            <h3 className="text-xs font-medium text-foreground">
              Classification
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
              {/* Product Item Group */}
              <FormField
                control={control}
                name="product_info.product_item_group_id"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-xs font-medium text-foreground">
                      Item Group <span className="text-destructive">*</span>
                    </FormLabel>
                    {currentMode === formType.VIEW ? (
                      <div className="h-8 p-2 bg-muted/30 rounded border border-border/30 flex items-center text-xs">
                        {itemGroups.find((group) => group.id === field.value)
                          ?.name || "N/A"}
                      </div>
                    ) : (
                      <FormControl>
                        <ItemGroupLookup
                          value={field.value}
                          onValueChange={(value) => {
                            handleItemGroupChange(value);
                            field.onChange(value);
                          }}
                        />
                      </FormControl>
                    )}
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Category */}
              <div>
                <FormLabel className="text-xs font-medium text-foreground">
                  Category
                </FormLabel>
                {currentMode === formType.VIEW ? (
                  <div className="h-8 p-2 bg-muted/30 rounded border border-border/30 flex items-center text-xs mt-1.5">
                    {categoryData.category.name || "N/A"}
                  </div>
                ) : (
                  <Input
                    placeholder="Category"
                    value={categoryData.category.name}
                    disabled
                    className="h-8 text-xs bg-muted/50 text-muted-foreground mt-1.5"
                  />
                )}
              </div>

              {/* Sub Category */}
              <div>
                <FormLabel className="text-xs font-medium text-foreground">
                  Sub Category
                </FormLabel>
                {currentMode === formType.VIEW ? (
                  <div className="h-8 p-2 bg-muted/30 rounded border border-border/30 flex items-center text-xs mt-1.5">
                    {categoryData.subCategory.name || "N/A"}
                  </div>
                ) : (
                  <Input
                    placeholder="Sub category"
                    value={categoryData.subCategory.name}
                    disabled
                    className="h-8 text-xs bg-muted/50 text-muted-foreground mt-1.5"
                  />
                )}
              </div>

              {/* Primary Inventory Unit */}
              <FormField
                control={control}
                name="inventory_unit_id"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-xs font-medium text-foreground">
                      Inventory Unit <span className="text-destructive">*</span>
                    </FormLabel>
                    {currentMode === formType.VIEW ? (
                      <div className="h-8 p-2 bg-muted/30 rounded border border-border/30 flex items-center text-xs">
                        {units?.find((unit: UnitDto) => unit.id === field.value)?.name ||
                          "N/A"}
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
