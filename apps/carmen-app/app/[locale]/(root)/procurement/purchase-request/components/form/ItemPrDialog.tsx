"use client";

import { useForm } from "react-hook-form";
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
import { PurchaseRequestDetailItemDto } from "@/dtos/pr.dto";
import { formType } from "@/dtos/form.dto";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import LocationLookup from "@/components/lookup/LocationLookup";
import ProductLookup from "@/components/lookup/ProductLookup";
import UnitLookup from "@/components/lookup/UnitLookup";
import CurrencyLookup from "@/components/lookup/CurrencyLookup";
import VendorLookup from "@/components/lookup/VendorLookup";
import { Box } from "lucide-react";
import TaxTypeLookup from "@/components/lookup/TaxTypeLookup";
import PriceListLookup from "@/components/lookup/PriceListLookup";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";

type ItemWithId = PurchaseRequestDetailItemDto & { id?: string };

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
    id: '',
    location_id: '',
    product_id: '',
    vendor_id: '',
    price_list_id: '',
    description: '',
    requested_qty: 0,
    requested_unit_id: '',
    approved_qty: 0,
    approved_unit_id: '',
    approved_base_qty: 0,
    approved_base_unit_id: '',
    approved_conversion_rate: 0,
    requested_conversion_rate: 0,
    requested_base_qty: 0,
    requested_base_unit_id: '',
    currency_id: '',
    exchange_rate: 0,
    exchange_rate_date: new Date().toISOString(),
    price: 0,
    total_price: 0,
    foc: 0,
    foc_unit_id: '',
    tax_type_inventory_id: '',
    tax_type: 'include',
    tax_rate: 0,
    tax_amount: 0,
    is_tax_adjustment: false,
    is_discount: false,
    discount_rate: 0,
    discount_amount: 0,
    is_discount_adjustment: false,
    is_active: true,
    note: '',
    info: {
        specifications: ''
    },
    dimension: {
        project: '',
        cost_center: ''
    }
});

export default function ItemPrDialog({
    open,
    onOpenChange,
    isLoading = false,
    mode,
    formValues,
    onSave
}: ItemPrDialogProps) {
    // Keep a local copy of form values to prevent issues with undefined
    const [localFormValues, setLocalFormValues] = useState<ItemWithId>(createEmptyItem());

    // Update local form values when parent values change
    useEffect(() => {
        if (formValues) {
            setLocalFormValues({
                ...createEmptyItem(),
                ...formValues
            });
        }
    }, [formValues]);

    // We use a local form for all modes
    const localForm = useForm<ItemWithId>({
        defaultValues: localFormValues
    });


    const isViewMode = mode === formType.VIEW;
    const isAddMode = !localFormValues?.id || localFormValues.id.startsWith('temp-');

    const editModeTitle = isAddMode ? "Add New Item" : "Edit Item";
    const dialogTitle = isViewMode ? "Item Details" : editModeTitle;

    const handleSave = () => {
        if (isViewMode || !onSave) return;

        // Validate form before saving
        localForm.trigger().then(isValid => {
            if (!isValid) {
                console.log("Form validation failed");
                return;
            }

            // Get values from the local form
            const formData = localForm.getValues();

            // Ensure ID is preserved (critical for maintaining item identity)
            if (localFormValues?.id) {
                formData.id = localFormValues.id;
            }

            // Ensure numeric values are properly converted
            formData.requested_qty = parseFloat(formData.requested_qty?.toString() ?? "0") || 0;
            formData.price = parseFloat(formData.price?.toString() ?? "0") || 0;
            formData.exchange_rate = parseFloat(formData.exchange_rate?.toString() ?? "1") || 1;
            formData.foc = parseFloat(formData.foc?.toString() ?? "0") || 0;

            // Calculate total price
            formData.total_price = formData.price * formData.requested_qty;

            // Ensure dimension object exists
            if (!formData.dimension) {
                formData.dimension = { project: '', cost_center: '' };
            }

            console.log("Saving form data:", formData);
            onSave(formData);
        });
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[1200px]">
                <DialogHeader>
                    <DialogTitle>{dialogTitle}</DialogTitle>
                </DialogHeader>

                <ScrollArea className="h-[calc(100vh-200px)]">
                    <Form {...localForm}>
                        <div className="mb-4">
                            <h3 className="text-sm font-medium mb-2">Basic Information</h3>
                            <Separator className="mb-2" />
                            <div className="grid grid-cols-3 gap-2">
                                <FormField
                                    control={localForm.control}
                                    name="location_id"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Location</FormLabel>
                                            <FormControl>
                                                <LocationLookup
                                                    value={field.value ?? ''}
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
                                    name="vendor_id"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Vendor</FormLabel>
                                            <FormControl>
                                                <VendorLookup
                                                    value={field.value ?? ''}
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
                                            <FormLabel>Product</FormLabel>
                                            <FormControl>
                                                <ProductLookup
                                                    value={field.value ?? ''}
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
                                    name="description"
                                    render={({ field }) => (
                                        <FormItem className="col-span-2">
                                            <FormLabel>Description</FormLabel>
                                            <FormControl>
                                                <Textarea
                                                    {...field}
                                                    disabled={isViewMode}
                                                    className="resize-none min-h-[80px]"
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>
                        </div>

                        <div className="mb-4">
                            <h3 className="text-sm font-medium mb-2">Quantity and Delivery</h3>
                            <Separator className="mb-2" />
                            <div className="grid grid-cols-4 gap-2">

                                <FormField
                                    control={localForm.control}
                                    name="requested_base_unit_id"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Requested Base Unit</FormLabel>
                                            <FormControl>
                                                <UnitLookup
                                                    value={field.value ?? ''}
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
                                    name="requested_qty"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Requested Quantity</FormLabel>
                                            <FormControl>
                                                <Input
                                                    type="number"
                                                    {...field}
                                                    value={field.value ?? 0}
                                                    onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                                                    disabled={isViewMode}
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={localForm.control}
                                    name="requested_unit_id"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Requested Unit</FormLabel>
                                            <FormControl>
                                                <UnitLookup
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
                                    name="approved_qty"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Requested Quantity</FormLabel>
                                            <FormControl>
                                                <Input
                                                    type="number"
                                                    {...field}
                                                    value={field.value ?? 0}
                                                    onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                                                    disabled={isViewMode}
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={localForm.control}
                                    name="approved_unit_id"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Approved Unit</FormLabel>
                                            <FormControl>
                                                <UnitLookup
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
                                    name="approved_base_unit_id"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Approved Base Unit</FormLabel>
                                            <FormControl>
                                                <UnitLookup
                                                    value={field.value ?? ''}
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
                                    name="foc"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>FOC Quantity</FormLabel>
                                            <FormControl>
                                                <Input
                                                    type="number"
                                                    {...field}
                                                    value={field.value ?? 0}
                                                    onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                                                    disabled={isViewMode}
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />


                                <FormField
                                    control={localForm.control}
                                    name="foc_unit_id"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Foc Unit</FormLabel>
                                            <FormControl>
                                                <UnitLookup
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
                                    name="price"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Unit Price</FormLabel>
                                            <FormControl>
                                                <Input
                                                    type="number"
                                                    {...field}
                                                    value={field.value ?? 0}
                                                    onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                                                    disabled={isViewMode}
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>

                        </div>
                        <Separator className="mb-4" />

                        <div className="grid grid-cols-3 gap-3">
                            <div>
                                <div className="flex items-center justify-between mb-2">
                                    <h3 className="text-sm font-medium">Pricing</h3>
                                    <Button variant="outline" size="sm" className="h-7 px-2 py-1">
                                        <Box className="mr-1 h-4 w-4" />
                                        Vendor Comparison
                                    </Button>
                                </div>
                                <div className="grid grid-cols-3 gap-2">
                                    <FormField
                                        control={localForm.control}
                                        name="currency_id"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Currency</FormLabel>
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
                                                <FormLabel>Exchange Rate</FormLabel>
                                                <FormControl>
                                                    <Input
                                                        type="number"
                                                        {...field}
                                                        value={field.value ?? 1}
                                                        onChange={(e) => field.onChange(parseFloat(e.target.value) || 1)}
                                                        disabled={isViewMode}
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
                                            <FormItem>
                                                <FormLabel>Price</FormLabel>
                                                <FormControl>
                                                    <Input
                                                        type="number"
                                                        {...field}
                                                        disabled={true}
                                                    />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        control={localForm.control}
                                        name="total_price"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Total Price</FormLabel>
                                                <FormControl>
                                                    <Input
                                                        type="number"
                                                        {...field}
                                                        disabled={true}
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
                                            <FormItem>
                                                <FormLabel>Price List</FormLabel>
                                                <FormControl>
                                                    <PriceListLookup
                                                        value={field.value ?? ''}
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
                                        name="tax_type_inventory_id"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Tax Type Inventory</FormLabel>
                                                <FormControl>
                                                    <TaxTypeLookup
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
                                        name="tax_type"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Tax Calculation</FormLabel>
                                                <FormControl>
                                                    <Select
                                                        value={field.value ?? 'include'}
                                                        onValueChange={field.onChange}
                                                        disabled={isViewMode}
                                                    >
                                                        <SelectTrigger>
                                                            <SelectValue placeholder="Select tax calculation method" />
                                                        </SelectTrigger>
                                                        <SelectContent>
                                                            <SelectItem value="include">Tax Inclusive</SelectItem>
                                                            <SelectItem value="exclude">Tax Exclusive</SelectItem>
                                                        </SelectContent>
                                                    </Select>
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </div>
                            </div>

                            <div>
                                <h3 className="text-sm font-medium mb-2">Calculated Amounts</h3>
                            </div>
                        </div>
                        <DialogFooter className="mt-4">
                            <Button type="button" variant="outline" onClick={() => onOpenChange(false)} className="h-8 px-3">
                                {isViewMode ? "Close" : "Cancel"}
                            </Button>
                            {!isViewMode && (
                                <Button
                                    type="button"
                                    onClick={handleSave}
                                    disabled={isLoading}
                                    className="h-8 px-3"
                                >
                                    Save
                                </Button>
                            )}
                        </DialogFooter>
                    </Form>
                </ScrollArea>
            </DialogContent>
        </Dialog>
    );
} 