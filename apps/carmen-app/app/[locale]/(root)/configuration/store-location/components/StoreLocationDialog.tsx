import { CreateStoreLocationDto, createStoreLocationSchema, StoreLocationDto } from "@/dtos/config.dto";
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

interface Props {
    readonly open: boolean;
    readonly onOpenChange: (open: boolean) => void;
    readonly mode: formType;
    readonly storeLocation?: StoreLocationDto;
    readonly onSubmit: (data: CreateStoreLocationDto) => void;
    readonly isLoading?: boolean;
}

export default function StoreLocationDialog({ open, onOpenChange, mode, storeLocation, onSubmit, isLoading = false }: Props) {
    const defaultStoreLocationValues = useMemo(() => ({
        name: '',
        location_type: INVENTORY_TYPE.INVENTORY,
        description: '',
        is_active: true,
        delivery_point_id: '',
        info: {
            floor: 0,
            building: '',
            capacity: 0,
            responsibleDepartment: '',
            itemCount: 0,
            lastCount: ''
        }
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
                        {mode === formType.ADD ? "Add Store Location" : "Edit Store Location"}
                    </DialogTitle>
                    <DialogDescription>
                        {mode === formType.ADD
                            ? "Add a new store location with name, type, description, and status"
                            : "Edit existing store location details including name, type, description, and status"}
                    </DialogDescription>
                </DialogHeader>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <FormField
                                control={form.control}
                                name="name"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Name</FormLabel>
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
                                        <FormLabel>Location Type</FormLabel>
                                        <FormControl>
                                            <Select
                                                onValueChange={field.onChange}
                                                defaultValue={field.value}
                                            >
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Select a location type" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value={INVENTORY_TYPE.INVENTORY}>Inventory</SelectItem>
                                                    <SelectItem value={INVENTORY_TYPE.DIRECT}>Direct</SelectItem>
                                                    <SelectItem value={INVENTORY_TYPE.CONSIGNMENT}>Consignment</SelectItem>
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
                                        <FormLabel>Description</FormLabel>
                                        <FormControl>
                                            <Input {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="info.floor"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Floor</FormLabel>
                                        <FormControl>
                                            <Input
                                                type="number"
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
                                name="info.building"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Building</FormLabel>
                                        <FormControl>
                                            <Input {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="info.capacity"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Capacity</FormLabel>
                                        <FormControl>
                                            <Input
                                                type="number"
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
                                name="info.responsibleDepartment"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Responsible Department</FormLabel>
                                        <FormControl>
                                            <Input {...field} />
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
                                            <Select
                                                onValueChange={field.onChange}
                                                defaultValue={field.value}
                                            >
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Select a delivery point" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="c32dbbe4-d453-4f02-9268-8014deffa299">Delivery Point 1</SelectItem>
                                                    <SelectItem value="2">Delivery Point 2</SelectItem>
                                                    <SelectItem value="3">Delivery Point 3</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>
                        <div className="space-y-4">
                            <FormField
                                control={form.control}
                                name="is_active"
                                render={({ field }) => (
                                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                                        <div className="space-y-0.5">
                                            <FormLabel className="text-base">
                                                Status
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
                        </div>
                        <DialogFooter>
                            <Button
                                type="submit"
                                disabled={isLoading || form.formState.isSubmitting}
                            >
                                {mode === formType.ADD ? "Add" : "Edit"}
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
