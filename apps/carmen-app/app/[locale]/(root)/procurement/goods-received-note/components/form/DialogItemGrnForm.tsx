"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
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
import { ScrollArea } from "@/components/ui/scroll-area";
import LocationLookup from "@/components/lookup/LocationLookup";
import ProductLookup from "@/components/lookup/ProductLookup";
import TaxTypeLookup from "@/components/lookup/TaxTypeLookup";
import UnitLookup from "@/components/lookup/UnitLookup";
import { formType } from "@/dtos/form.dto";
import { GoodReceivedNoteDetailItemDto } from "@/dtos/grn.dto";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { v4 as uuidv4 } from "uuid";
import { z } from "zod";
import { Box, CalendarIcon, Plus } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { Textarea } from "@/components/ui/textarea";
import DeliveryPointLookup from "@/components/lookup/DeliveryPointLookup";
import { TaxType } from "@/constants/enum";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";

const GrnItemFormSchema = z.object({
  id: z.string().uuid().optional(),
  purchase_order_detail_id: z.string().uuid().optional(),
  sequence_no: z.number().optional().default(0),
  location_id: z.string().min(1, "Location is required"),
  product_id: z.string().min(1, "Product is required"),
  order_qty: z.number().optional().default(0),
  order_unit_id: z.string().optional(),
  received_qty: z.number().optional().default(0),
  received_unit_id: z.string().optional(),
  is_foc: z.boolean().optional().default(false),
  foc_qty: z.number().optional().default(0),
  foc_unit_id: z.string().optional(),
  price: z.number().optional().default(0),
  tax_type_inventory_id: z.string().optional(),
  tax_type: z.string().optional(),
  tax_rate: z.number().optional().default(0),
  tax_amount: z.number().optional().default(0),
  is_tax_adjustment: z.boolean().optional().default(false),
  total_amount: z.number().optional().default(0),
  delivery_point_id: z.string().optional(),
  base_price: z.number().optional().default(0),
  base_qty: z.number().optional().default(0),
  extra_cost: z.number().optional().default(0),
  total_cost: z.number().optional().default(0),
  is_discount: z.boolean().optional().default(false),
  discount_rate: z.number().optional().default(0),
  discount_amount: z.number().optional().default(0),
  is_discount_adjustment: z.boolean().optional().default(false),
  expired_date: z.string().optional(),
  note: z.string().optional().default(""),
  exchange_rate: z.number().optional().default(1),
  info: z.any().optional(),
  dimension: z.any().optional(),
});

type GrnItemFormValues = z.infer<typeof GrnItemFormSchema>;

const defaultItemValues: GrnItemFormValues = {
  location_id: "",
  product_id: "",
  note: "",
  sequence_no: 0,
  order_qty: 0,
  received_qty: 0,
  is_foc: false,
  foc_qty: 0,
  price: 0,
  tax_rate: 0,
  tax_amount: 0,
  is_tax_adjustment: false,
  total_amount: 0,
  base_price: 0,
  base_qty: 0,
  extra_cost: 0,
  total_cost: 0,
  is_discount: false,
  discount_rate: 0,
  discount_amount: 0,
  is_discount_adjustment: false,
  exchange_rate: 1,
  id: undefined,
  purchase_order_detail_id: undefined,
  order_unit_id: "",
  received_unit_id: "",
  foc_unit_id: "",
  tax_type_inventory_id: "",
  tax_type: "",
  delivery_point_id: "",
  expired_date: undefined,
  info: undefined,
  dimension: "",
};

const convertDtoToFormValues = (
  dto: GoodReceivedNoteDetailItemDto
): GrnItemFormValues => {
  return {
    ...defaultItemValues,
    ...dto,
    note: dto.note ?? "",
    order_unit_id: dto.order_unit_id ?? "",
    received_unit_id: dto.received_unit_id ?? "",
    foc_unit_id: dto.foc_unit_id ?? "",
    tax_type_inventory_id: dto.tax_type_inventory_id ?? "",
    tax_type: dto.tax_type ?? TaxType.NONE,
    delivery_point_id: dto.delivery_point_id ?? "",
    dimension: dto.dimension ?? "",
    expired_date: dto.expired_date ?? "", // always a string
  };
};

const convertFormValuesToDto = (
  formValues: GrnItemFormValues
): GoodReceivedNoteDetailItemDto & { id?: string } => {
  return {
    ...formValues,
    order_unit_id: formValues.order_unit_id ?? "",
    received_unit_id: formValues.received_unit_id ?? "",
    foc_unit_id: formValues.foc_unit_id ?? "",
    tax_type_inventory_id: formValues.tax_type_inventory_id ?? "",
    tax_type:
      formValues.tax_type === "included" ||
      formValues.tax_type === "excluded" ||
      formValues.tax_type === "none"
        ? formValues.tax_type
        : TaxType.NONE,
    delivery_point_id: formValues.delivery_point_id ?? "",
    dimension: formValues.dimension ?? "",
    note: formValues.note ?? "",
    info: formValues.info,
    id: formValues.id,
    expired_date: formValues.expired_date ?? "",
  };
};

interface DialogGrnFormProps {
  readonly mode: formType;
  readonly onAddItem: (
    item: GoodReceivedNoteDetailItemDto,
    action: "add" | "update"
  ) => void;
  readonly initialData?: GoodReceivedNoteDetailItemDto | null;
  readonly isOpen?: boolean;
  readonly onOpenChange?: (open: boolean) => void;
}

export default function DialogItemGrnForm({
  mode,
  onAddItem,
  initialData = null,
  isOpen,
  onOpenChange,
}: DialogGrnFormProps) {
  const [dialogOpen, setDialogOpen] = useState(false);

  // Use external control if provided
  const isDialogOpen = isOpen ?? dialogOpen;
  const setIsDialogOpen = onOpenChange || setDialogOpen;

  const form = useForm<GrnItemFormValues>({
    resolver: zodResolver(GrnItemFormSchema),
    defaultValues: {},
  });

  useEffect(() => {
    if (isOpen) {
      if (initialData) {
        form.reset(convertDtoToFormValues(initialData));
      } else {
        form.reset(defaultItemValues);
      }
    }
  }, [initialData, isOpen, form]);

  const onSubmit = async (data: GrnItemFormValues) => {
    const action = initialData ? "update" : "add";
    let dtoData = convertFormValuesToDto(data);
    if (action === "add" && !dtoData.id) {
      dtoData = { ...dtoData, id: uuidv4() };
    }
    onAddItem(dtoData, action);
    handleCancel();
  };

  const handleCancel = () => {
    form.reset();
    setIsDialogOpen(false);
  };

  const dialogTitle = initialData ? "Edit Item" : "Add Item";

  return (
    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
      {!onOpenChange && (
        <DialogTrigger asChild>
          <Button variant="default" size="sm" disabled={mode === formType.VIEW}>
            <Plus />
            Add Good Recieve Note Item
          </Button>
        </DialogTrigger>
      )}
      <DialogContent className="sm:max-w-[1000px] h-[87vh] flex flex-col overflow-hidden">
        <DialogHeader className="border-b border-border pb-2 flex-shrink-0">
          <DialogTitle className="text-base font-semibold flex items-center gap-3">
            <div className="p-2 rounded-lg bg-primary/10">
              <Box className="h-4 w-4 text-primary" />
            </div>
            {dialogTitle}
          </DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <ScrollArea className="h-[calc(80vh-100px)]">
              <div className="space-y-4 px-4">
                <div>
                  <div className="flex items-center gap-2">
                    <div className="h-0.5 w-4 bg-primary rounded-full"></div>
                    <h3 className="text-xs font-semibold">
                      Product Information
                    </h3>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
                    <FormField
                      control={form.control}
                      name="product_id"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Product</FormLabel>
                          <FormControl>
                            <ProductLookup
                              value={field.value}
                              onValueChange={field.onChange}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="location_id"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Location</FormLabel>
                          <FormControl>
                            <LocationLookup
                              value={field.value}
                              onValueChange={field.onChange}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="delivery_point_id"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Delivery Point</FormLabel>
                          <FormControl>
                            <DeliveryPointLookup
                              value={field.value}
                              onValueChange={field.onChange}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="sequence_no"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Sequence No.</FormLabel>
                          <FormControl>
                            <Input
                              type="number"
                              min="1"
                              {...field}
                              onChange={(e) =>
                                field.onChange(
                                  e.target.valueAsNumber || undefined
                                )
                              }
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="purchase_order_detail_id"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Purchase Order Detail</FormLabel>
                          <FormControl>
                            <Input {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>

                <Separator />

                <div>
                  <div className="flex items-center gap-2">
                    <div className="h-0.5 w-4 bg-primary rounded-full"></div>
                    <h3 className="text-xs font-semibold">
                      Quantity Information
                    </h3>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    <FormField
                      control={form.control}
                      name="order_qty"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Order Qty</FormLabel>
                          <FormControl>
                            <Input
                              type="number"
                              min="0"
                              step="0.01"
                              {...field}
                              onChange={(e) =>
                                field.onChange(
                                  e.target.valueAsNumber || undefined
                                )
                              }
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="order_unit_id"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Order Unit</FormLabel>
                          <FormControl>
                            <UnitLookup
                              value={field.value}
                              onValueChange={field.onChange}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="received_qty"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Received Qty</FormLabel>
                          <FormControl>
                            <Input
                              type="number"
                              min="0"
                              step="0.01"
                              {...field}
                              onChange={(e) =>
                                field.onChange(
                                  e.target.valueAsNumber || undefined
                                )
                              }
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="received_unit_id"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Received Unit</FormLabel>
                          <FormControl>
                            <UnitLookup
                              value={field.value}
                              onValueChange={field.onChange}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <FormField
                      control={form.control}
                      name="foc_qty"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>FOC Qty</FormLabel>
                          <FormControl>
                            <Input
                              type="number"
                              min="0"
                              step="0.01"
                              {...field}
                              onChange={(e) =>
                                field.onChange(
                                  e.target.valueAsNumber || undefined
                                )
                              }
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="base_qty"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Base Qty</FormLabel>
                          <FormControl>
                            <Input
                              type="number"
                              min="0"
                              step="0.01"
                              {...field}
                              onChange={(e) =>
                                field.onChange(
                                  e.target.valueAsNumber || undefined
                                )
                              }
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="foc_unit_id"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>FOC Unit</FormLabel>
                          <FormControl>
                            <UnitLookup
                              value={field.value}
                              onValueChange={field.onChange}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="is_foc"
                      render={({ field }) => (
                        <FormItem>
                          <FormControl>
                            <div className="flex flex-row items-center justify-between rounded-lg border p-4 col-span-1">
                              <div className="space-y-0.5">
                                <label className="text-xs font-medium">
                                  FOC (Free of Charge)
                                </label>
                                <div className="text-xs text-muted-foreground">
                                  Free of Charge
                                </div>
                              </div>
                              <Switch
                                checked={field.value}
                                onCheckedChange={(checked) =>
                                  field.onChange(checked)
                                }
                              />
                            </div>
                          </FormControl>
                        </FormItem>
                      )}
                    />
                  </div>
                </div>

                <Separator />

                <div>
                  <div className="flex items-center gap-2">
                    <div className="h-0.5 w-4 bg-primary rounded-full"></div>
                    <h3 className="text-xs font-semibold">
                      Pricing & Cost Details
                    </h3>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    <FormField
                      control={form.control}
                      name="price"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Unit Price</FormLabel>
                          <FormControl>
                            <Input
                              type="number"
                              min="0"
                              step="0.01"
                              {...field}
                              onChange={(e) =>
                                field.onChange(
                                  e.target.valueAsNumber || undefined
                                )
                              }
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="base_price"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Base Price</FormLabel>
                          <FormControl>
                            <Input
                              type="number"
                              min="0"
                              step="0.01"
                              {...field}
                              onChange={(e) =>
                                field.onChange(
                                  e.target.valueAsNumber || undefined
                                )
                              }
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="extra_cost"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Extra Cost</FormLabel>
                          <FormControl>
                            <Input
                              type="number"
                              min="0"
                              step="0.01"
                              {...field}
                              onChange={(e) =>
                                field.onChange(
                                  e.target.valueAsNumber || undefined
                                )
                              }
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="total_cost"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Total Cost</FormLabel>
                          <FormControl>
                            <Input
                              type="number"
                              min="0"
                              step="0.01"
                              {...field}
                              onChange={(e) =>
                                field.onChange(
                                  e.target.valueAsNumber || undefined
                                )
                              }
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="total_amount"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Total Amount</FormLabel>
                          <FormControl>
                            <Input
                              type="number"
                              min="0"
                              step="0.01"
                              {...field}
                              onChange={(e) =>
                                field.onChange(
                                  e.target.valueAsNumber || undefined
                                )
                              }
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="exchange_rate"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Exchange Rate</FormLabel>
                          <FormControl>
                            <Input
                              type="number"
                              min="0"
                              step="0.000001"
                              {...field}
                              onChange={(e) =>
                                field.onChange(
                                  e.target.valueAsNumber || undefined
                                )
                              }
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>

                <Separator />

                <div>
                  <div className="flex items-center gap-2">
                    <div className="h-0.5 w-4 bg-primary rounded-full"></div>
                    <h3 className="text-xs font-semibold">Tax Information</h3>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    <FormField
                      control={form.control}
                      name="tax_type_inventory_id"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Tax Type Inventory</FormLabel>
                          <FormControl>
                            <TaxTypeLookup
                              value={field.value}
                              onValueChange={field.onChange}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="tax_type"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Tax Type</FormLabel>
                          <FormControl>
                            <Input {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="tax_rate"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Tax Rate (%)</FormLabel>
                          <FormControl>
                            <Input
                              type="number"
                              min="0"
                              max="100"
                              step="0.01"
                              {...field}
                              onChange={(e) =>
                                field.onChange(
                                  e.target.valueAsNumber || undefined
                                )
                              }
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="tax_amount"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Tax Amount</FormLabel>
                          <FormControl>
                            <Input
                              type="number"
                              min="0"
                              step="0.01"
                              {...field}
                              onChange={(e) =>
                                field.onChange(
                                  e.target.valueAsNumber || undefined
                                )
                              }
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="is_tax_adjustment"
                      render={({ field }) => (
                        <FormItem>
                          <FormControl>
                            <div className="flex flex-row items-center justify-between rounded-lg border p-4 col-span-1">
                              <div className="space-y-0.5">
                                <label className="text-xs font-medium">
                                  Adjust Tax
                                </label>
                                <div className="text-xs text-muted-foreground">
                                  Adjust tax manually
                                </div>
                              </div>
                              <Switch
                                checked={field.value}
                                onCheckedChange={(checked) =>
                                  field.onChange(checked)
                                }
                              />
                            </div>
                          </FormControl>
                        </FormItem>
                      )}
                    />
                  </div>
                </div>

                <Separator />

                <div>
                  <div className="flex items-center gap-2">
                    <div className="h-0.5 w-4 bg-primary rounded-full"></div>
                    <h3 className="text-xs font-semibold">
                      Discount Information
                    </h3>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="discount_rate"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Discount Rate (%)</FormLabel>
                          <FormControl>
                            <Input
                              type="number"
                              min="0"
                              max="100"
                              step="0.01"
                              {...field}
                              onChange={(e) =>
                                field.onChange(
                                  e.target.valueAsNumber || undefined
                                )
                              }
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="discount_amount"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Discount Amount</FormLabel>
                          <FormControl>
                            <Input
                              type="number"
                              min="0"
                              step="0.01"
                              {...field}
                              onChange={(e) =>
                                field.onChange(
                                  e.target.valueAsNumber || undefined
                                )
                              }
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="is_discount"
                      render={({ field }) => (
                        <FormItem>
                          <FormControl>
                            <div className="flex flex-row items-center justify-between rounded-lg border p-4 col-span-1">
                              <div className="space-y-0.5">
                                <label className="text-xs font-medium">
                                  Apply Discount
                                </label>
                                <div className="text-xs text-muted-foreground">
                                  Apply discount manually
                                </div>
                              </div>
                              <Switch
                                checked={field.value}
                                onCheckedChange={(checked) =>
                                  field.onChange(checked)
                                }
                              />
                            </div>
                          </FormControl>
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="is_discount_adjustment"
                      render={({ field }) => (
                        <FormItem>
                          <FormControl>
                            <div className="flex flex-row items-center justify-between rounded-lg border p-4 col-span-1">
                              <div className="space-y-0.5">
                                <label className="text-xs font-medium">
                                  Apply Discount
                                </label>
                                <div className="text-xs text-muted-foreground">
                                  Apply discount manually
                                </div>
                              </div>
                              <Switch
                                checked={field.value}
                                onCheckedChange={(checked) =>
                                  field.onChange(checked)
                                }
                              />
                            </div>
                          </FormControl>
                        </FormItem>
                      )}
                    />
                  </div>
                </div>
                <Separator />
                <div>
                  <div className="flex items-center gap-2">
                    <div className="h-0.5 w-4 bg-primary rounded-full"></div>
                    <h3 className="text-xs font-semibold">
                      Additional Information
                    </h3>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="expired_date"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Expiry Date</FormLabel>
                          <Popover>
                            <PopoverTrigger asChild>
                              <FormControl>
                                <Button
                                  variant="outline"
                                  className={cn(
                                    "w-full pl-3 text-left font-normal",
                                    !field.value && "text-muted-foreground"
                                  )}
                                >
                                  {field.value ? (
                                    format(new Date(field.value), "PPP")
                                  ) : (
                                    <span>Select expiry date</span>
                                  )}
                                  <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
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
                                  field.onChange(date ? date.toISOString() : "")
                                }
                                disabled={(date) =>
                                  date < new Date("1900-01-01")
                                }
                                initialFocus
                              />
                            </PopoverContent>
                          </Popover>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="dimension"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Dimension</FormLabel>
                          <FormControl>
                            <Input {...field} placeholder="e.g., 10x5x3 cm" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="note"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Note</FormLabel>
                          <FormControl>
                            <Textarea
                              {...field}
                              rows={3}
                              placeholder="Additional notes or comments..."
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="info"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Additional Info</FormLabel>
                          <FormControl>
                            <Textarea
                              {...field}
                              rows={2}
                              placeholder="Any additional information..."
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>
              </div>
            </ScrollArea>

            <DialogFooter className="flex justify-end gap-1 mb-4">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={handleCancel}
              >
                Cancel
              </Button>
              <Button type="submit" size="sm" disabled={mode === formType.VIEW}>
                {initialData ? "Save Changes" : "Add Item"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
