"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
    Dialog,
    DialogContent,
    DialogTrigger,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Plus } from "lucide-react";
import { formType } from "@/dtos/form.dto";
import { GoodReceivedNoteDetailItemDto } from "@/dtos/grn.dto";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Checkbox } from "@/components/ui/checkbox";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import LocationLookup from "@/components/lookup/LocationLookup";
import ProductLookup from "@/components/lookup/ProductLookup";
import { Textarea } from "@/components/ui/textarea";
import UnitLookup from "@/components/lookup/UnitLookup";
import DeliveryPointLookup from "@/components/lookup/DeliveryPointLookup";
import TaxTypeLookup from "@/components/lookup/TaxTypeLookup";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { TaxType } from "@/constants/enum";

// Create form schema that is more flexible for user input
const GrnItemFormSchema = z.object({
    id: z.string().uuid().optional(),
    sequence_no: z.number().default(1),
    location_id: z.string().min(1, "Location is required"),
    product_id: z.string().min(1, "Product is required"),
    order_qty: z.number().nonnegative("Order quantity must be non-negative"),
    order_unit_id: z.string().min(1, "Order unit is required"),
    received_qty: z.number().nonnegative("Received quantity must be non-negative"),
    received_unit_id: z.string().optional(),
    is_foc: z.boolean().default(false),
    foc_qty: z.number().nonnegative("FOC quantity must be non-negative").default(0),
    foc_unit_id: z.string().optional(),
    price: z.number().nonnegative("Price must be non-negative"),
    tax_type_inventory_id: z.string().optional(),
    tax_type: z.string().default(""),
    tax_rate: z.number().nonnegative("Tax rate must be non-negative").default(0),
    tax_amount: z.number().nonnegative("Tax amount must be non-negative").default(0),
    is_tax_adjustment: z.boolean().default(false),
    total_amount: z.number().nonnegative("Total amount must be non-negative").default(0),
    delivery_point_id: z.string().optional(),
    base_price: z.number().nonnegative("Base price must be non-negative").default(0),
    base_qty: z.number().nonnegative("Base quantity must be non-negative").default(0),
    extra_cost: z.number().nonnegative("Extra cost must be non-negative").default(0),
    total_cost: z.number().nonnegative("Total cost must be non-negative").default(0),
    is_discount: z.boolean().default(false),
    discount_rate: z.number().nonnegative("Discount rate must be non-negative").default(0),
    discount_amount: z.number().nonnegative("Discount amount must be non-negative").default(0),
    is_discount_adjustment: z.boolean().default(false),
    note: z.string().default(""),
    exchange_rate: z.number().nonnegative("Exchange rate must be non-negative").default(1),
    info: z.object({
        test1: z.string().default(""),
        test2: z.string().default(""),
    }).default({ test1: "", test2: "" }),
    dimension: z.object({
        test1: z.string().default(""),
        test2: z.string().default(""),
    }).default({ test1: "", test2: "" }),
});

type GrnItemFormValues = z.infer<typeof GrnItemFormSchema>;

// Mock data - you can move these to a separate file if needed
const mockCalulateAmount = [
    { id: "1", description: "Net Amount", total: "1000.00", base: "1000.00" },
    { id: "2", description: "Tax Amount", total: "70.00", base: "70.00" },
    { id: "3", description: "Total Amount", total: "1070.00", base: "1070.00" },
];

const mockOnHand = [
    { id: "1", location: "Warehouse A", quantity: 500, units: "pcs", par: 600, reorderPoint: 400, minStock: 300, maxStock: 800 },
    { id: "2", location: "Warehouse B", quantity: 750, units: "pcs", par: 800, reorderPoint: 600, minStock: 500, maxStock: 1000 },
    { id: "3", location: "Store Front", quantity: 400, units: "pcs", par: 500, reorderPoint: 300, minStock: 200, maxStock: 600 },
];

const mockOnOrder = [
    { id: "1", poNumber: "PO-2023-001", vendor: "Organic Farms Ltd", deliveryDate: "2023-08-15", remainingQty: 200, units: "pcs", locations: "Warehouse A, B" },
    { id: "2", poNumber: "PO-2023-002", vendor: "Green Valley Co", deliveryDate: "2023-08-20", remainingQty: 150, units: "pcs", locations: "Store Front" },
];

// Simple conversion functions
const convertDtoToFormValues = (dto: GoodReceivedNoteDetailItemDto): GrnItemFormValues => {
    return {
        id: dto.id,
        sequence_no: dto.sequence_no,
        location_id: dto.location_id,
        product_id: dto.product_id,
        order_qty: dto.order_qty,
        order_unit_id: dto.order_unit_id,
        received_qty: dto.received_qty,
        received_unit_id: dto.received_unit_id,
        is_foc: dto.is_foc,
        foc_qty: dto.foc_qty,
        foc_unit_id: dto.foc_unit_id,
        price: dto.price,
        tax_type_inventory_id: dto.tax_type_inventory_id,
        tax_type: dto.tax_type,
        tax_rate: dto.tax_rate,
        tax_amount: dto.tax_amount,
        is_tax_adjustment: dto.is_tax_adjustment,
        total_amount: dto.total_amount,
        delivery_point_id: dto.delivery_point_id,
        base_price: dto.base_price,
        base_qty: dto.base_qty,
        extra_cost: dto.extra_cost,
        total_cost: dto.total_cost,
        is_discount: dto.is_discount,
        discount_rate: dto.discount_rate,
        discount_amount: dto.discount_amount,
        is_discount_adjustment: dto.is_discount_adjustment,
        note: dto.note,
        exchange_rate: dto.exchange_rate,
        info: dto.info,
        dimension: dto.dimension,
    };
};

const convertFormValuesToDto = (formValues: GrnItemFormValues): GoodReceivedNoteDetailItemDto => {
    return {
        id: formValues.id,
        sequence_no: formValues.sequence_no,
        location_id: formValues.location_id,
        product_id: formValues.product_id,
        order_qty: formValues.order_qty,
        order_unit_id: formValues.order_unit_id,
        received_qty: formValues.received_qty,
        received_unit_id: formValues.received_unit_id || formValues.order_unit_id,
        is_foc: formValues.is_foc,
        foc_qty: formValues.foc_qty,
        foc_unit_id: formValues.foc_unit_id || formValues.order_unit_id,
        price: formValues.price,
        tax_type_inventory_id: formValues.tax_type_inventory_id || formValues.order_unit_id,
        tax_type: formValues.tax_type,
        tax_rate: formValues.tax_rate,
        tax_amount: formValues.tax_amount,
        is_tax_adjustment: formValues.is_tax_adjustment,
        total_amount: formValues.total_amount,
        delivery_point_id: formValues.delivery_point_id || formValues.location_id,
        base_price: formValues.base_price,
        base_qty: formValues.base_qty,
        extra_cost: formValues.extra_cost,
        total_cost: formValues.total_cost,
        is_discount: formValues.is_discount,
        discount_rate: formValues.discount_rate,
        discount_amount: formValues.discount_amount,
        is_discount_adjustment: formValues.is_discount_adjustment,
        note: formValues.note,
        exchange_rate: formValues.exchange_rate,
        info: formValues.info,
        dimension: formValues.dimension,
    };
};

interface DialogGrnFormProps {
    readonly mode: formType;
    readonly onAddItem: (item: GoodReceivedNoteDetailItemDto, action: 'add' | 'update') => void;
    readonly initialData?: GoodReceivedNoteDetailItemDto | null;
    readonly initData?: GoodReceivedNoteDetailItemDto[]; // Original data from API
    readonly isOpen?: boolean;
    readonly onOpenChange?: (open: boolean) => void;
}

export default function DialogItemGrnForm({
    mode,
    onAddItem,
    initialData = null,
    initData,
    isOpen,
    onOpenChange
}: DialogGrnFormProps) {
    const [dialogOpen, setDialogOpen] = useState(false);
    const [onHandDialogOpen, setOnHandDialogOpen] = useState(false);
    const [onOrderDialogOpen, setOnOrderDialogOpen] = useState(false);
    const [isDiscRateEnabled, setIsDiscRateEnabled] = useState(false);
    const [isTaxRateEnabled, setIsTaxRateEnabled] = useState(false);

    // Use external control if provided
    const isDialogOpen = isOpen ?? dialogOpen;
    const setIsDialogOpen = onOpenChange || setDialogOpen;

    // Create a form using useForm with the GrnItemFormSchema validation
    const form = useForm<z.infer<typeof GrnItemFormSchema>>({
        resolver: zodResolver(GrnItemFormSchema),
        defaultValues: {
            sequence_no: 1,
            location_id: "",
            product_id: "",
            order_qty: 0,
            order_unit_id: "",
            received_qty: 0,
            received_unit_id: "",
            is_foc: false,
            foc_qty: 0,
            foc_unit_id: "",
            price: 0,
            tax_type_inventory_id: "",
            tax_type: "",
            tax_rate: 0,
            tax_amount: 0,
            is_tax_adjustment: false,
            total_amount: 0,
            delivery_point_id: "",
            base_price: 0,
            base_qty: 0,
            extra_cost: 0,
            total_cost: 0,
            is_discount: false,
            discount_rate: 0,
            discount_amount: 0,
            is_discount_adjustment: false,
            note: "",
            exchange_rate: 1,
            info: { test1: "", test2: "" },
            dimension: { test1: "", test2: "" },
        },
    });

    useEffect(() => {
        if (initialData) {
            const formValues = convertDtoToFormValues(initialData);
            form.reset(formValues);
            setIsDiscRateEnabled(formValues.discount_rate > 0);
            setIsTaxRateEnabled(formValues.tax_rate > 0);
        }
    }, [initialData, form]);

    // Reset discount_rate when checkbox is unchecked
    useEffect(() => {
        if (!isDiscRateEnabled) {
            form.setValue('discount_rate', 0);
        }
        if (!isTaxRateEnabled) {
            form.setValue('tax_rate', 0);
        }
    }, [isDiscRateEnabled, isTaxRateEnabled, form]);

    // Monitor form dirty state and errors
    useEffect(() => {
        const { isDirty, isValid, errors } = form.formState;

        console.log('Form State:', {
            isDirty,
            isValid,
            hasErrors: Object.keys(errors).length > 0,
            errors: errors
        });

        // You can add additional logic here based on form state
        if (isDirty && Object.keys(errors).length > 0) {
            console.log('Form is dirty and has errors:', errors);
        } else if (isDirty && Object.keys(errors).length === 0) {
            console.log('Form is dirty but valid');
        }
    }, [form.formState]);

    const onSubmit = (data: z.infer<typeof GrnItemFormSchema>) => {
        // Debug logging
        console.log('=== Form Submit Debug ===');
        console.log('initialData:', initialData);
        console.log('initialData?.id:', initialData?.id);
        console.log('initData:', initData);
        console.log('Has initialData:', !!initialData);
        console.log('Has initialData.id:', !!(initialData?.id));

        // Calculate derived values
        const netAmount = data.order_qty * data.price;
        const taxAmount = netAmount * (data.tax_rate / 100); // Convert percentage to decimal
        const totalAmount = netAmount + taxAmount;

        // Set calculated values
        data.base_price = data.price;
        data.base_qty = data.order_qty;
        data.tax_amount = taxAmount;
        data.total_amount = totalAmount;
        data.total_cost = totalAmount;
        data.received_qty = data.received_qty || data.order_qty; // Set received qty equal to ordered qty by default if not set

        // Set unit IDs if they're still default values
        if (data.received_unit_id === "") {
            data.received_unit_id = data.order_unit_id;
        }
        if (data.foc_unit_id === "") {
            data.foc_unit_id = data.order_unit_id;
        }

        // Convert form values to DTO
        const dtoItem = convertFormValuesToDto(data);

        // Determine if this is a new item or update by checking against initData
        let isExistingItem = false;

        if (initialData?.id && initData) {
            // Check if this item exists in the original data (initData)
            isExistingItem = initData.some(item => item.id === initialData.id);
            console.log('Item exists in initData:', isExistingItem);
        }

        if (isExistingItem && initialData?.id) {
            // This is an update - item exists in original data
            data.id = initialData.id;
            dtoItem.id = initialData.id;

            // Pass to parent with action indicator as separate parameter
            onAddItem(dtoItem, 'update');

            console.log('✅ Updating existing item (found in initData):', dtoItem);
        } else {
            // This is a new item - either no initialData.id or not found in initData
            // Pass to parent with action indicator as separate parameter
            onAddItem(dtoItem, 'add');

            console.log('✅ Adding new item (not in initData):', dtoItem);
        }

        // Close dialog and reset form
        setIsDialogOpen(false);
        form.reset();
    };

    const handleCancel = (e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDialogOpen(false);
        form.reset();
    }

    const openOnHand = (e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault();
        e.stopPropagation();
        setOnHandDialogOpen(true);
    }

    const openOnOrder = (e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault();
        e.stopPropagation();
        setOnOrderDialogOpen(true);
    }

    const dialogTitle = initialData ? "Edit Item" : "Add Item";

    return (
        <>
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                {!onOpenChange && (
                    <DialogTrigger asChild>
                        <Button variant="default" size="sm" disabled={mode === formType.VIEW}>
                            <Plus />
                            Add Item
                        </Button>
                    </DialogTrigger>
                )}
                <DialogContent className="sm:max-w-[1200px] overflow-y-auto h-[80vh]">
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-2 py-2">

                            <div className="flex justify-between items-center">
                                <p className="text-base font-bold">{dialogTitle}</p>
                                <div className="flex items-center gap-2">
                                    <Button
                                        type="button"
                                        variant="outline"
                                        size="sm"
                                        onClick={handleCancel}
                                    >
                                        Cancel
                                    </Button>
                                    <Button
                                        type="submit"
                                        variant="default"
                                        size="sm"
                                    // disabled={!form.formState.isValid}
                                    >
                                        Save
                                    </Button>
                                </div>
                            </div>

                            <Card className="p-4 space-y-4 mt-4">
                                <p className="text-sm font-bold">Basic Information</p>
                                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-2">
                                    <FormField
                                        control={form.control}
                                        name="sequence_no"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Sequence No.</FormLabel>
                                                <FormControl>
                                                    <Input
                                                        type="number"
                                                        {...field}
                                                        onChange={(e) => field.onChange(Number(e.target.value))}
                                                        value={field.value}
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
                                            <FormItem >
                                                <FormLabel>Location</FormLabel>
                                                <FormControl>
                                                    <LocationLookup
                                                        onValueChange={field.onChange}
                                                        value={field.value}
                                                    />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />

                                    <FormField
                                        control={form.control}
                                        name="product_id"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Product Name</FormLabel>
                                                <FormControl>
                                                    <ProductLookup
                                                        onValueChange={field.onChange}
                                                        value={field.value}
                                                    />
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
                                                <FormLabel>Description</FormLabel>
                                                <FormControl>
                                                    <Textarea {...field} />
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
                                                    <Input {...field} />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </div>
                            </Card>

                            <Card className="p-4 space-y-4 mt-4">
                                <div className="flex justify-between">
                                    <p className="text-base font-bold">Quantity and Delivery</p>
                                    <div className="flex items-center gap-2">
                                        <Button
                                            type="button"
                                            variant="outline"
                                            size="sm"
                                            onClick={openOnHand}
                                        >
                                            On Hand
                                        </Button>
                                        <Button
                                            type="button"
                                            variant="outline"
                                            size="sm"
                                            onClick={openOnOrder}
                                        >
                                            On Order
                                        </Button>
                                    </div>
                                </div>
                                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-2">
                                    <FormField
                                        control={form.control}
                                        name="order_qty"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Ordered Qty</FormLabel>
                                                <FormControl>
                                                    <Input
                                                        type="number"
                                                        {...field}
                                                        onChange={(e) => field.onChange(Number(e.target.value))}
                                                        value={field.value}
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
                                                <FormLabel>Ordered Unit</FormLabel>
                                                <FormControl>
                                                    <UnitLookup
                                                        onValueChange={field.onChange}
                                                        value={field.value}
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
                                                <FormLabel>Receiving Qty</FormLabel>
                                                <FormControl>
                                                    <Input
                                                        type="number"
                                                        {...field}
                                                        onChange={(e) => field.onChange(Number(e.target.value))}
                                                        value={field.value}
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
                                                        onValueChange={field.onChange}
                                                        value={field.value}
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
                                                <div className="flex flex-col gap-2 mt-2">
                                                    <FormLabel>Is FOC</FormLabel>
                                                    <FormControl>
                                                        <Checkbox
                                                            checked={field.value}
                                                            onCheckedChange={field.onChange}
                                                        />
                                                    </FormControl>
                                                </div>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />

                                    <FormField
                                        control={form.control}
                                        name="foc_qty"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>FOC Qty</FormLabel>
                                                <FormControl>
                                                    <Input {...field}
                                                        onChange={(e) => field.onChange(Number(e.target.value))}
                                                        value={field.value}
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
                                                        onValueChange={field.onChange}
                                                        value={field.value}
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
                                                        onValueChange={field.onChange}
                                                        value={field.value}
                                                    />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </div>
                            </Card>
                            <Card className="p-4 space-y-4 mt-4">
                                <p className="text-base font-bold">Pricing & Calculation</p>
                                <div className="grid grid-cols-2 md:grid-cols-2 gap-4">

                                    <div className="space-y-4">
                                        <div>
                                            <p className="text-sm font-bold">Pricing</p>
                                            <div className="grid grid-cols-2 gap-2">
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
                                                                    step="0.01"
                                                                    {...field}
                                                                    onChange={(e) => field.onChange(Number(e.target.value))}
                                                                    value={field.value}
                                                                />
                                                            </FormControl>
                                                            <FormMessage />
                                                        </FormItem>
                                                    )}
                                                />
                                                <FormField
                                                    control={form.control}
                                                    name="price"
                                                    render={({ field }) => (
                                                        <FormItem>
                                                            <FormLabel>Price</FormLabel>
                                                            <FormControl>
                                                                <Input
                                                                    type="number"
                                                                    min="0"
                                                                    step="0.01"
                                                                    {...field}
                                                                    onChange={(e) => field.onChange(Number(e.target.value))}
                                                                    value={field.value}
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
                                                                    onChange={(e) => field.onChange(Number(e.target.value))}
                                                                    value={field.value}
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
                                                                    {...field}
                                                                    onChange={(e) => field.onChange(Number(e.target.value))}
                                                                    value={field.value}
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
                                                                    onChange={(e) => field.onChange(Number(e.target.value))}
                                                                    value={field.value}
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
                                                                    onChange={(e) => field.onChange(Number(e.target.value))}
                                                                    value={field.value}
                                                                />
                                                            </FormControl>
                                                            <FormMessage />
                                                        </FormItem>
                                                    )}
                                                />
                                            </div>
                                        </div>
                                        <div>
                                            <p className="text-sm font-bold">Tax Information</p>
                                            <div className="grid grid-cols-2 gap-2">
                                                <FormField
                                                    control={form.control}
                                                    name="tax_type_inventory_id"
                                                    render={({ field }) => (
                                                        <FormItem>
                                                            <FormLabel>Tax Type Inventory ID</FormLabel>
                                                            <FormControl>
                                                                <TaxTypeLookup
                                                                    onValueChange={field.onChange}
                                                                    value={field.value}
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
                                                                <Select
                                                                    value={field.value ?? TaxType.INCLUDED}
                                                                    onValueChange={field.onChange}
                                                                >
                                                                    <SelectTrigger>
                                                                        <SelectValue placeholder="Select tax calculation method" />
                                                                    </SelectTrigger>
                                                                    <SelectContent>
                                                                        <SelectItem value={TaxType.NONE}>None</SelectItem>
                                                                        <SelectItem value={TaxType.INCLUDED}>Inclusive</SelectItem>
                                                                        <SelectItem value={TaxType.ADD}>Add</SelectItem>
                                                                    </SelectContent>
                                                                </Select>
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
                                                            <div className="flex flex-col gap-2 mt-2">
                                                                <FormLabel>Is Tax Adjustment</FormLabel>
                                                                <FormControl>
                                                                    <Checkbox
                                                                        checked={field.value}
                                                                        onCheckedChange={field.onChange}
                                                                    />
                                                                </FormControl>
                                                            </div>
                                                            <FormMessage />
                                                        </FormItem>
                                                    )}
                                                />
                                            </div>
                                        </div>
                                        <div>
                                            <p className="text-sm font-bold">Adjustments</p>
                                            <div className="grid grid-cols-2 gap-2">
                                                <FormField
                                                    control={form.control}
                                                    name="is_discount"
                                                    render={({ field }) => (
                                                        <FormItem>
                                                            <div className="flex flex-col gap-2 mt-2">
                                                                <FormLabel>Is Discount</FormLabel>
                                                                <FormControl>
                                                                    <Checkbox
                                                                        checked={field.value}
                                                                        onCheckedChange={field.onChange}
                                                                    />
                                                                </FormControl>
                                                            </div>
                                                            <FormMessage />
                                                        </FormItem>
                                                    )}
                                                />
                                                <FormField
                                                    control={form.control}
                                                    name="is_discount_adjustment"
                                                    render={({ field }) => (
                                                        <FormItem>
                                                            <div className="flex flex-col gap-2 mt-2">
                                                                <FormLabel>Is Discount Adjustment</FormLabel>
                                                                <FormControl>
                                                                    <Checkbox
                                                                        checked={field.value}
                                                                        onCheckedChange={field.onChange}
                                                                    />
                                                                </FormControl>
                                                            </div>
                                                            <FormMessage />
                                                        </FormItem>
                                                    )}
                                                />
                                                <FormField
                                                    control={form.control}
                                                    name="discount_rate"
                                                    render={({ field }) => (
                                                        <FormItem>
                                                            <FormLabel className="flex items-center gap-2 mt-2">
                                                                <p>Disc. Rate (%)</p>
                                                                <Checkbox
                                                                    checked={isDiscRateEnabled}
                                                                    onCheckedChange={(checked) => {
                                                                        setIsDiscRateEnabled(checked === true);
                                                                    }}
                                                                />
                                                            </FormLabel>

                                                            <FormControl>
                                                                <Input
                                                                    type="number"
                                                                    min="0"
                                                                    step="0.01"
                                                                    {...field}
                                                                    onChange={(e) => field.onChange(Number(e.target.value))}
                                                                    value={field.value}
                                                                    disabled={!isDiscRateEnabled}
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
                                                            <FormLabel>Override Discount Amount</FormLabel>
                                                            <FormControl>
                                                                <Input
                                                                    type="number"
                                                                    min="0"
                                                                    step="0.01"
                                                                    {...field}
                                                                    onChange={(e) => field.onChange(Number(e.target.value))}
                                                                    value={field.value}
                                                                />
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

                                                            <FormLabel className="flex items-center gap-2 mt-2">
                                                                <p>Tax Rate (%)</p>
                                                                <Checkbox
                                                                    checked={isTaxRateEnabled}
                                                                    onCheckedChange={(checked) => {
                                                                        setIsTaxRateEnabled(checked === true);
                                                                    }}
                                                                />
                                                            </FormLabel>
                                                            <FormControl>
                                                                <Input
                                                                    type="number"
                                                                    min="0"
                                                                    step="0.01"
                                                                    {...field}
                                                                    onChange={(e) => field.onChange(Number(e.target.value))}
                                                                    value={field.value}
                                                                    disabled={!isTaxRateEnabled}
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
                                                            <FormLabel>Override Tax Amount</FormLabel>
                                                            <FormControl>
                                                                <Input
                                                                    type="number"
                                                                    min="0"
                                                                    step="0.01"
                                                                    {...field}
                                                                    onChange={(e) => field.onChange(Number(e.target.value))}
                                                                    value={field.value}
                                                                />
                                                            </FormControl>
                                                            <FormMessage />
                                                        </FormItem>
                                                    )}
                                                />
                                            </div>

                                        </div>
                                    </div>

                                    <div>
                                        <p className="text-sm font-bold">Calculated Amounts</p>
                                        <div className="grid grid-cols-2 gap-2 mb-4">
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
                                                                onChange={(e) => field.onChange(Number(e.target.value))}
                                                                value={field.value}
                                                                readOnly
                                                            />
                                                        </FormControl>
                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />
                                        </div>
                                        <Table>
                                            <TableHeader>
                                                <TableRow>
                                                    <TableHead>Description</TableHead>
                                                    <TableHead>Total Amount (USD)</TableHead>
                                                    <TableHead>Base Amount (USD)</TableHead>
                                                </TableRow>
                                            </TableHeader>
                                            <TableBody>
                                                {mockCalulateAmount.map((item) => (
                                                    <TableRow key={item.id}>
                                                        <TableCell>{item.description}</TableCell>
                                                        <TableCell>{item.total}</TableCell>
                                                        <TableCell>{item.base}</TableCell>
                                                    </TableRow>
                                                ))}
                                            </TableBody>
                                        </Table>
                                        <Card className="bg-blue-100 p-4 space-y-2">
                                            <p className="text-sm font-bold text-blue-800">Item Information</p>
                                            <div className="grid grid-cols-2 gap-2">
                                                <div>
                                                    <p className="text-xs">Inventory On Hand</p>
                                                    <p className="text-xs">5 piece</p>
                                                </div>
                                                <div>
                                                    <p className="text-xs">Last Purchase Price</p>
                                                    <p className="text-xs">฿399.99</p>
                                                </div>
                                                <div>
                                                    <p className="text-xs">Last Order Date</p>
                                                    <p className="text-xs">Aug 10, 2023</p>
                                                </div>
                                                <div>
                                                    <p className="text-xs">Last Vendor</p>
                                                    <p className="text-xs">Professional Kitchen Supplies</p>
                                                </div>
                                            </div>
                                        </Card>
                                    </div>
                                </div>
                            </Card>
                        </form>
                    </Form>
                </DialogContent>
            </Dialog>

            {/* On Hand Dialog */}
            <Dialog open={onHandDialogOpen} onOpenChange={setOnHandDialogOpen}>
                <DialogContent className="sm:max-w-[1000px]">
                    <DialogHeader>
                        <DialogTitle>On Hand by Location</DialogTitle>
                    </DialogHeader>
                    <div className="bg-muted p-2 rounded-md">
                        <div className="flex justify-between">
                            <p className="text-xs font-bold">Organic Quinoa</p>
                            <Badge variant="default" className="text-xs bg-emerald-200 text-emerald-800">Accepted</Badge>
                        </div>

                        <p className="text-xs text-muted-foreground">Premium organic white quinoa grains</p>
                    </div>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Location</TableHead>
                                <TableHead>Quantity On Hand</TableHead>
                                <TableHead>Inv. Units</TableHead>
                                <TableHead>Par</TableHead>
                                <TableHead>Reorder Point</TableHead>
                                <TableHead>Min Stock</TableHead>
                                <TableHead>Max Stock</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {mockOnHand.map((item) => (
                                <TableRow key={item.id}>
                                    <TableCell>{item.location}</TableCell>
                                    <TableCell>{item.quantity}</TableCell>
                                    <TableCell>{item.units}</TableCell>
                                    <TableCell>{item.par}</TableCell>
                                    <TableCell>{item.reorderPoint}</TableCell>
                                    <TableCell>{item.minStock}</TableCell>
                                    <TableCell>{item.maxStock}</TableCell>
                                </TableRow>
                            ))}
                            <TableRow>
                                <TableCell className="font-bold">Total</TableCell>
                                <TableCell className="font-bold">1650</TableCell>
                                <TableCell>pcs</TableCell>
                                <TableCell></TableCell>
                                <TableCell></TableCell>
                                <TableCell></TableCell>
                                <TableCell></TableCell>
                            </TableRow>
                        </TableBody>
                    </Table>
                </DialogContent>
            </Dialog>

            {/* On Order Dialog */}
            <Dialog open={onOrderDialogOpen} onOpenChange={setOnOrderDialogOpen}>
                <DialogContent className="sm:max-w-[1000px]">
                    <DialogHeader>
                        <DialogTitle>On Order Information</DialogTitle>
                    </DialogHeader>

                    <div className="bg-muted p-2 rounded-md">
                        <p className="text-xs font-bold">Organic Quinoa</p>
                        <p className="text-xs text-muted-foreground">Premium organic white quinoa grains</p>
                    </div>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>PO #</TableHead>
                                <TableHead>Vendor</TableHead>
                                <TableHead>Delivery Date</TableHead>
                                <TableHead>Remaining Qty</TableHead>
                                <TableHead>Inventory Units</TableHead>
                                <TableHead>Locations Ordered</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {mockOnOrder.map((item) => (
                                <TableRow key={item.id}>
                                    <TableCell>{item.poNumber}</TableCell>
                                    <TableCell>{item.vendor}</TableCell>
                                    <TableCell>{item.deliveryDate}</TableCell>
                                    <TableCell>{item.remainingQty}</TableCell>
                                    <TableCell>{item.units}</TableCell>
                                    <TableCell>{item.locations}</TableCell>
                                </TableRow>
                            ))}
                            <TableRow>
                                <TableCell className="font-bold">Total</TableCell>
                                <TableCell></TableCell>
                                <TableCell></TableCell>
                                <TableCell className="font-bold">350</TableCell>
                                <TableCell></TableCell>
                                <TableCell></TableCell>
                            </TableRow>
                        </TableBody>
                    </Table>
                </DialogContent>
            </Dialog>
        </>
    );
} 