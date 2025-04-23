"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
    Dialog,
    DialogContent,
    DialogFooter,
    DialogTrigger,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Plus } from "lucide-react";
import { formType } from "@/dtos/form.dto";
import { GrnItemFormValues, GrnItemSchema } from "../../type.dto";
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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";

interface DialogGrnFormProps {
    readonly mode: formType;
    readonly onAddItem: (item: GrnItemFormValues) => void;
    readonly initialData?: GrnItemFormValues | null;
    readonly isOpen?: boolean;
    readonly onOpenChange?: (open: boolean) => void;
}

export default function DialogItemGrnForm({
    mode,
    onAddItem,
    initialData = null,
    isOpen,
    onOpenChange
}: DialogGrnFormProps) {
    const [dialogOpen, setDialogOpen] = useState(false);
    const [onHandDialogOpen, setOnHandDialogOpen] = useState(false);
    const [onOrderDialogOpen, setOnOrderDialogOpen] = useState(false);

    // Use external control if provided
    const isDialogOpen = isOpen ?? dialogOpen;
    const setIsDialogOpen = onOpenChange || setDialogOpen;

    // Create a form using useForm with the GrnItemSchema validation
    const form = useForm<z.infer<typeof GrnItemSchema>>({
        resolver: zodResolver(GrnItemSchema),
        defaultValues: {
            locations: { id: "", name: "" },
            products: { id: "", name: "", description: "" },
            lot_no: "",
            qty_order: 0,
            qty_received: 0,
            unit: { id: "", name: "" },
            price: 0,
            net_amount: 0,
            tax_amount: 0,
            total_amount: 0,
            po_ref_no: "",
            job_code: "",
            foc: false,
            delivery_point: "",
            currency: "",
            exchange_rate: 0,
            tax_inclusive: false,
            adj_disc_rate: 0,
            adj_tax_rate: 0,
            override_disc_amount: 0,
            override_tax_amount: 0,
        },
    });

    // Update form values when initialData changes
    useEffect(() => {
        if (initialData) {
            form.reset(initialData);
        }
    }, [initialData, form]);

    const onSubmit = (data: z.infer<typeof GrnItemSchema>) => {
        // Calculate derived values
        const netAmount = data.qty_order * data.price;
        const taxAmount = netAmount * 0.07; // Assuming 7% tax
        const totalAmount = netAmount + taxAmount;

        // Set calculated values
        data.net_amount = netAmount;
        data.tax_amount = taxAmount;
        data.total_amount = totalAmount;
        data.qty_received = data.qty_received || data.qty_order; // Set received qty equal to ordered qty by default if not set

        // Preserve the id if editing
        if (initialData?.id) {
            data.id = initialData.id;
        }

        // Pass the complete item to parent
        onAddItem(data);

        // Close dialog and reset form
        setIsDialogOpen(false);
        form.reset();
    };

    const handleCancel = (e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault();
        setIsDialogOpen(false);
        form.reset();
    }

    const openOnHand = (e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault();
        setOnHandDialogOpen(true);
    }

    const openOnOrder = (e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault();
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

                            <div className="border-b pb-4">

                                <div className="flex justify-between items-center">
                                    <p className="text-base font-bold">{dialogTitle}</p>
                                    <div className="flex items-center gap-2">
                                        <Button variant="outline" size="sm" onClick={handleCancel}>
                                            Cancel
                                        </Button>
                                        <Button
                                            variant="default"
                                            size="sm"
                                            disabled={!form.formState.isValid}
                                        >
                                            Save
                                        </Button>
                                    </div>
                                </div>
                                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-2">
                                    <FormField
                                        control={form.control}
                                        name="locations.name"
                                        render={({ field }) => (
                                            <FormItem >
                                                <FormLabel>Location</FormLabel>
                                                <FormControl>
                                                    <Input {...field} />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />

                                    <FormField
                                        control={form.control}
                                        name="products.name"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Product</FormLabel>
                                                <FormControl>
                                                    <Input {...field} />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />

                                    <FormField
                                        control={form.control}
                                        name="po_ref_no"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>PO Ref No.</FormLabel>
                                                <FormControl>
                                                    <Input {...field} />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />

                                    <FormField
                                        control={form.control}
                                        name="job_code"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Job Code</FormLabel>
                                                <FormControl>
                                                    <Input {...field} />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />

                                    <FormField
                                        control={form.control}
                                        name="products.description"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Description</FormLabel>
                                                <FormControl>
                                                    <Input {...field} />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </div>
                            </div>

                            <div className="border-b pb-4 space-y-2">
                                <div className="flex justify-between">
                                    <p className="text-base font-bold">Quantity and Delivery</p>
                                    <div className="flex items-center gap-2">
                                        <Button variant="outline" size="sm" onClick={openOnHand}>
                                            On Hand
                                        </Button>
                                        <Button variant="outline" size="sm" onClick={openOnOrder}>
                                            On Order
                                        </Button>
                                    </div>
                                </div>
                                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-2">
                                    <FormField
                                        control={form.control}
                                        name="unit.name"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Ord. Unit</FormLabel>
                                                <FormControl>
                                                    <Input {...field} />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />

                                    <FormField
                                        control={form.control}
                                        name="qty_order"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Order Quantity</FormLabel>
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
                                        name="qty_received"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Receiving Quantity</FormLabel>
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
                                        name="lot_no"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Lot No.</FormLabel>
                                                <FormControl>
                                                    <Input {...field} />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />

                                    <FormField
                                        control={form.control}
                                        name="delivery_point"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Delivery Point</FormLabel>
                                                <FormControl>
                                                    <Input {...field} />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />

                                    <FormField
                                        control={form.control}
                                        name="foc"
                                        render={({ field }) => (
                                            <FormItem>
                                                <div className="flex flex-col gap-2">
                                                    <FormLabel>FOC</FormLabel>
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

                                <div className="bg-muted p-2 rounded-md">
                                    <div className="flex justify-between items-center">
                                        <div>
                                            <p className="text-xs">On Hand</p>
                                            <p className="text-xs">0 kg</p>
                                        </div>
                                        <div>
                                            <p className="text-xs">On Ordered</p>
                                            <p className="text-xs">0 kg</p>
                                        </div>
                                        <div>
                                            <p className="text-xs">Reorder Level</p>
                                            <p className="text-xs">0 kg</p>
                                        </div>

                                    </div>
                                </div>
                            </div>

                            <div className="flex flex-col md:flex-row gap-2">
                                <div className="space-y-2">
                                    <p className="text-base font-bold">Pricing</p>
                                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
                                        <FormField
                                            control={form.control}
                                            name="currency"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>Currency</FormLabel>
                                                    <FormControl>
                                                        <Select onValueChange={field.onChange} value={field.value}>
                                                            <SelectTrigger>
                                                                <SelectValue placeholder="Select a currency" />
                                                            </SelectTrigger>
                                                            <SelectContent>
                                                                <SelectItem value="USD">USD</SelectItem>
                                                                <SelectItem value="EUR">EUR</SelectItem>
                                                                <SelectItem value="GBP">GBP</SelectItem>
                                                            </SelectContent>
                                                        </Select>
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
                                            name="tax_inclusive"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <div className="flex flex-col gap-2 mt-2">
                                                        <FormLabel>Tax Incl.</FormLabel>
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
                                    <div className="grid grid-cols-2 gap-2">
                                        <FormField
                                            control={form.control}
                                            name="adj_disc_rate"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>Adj. Disc. Rate (%)</FormLabel>
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
                                            name="override_disc_amount"
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
                                            name="adj_tax_rate"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>Adj. Tax Rate (%)</FormLabel>
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
                                            name="override_tax_amount"
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
                                    <div className="bg-muted p-2 rounded-md">
                                        <div className="flex justify-between items-center">
                                            <div>
                                                <p className="text-xs text-muted-foreground">Last Price</p>
                                                <p className="text-xs text-muted-foreground">0.00 per Kg</p>
                                            </div>
                                            <div>
                                                <p className="text-xs text-muted-foreground">Last Order Date</p>
                                                <p className="text-xs text-muted-foreground">4/23/2025</p>
                                            </div>
                                            <div>
                                                <p className="text-xs text-muted-foreground">Last Vendor</p>
                                                <p className="text-xs text-muted-foreground">N/A</p>
                                            </div>

                                        </div>
                                    </div>

                                </div>
                                <div className="flex-1">
                                    <p className="text-base font-bold">Calculated Amounts</p>
                                    <Table>
                                        <TableHeader>
                                            <TableRow>
                                                <TableHead>Description</TableHead>
                                                <TableHead>Total Amount (USD)</TableHead>
                                                <TableHead>Base Amount (USD)</TableHead>
                                            </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                            <TableRow>
                                                <TableCell>Sub Total Amount</TableCell>
                                                <TableCell>0.00</TableCell>
                                                <TableCell>0.00</TableCell>
                                            </TableRow>
                                            <TableRow>
                                                <TableCell>Discount Amount</TableCell>
                                                <TableCell>0.00</TableCell>
                                                <TableCell>0.00</TableCell>
                                            </TableRow>
                                            <TableRow>
                                                <TableCell>Net Amount</TableCell>
                                                <TableCell>0.00</TableCell>
                                                <TableCell>0.00</TableCell>
                                            </TableRow>
                                            <TableRow>
                                                <TableCell>Tax Amount</TableCell>
                                                <TableCell>0.00</TableCell>
                                                <TableCell>0.00</TableCell>
                                            </TableRow>
                                            <TableRow>
                                                <TableCell>Total Amount</TableCell>
                                                <TableCell>0.00</TableCell>
                                                <TableCell>0.00</TableCell>
                                            </TableRow>
                                        </TableBody>
                                    </Table>
                                </div>

                            </div>

                            <DialogFooter>

                            </DialogFooter>
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
                            {[
                                {
                                    location: "Warehouse A",
                                    quantity: 500,
                                    units: "pcs",
                                    par: 600,
                                    reorderPoint: 400,
                                    minStock: 300,
                                    maxStock: 800
                                },
                                {
                                    location: "Store B",
                                    quantity: 150,
                                    units: "pcs",
                                    par: 200,
                                    reorderPoint: 100,
                                    minStock: 50,
                                    maxStock: 250
                                },
                                {
                                    location: "Distribution Center C",
                                    quantity: 1000,
                                    units: "pcs",
                                    par: 1200,
                                    reorderPoint: 800,
                                    minStock: 600,
                                    maxStock: 1500
                                }
                            ].map((item, index) => (
                                <TableRow key={index}>
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
                            {[
                                {
                                    poNumber: "PO-001",
                                    vendor: "Acme Supplies",
                                    deliveryDate: "2023-07-15",
                                    remainingQty: 100,
                                    units: "pcs",
                                    locations: "Warehouse A, Store B"
                                },
                                {
                                    poNumber: "PO-002",
                                    vendor: "Global Goods",
                                    deliveryDate: "2023-07-20",
                                    remainingQty: 50,
                                    units: "boxes",
                                    locations: "Store C"
                                },
                                {
                                    poNumber: "PO-003",
                                    vendor: "Tech Solutions",
                                    deliveryDate: "2023-07-25",
                                    remainingQty: 200,
                                    units: "units",
                                    locations: "Warehouse B, Store A, Store D"
                                }
                            ].map((item, index) => (
                                <TableRow key={index}>
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