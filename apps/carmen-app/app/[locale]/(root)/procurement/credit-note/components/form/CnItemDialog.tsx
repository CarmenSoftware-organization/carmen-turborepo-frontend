import {
  CreditNoteDetailFormItemDto,
  CreditNoteFormDto,
} from "../../dto/cdn.dto";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Control } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { useEffect, useState } from "react";
import { nanoid } from "nanoid";
import {
  Box,
  Calculator,
  Package,
  Receipt,
  Percent,
  AlertCircle,
} from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import LocationLookup from "@/components/lookup/LocationLookup";
import ProductLookup from "@/components/lookup/ProductLookup";
import { useFormState } from "react-hook-form";

interface CnItemDialogProps {
  readonly open: boolean;
  readonly onOpenChange: (open: boolean) => void;
  readonly control: Control<CreditNoteFormDto>;
  readonly onSave: (item: CreditNoteDetailFormItemDto, isEdit: boolean) => void;
  readonly initItem?: CreditNoteDetailFormItemDto;
  readonly itemIndex?: number;
}

// Default empty item for new item creation
const createEmptyItem = (): CreditNoteDetailFormItemDto => ({
  credit_note_id: "",
  description: null,
  note: null,
  location_id: "",
  location_name: null,
  product_id: "",
  product_name: "",
  product_local_name: null,
  return_qty: 0,
  return_unit_id: "",
  return_unit_name: null,
  return_conversion_factor: 1,
  return_base_qty: 0,
  price: 0,
  tax_type_inventory_id: "",
  tax_type: "",
  tax_rate: 0,
  tax_amount: 0,
  is_tax_adjustment: false,
  discount_rate: 0,
  discount_amount: 0,
  is_discount_adjustment: false,
  extra_cost_amount: 0,
  base_price: 0,
  base_tax_amount: 0,
  base_discount_amount: 0,
  base_extra_cost_amount: 0,
  total_price: 0,
  created_at: new Date().toISOString(),
  created_by_id: "",
});

// ตัวอย่างการใช้ formState เพื่อตรวจสอบสถานะของแต่ละ field
const useFieldValidation = (control: Control<CreditNoteFormDto>) => {
  const formState = useFormState({ control });

  return {
    // สถานะทั้งหมด
    isDirty: formState.isDirty,
    isValid: formState.isValid,

    // สถานะของ field เฉพาะ
    dirtyFields: formState.dirtyFields,
    errors: formState.errors,
    touchedFields: formState.touchedFields,

    // Helper functions
    isFieldDirty: (fieldName: string) => {
      return formState.dirtyFields[
        fieldName as keyof typeof formState.dirtyFields
      ];
    },

    isFieldValid: (fieldName: string) => {
      return !formState.errors[fieldName as keyof typeof formState.errors];
    },

    getFieldError: (fieldName: string) => {
      return formState.errors[fieldName as keyof typeof formState.errors];
    },
  };
};

export default function CnItemDialog({
  open,
  onOpenChange,
  control,
  onSave,
  initItem,
  itemIndex,
}: CnItemDialogProps) {
  const [formData, setFormData] = useState<CreditNoteDetailFormItemDto | null>(
    null
  );
  // const [errors, setErrors] = useState({});
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

  const isEditMode = initItem !== undefined && itemIndex !== undefined;

  // ใช้ field validation helper
  const fieldValidation = useFieldValidation(control);

  // ตัวอย่างการใช้งาน - สามารถดูสถานะได้
  console.log("Form State:", {
    isDirty: fieldValidation.isDirty,
    isValid: fieldValidation.isValid,
    dirtyFields: fieldValidation.dirtyFields,
    errors: fieldValidation.errors,
    touchedFields: fieldValidation.touchedFields,
  });

  // Calculate derived values
  const calculateDerivedValues = (data: CreditNoteDetailFormItemDto) => {
    const qty = data.return_qty || 0;
    const price = data.price || 0;
    const taxRate = data.tax_rate || 0;
    const discountRate = data.discount_rate || 0;
    const conversionFactor = data.return_conversion_factor || 1;

    // Calculate base quantities and amounts
    const baseQty = qty * conversionFactor;
    const basePrice = price;

    // Calculate discount
    const discountAmount = data.is_discount_adjustment
      ? data.discount_amount
      : (price * qty * discountRate) / 100;

    // Calculate tax on discounted amount
    const taxableAmount = price * qty - discountAmount;
    const taxAmount = data.is_tax_adjustment
      ? data.tax_amount
      : (taxableAmount * taxRate) / 100;

    // Calculate total
    const totalPrice =
      taxableAmount + taxAmount + (data.extra_cost_amount || 0);

    return {
      ...data,
      return_base_qty: baseQty,
      base_price: basePrice,
      discount_amount: discountAmount,
      tax_amount: taxAmount,
      base_discount_amount: discountAmount,
      base_tax_amount: taxAmount,
      base_extra_cost_amount: data.extra_cost_amount || 0,
      total_price: totalPrice,
    };
  };

  // const validateForm = (
  //   data: CreditNoteDetailFormItemDto
  // ): ValidationErrors => {
  //   const newErrors: ValidationErrors = {};

  //   if (!data.product_name?.trim()) {
  //     newErrors.product_name = "Product name is required";
  //   }

  //   if (data.return_qty <= 0) {
  //     newErrors.return_qty = "Quantity must be greater than 0";
  //   }

  //   if (data.price < 0) {
  //     newErrors.price = "Price must be greater than 0";
  //   }

  //   if (data.tax_rate < 0 || data.tax_rate > 100) {
  //     newErrors.tax_rate = "Tax rate must be between 0-100%";
  //   }

  //   if (data.discount_rate < 0 || data.discount_rate > 100) {
  //     newErrors.discount_rate = "Discount rate must be between 0-100%";
  //   }

  //   return newErrors;
  // };

  useEffect(() => {
    if (open) {
      if (initItem) {
        setFormData({ ...initItem });
      } else {
        setFormData(createEmptyItem());
      }
      // setErrors({});
      setHasUnsavedChanges(false);
    } else {
      setFormData(null);
    }
  }, [open, initItem]);

  const updateFormData = (updates: Partial<CreditNoteDetailFormItemDto>) => {
    if (!formData) return;

    const newData = { ...formData, ...updates };
    const calculatedData = calculateDerivedValues(newData);
    setFormData(calculatedData);
    setHasUnsavedChanges(true);

    // Clear specific field errors when user updates them
    // const newErrors = { ...errors };
    // Object.keys(updates).forEach((key) => {
    //   if (key in newErrors) {
    //     delete newErrors[key as keyof ValidationErrors];
    //   }
    // });
    // setErrors(newErrors);
  };

  const handleSave = () => {
    if (!formData) return;

    if (isEditMode) {
      onSave(formData, true);
    } else {
      const newItem = {
        ...formData,
        id: nanoid(),
        sequence_no: Date.now(),
      };
      onSave(newItem, false);
    }

    onOpenChange(false);
  };

  const handleCancel = () => {
    if (hasUnsavedChanges) {
      if (confirm("There are unsaved changes. Do you want to cancel?")) {
        onOpenChange(false);
      }
    } else {
      onOpenChange(false);
    }
  };

  if (!formData) return null;

  // const hasErrors = Object.keys(errors).length > 0;
  const hasErrors = false;
  const isFormValid = formData.product_name?.trim() && formData.return_qty > 0;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[1400px] h-[85vh] flex flex-col overflow-hidden">
        <DialogHeader className="border-b border-border pb-4 flex-shrink-0">
          <DialogTitle className="text-xl font-semibold flex items-center gap-3">
            <div className="p-2 rounded-lg bg-primary/10">
              <Box className="h-5 w-5 text-primary" />
            </div>
            {isEditMode ? "Edit Item" : "Add Item"}
          </DialogTitle>
        </DialogHeader>

        <div className="flex-1 overflow-hidden">
          <ScrollArea className="h-full">
            <div className="space-y-4 px-4">
              <div>
                <div className="flex items-center gap-2">
                  <Package className="h-4 w-4 text-primary" />
                  <h3 className="text-sm font-semibold">
                    Location & Product Information
                  </h3>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2 mt-2">
                  <FormField
                    control={control}
                    name="credit_note_detail.data"
                    render={() => (
                      <FormItem>
                        <FormLabel>Location</FormLabel>
                        <FormControl>
                          <LocationLookup
                            value={formData.location_id || ""}
                            onValueChange={(value: string) => {
                              updateFormData({
                                location_id: value,
                                location_name: "", // จะได้ชื่อจาก component
                              });
                            }}
                            placeholder="Select Location"
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={control}
                    name="credit_note_detail.data"
                    render={() => (
                      <FormItem>
                        <FormLabel>Product</FormLabel>
                        <FormControl>
                          <ProductLookup
                            value={formData.product_id || ""}
                            onValueChange={(value: string) => {
                              updateFormData({
                                product_id: value,
                                product_name: "",
                              });
                            }}
                            placeholder="Select Product"
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={control}
                    name="credit_note_detail.data"
                    render={() => (
                      <FormItem>
                        <FormLabel>Product Local Name</FormLabel>
                        <FormControl>
                          <Input
                            value={formData.product_local_name || ""}
                            onChange={(e) =>
                              updateFormData({
                                product_local_name: e.target.value,
                              })
                            }
                            placeholder="Enter Product Local Name"
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={control}
                    name="credit_note_detail.data"
                    render={() => (
                      <FormItem className="md:col-span-2 lg:col-span-1">
                        <FormLabel>Description</FormLabel>
                        <FormControl>
                          <Textarea
                            value={formData.description || ""}
                            onChange={(e) =>
                              updateFormData({ description: e.target.value })
                            }
                            placeholder="Enter Description"
                            rows={3}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={control}
                    name="credit_note_detail.data"
                    render={() => (
                      <FormItem className="md:col-span-2 lg:col-span-1">
                        <FormLabel>Note</FormLabel>
                        <FormControl>
                          <Textarea
                            value={formData.note || ""}
                            onChange={(e) =>
                              updateFormData({ note: e.target.value })
                            }
                            placeholder="Enter Note"
                            rows={3}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                </div>
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <Calculator className="h-4 w-4 text-primary" />
                  <h3 className="text-sm font-semibold">
                    Price & Unit Information
                  </h3>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mt-2">
                  <FormField
                    control={control}
                    name="credit_note_detail.data"
                    render={() => (
                      <FormItem>
                        <FormLabel>Unit Price</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            min="0"
                            step="0.01"
                            value={formData.price}
                            onChange={(e) =>
                              updateFormData({
                                price: Number(e.target.value),
                              })
                            }
                            placeholder="0.00"
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={control}
                    name="credit_note_detail.data"
                    render={() => (
                      <FormItem>
                        <FormLabel>Base Price</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            value={formData.base_price}
                            readOnly
                            className="bg-muted"
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={control}
                    name="credit_note_detail.data"
                    render={() => (
                      <FormItem>
                        <FormLabel>Return Quantity</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            min="0"
                            step="0.01"
                            value={formData.return_qty}
                            onChange={(e) =>
                              updateFormData({
                                return_qty: Number(e.target.value),
                              })
                            }
                            placeholder="0.00"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={control}
                    name="credit_note_detail.data"
                    render={() => (
                      <FormItem>
                        <FormLabel>Unit</FormLabel>
                        <FormControl>
                          <Input
                            value={formData.return_unit_name || ""}
                            onChange={(e) =>
                              updateFormData({
                                return_unit_name: e.target.value,
                              })
                            }
                            placeholder="Enter Unit"
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={control}
                    name="credit_note_detail.data"
                    render={() => (
                      <FormItem>
                        <FormLabel>Conversion Factor</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            min="0"
                            step="0.01"
                            value={formData.return_conversion_factor}
                            onChange={(e) =>
                              updateFormData({
                                return_conversion_factor: Number(
                                  e.target.value
                                ),
                              })
                            }
                            placeholder="1.00"
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={control}
                    name="credit_note_detail.data"
                    render={() => (
                      <FormItem>
                        <FormLabel>Base Quantity</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            value={formData.return_base_qty}
                            readOnly
                            className="bg-muted"
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                </div>
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <Percent className="h-4 w-4 text-primary" />
                  <h3 className="text-sm font-semibold">Tax Information</h3>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mt-2">
                  <FormField
                    control={control}
                    name="credit_note_detail.data"
                    render={() => (
                      <FormItem>
                        <FormLabel>Tax Type</FormLabel>
                        <FormControl>
                          <Input
                            value={formData.tax_type || ""}
                            onChange={(e) =>
                              updateFormData({ tax_type: e.target.value })
                            }
                            placeholder="Enter Tax Type"
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={control}
                    name="credit_note_detail.data"
                    render={() => (
                      <FormItem>
                        <FormLabel>Tax Rate (%)</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            min="0"
                            max="100"
                            step="0.01"
                            value={formData.tax_rate}
                            onChange={(e) =>
                              updateFormData({
                                tax_rate: Number(e.target.value),
                              })
                            }
                            placeholder="0.00"
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={control}
                    name="credit_note_detail.data"
                    render={() => (
                      <FormItem>
                        <FormLabel>Tax Amount</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            min="0"
                            step="0.01"
                            value={formData.tax_amount}
                            onChange={(e) =>
                              updateFormData({
                                tax_amount: Number(e.target.value),
                              })
                            }
                            placeholder="0.00"
                            disabled={!formData.is_tax_adjustment}
                            className={
                              formData.is_tax_adjustment ? "" : "bg-muted"
                            }
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={control}
                    name="credit_note_detail.data"
                    render={() => (
                      <FormItem>
                        <FormLabel>Base Tax Amount</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            value={formData.base_tax_amount}
                            readOnly
                            className="bg-muted"
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={control}
                    name="credit_note_detail.data"
                    render={() => (
                      <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4 col-span-1">
                        <div className="space-y-0.5">
                          <FormLabel className="text-base">
                            Adjust Tax
                          </FormLabel>
                          <div className="text-[0.8rem] text-muted-foreground">
                            Adjust tax manually
                          </div>
                        </div>
                        <FormControl>
                          <Switch
                            checked={formData.is_tax_adjustment}
                            onCheckedChange={(checked) =>
                              updateFormData({ is_tax_adjustment: checked })
                            }
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center gap-2">
                  <Receipt className="h-4 w-4 text-primary" />
                  <h3 className="text-sm font-semibold">
                    Discount & Extra Cost
                  </h3>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mt-2">
                  <FormField
                    control={control}
                    name="credit_note_detail.data"
                    render={() => (
                      <FormItem>
                        <FormLabel>Discount Rate (%)</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            min="0"
                            max="100"
                            step="0.01"
                            value={formData.discount_rate}
                            onChange={(e) =>
                              updateFormData({
                                discount_rate: Number(e.target.value),
                              })
                            }
                            placeholder="0.00"
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={control}
                    name="credit_note_detail.data"
                    render={() => (
                      <FormItem>
                        <FormLabel>Discount Amount</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            min="0"
                            step="0.01"
                            value={formData.discount_amount}
                            onChange={(e) =>
                              updateFormData({
                                discount_amount: Number(e.target.value),
                              })
                            }
                            placeholder="0.00"
                            disabled={!formData.is_discount_adjustment}
                            className={
                              formData.is_discount_adjustment ? "" : "bg-muted"
                            }
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={control}
                    name="credit_note_detail.data"
                    render={() => (
                      <FormItem>
                        <FormLabel>Base Discount Amount</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            value={formData.base_discount_amount}
                            readOnly
                            className="bg-muted"
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={control}
                    name="credit_note_detail.data"
                    render={() => (
                      <FormItem>
                        <FormLabel>Extra Cost Amount</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            min="0"
                            step="0.01"
                            value={formData.extra_cost_amount}
                            onChange={(e) =>
                              updateFormData({
                                extra_cost_amount: Number(e.target.value),
                              })
                            }
                            placeholder="0.00"
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={control}
                    name="credit_note_detail.data"
                    render={() => (
                      <FormItem>
                        <FormLabel>Base Extra Cost Amount</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            value={formData.base_extra_cost_amount}
                            readOnly
                            className="bg-muted"
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={control}
                    name="credit_note_detail.data"
                    render={() => (
                      <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4 col-span-2">
                        <div className="space-y-0.5">
                          <FormLabel className="text-base">
                            Adjust Discount
                          </FormLabel>
                          <div className="text-[0.8rem] text-muted-foreground">
                            Adjust discount manually
                          </div>
                        </div>
                        <FormControl>
                          <Switch
                            checked={formData.is_discount_adjustment}
                            onCheckedChange={(checked) =>
                              updateFormData({
                                is_discount_adjustment: checked,
                              })
                            }
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                </div>
              </div>

              {/* <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Calculator className="h-4 w-4" />
                    Summary
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                      <div className="space-y-2">
                        <p className="text-sm font-medium text-muted-foreground">
                          Quantity × Unit Price
                        </p>
                        <p className="text-lg font-semibold">
                          {(
                            formData.return_qty * formData.price
                          ).toLocaleString("th-TH", {
                            minimumFractionDigits: 2,
                          })}{" "}
                          บาท
                        </p>
                      </div>
                      <div className="space-y-2">
                        <p className="text-sm font-medium text-muted-foreground">
                          Discount
                        </p>
                        <p className="text-lg font-semibold text-green-600">
                          -
                          {formData.discount_amount.toLocaleString("th-TH", {
                            minimumFractionDigits: 2,
                          })}{" "}
                          Unit Base
                        </p>
                      </div>
                      <div className="space-y-2">
                        <p className="text-sm font-medium text-muted-foreground">
                          Tax
                        </p>
                        <p className="text-lg font-semibold">
                          {formData.tax_amount.toLocaleString("th-TH", {
                            minimumFractionDigits: 2,
                          })}{" "}
                          Unit Base
                        </p>
                      </div>
                      <div className="space-y-2">
                        <p className="text-sm font-medium text-muted-foreground">
                          Extra Cost
                        </p>
                        <p className="text-lg font-semibold">
                          {formData.extra_cost_amount.toLocaleString("th-TH", {
                            minimumFractionDigits: 2,
                          })}{" "}
                          Unit Base
                        </p>
                      </div>
                    </div>

                    <Separator />

                    <div className="flex justify-between items-center p-4 bg-primary/5 rounded-lg">
                      <p className="text-xl font-bold">Total</p>
                      <p className="text-2xl font-bold text-primary">
                        {formData.total_price.toLocaleString("th-TH", {
                          minimumFractionDigits: 2,
                        })}{" "}
                        Unit Base
                      </p>
                    </div>

                    {hasErrors && (
                      <Alert variant="destructive">
                        <AlertCircle className="h-4 w-4" />
                        <AlertDescription>
                          Please check the required information and fix the errors before saving
                        </AlertDescription>
                      </Alert>
                    )}
                  </div>
                </CardContent>
              </Card> */}
            </div>
          </ScrollArea>
        </div>

        <DialogFooter className="border-t border-border pt-4 bg-background flex-shrink-0">
          <div className="flex justify-between w-full">
            <div className="flex items-center gap-2">
              {hasErrors && (
                <Badge variant="destructive" className="gap-1">
                  <AlertCircle className="h-3 w-3" />
                  มีข้อผิดพลาด 0 รายการ
                </Badge>
              )}
            </div>
            <div className="flex gap-3">
              <Button variant="outline" onClick={handleCancel}>
                ยกเลิก
              </Button>
              <Button
                onClick={handleSave}
                disabled={!isFormValid}
                className="min-w-[100px]"
              >
                {isEditMode ? "อัปเดต" : "บันทึก"}
              </Button>
            </div>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
