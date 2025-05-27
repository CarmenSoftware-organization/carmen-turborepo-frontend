import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useTranslations } from "next-intl";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { TaxType } from "@/constants/enum";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { Plus, CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { CreatePriceListDto, priceListSchema } from "@/dtos/price-list.dto";
import VendorLookup from "@/components/lookup/VendorLookup";
import ProductLookup from "@/components/lookup/ProductLookup";
import UnitLookup from "@/components/lookup/UnitLookup";
import { useCreatePriceList } from "@/hooks/usePriceList";
import { useAuth } from "@/context/AuthContext";
import { toastError, toastSuccess } from "@/components/ui-custom/Toast";

interface FormDialogPriceListProps {
    readonly open: boolean;
    readonly onOpenChange: (open: boolean) => void;
}

export default function FormDialogPriceList({ open, onOpenChange }: FormDialogPriceListProps) {
    const tCommon = useTranslations('Common');
    const { token, tenantId } = useAuth();
    const form = useForm<CreatePriceListDto>({
        resolver: zodResolver(priceListSchema),
        defaultValues: {
            vendor_id: "",
            from_date: new Date(),
            to_date: new Date(),
            product_id: "",
            product_name: "",
            unit_id: "",
            unit_name: "",
            price: 0,
            price_without_vat: 0,
            price_with_vat: 0,
            tax_type: TaxType.ADD,
            tax_rate: 0,
            is_active: true,
            note: "",
            dimension: "",
        },
    });

    const { mutate: createPriceList, isPending } = useCreatePriceList(token, tenantId);

    const onSubmit = (data: CreatePriceListDto) => {
        createPriceList(data, {
            onSuccess: () => {
                onOpenChange(false);
                form.reset();
                toastSuccess({ message: 'Price list created successfully' });
            },
            onError: (error: unknown) => {
                toastError({ message: 'Failed to create price list' });
            }
        });
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogTrigger asChild>
                <Button size={'sm'}>
                    <Plus className="h-4 w-4" />
                    {tCommon('add')}
                </Button>
            </DialogTrigger>
            <DialogContent className="max-w-4xl overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>Add Price List</DialogTitle>
                    <DialogDescription>
                        Create a new price list for your vendor management.
                    </DialogDescription>
                </DialogHeader>

                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                        <div className="grid grid-cols-4 gap-4">
                            <FormField
                                control={form.control}
                                name="vendor_id"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Vendor ID *</FormLabel>
                                        <FormControl>
                                            <VendorLookup
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
                                name="from_date"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>From Date *</FormLabel>
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
                                                            <span className="text-muted-foreground">Select date</span>
                                                        )}
                                                        <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                                    </Button>
                                                </FormControl>
                                            </PopoverTrigger>
                                            <PopoverContent className="w-auto p-0" align="start">
                                                <Calendar
                                                    mode="single"
                                                    selected={field.value ? new Date(field.value) : undefined}
                                                    onSelect={(date) => field.onChange(date || new Date())}
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
                                name="to_date"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>To Date</FormLabel>
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
                                                            <span className="text-muted-foreground">Select date</span>
                                                        )}
                                                        <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                                    </Button>
                                                </FormControl>
                                            </PopoverTrigger>
                                            <PopoverContent className="w-auto p-0" align="start">
                                                <Calendar
                                                    mode="single"
                                                    selected={field.value ? new Date(field.value) : undefined}
                                                    onSelect={(date) => field.onChange(date)}
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
                                name="unit_id"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Unit</FormLabel>
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
                                name="price"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Price</FormLabel>
                                        <FormControl>
                                            <Input
                                                type="number"
                                                step="0.01"
                                                placeholder="0.00"
                                                {...field}
                                                onChange={(e) => field.onChange(parseFloat(e.target.value))}
                                                min={0.00}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="price_without_vat"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Price Without VAT</FormLabel>
                                        <FormControl>
                                            <Input
                                                type="number"
                                                step="0"
                                                placeholder="0"
                                                {...field}
                                                onChange={(e) => field.onChange(Number(e.target.value))}
                                                min={0}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="price_with_vat"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Price With VAT</FormLabel>
                                        <FormControl>
                                            <Input
                                                type="number"
                                                step="0"
                                                placeholder="0"
                                                {...field}
                                                onChange={(e) => field.onChange(Number(e.target.value))}
                                                min={0}
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
                                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                                            <FormControl>
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Select tax type" />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent>
                                                <SelectItem value={TaxType.ADD}>Add</SelectItem>
                                                <SelectItem value={TaxType.INCLUDED}>Include</SelectItem>
                                                <SelectItem value={TaxType.NONE}>None</SelectItem>
                                            </SelectContent>
                                        </Select>
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
                                                step="0"
                                                placeholder="0"
                                                {...field}
                                                onChange={(e) => field.onChange(Number(e.target.value))}
                                                min={0}
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
                                name="dimension"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Dimension</FormLabel>
                                        <FormControl>
                                            <Textarea placeholder="Enter dimension" {...field} />
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
                                            <Textarea placeholder="Enter note" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>

                        <FormField
                            control={form.control}
                            name="is_active"
                            render={({ field }) => (
                                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                                    <div className="space-y-0.5">
                                        <FormLabel className="text-base">Active Status</FormLabel>
                                        <div className="text-sm text-muted-foreground">
                                            Enable or disable this price list
                                        </div>
                                    </div>
                                    <FormControl>
                                        <Switch
                                            checked={field.value}
                                            onCheckedChange={field.onChange}
                                        />
                                    </FormControl>
                                </FormItem>
                            )}
                        />

                        <div className="flex justify-end space-x-2 pt-4">
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => onOpenChange(false)}
                            >
                                Cancel
                            </Button>
                            <Button type="submit" disabled={isPending}>
                                {isPending ? 'Creating...' : 'Create Price List'}
                            </Button>
                        </div>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    )
}