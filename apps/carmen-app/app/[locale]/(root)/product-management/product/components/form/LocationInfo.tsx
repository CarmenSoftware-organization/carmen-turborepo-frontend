import { Control, useFieldArray, useFormContext } from "react-hook-form";
import { formType } from "@/dtos/form.dto";
import { ProductFormValues } from "../../pd-schema";
import { FormField, FormItem, FormControl } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Plus, Trash } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useStoreLocation } from "@/hooks/useStoreLocation";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { TableBodySkeleton } from "@/components/loading/TableBodySkeleton";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

interface LocationInfoProps {
    readonly control: Control<ProductFormValues>;
    readonly currentMode: formType;
    readonly productData?: {
        id: string;
        product_subcategory_id: string;
        code: string;
        name: string;
        description: string | null;
        price_deviation_limit: number;
        qty_deviation_limit: number;
        is_used_in_recipe: boolean;
        is_sold_directly: boolean;
        is_active: boolean;
        note: string | null;
        info: string | null;
        dimension: string | null;
        created_at: string;
        created_by_id: string;
        updated_at: string;
        updated_by_id: string | null;
        deleted_at: string | null;
        deleted_by_id: string | null;
        sub_category: {
            id: string;
            code: string;
            name: string;
        };
        category: {
            id: string;
            code: string;
            name: string;
        };
    };
}

interface LocationData {
    id: string;
    location_id: string;
}

interface LocationsFormData {
    data: LocationData[];
    add: { location_id: string }[];
    remove: { id: string }[];
}

interface StoreLocation {
    id: string;
    name: string;
    location_type: string;
    description: string;
    is_active: boolean;
    delivery_point: {
        id: string;
        name: string;
        is_active: boolean;
    };
}

export default function LocationInfo({ control, currentMode, productData }: LocationInfoProps) {
    const { storeLocations, isLoading } = useStoreLocation();
    const { watch } = useFormContext<ProductFormValues>();
    const locations = watch("locations") as LocationsFormData;
    const existingLocations = locations?.data || [];
    const newLocations = watch("locations.add") || [];
    const removedLocations = watch("locations.remove") || [];

    const { fields: locationFields, append: appendLocation, remove: removeLocation } = useFieldArray({
        control,
        name: "locations.add"
    });

    const { append: appendLocationRemove } = useFieldArray({
        control,
        name: "locations.remove"
    });

    const getLocationTypeColor = (type: string) => {
        switch (type.toLowerCase()) {
            case 'inventory':
                return 'bg-blue-100 text-blue-800';
            case 'direct':
                return 'bg-green-100 text-green-800';
            case 'consignment':
                return 'bg-purple-100 text-purple-800';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    };

    // Filter store locations based on product data criteria
    const getFilteredStoreLocationsByProduct = () => {
        if (!productData) return storeLocations;

        return storeLocations.filter(location => {
            // กรองตาม category - Fixed Assets ควรใช้ location_type = 'inventory'
            if (productData.category.name === "Fixed Assets") {
                return location.location_type.toLowerCase() === 'inventory';
            }

            // กรองตาม is_used_in_recipe - ถ้าใช้ใน recipe ควรเป็น inventory
            if (productData.is_used_in_recipe) {
                return location.location_type.toLowerCase() === 'inventory';
            }

            // กรองตาม is_sold_directly - ถ้าขายตรงอาจใช้ direct หรือ consignment
            if (productData.is_sold_directly) {
                return ['direct', 'consignment', 'inventory'].includes(location.location_type.toLowerCase());
            }

            // Default: แสดงทุก location ที่ active
            return location.is_active;
        });
    };

    // Filter out removed locations
    const displayLocations = existingLocations.filter(
        location => !removedLocations.some(removed => removed.id === location.id)
    );

    const hasLocations = displayLocations.length > 0 || newLocations.length > 0;

    // Apply product-based filtering and exclude existing locations
    const filteredStoreLocations = getFilteredStoreLocationsByProduct().filter(
        location => !existingLocations.some(existing => existing.location_id === location.id)
    );

    return (
        <div className="rounded-lg border p-4 space-y-4">
            <div className="flex justify-between items-center">
                <h2 className="text-lg font-semibold">Locations</h2>
                {currentMode !== formType.VIEW && (
                    <Button
                        type="button"
                        variant="default"
                        size="sm"
                        onClick={() => appendLocation({ location_id: "" })}
                        disabled={isLoading}
                    >
                        <Plus />
                        Add Location
                    </Button>
                )}
            </div>

            {/* Locations Table */}
            {(hasLocations || isLoading) && (
                <div className="border rounded-md">
                    <Table>
                        <TableHeader className="sticky top-0 bg-background z-10">
                            <TableRow>
                                <TableHead>Location Name</TableHead>
                                <TableHead>Type</TableHead>
                                <TableHead>Description</TableHead>
                                <TableHead>Delivery Point</TableHead>
                                <TableHead>Status</TableHead>
                                {currentMode !== formType.VIEW && (
                                    <TableHead>Action</TableHead>
                                )}
                            </TableRow>
                        </TableHeader>
                        {isLoading ? (
                            <TableBodySkeleton rows={currentMode !== formType.VIEW ? 6 : 5} />
                        ) : (
                            <TableBody>
                                {displayLocations.map((location) => {
                                    const storeLocation = storeLocations.find(loc => loc.id === location.location_id) as StoreLocation;

                                    return (
                                        <TableRow key={location.id}>
                                            <TableCell className="font-medium">
                                                {storeLocation?.name ?? "Unknown Location"}
                                            </TableCell>
                                            <TableCell>
                                                <Badge
                                                    variant="secondary"
                                                    className={getLocationTypeColor(storeLocation?.location_type ?? '')}
                                                >
                                                    {storeLocation?.location_type ?? 'Unknown Type'}
                                                </Badge>
                                            </TableCell>
                                            <TableCell className="text-gray-500">
                                                {storeLocation?.description || '-'}
                                            </TableCell>
                                            <TableCell className="text-gray-500">
                                                {storeLocation?.delivery_point?.name || '-'}
                                            </TableCell>
                                            <TableCell>
                                                <Badge variant="secondary" className={storeLocation?.is_active ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}>
                                                    {storeLocation?.is_active ? 'Active' : 'Inactive'}
                                                </Badge>
                                            </TableCell>
                                            {currentMode !== formType.VIEW && (
                                                <TableCell>
                                                    <AlertDialog>
                                                        <AlertDialogTrigger asChild>
                                                            <Button
                                                                type="button"
                                                                variant="ghost"
                                                                size="sm"
                                                                className="text-destructive"
                                                            >
                                                                <Trash className="h-4 w-4" />
                                                            </Button>
                                                        </AlertDialogTrigger>
                                                        <AlertDialogContent>
                                                            <AlertDialogHeader>
                                                                <AlertDialogTitle>Remove Location</AlertDialogTitle>
                                                                <AlertDialogDescription className="space-y-2">
                                                                    <p>Are you sure you want to remove this location?</p>
                                                                    <div className="mt-2 p-3 bg-gray-50 rounded-md space-y-1">
                                                                        <p><span className="font-semibold">Location ID:</span> {location.id}</p>
                                                                        <p><span className="font-semibold">Name:</span> {storeLocation?.name}</p>
                                                                        <p><span className="font-semibold">Type:</span> {storeLocation?.location_type}</p>
                                                                    </div>
                                                                </AlertDialogDescription>
                                                            </AlertDialogHeader>
                                                            <AlertDialogFooter>
                                                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                                                <AlertDialogAction
                                                                    onClick={() => appendLocationRemove({ id: location.id })}
                                                                >
                                                                    Remove
                                                                </AlertDialogAction>
                                                            </AlertDialogFooter>
                                                        </AlertDialogContent>
                                                    </AlertDialog>
                                                </TableCell>
                                            )}
                                        </TableRow>
                                    );
                                })}
                                {locationFields.map((field, index) => {
                                    const selectedLocationId = watch(`locations.add.${index}.location_id`);
                                    const storeLocation = storeLocations.find(loc => loc.id === selectedLocationId) as StoreLocation;

                                    return (
                                        <TableRow key={field.id}>
                                            <ScrollArea className="w-full h-[100px]">
                                                <TableCell className="font-medium">
                                                    <FormField
                                                        control={control}
                                                        name={`locations.add.${index}.location_id`}
                                                        render={({ field }) => (
                                                            <FormItem className="flex-1 space-y-0">
                                                                <FormControl>
                                                                    <Select onValueChange={field.onChange} value={field.value} disabled={currentMode === formType.VIEW}>
                                                                        <SelectTrigger>
                                                                            <SelectValue placeholder="Select location" />
                                                                        </SelectTrigger>
                                                                        <SelectContent>
                                                                            {filteredStoreLocations.length === 0 ? (
                                                                                <div className="flex items-center justify-center py-2 text-sm text-gray-500">
                                                                                    No locations available
                                                                                </div>
                                                                            ) : filteredStoreLocations.map((location) => (
                                                                                <SelectItem
                                                                                    key={location.id}
                                                                                    value={location.id?.toString() ?? ""}
                                                                                >
                                                                                    {location.name}
                                                                                </SelectItem>
                                                                            ))}
                                                                        </SelectContent>
                                                                    </Select>
                                                                </FormControl>
                                                            </FormItem>
                                                        )}
                                                    />
                                                </TableCell>
                                                <TableCell>
                                                    <Badge
                                                        variant="secondary"
                                                        className={getLocationTypeColor(storeLocation?.location_type ?? '')}
                                                    >
                                                        {storeLocation?.location_type ?? 'Select Location'}
                                                    </Badge>
                                                </TableCell>
                                                <TableCell className="text-gray-500">
                                                    {storeLocation?.description || '-'}
                                                </TableCell>
                                                <TableCell className="text-gray-500">
                                                    {storeLocation?.delivery_point?.name || '-'}
                                                </TableCell>
                                                <TableCell>
                                                    <Badge variant="secondary" className={storeLocation?.is_active ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}>
                                                        {storeLocation?.is_active ? 'Active' : 'Inactive'}
                                                    </Badge>
                                                </TableCell>
                                                {currentMode !== formType.VIEW && (
                                                    <TableCell>
                                                        <Button
                                                            type="button"
                                                            variant="ghost"
                                                            size="icon"
                                                            onClick={() => removeLocation(index)}
                                                            className="h-6 w-6 text-destructive hover:text-destructive/80"
                                                        >
                                                            <Trash className="h-4 w-4" />
                                                        </Button>
                                                    </TableCell>
                                                )}
                                            </ScrollArea>

                                        </TableRow>
                                    );
                                })}
                            </TableBody>
                        )}
                    </Table>
                </div>
            )}
        </div>
    );
}
