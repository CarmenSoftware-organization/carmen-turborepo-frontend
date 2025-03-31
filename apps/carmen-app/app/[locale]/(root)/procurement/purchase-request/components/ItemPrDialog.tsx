"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
    DialogDescription,
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
import { Loader2 } from "lucide-react";
import { ItemDetailPrDto, ItemPrSchema } from "@/dtos/procurement.dto";


interface ItemPrDialogProps {
    readonly open: boolean;
    readonly onOpenChange: (open: boolean) => void;
    readonly onSubmit: (data: ItemDetailPrDto) => void;
    readonly isLoading?: boolean;
}

export default function ItemPrDialog({
    open,
    onOpenChange,
    onSubmit,
    isLoading = false
}: ItemPrDialogProps) {
    const form = useForm<ItemDetailPrDto>({
        resolver: zodResolver(ItemPrSchema),
        defaultValues: {
            location: "",
            product_name: "",
            description: "",
            order_unit: "",
            inv_unit: "",
            request_qty: 0,
            on_order_qty: 0,
            approved_qty: 0,
            on_hand_qty: 0,
            base_currency: "USD",
            price: 0,
            total_price: 0,
            status: "Pending",
        },
    });

    const handleSubmit = (data: ItemDetailPrDto) => {
        onSubmit(data);
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[600px]">
                <DialogHeader>
                    <DialogTitle>Add Item</DialogTitle>
                    <DialogDescription>
                        Add a new item to your purchase request.
                    </DialogDescription>
                </DialogHeader>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                            <FormField
                                control={form.control}
                                name="location"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Location</FormLabel>
                                        <FormControl>
                                            <Input placeholder="Enter location" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="product_name"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Product Name</FormLabel>
                                        <FormControl>
                                            <Input placeholder="Enter product name" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>
                        <FormField
                            control={form.control}
                            name="description"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Description</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Enter description" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <div className="grid grid-cols-2 gap-4">
                            <FormField
                                control={form.control}
                                name="order_unit"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Order Unit</FormLabel>
                                        <FormControl>
                                            <Input placeholder="Enter order unit" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="inv_unit"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Inventory Unit</FormLabel>
                                        <FormControl>
                                            <Input placeholder="Enter inventory unit" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <FormField
                                control={form.control}
                                name="request_qty"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Request Quantity</FormLabel>
                                        <FormControl>
                                            <Input
                                                type="number"
                                                placeholder="Enter request quantity"
                                                {...field}
                                                onChange={(e) => field.onChange(Number(e.target.value))}
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
                                                placeholder="Enter price"
                                                {...field}
                                                onChange={(e) => field.onChange(Number(e.target.value))}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <FormField
                                control={form.control}
                                name="base_currency"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Base Currency</FormLabel>
                                        <FormControl>
                                            <Input placeholder="Enter base currency" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="total_price"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Total Price</FormLabel>
                                        <FormControl>
                                            <Input
                                                type="number"
                                                placeholder="Enter total price"
                                                {...field}
                                                onChange={(e) => field.onChange(Number(e.target.value))}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>
                        <DialogFooter>
                            <Button
                                type="submit"
                                disabled={isLoading || form.formState.isSubmitting}
                            >
                                Add Item
                                {(isLoading || form.formState.isSubmitting) && (
                                    <Loader2 className="w-4 h-4 ml-2 animate-spin" />
                                )}
                            </Button>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    );
} 