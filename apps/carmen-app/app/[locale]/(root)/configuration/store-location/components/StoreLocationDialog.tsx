import { CreateStoreLocationDto, createStoreLocationSchema, DeliveryPointDto, StoreLocationDto } from "@/dtos/config.dto";
import { formType } from "@/dtos/form.dto";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useMemo } from "react";
import { useForm } from "react-hook-form";
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
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { INVENTORY_TYPE } from "@/constants/enum";
import { useDeliveryPoint } from "@/hooks/useDeliveryPoint";
import { Textarea } from "@/components/ui/textarea";
import { useTranslations } from "next-intl";
interface Props {
    readonly open: boolean;
    readonly onOpenChange: (open: boolean) => void;
    readonly mode: formType;
    readonly storeLocation?: StoreLocationDto;
    readonly onSubmit: (data: CreateStoreLocationDto) => void;
    readonly isLoading?: boolean;
}

export default function StoreLocationDialog({ open, onOpenChange, mode, storeLocation, onSubmit, isLoading = false }: Props) {
    const tCommon = useTranslations('Common');
    const tStoreLocation = useTranslations('StoreLocation');

    const { deliveryPoints } = useDeliveryPoint();

    const defaultStoreLocationValues = useMemo(() => ({
        name: '',
        location_type: INVENTORY_TYPE.INVENTORY,
        description: '',
        is_active: true,
        delivery_point_id: '',
    }), []);

    const form = useForm<CreateStoreLocationDto>({
        resolver: zodResolver(createStoreLocationSchema),
        defaultValues: mode === formType.EDIT && storeLocation
            ? {
                ...storeLocation,
                delivery_point_id: storeLocation.delivery_point?.id ?? ''
            }
            : defaultStoreLocationValues,
    });

    useEffect(() => {
        if (mode === formType.EDIT && storeLocation) {
            form.reset({
                ...storeLocation,
                delivery_point_id: storeLocation.delivery_point?.id ?? ''
            });
        } else {
            form.reset(defaultStoreLocationValues);
        }
    }, [mode, storeLocation, form, defaultStoreLocationValues]);

    const handleSubmit = async (data: CreateStoreLocationDto) => {
        try {
            const validatedData = createStoreLocationSchema.parse(data);
            onSubmit(validatedData);
            form.reset(defaultStoreLocationValues);
            onOpenChange(false);
        } catch (error) {
            console.error('Validation Error:', error);
        }
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>
                        {mode === formType.ADD ? tStoreLocation("add_store_location") : tStoreLocation("edit_store_location")}
                    </DialogTitle>
                    <DialogDescription>
                        {mode === formType.ADD
                            ? tStoreLocation("add_store_location_description")
                            : tStoreLocation("edit_store_location_description")}
                    </DialogDescription>
                </DialogHeader>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
                        <FormField
                            control={form.control}
                            name="name"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>{tCommon("name")}</FormLabel>
                                    <FormControl>
                                        <Input {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="location_type"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>{tStoreLocation("location_type")}</FormLabel>
                                    <FormControl>
                                        <Select
                                            onValueChange={field.onChange}
                                            defaultValue={field.value}
                                        >
                                            <SelectTrigger>
                                                <SelectValue placeholder="Select a location type" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value={INVENTORY_TYPE.INVENTORY}>{tStoreLocation("inventory")}</SelectItem>
                                                <SelectItem value={INVENTORY_TYPE.DIRECT}>{tStoreLocation("direct")}</SelectItem>
                                                <SelectItem value={INVENTORY_TYPE.CONSIGNMENT}>{tStoreLocation("consignment")}</SelectItem>
                                            </SelectContent>
                                        </Select>
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
                                    <FormLabel>{tStoreLocation("delivery_point")}</FormLabel>
                                    <FormControl>
                                        <Select
                                            onValueChange={field.onChange}
                                            defaultValue={field.value}
                                        >
                                            <SelectTrigger>
                                                <SelectValue placeholder={tStoreLocation("delivery_point_placeholder")} />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {deliveryPoints
                                                    .filter((dp): dp is DeliveryPointDto & { id: string } => !!dp.id)
                                                    .map((deliveryPoint) => (
                                                        <SelectItem key={deliveryPoint.id} value={deliveryPoint.id}>
                                                            {deliveryPoint.name}
                                                        </SelectItem>
                                                    ))}
                                            </SelectContent>
                                        </Select>
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="description"
                            render={({ field }) => (
                                <FormItem className="md:col-span-2">
                                    <FormLabel>{tCommon("description")}</FormLabel>
                                    <FormControl>
                                        <Textarea {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="is_active"
                            render={({ field }) => (
                                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                                    <div className="space-y-0.5">
                                        <FormLabel className="text-sm">
                                            {tCommon("status")}
                                        </FormLabel>
                                    </div>
                                    <FormControl>
                                        <Switch
                                            checked={field.value}
                                            onCheckedChange={field.onChange}
                                            className="data-[state=checked]:bg-blue-600"
                                        />
                                    </FormControl>
                                </FormItem>
                            )}
                        />
                        <DialogFooter>
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => onOpenChange(false)}
                            >
                                {tCommon("cancel")}
                            </Button>
                            <Button
                                type="submit"
                                disabled={isLoading || form.formState.isSubmitting}
                            >
                                {mode === formType.ADD ? tCommon("add") : tCommon("edit")}
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
