import { CreditNoteDetailFormItemDto } from "@/dtos/credit-note.dto";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { useEffect, useState } from "react";
import { nanoid } from "nanoid";
import { Box } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import LookupLocation from "@/components/lookup/LookupLocation";
import LookupProduct from "@/components/lookup/LookupProduct";
import UnitLookup from "@/components/lookup/LookupUnit";
import LookupTaxType from "@/components/lookup/LookupTaxType";
import { Separator } from "@/components/ui/separator";
interface CnItemDialogProps {
  readonly open: boolean;
  readonly onOpenChange: (open: boolean) => void;
  readonly onSave: (item: CreditNoteDetailFormItemDto, isEdit: boolean) => void;
  readonly initItem?: CreditNoteDetailFormItemDto;
  readonly itemIndex?: number;
}

// Default empty item for new item creation
const createEmptyItem = (): CreditNoteDetailFormItemDto => ({
  description: undefined,
  note: undefined,
  location_id: "",
  product_id: "",
  return_qty: 0,
  return_unit_id: "",
  return_conversion_factor: 1,
  return_base_qty: 0,
  price: 0,
  tax_type_inventory_id: "",
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
});

export default function CnItemDialog({
  open,
  onOpenChange,
  onSave,
  initItem,
  itemIndex,
}: CnItemDialogProps) {
  const [formData, setFormData] = useState<CreditNoteDetailFormItemDto | null>(null);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

  const isEditMode = initItem !== undefined && itemIndex !== undefined;

  const calculateDerivedValues = (data: CreditNoteDetailFormItemDto) => {
    const qty = data.return_qty || 0;
    const price = data.price || 0;
    const taxRate = data.tax_rate || 0;
    const discountRate = data.discount_rate || 0;
    const conversionFactor = data.return_conversion_factor || 1;

    const baseQty = qty * conversionFactor;
    const basePrice = price;

    const discountAmount = data.is_discount_adjustment
      ? data.discount_amount
      : (price * qty * discountRate) / 100;

    const taxableAmount = price * qty - discountAmount;
    const taxAmount = data.is_tax_adjustment ? data.tax_amount : (taxableAmount * taxRate) / 100;

    const totalPrice = taxableAmount + taxAmount + (data.extra_cost_amount || 0);

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

  useEffect(() => {
    if (open) {
      if (initItem) {
        setFormData({ ...initItem });
      } else {
        setFormData(createEmptyItem());
      }
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
  };

  const handleSave = () => {
    if (!formData) return;

    if (isEditMode) {
      onSave(formData, true);
    } else {
      const newItem = {
        ...formData,
        id: nanoid(),
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

  const isFormValid = formData.product_id?.trim() && formData.return_qty > 0;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[1000px] h-[85vh] flex flex-col overflow-hidden">
        <DialogHeader className="border-b border-border pb-2 flex-shrink-0">
          <DialogTitle className="text-base font-semibold flex items-center gap-3">
            <div className="p-2 rounded-lg bg-primary/10">
              <Box className="h-4 w-4 text-primary" />
            </div>
            {isEditMode ? "Edit Item" : "Add Item"}
          </DialogTitle>
        </DialogHeader>

        <div className="flex-1 overflow-hidden">
          <ScrollArea className="h-full">
            <div className="space-y-4 px-4">
              <div>
                <div className="flex items-center gap-2">
                  <div className="h-0.5 w-4 bg-primary rounded-full"></div>
                  <h3 className="text-xs font-semibold">Location & Product Information</h3>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-2 mt-2">
                  <div>
                    <div className="space-y-2">
                      <label className="text-xs font-medium">Location</label>
                      <LookupLocation
                        value={formData.location_id || ""}
                        onValueChange={(value: string) => {
                          updateFormData({
                            location_id: value,
                          });
                        }}
                        placeholder="Select Location"
                      />
                    </div>
                  </div>

                  <div>
                    <div className="space-y-2">
                      <label className="text-xs font-medium">Product</label>
                      <LookupProduct
                        value={formData.product_id || ""}
                        onValueChange={(value: string) => {
                          updateFormData({
                            product_id: value,
                          });
                        }}
                        placeholder="Select Product"
                      />
                    </div>
                  </div>

                  <div className="md:col-span-2 lg:col-span-1">
                    <div className="space-y-2">
                      <label className="text-xs font-medium">Description</label>
                      <Textarea
                        value={formData.description || ""}
                        onChange={(e) => updateFormData({ description: e.target.value })}
                        placeholder="Enter Description"
                        rows={3}
                      />
                    </div>
                  </div>

                  <div className="md:col-span-2 lg:col-span-1">
                    <div className="space-y-2">
                      <label className="text-xs font-medium">Note</label>
                      <Textarea
                        value={formData.note || ""}
                        onChange={(e) => updateFormData({ note: e.target.value })}
                        placeholder="Enter Note"
                        rows={3}
                      />
                    </div>
                  </div>
                </div>
              </div>
              <Separator />
              <div>
                <div className="flex items-center gap-2">
                  <div className="h-0.5 w-4 bg-primary rounded-full"></div>
                  <h3 className="text-xs font-semibold">Price & Unit Information</h3>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mt-2">
                  <div>
                    <div className="space-y-2">
                      <label className="text-xs font-medium">Unit Price</label>
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
                    </div>
                  </div>

                  <div>
                    <div className="space-y-2">
                      <label className="text-xs font-medium">Base Price</label>
                      <Input
                        type="number"
                        value={formData.base_price}
                        readOnly
                        className="bg-muted"
                      />
                    </div>
                  </div>

                  <div>
                    <div className="space-y-2">
                      <label className="text-xs font-medium">Return Quantity</label>
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
                    </div>
                  </div>

                  <div>
                    <div className="space-y-2">
                      <label className="text-xs font-medium">Unit</label>
                      <UnitLookup
                        value={formData.return_unit_id || ""}
                        onValueChange={(value: string) => {
                          updateFormData({
                            return_unit_id: value,
                          });
                        }}
                        placeholder="Select Unit"
                      />
                    </div>
                  </div>

                  <div>
                    <div className="space-y-2">
                      <label className="text-xs font-medium">Conversion Factor</label>
                      <Input
                        type="number"
                        min="0"
                        step="0.01"
                        value={formData.return_conversion_factor}
                        onChange={(e) =>
                          updateFormData({
                            return_conversion_factor: Number(e.target.value),
                          })
                        }
                        placeholder="1.00"
                      />
                    </div>
                  </div>

                  <div>
                    <div className="space-y-2">
                      <label className="text-xs font-medium">Base Quantity</label>
                      <Input
                        type="number"
                        value={formData.return_base_qty}
                        readOnly
                        className="bg-muted"
                      />
                    </div>
                  </div>
                </div>
              </div>
              <Separator />
              <div>
                <div className="flex items-center gap-2">
                  <div className="h-0.5 w-4 bg-primary rounded-full"></div>
                  <h3 className="text-xs font-semibold">Tax Information</h3>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mt-2">
                  <div>
                    <div className="space-y-2">
                      <label className="text-xs font-medium">Tax Type</label>
                      <LookupTaxType
                        value={formData.tax_type_inventory_id || ""}
                        onValueChange={(value: string) => {
                          updateFormData({
                            tax_type_inventory_id: value,
                          });
                        }}
                        placeholder="Select Tax Type"
                      />
                    </div>
                  </div>

                  <div>
                    <div className="space-y-2">
                      <label className="text-xs font-medium">Tax Rate (%)</label>
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
                    </div>
                  </div>

                  <div>
                    <div className="space-y-2">
                      <label className="text-xs font-medium">Tax Amount</label>
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
                        className={formData.is_tax_adjustment ? "" : "bg-muted"}
                      />
                    </div>
                  </div>

                  <div>
                    <div className="space-y-2">
                      <label className="text-xs font-medium">Base Tax Amount</label>
                      <Input
                        type="number"
                        value={formData.base_tax_amount}
                        readOnly
                        className="bg-muted"
                      />
                    </div>
                  </div>

                  <div className="flex flex-row items-center justify-between rounded-lg border p-4 col-span-1">
                    <div className="space-y-0.5">
                      <label className="text-xs font-medium">Adjust Tax</label>
                      <div className="text-xs text-muted-foreground">Adjust tax manually</div>
                    </div>
                    <Switch
                      checked={formData.is_tax_adjustment}
                      onCheckedChange={(checked) => updateFormData({ is_tax_adjustment: checked })}
                    />
                  </div>
                </div>
              </div>
              <Separator />
              <div>
                <div className="flex items-center gap-2">
                  <div className="h-0.5 w-4 bg-primary rounded-full"></div>
                  <h3 className="text-xs font-semibold">Discount & Extra Cost</h3>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mt-2">
                  <div>
                    <div className="space-y-2">
                      <label className="text-xs font-medium">Discount Rate (%)</label>
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
                    </div>
                  </div>

                  <div>
                    <div className="space-y-2">
                      <label className="text-xs font-medium">Discount Amount</label>
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
                        className={formData.is_discount_adjustment ? "" : "bg-muted"}
                      />
                    </div>
                  </div>

                  <div>
                    <div className="space-y-2">
                      <label className="text-xs font-medium">Base Discount Amount</label>
                      <Input
                        type="number"
                        value={formData.base_discount_amount}
                        readOnly
                        className="bg-muted"
                      />
                    </div>
                  </div>

                  <div>
                    <div className="space-y-2">
                      <label className="text-xs font-medium">Extra Cost Amount</label>
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
                    </div>
                  </div>

                  <div>
                    <div className="space-y-2">
                      <label className="text-xs font-medium">Base Extra Cost Amount</label>
                      <Input
                        type="number"
                        value={formData.base_extra_cost_amount}
                        readOnly
                        className="bg-muted"
                      />
                    </div>
                  </div>

                  <div className="flex flex-row items-center justify-between rounded-lg border p-4 col-span-2">
                    <div className="space-y-0.5">
                      <label className="text-xs font-medium">Adjust Discount</label>
                      <div className="text-xs text-muted-foreground">Adjust discount manually</div>
                    </div>
                    <Switch
                      checked={formData.is_discount_adjustment}
                      onCheckedChange={(checked) =>
                        updateFormData({
                          is_discount_adjustment: checked,
                        })
                      }
                    />
                  </div>
                </div>
              </div>
            </div>
          </ScrollArea>
        </div>

        <DialogFooter>
          <div className="flex justify-end w-full gap-2">
            <Button variant="outline" onClick={handleCancel} size="sm">
              Cancel
            </Button>
            <Button onClick={handleSave} disabled={!isFormValid} size="sm">
              {isEditMode ? "Update" : "Save"}
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
