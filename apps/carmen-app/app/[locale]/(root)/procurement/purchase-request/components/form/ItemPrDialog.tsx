"use client";

import { useForm, useWatch } from "react-hook-form";
import { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

import { formType } from "@/dtos/form.dto";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";
import LocationLookup from "@/components/lookup/LocationLookup";
import ProductLookup from "@/components/lookup/ProductLookup";
import UnitLookup from "@/components/lookup/UnitLookup";
import CurrencyLookup from "@/components/lookup/CurrencyLookup";
import VendorLookup from "@/components/lookup/VendorLookup";
import { Box, CalendarIcon } from "lucide-react";
import PriceListLookup from "@/components/lookup/PriceListLookup";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { TaxType } from "@/constants/enum";
import useProduct from "@/hooks/useProduct";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { format } from "date-fns";
import { Calendar } from "@/components/ui/calendar";
import { cn } from "@/lib/utils";
import DeliveryPointLookup from "@/components/lookup/DeliveryPointLookup";
import { useCurrency } from "@/hooks/useCurrency";
import NumberInput from "@/components/form-custom/NumberInput";

type ItemWithId = {
  id?: string;
  location_id: string;
  product_id: string;
  vendor_id: string;
  price_list_id: string;
  pricelist_detail_id?: string;
  description: string;
  requested_qty: number;
  requested_unit_id: string;
  requested_conversion_unit_factor?: number;
  approved_qty: number;
  approved_unit_id: string;
  approved_conversion_unit_factor?: number;
  approved_base_qty: number;
  requested_base_qty: number;
  inventory_unit_id?: string;
  currency_id: string;
  exchange_rate: number;
  exchange_rate_date: string;
  price: number;
  total_price: number;
  foc: number;
  foc_unit_id: string;
  tax_type: string;
  tax_type_inventory_id?: string;
  tax_rate: number;
  tax_amount: number;
  is_tax_adjustment: boolean;
  is_discount: boolean;
  discount_rate: number;
  discount_amount: number;
  is_discount_adjustment: boolean;
  is_active: boolean;
  note: string;
  delivery_date: string;
  delivery_point_id: string;
};

interface ItemPrDialogProps {
  readonly open: boolean;
  readonly onOpenChange: (open: boolean) => void;
  readonly isLoading?: boolean;
  readonly mode: formType;
  readonly formValues?: ItemWithId;
  readonly onSave?: (data: ItemWithId) => void;
}

// Create empty default item
const createEmptyItem = (): ItemWithId => ({
  id: "",
  location_id: "",
  product_id: "",
  vendor_id: "",
  price_list_id: "",
  pricelist_detail_id: "",
  description: "",
  requested_qty: 0,
  requested_unit_id: "",
  requested_conversion_unit_factor: 1,
  approved_qty: 0,
  approved_unit_id: "",
  approved_conversion_unit_factor: 1,
  approved_base_qty: 0,
  requested_base_qty: 0,
  inventory_unit_id: "",
  currency_id: "",
  exchange_rate: 1.0,
  exchange_rate_date: new Date().toISOString(),
  price: 0.0,
  total_price: 0.0,
  foc: 0,
  foc_unit_id: "",
  tax_type: TaxType.NONE,
  tax_type_inventory_id: "",
  tax_rate: 0.0,
  tax_amount: 0.0,
  is_tax_adjustment: false,
  is_discount: false,
  discount_rate: 0.0,
  discount_amount: 0.0,
  is_discount_adjustment: false,
  is_active: true,
  note: "",
  delivery_date: new Date().toISOString(),
  delivery_point_id: "",
});

export default function ItemPrDialog({
  open,
  onOpenChange,
  isLoading = false,
  mode,
  formValues,
  onSave,
}: ItemPrDialogProps) {
  const { getCurrencyExchangeRate } = useCurrency();
  // Keep a local copy of form values to prevent issues with undefined
  const [localFormValues, setLocalFormValues] =
    useState<ItemWithId>(createEmptyItem());

  // We use a local form for all modes
  const localForm = useForm<ItemWithId>({
    defaultValues: createEmptyItem(),
  });

  // Get products data for auto-filling base unit
  const { products } = useProduct();

  // Initialize form when dialog opens
  useEffect(() => {
    if (open) {
      if (formValues) {
        const mergedValues = {
          ...createEmptyItem(),
          ...formValues,
        };
        setLocalFormValues(mergedValues);
        localForm.reset(mergedValues);
      } else {
        const emptyValues = createEmptyItem();
        setLocalFormValues(emptyValues);
        localForm.reset(emptyValues);
      }
    }
  }, [open, formValues, localForm]);

  // Reset form when dialog closes
  useEffect(() => {
    if (!open) {
      const emptyItem = createEmptyItem();
      localForm.reset(emptyItem);
      setLocalFormValues(emptyItem);
    }
  }, [open, localForm]);

  // Watch for product_id changes to auto-fill base unit
  const watchedProductId = useWatch({
    control: localForm.control,
    name: "product_id",
  });

  // Watch for requested_unit_id changes to update approved_unit_id and foc_unit_id
  const watchedRequestedUnitId = useWatch({
    control: localForm.control,
    name: "requested_unit_id",
  });

  // Update approved_unit_id and foc_unit_id when requested_unit_id changes
  useEffect(() => {
    if (watchedRequestedUnitId) {
      localForm.setValue("approved_unit_id", watchedRequestedUnitId);
      localForm.setValue("foc_unit_id", watchedRequestedUnitId);
    }
  }, [watchedRequestedUnitId, localForm]);

  // Auto-fill requested_base_unit_id when product changes
  useEffect(() => {
    if (watchedProductId && products && Array.isArray(products)) {
      const selectedProduct = products.find(
        (product) => product.id === watchedProductId
      );
      if (selectedProduct?.inventory_unit_id) {
        localForm.setValue(
          "inventory_unit_id",
          selectedProduct.inventory_unit_id
        );
      }
    }
  }, [watchedProductId, products, localForm]);

  // Watch for price and quantity changes
  const watchedPrice = useWatch({
    control: localForm.control,
    name: "price",
  });

  const watchedQty = useWatch({
    control: localForm.control,
    name: "requested_qty",
  });

  const watchedExchangeRate = useWatch({
    control: localForm.control,
    name: "exchange_rate",
  });

  // Calculate total price when price or quantity changes
  useEffect(() => {
    const price = parseFloat(watchedPrice?.toString() ?? "0") || 0;
    const qty = parseFloat(watchedQty?.toString() ?? "0") || 0;
    const exchangeRate =
      parseFloat(watchedExchangeRate?.toString() ?? "1") || 1;
    const total = parseFloat((price * qty * exchangeRate).toFixed(2));
    localForm.setValue("total_price", total);
  }, [watchedPrice, watchedQty, watchedExchangeRate, localForm]);

  const isViewMode = mode === formType.VIEW;

  // Watch form values to check if required fields are filled
  const watchedValues = useWatch({
    control: localForm.control,
    name: [
      "location_id",
      "product_id",
      "vendor_id",
      "requested_qty",
      "requested_unit_id",
      "currency_id",
      "price",
    ],
  });

  // Check if all required fields are filled
  const isFormValid = watchedValues.every((value) => {
    if (value === null || value === undefined) {
      return false;
    }
    if (typeof value === "number") {
      return value > 0;
    }
    if (typeof value === "string") {
      return value.trim() !== "";
    }
    return Boolean(value);
  });

  const dialogTitle = "Item Details";

  const handleSave = async () => {
    if (isViewMode || !onSave) return;

    // Validate form before saving
    const isValid = await localForm.trigger();
    if (!isValid) {
      console.log("Form validation failed", localForm.formState.errors);
      return;
    }

    // Get values from the local form
    const formData = localForm.getValues();

    // Ensure ID is preserved (critical for maintaining item identity)
    if (localFormValues?.id) {
      formData.id = localFormValues.id;
    }

    // Ensure numeric values are properly converted to float
    formData.requested_qty =
      parseFloat(formData.requested_qty?.toString() ?? "0") || 0;
    formData.approved_qty =
      parseFloat(formData.approved_qty?.toString() ?? "0") || 0;
    formData.price = parseFloat(formData.price?.toString() ?? "0") || 0.0;
    formData.exchange_rate =
      parseFloat(formData.exchange_rate?.toString() ?? "1") || 1.0;
    formData.foc = parseFloat(formData.foc?.toString() ?? "0") || 0;
    formData.tax_rate = parseFloat(formData.tax_rate?.toString() ?? "0") || 0.0;
    formData.tax_amount =
      parseFloat(formData.tax_amount?.toString() ?? "0") || 0.0;
    formData.discount_rate =
      parseFloat(formData.discount_rate?.toString() ?? "0") || 0.0;
    formData.discount_amount =
      parseFloat(formData.discount_amount?.toString() ?? "0") || 0.0;

    // Calculate total price
    formData.total_price = parseFloat(
      (formData.price * formData.requested_qty).toFixed(2)
    );

    console.log("Saving form data:", formData);
    onSave(formData);
  };

  const currencyId = useWatch({
    control: localForm.control,
    name: "currency_id",
  });

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[1200px] h-[80vh] flex flex-col overflow-hidden">
        <DialogHeader className="border-b pb-2 flex-shrink-0">
          <DialogTitle className="text-lg font-medium flex items-center gap-2">
            <Box className="h-4 w-4 text-primary" />
            {dialogTitle}
          </DialogTitle>
        </DialogHeader>

        <div className="flex-1 overflow-hidden">
          <ScrollArea className="h-full">
            <div className="p-2">
              <Form {...localForm}>
                <div className="space-y-3">
                  {/* Basic Information Section */}
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <div className="h-0.5 w-4 bg-primary rounded-full"></div>
                      <h3 className="text-sm font-bold text-foreground">
                        Basic Information
                      </h3>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                      <FormField
                        control={localForm.control}
                        name="location_id"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-xs font-medium">
                              Location{" "}
                              <span className="text-destructive">*</span>
                            </FormLabel>
                            <FormControl>
                              <LocationLookup
                                value={field.value ?? ""}
                                disabled={isViewMode}
                                onValueChange={(value) => field.onChange(value)}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={localForm.control}
                        name="product_id"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-xs font-medium">
                              Product{" "}
                              <span className="text-destructive">*</span>
                            </FormLabel>
                            <FormControl>
                              <ProductLookup
                                value={field.value ?? ""}
                                onValueChange={(value) => field.onChange(value)}
                                disabled={isViewMode}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <FormField
                      control={localForm.control}
                      name="description"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-xs font-medium">
                            Description
                          </FormLabel>
                          <FormControl>
                            <Textarea
                              {...field}
                              disabled={isViewMode}
                              className="resize-none min-h-[50px] bg-background text-xs"
                              placeholder="Enter product description..."
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  {/* Quantity & Units Section */}
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 mt-6">
                      <div className="h-0.5 w-4 bg-primary rounded-full"></div>
                      <h3 className="text-sm font-bold text-foreground">
                        Quantity and Delivery
                      </h3>
                    </div>
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
                      {/* Requested Quantity */}
                      <div className="space-y-1">
                        <div className="grid grid-cols-2 gap-1">
                          <FormField
                            control={localForm.control}
                            name="requested_unit_id"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel className="text-xs font-medium">
                                  Order Unit{" "}
                                  <span className="text-destructive">*</span>
                                </FormLabel>
                                <FormControl>
                                  <UnitLookup
                                    value={field.value}
                                    onValueChange={(value) =>
                                      field.onChange(value)
                                    }
                                    disabled={isViewMode}
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <FormField
                            control={localForm.control}
                            name="requested_qty"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel className="text-xs font-medium">
                                  Requested Quantity{" "}
                                  <span className="text-destructive">*</span>
                                </FormLabel>
                                <FormControl>
                                  <NumberInput
                                    value={field.value ?? 0}
                                    onChange={(value) => field.onChange(value)}
                                    disabled={isViewMode}
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>
                      </div>

                      {/* Approved Quantity */}
                      <div className="space-y-1">
                        <div className="grid grid-cols-2 gap-1">
                          <FormField
                            control={localForm.control}
                            name="approved_qty"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel className="text-xs font-medium">
                                  Approved Quantity
                                </FormLabel>
                                <FormControl>
                                  <NumberInput
                                    value={field.value ?? 0}
                                    onChange={(value) => field.onChange(value)}
                                    disabled={isViewMode}
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />

                          <FormField
                            control={localForm.control}
                            name="foc"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel className="text-xs font-medium">
                                  FOC Quantity
                                </FormLabel>
                                <FormControl>
                                  <NumberInput
                                    value={field.value ?? 0}
                                    onChange={(value) => field.onChange(value)}
                                    disabled={isViewMode}
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>
                      </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-2">
                      <FormField
                        control={localForm.control}
                        name="delivery_date"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-xs font-medium">
                              <div className="flex items-center gap-1 mt-2">
                                <CalendarIcon className="h-3 w-3" />
                                Delivery Date
                              </div>
                            </FormLabel>
                            {mode === formType.VIEW ? (
                              <p className="text-xs text-muted-foreground mt-1 px-2 py-1 rounded">
                                {field.value ? (
                                  format(new Date(field.value), "PPP")
                                ) : (
                                  <span className="text-muted-foreground">
                                    Select date
                                  </span>
                                )}
                              </p>
                            ) : (
                              <Popover>
                                <PopoverTrigger asChild>
                                  <FormControl>
                                    <Button
                                      variant="outline"
                                      className={cn(
                                        "w-full pl-2 text-left font-normal text-xs bg-background mt-1",
                                        !field.value && "text-muted-foreground"
                                      )}
                                    >
                                      {field.value ? (
                                        format(new Date(field.value), "PPP")
                                      ) : (
                                        <span className="text-muted-foreground">
                                          Select date
                                        </span>
                                      )}
                                      <CalendarIcon className="ml-auto h-3 w-3 opacity-50" />
                                    </Button>
                                  </FormControl>
                                </PopoverTrigger>
                                <PopoverContent
                                  className="w-auto p-0"
                                  align="start"
                                >
                                  <Calendar
                                    mode="single"
                                    selected={
                                      field.value
                                        ? new Date(field.value)
                                        : undefined
                                    }
                                    onSelect={(date) =>
                                      field.onChange(
                                        date
                                          ? date.toISOString()
                                          : new Date().toISOString()
                                      )
                                    }
                                    initialFocus
                                  />
                                </PopoverContent>
                              </Popover>
                            )}
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={localForm.control}
                        name="delivery_point_id"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-xs font-medium">
                              Delivery Point
                            </FormLabel>
                            <FormControl>
                              <DeliveryPointLookup
                                value={field.value}
                                onValueChange={(value) => field.onChange(value)}
                                disabled={isViewMode}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center gap-2 mt-6">
                      <div className="h-0.5 w-4 bg-primary rounded-full"></div>
                      <h3 className="text-sm font-bold text-foreground">
                        Vendor and Additional Information
                      </h3>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-2">
                      <FormField
                        control={localForm.control}
                        name="vendor_id"
                        render={({ field }) => (
                          <FormItem className="col-span-2">
                            <FormLabel className="text-xs font-medium">
                              Vendor <span className="text-destructive">*</span>
                            </FormLabel>
                            <FormControl>
                              <VendorLookup
                                value={field.value ?? ""}
                                disabled={isViewMode}
                                onValueChange={(value) => field.onChange(value)}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={localForm.control}
                        name="price_list_id"
                        render={({ field }) => (
                          <FormItem className="col-span-1">
                            <FormLabel className="text-xs font-medium">
                              Price List
                            </FormLabel>
                            <FormControl>
                              <PriceListLookup
                                value={field.value ?? ""}
                                onValueChange={(value) => field.onChange(value)}
                                disabled={isViewMode}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  </div>

                  {/* Pricing & Tax Section */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="h-0.5 w-4 bg-primary rounded-full"></div>
                      <h3 className="text-sm font-bold text-foreground">
                        Pricing & Tax
                      </h3>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      className="text-xs h-6 px-2 hover:bg-primary hover:text-white transition-colors"
                    >
                      <Box className="mr-1 h-3 w-3" />
                      Compare Prices
                    </Button>
                  </div>

                  {/* Currency & Price */}
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-2">
                    <FormField
                      control={localForm.control}
                      name="currency_id"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-xs font-medium flex items-center gap-1">
                            Currency <span className="text-destructive">*</span>
                          </FormLabel>
                          <FormControl>
                            <CurrencyLookup
                              value={field.value}
                              onValueChange={(value) => field.onChange(value)}
                              disabled={isViewMode}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={localForm.control}
                      name="exchange_rate"
                      render={({ field }) => (
                        <FormItem>
                          <p className="text-xs font-medium">Exchange Rate</p>
                          <FormControl>
                            <Input
                              {...field}
                              value={getCurrencyExchangeRate(currencyId)}
                              onChange={(e) =>
                                field.onChange(parseFloat(e.target.value) || 1)
                              }
                              disabled
                              min={0.0}
                              className="bg-muted/50 text-xs font-medium"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={localForm.control}
                      name="price"
                      render={({ field }) => (
                        <FormItem className="col-span-2">
                          <FormLabel className="text-xs font-medium flex items-center gap-1">
                            Unit Price{" "}
                            <span className="text-destructive">*</span>
                          </FormLabel>
                          <FormControl>
                            <NumberInput
                              value={field.value ?? 0}
                              onChange={(value) => field.onChange(value)}
                              disabled={isViewMode}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
                    <FormField
                      control={localForm.control}
                      name="tax_type"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-xs font-medium">
                            Tax Type
                          </FormLabel>
                          <FormControl>
                            <Select
                              value={field.value ?? TaxType.INCLUDED}
                              onValueChange={field.onChange}
                              disabled={isViewMode}
                            >
                              <SelectTrigger className="bg-background text-xs">
                                <SelectValue placeholder="Select method" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value={TaxType.NONE}>
                                  None
                                </SelectItem>
                                <SelectItem value={TaxType.INCLUDED}>
                                  Included
                                </SelectItem>
                                <SelectItem value={TaxType.ADD}>Add</SelectItem>
                              </SelectContent>
                            </Select>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={localForm.control}
                      name="is_tax_adjustment"
                      render={({ field }) => (
                        <FormItem className="flex flex-col justify-end h-full">
                          <div className="flex items-center gap-2 bg-muted/30 p-2 rounded">
                            <FormControl>
                              <input
                                type="checkbox"
                                checked={field.value}
                                onChange={field.onChange}
                                disabled={isViewMode}
                                className="h-4 w-4 rounded border-gray-300"
                              />
                            </FormControl>
                            <FormLabel className="text-xs font-medium !m-0">
                              Enable Tax Adjustment
                            </FormLabel>
                          </div>
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={localForm.control}
                      name="tax_rate"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-xs font-medium">
                            Tax Rate (%)
                          </FormLabel>
                          <FormControl>
                            <NumberInput
                              value={field.value ?? 0}
                              onChange={(value) => field.onChange(value)}
                              disabled={isViewMode}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={localForm.control}
                      name="tax_amount"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-xs font-medium">
                            Tax Amount
                          </FormLabel>
                          <FormControl>
                            <NumberInput
                              value={field.value ?? 0}
                              onChange={(value) => field.onChange(value)}
                              disabled={isViewMode}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  {/* Discount Configuration */}
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
                    <FormField
                      control={localForm.control}
                      name="is_discount"
                      render={({ field }) => (
                        <FormItem className="flex flex-col justify-end h-full">
                          <div className="flex items-center gap-2 bg-muted/30 p-2 rounded">
                            <FormControl>
                              <input
                                type="checkbox"
                                checked={field.value}
                                onChange={field.onChange}
                                disabled={isViewMode}
                                className="h-4 w-4 rounded border-gray-300"
                              />
                            </FormControl>
                            <FormLabel className="text-xs font-medium !m-0">
                              Apply Discount
                            </FormLabel>
                          </div>
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={localForm.control}
                      name="is_discount_adjustment"
                      render={({ field }) => (
                        <FormItem className="flex flex-col justify-end h-full">
                          <div className="flex items-center gap-2 bg-muted/30 p-2 rounded">
                            <FormControl>
                              <input
                                type="checkbox"
                                checked={field.value}
                                onChange={field.onChange}
                                disabled={
                                  isViewMode || !localForm.watch("is_discount")
                                }
                                className="h-4 w-4 rounded border-gray-300"
                              />
                            </FormControl>
                            <FormLabel className="text-xs font-medium !m-0">
                              Enable Adjustment
                            </FormLabel>
                          </div>
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={localForm.control}
                      name="discount_rate"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-xs font-medium">
                            Discount Rate (%)
                          </FormLabel>
                          <FormControl>
                            <NumberInput
                              value={field.value ?? 0}
                              onChange={(value) => field.onChange(value)}
                              disabled={isViewMode}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={localForm.control}
                      name="discount_amount"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-xs font-medium">
                            Discount Amount
                          </FormLabel>
                          <FormControl>
                            <NumberInput
                              value={field.value ?? 0}
                              onChange={(value) => field.onChange(value)}
                              disabled={isViewMode}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center gap-2 mt-6">
                      <div className="h-0.5 w-4 bg-primary rounded-full"></div>
                      <h3 className="text-sm font-bold text-foreground">
                        Calculate Amount
                      </h3>
                    </div>

                    <FormField
                      control={localForm.control}
                      name="total_price"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-xs font-medium">
                            Total
                          </FormLabel>
                          <FormControl>
                            <NumberInput
                              value={field.value ?? 0}
                              onChange={(value) => field.onChange(value)}
                              disabled={isViewMode}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>
              </Form>
            </div>
          </ScrollArea>
        </div>

        <DialogFooter className="border-t pt-2 bg-background flex-shrink-0">
          <div className="flex items-center justify-between w-full">
            <div className="flex-1">
              {!isViewMode && !isFormValid && (
                <div className="flex items-center gap-2 text-xs text-muted-foreground bg-muted/50 p-1.5 rounded">
                  <div className="h-1 w-1 bg-destructive rounded-full"></div>
                  <span>
                    Fill required: Location, Product, Vendor, Qty, Unit,
                    Currency, Price
                  </span>
                </div>
              )}
              {!isViewMode && isFormValid && (
                <div className="flex items-center gap-2 text-xs text-primary bg-primary/10 p-1.5 rounded">
                  <div className="h-1 w-1 bg-primary rounded-full"></div>
                  <span>Ready to save</span>
                </div>
              )}
            </div>
            <div className="flex gap-2 ml-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
                className="px-3 text-xs"
              >
                {isViewMode ? "Close" : "Cancel"}
              </Button>
              {!isViewMode && (
                <Button
                  type="button"
                  onClick={handleSave}
                  disabled={isLoading || !isFormValid}
                  className="px-3 text-xs font-medium"
                  title={!isFormValid ? "Please fill all required fields" : ""}
                >
                  {isLoading ? "Saving..." : "Save"}
                </Button>
              )}
            </div>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
