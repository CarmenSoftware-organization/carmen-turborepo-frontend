import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { formType } from "@/dtos/form.dto";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage
} from "@/components/ui/form";
import { Plus, Minus } from "lucide-react";
import { CreateStoreLocationDto, createStoreLocationSchema } from "@/dtos/config.dto";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { INVENTORY_TYPE } from "@/constants/enum";
import { useTranslations } from "next-intl";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import DeliveryPointLookup from "@/components/lookup/DeliveryPointLookup";

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
    const tCommon = useTranslations('Common');

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
        return <div className="flex items-center justify-center p-8">Loading...</div>;
    }

    return (
        <div className="max-w-6xl mx-auto p-6 space-y-6">
            <div className="flex items-center justify-between">
                <h1 className="text-2xl font-bold">
                    {isCreate ? "Create" : mode === formType.EDIT ? "Edit" : "View"} Store Location
                </h1>
                <div className="text-sm text-muted-foreground">Mode: {mode}</div>
            </div>

            <Form {...form}>
                <form onSubmit={form.handleSubmit(onFormSubmit)} className="space-y-6">
                    {/* Basic Information */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Basic Information</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <FormField
                                    control={form.control}
                                    name="name"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Name</FormLabel>
                                            <FormControl>
                                                <Input
                                                    {...field}
                                                    readOnly={isReadOnly}
                                                    className="w-full"
                                                />
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
                            </div>
                        </CardContent>
                    </Card>

                    {/* Store Information */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Store Information</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
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
                                                    readOnly={isReadOnly}
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
                                                <Input
                                                    {...field}
                                                    readOnly={isReadOnly}
                                                />
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
                                                    readOnly={isReadOnly}
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
                                                <Input
                                                    {...field}
                                                    readOnly={isReadOnly}
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={form.control}
                                    name="info.itemCount"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Item Count</FormLabel>
                                            <FormControl>
                                                <Input
                                                    type="number"
                                                    {...field}
                                                    readOnly={isReadOnly}
                                                    onChange={(e) => field.onChange(Number(e.target.value))}
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={form.control}
                                    name="info.lastCount"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Last Count</FormLabel>
                                            <FormControl>
                                                <Input
                                                    {...field}
                                                    readOnly={isReadOnly}
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>
                        </CardContent>
                    </Card>

                    {/* Users Management */}
                    {!isReadOnly && (
                        <Card>
                            <CardHeader>
                                <CardTitle>Users Management</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-6">
                                {/* Add Users */}
                                <div>
                                    <div className="flex items-center justify-between mb-3">
                                        <Label className="text-base font-medium">Add Users</Label>
                                        <Button
                                            type="button"
                                            variant="outline"
                                            size="sm"
                                            onClick={() => appendAddUser({ id: "" })}
                                        >
                                            <Plus className="w-4 h-4 mr-2" />
                                            Add User
                                        </Button>
                                    </div>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                        {addUserFields.map((field, index) => (
                                            <div key={field.id} className="flex gap-2">
                                                <FormField
                                                    control={form.control}
                                                    name={`users.add.${index}.id`}
                                                    render={({ field: inputField }) => (
                                                        <FormItem className="flex-1">
                                                            <FormControl>
                                                                <Input
                                                                    placeholder="User UUID"
                                                                    {...inputField}
                                                                />
                                                            </FormControl>
                                                            <FormMessage />
                                                        </FormItem>
                                                    )}
                                                />
                                                {addUserFields.length > 1 && (
                                                    <Button
                                                        type="button"
                                                        variant="outline"
                                                        size="sm"
                                                        onClick={() => removeAddUser(index)}
                                                    >
                                                        <Minus className="w-4 h-4" />
                                                    </Button>
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                <Separator />

                                {/* Remove Users */}
                                <div>
                                    <div className="flex items-center justify-between mb-3">
                                        <Label className="text-base font-medium">Remove Users</Label>
                                        <Button
                                            type="button"
                                            variant="outline"
                                            size="sm"
                                            onClick={() => appendRemoveUser({ id: "" })}
                                        >
                                            <Plus className="w-4 h-4 mr-2" />
                                            Add User to Remove
                                        </Button>
                                    </div>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                        {removeUserFields.map((field, index) => (
                                            <div key={field.id} className="flex gap-2">
                                                <FormField
                                                    control={form.control}
                                                    name={`users.remove.${index}.id`}
                                                    render={({ field: inputField }) => (
                                                        <FormItem className="flex-1">
                                                            <FormControl>
                                                                <Input
                                                                    placeholder="User UUID"
                                                                    {...inputField}
                                                                />
                                                            </FormControl>
                                                            <FormMessage />
                                                        </FormItem>
                                                    )}
                                                />
                                                <Button
                                                    type="button"
                                                    variant="outline"
                                                    size="sm"
                                                    onClick={() => removeRemoveUser(index)}
                                                >
                                                    <Minus className="w-4 h-4" />
                                                </Button>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    )}

                    {/* View Mode - Display Users */}
                    {isReadOnly && (transformedInitialData?.users?.add?.length || transformedInitialData?.users?.remove?.length) && (
                        <Card>
                            <CardHeader>
                                <CardTitle>Users</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                {transformedInitialData?.users?.add && transformedInitialData.users.add.length > 0 && (
                                    <div>
                                        <Label className="text-base font-medium">Users</Label>
                                        <div className="mt-2 grid grid-cols-1 md:grid-cols-2 gap-2">
                                            {transformedInitialData.users.add.map((user: { id: string }, index: number) => (
                                                <div key={index} className="p-2 border rounded">
                                                    {user.id}
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {transformedInitialData?.users?.remove && transformedInitialData.users.remove.length > 0 && (
                                    <div>
                                        <Label className="text-base font-medium">Users to Remove</Label>
                                        <div className="mt-2 grid grid-cols-1 md:grid-cols-2 gap-2">
                                            {transformedInitialData.users.remove.map((user: { id: string }, index: number) => (
                                                <div key={index} className="p-2 border rounded">
                                                    {user.id}
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    )}

                    {/* Form Actions */}
                    {!isReadOnly && (
                        <div className="flex justify-end gap-3">
                            <Button type="button" variant="outline">
                                Cancel
                            </Button>
                            <Button type="submit">
                                {isCreate ? "Create" : "Update"} Store Location
                            </Button>
                        </div>
                    )}
                </form>
            </Form>

            {/* Debug Information */}
            {initialData && (
                <Card>
                    <CardHeader>
                        <CardTitle>Debug Information</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <pre className="text-xs overflow-auto">
                            {JSON.stringify(initialData, null, 2)}
                        </pre>
                    </CardContent>
                </Card>
            )}
        </div>
    );
}