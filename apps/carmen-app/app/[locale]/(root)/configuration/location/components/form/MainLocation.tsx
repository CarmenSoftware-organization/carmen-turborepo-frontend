import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { formType } from "@/dtos/form.dto";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage
} from "@/components/ui/form";

import { CreateStoreLocationDto, createStoreLocationSchema } from "@/dtos/config.dto";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { INVENTORY_TYPE } from "@/constants/enum";
import { useTranslations } from "next-intl";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import DeliveryPointLookup from "@/components/lookup/DeliveryPointLookup";
import { Card } from "@/components/ui/card";
import UserLocation from "./UserLocation";

interface MainLocationProps {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    readonly initialData?: any;
    readonly mode: formType;
    readonly isLoading?: boolean;
}

export default function MainLocation({
    initialData,
    mode,
    isLoading
}: MainLocationProps) {
    const tStoreLocation = useTranslations('StoreLocation');

    // Transform initial data to match form structure
    const transformedInitialData = initialData ? {
        id: initialData.id || "",
        name: initialData.name || "",
        location_type: initialData.location_type || "",
        description: initialData.description || "",
        is_active: initialData.is_active || false,
        delivery_point_id: initialData.delivery_point?.id || "",
        users: {
            add: initialData.users && Array.isArray(initialData.users) && initialData.users.length > 0
                ? initialData.users.map((user: string | { id: string }) => ({
                    id: typeof user === 'string' ? user : user.id
                }))
                : [{ id: "" }],
            remove: []
        },
        info: {
            floor: initialData.info?.floor || 0,
            building: initialData.info?.building || "",
            capacity: initialData.info?.capacity || 0,
            responsibleDepartment: initialData.info?.responsibleDepartment || "",
            itemCount: initialData.info?.itemCount || 0,
            lastCount: initialData.info?.lastCount || ""
        }
    } : {
        delivery_point_id: "",
        users: {
            add: [{ id: "" }],
            remove: []
        },
        info: {
            floor: 0,
            building: "",
            capacity: 0,
            responsibleDepartment: "",
            itemCount: 0,
            lastCount: ""
        }
    };

    const form = useForm<CreateStoreLocationDto>({
        resolver: zodResolver(createStoreLocationSchema),
        defaultValues: transformedInitialData
    });

    const { fields: addUserFields, append: appendAddUser, remove: removeAddUser } = useFieldArray({
        control: form.control,
        name: "users.add"
    });

    const { fields: removeUserFields, append: appendRemoveUser, remove: removeRemoveUser } = useFieldArray({
        control: form.control,
        name: "users.remove"
    });

    const isReadOnly = mode === formType.VIEW;
    const isCreate = mode === formType.ADD;

    const onFormSubmit = (data: CreateStoreLocationDto) => {
        console.log("Form submitted:", data);

        // Transform data back to server format if needed
        const transformedData = {
            ...data,
            // Filter out empty user IDs and transform to server format if needed
            users: {
                add: data.users?.add?.filter(user => user.id.trim() !== "") || [],
                remove: data.users?.remove?.filter(user => user.id.trim() !== "") || []
            }
        };

        // Handle form submission based on mode
        if (isCreate) {
            // Create new store location
            console.log("Creating new store location:", transformedData);
            // TODO: Add API call for creating
        } else if (mode === "edit") {
            // Update existing store location
            console.log("Updating store location:", transformedData);
            // TODO: Add API call for updating
        }
    };

    if (isLoading) {
        return <div className="flex items-center justify-center p-4 text-sm">Loading...</div>;
    }

    return (
        <div className="max-w-full mx-auto p-3 space-y-3">
            {/* Header */}
            <div className="flex items-center justify-between border-b pb-2">
                <h1 className="text-lg font-medium">
                    {isCreate ? "Create" : mode === formType.EDIT ? "Edit" : "View"} Store Location
                </h1>
                <div className="text-xs text-gray-500">Mode: {mode}</div>
            </div>

            <Form {...form}>
                <form onSubmit={form.handleSubmit(onFormSubmit)} className="space-y-4">
                    {/* Basic Information */}
                    <Card className="p-4">
                        <div className="text-sm font-medium mb-2">Basic Information</div>
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
                            <FormField
                                control={form.control}
                                name="name"
                                render={({ field }) => (
                                    <FormItem className="space-y-1">
                                        <FormLabel className="text-xs font-medium">Name</FormLabel>
                                        <FormControl>
                                            <Input
                                                {...field}
                                                readOnly={isReadOnly}
                                                className="h-8 text-xs"
                                            />
                                        </FormControl>
                                        <FormMessage className="text-xs" />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="location_type"
                                render={({ field }) => (
                                    <FormItem className="space-y-1">
                                        <FormLabel className="text-xs font-medium">Type</FormLabel>
                                        <FormControl>
                                            <Select
                                                onValueChange={field.onChange}
                                                defaultValue={field.value}
                                                disabled={isReadOnly}
                                            >
                                                <SelectTrigger className="h-8 text-xs">
                                                    <SelectValue placeholder="Select type" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value={INVENTORY_TYPE.INVENTORY} className="text-xs">{tStoreLocation("inventory")}</SelectItem>
                                                    <SelectItem value={INVENTORY_TYPE.DIRECT} className="text-xs">{tStoreLocation("direct")}</SelectItem>
                                                    <SelectItem value={INVENTORY_TYPE.CONSIGNMENT} className="text-xs">{tStoreLocation("consignment")}</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </FormControl>
                                        <FormMessage className="text-xs" />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="delivery_point_id"
                                render={({ field }) => (
                                    <FormItem className="space-y-1">
                                        <FormLabel className="text-xs font-medium">Delivery Point</FormLabel>
                                        <FormControl>
                                            <DeliveryPointLookup
                                                value={field.value}
                                                onValueChange={field.onChange}
                                                disabled={isReadOnly}
                                            />
                                        </FormControl>
                                        <FormMessage className="text-xs" />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="is_active"
                                render={({ field }) => (
                                    <FormItem className="space-y-1">
                                        <FormLabel className="text-xs font-medium">Status</FormLabel>
                                        <FormControl>
                                            <div className="flex items-center space-x-2 pt-1">
                                                <Switch
                                                    checked={field.value}
                                                    onCheckedChange={field.onChange}
                                                    disabled={isReadOnly}
                                                    className="scale-75"
                                                />
                                                <span className="text-xs">{field.value ? "Active" : "Inactive"}</span>
                                            </div>
                                        </FormControl>
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="description"
                                render={({ field }) => (
                                    <FormItem className="md:col-span-4 space-y-1">
                                        <FormLabel className="text-xs font-medium">Description</FormLabel>
                                        <FormControl>
                                            <Textarea
                                                {...field}
                                                readOnly={isReadOnly}
                                                className="min-h-[60px] text-xs resize-none"
                                            />
                                        </FormControl>
                                        <FormMessage className="text-xs" />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="info.floor"
                                render={({ field }) => (
                                    <FormItem className="space-y-1">
                                        <FormLabel className="text-xs font-medium">Floor</FormLabel>
                                        <FormControl>
                                            <Input
                                                type="number"
                                                {...field}
                                                readOnly={isReadOnly}
                                                className="h-8 text-xs"
                                                onChange={(e) => field.onChange(Number(e.target.value))}
                                            />
                                        </FormControl>
                                        <FormMessage className="text-xs" />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="info.building"
                                render={({ field }) => (
                                    <FormItem className="space-y-1">
                                        <FormLabel className="text-xs font-medium">Building</FormLabel>
                                        <FormControl>
                                            <Input
                                                {...field}
                                                readOnly={isReadOnly}
                                                className="h-8 text-xs"
                                            />
                                        </FormControl>
                                        <FormMessage className="text-xs" />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="info.capacity"
                                render={({ field }) => (
                                    <FormItem className="space-y-1">
                                        <FormLabel className="text-xs font-medium">Capacity</FormLabel>
                                        <FormControl>
                                            <Input
                                                type="number"
                                                {...field}
                                                readOnly={isReadOnly}
                                                className="h-8 text-xs"
                                                onChange={(e) => field.onChange(Number(e.target.value))}
                                            />
                                        </FormControl>
                                        <FormMessage className="text-xs" />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="info.responsibleDepartment"
                                render={({ field }) => (
                                    <FormItem className="space-y-1">
                                        <FormLabel className="text-xs font-medium">Department</FormLabel>
                                        <FormControl>
                                            <Input
                                                {...field}
                                                readOnly={isReadOnly}
                                                className="h-8 text-xs"
                                            />
                                        </FormControl>
                                        <FormMessage className="text-xs" />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="info.itemCount"
                                render={({ field }) => (
                                    <FormItem className="space-y-1">
                                        <FormLabel className="text-xs font-medium">Item Count</FormLabel>
                                        <FormControl>
                                            <Input
                                                type="number"
                                                {...field}
                                                readOnly={isReadOnly}
                                                className="h-8 text-xs"
                                                onChange={(e) => field.onChange(Number(e.target.value))}
                                            />
                                        </FormControl>
                                        <FormMessage className="text-xs" />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="info.lastCount"
                                render={({ field }) => (
                                    <FormItem className="space-y-1">
                                        <FormLabel className="text-xs font-medium">Last Count</FormLabel>
                                        <FormControl>
                                            <Input
                                                {...field}
                                                readOnly={isReadOnly}
                                                className="h-8 text-xs"
                                            />
                                        </FormControl>
                                        <FormMessage className="text-xs" />
                                    </FormItem>
                                )}
                            />
                        </div>
                    </Card>

                    <UserLocation
                        control={form.control}
                        isReadOnly={isReadOnly}
                        addUserFields={addUserFields}
                        appendAddUser={appendAddUser}
                        removeAddUser={removeAddUser}
                        removeUserFields={removeUserFields}
                        appendRemoveUser={appendRemoveUser}
                        removeRemoveUser={removeRemoveUser}
                    />

                    {/* View Mode - Display Users */}
                    {isReadOnly && (transformedInitialData?.users?.add?.length || transformedInitialData?.users?.remove?.length) && (
                        <div className="border border-gray-200 p-3">
                            <div className="text-sm font-medium mb-2 border-b pb-1">Users</div>
                            <div className="space-y-3">
                                {transformedInitialData?.users?.add && transformedInitialData.users.add.length > 0 && (
                                    <div>
                                        <Label className="text-xs font-medium">Assigned Users</Label>
                                        <div className="mt-1 grid grid-cols-1 md:grid-cols-3 gap-1">
                                            {transformedInitialData.users.add.map((user: { id: string }, index: number) => (
                                                <div key={index} className="p-1 border rounded text-xs">
                                                    {user.id}
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {transformedInitialData?.users?.remove && transformedInitialData.users.remove.length > 0 && (
                                    <div>
                                        <Label className="text-xs font-medium">Users to Remove</Label>
                                        <div className="mt-1 grid grid-cols-1 md:grid-cols-3 gap-1">
                                            {transformedInitialData.users.remove.map((user: { id: string }, index: number) => (
                                                <div key={index} className="p-1 border rounded text-xs">
                                                    {user.id}
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}

                    {/* Form Actions */}
                    {!isReadOnly && (
                        <div className="flex justify-end gap-2 pt-2">
                            <Button type="button" variant="outline" size="sm" className="h-8 px-3 text-xs">
                                Cancel
                            </Button>
                            <Button type="submit" size="sm" className="h-8 px-3 text-xs">
                                {isCreate ? "Create" : "Update"}
                            </Button>
                        </div>
                    )}
                </form>
            </Form>
        </div>
    );
}