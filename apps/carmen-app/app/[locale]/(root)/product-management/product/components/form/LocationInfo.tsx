import { Control, useFieldArray, useFormContext } from "react-hook-form";
import { formType } from "@/dtos/form.dto";
import { ProductFormValues } from "../../pd-schema";
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Plus, Trash2 } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useStoreLocation } from "@/hooks/useStoreLocation";
import { Badge } from "@/components/ui/badge";
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

export default function LocationInfo({ control, currentMode }: LocationInfoProps) {
    const { storeLocations } = useStoreLocation();
    const { watch } = useFormContext<ProductFormValues>();
    const locations = watch("locations") as LocationsFormData;
    const existingLocations = locations?.data || [];
    const newLocations = watch("locations.add") || [];
    const removedLocations = watch("locations.remove") || [];

    const { fields: locationFields, append: appendLocation, remove: removeLocation } = useFieldArray({
        control,
        name: "locations.add"
    });

    const { fields: locationRemoveFields, append: appendLocationRemove, remove: removeLocationRemove } = useFieldArray({
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

    // Filter out removed locations
    const displayLocations = existingLocations.filter(
        location => !removedLocations.some(removed => removed.id === location.id)
    );

    const hasLocations = displayLocations.length > 0 || newLocations.length > 0;

    return (
        <div className="rounded-lg border p-6 space-y-4">
            <div className="flex justify-between items-center">
                <h2 className="text-lg font-semibold">Locations</h2>
                <div className="space-x-2">
                    <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => appendLocation({ location_id: "" })}
                    >
                        <Plus className="h-4 w-4 mr-2" />
                        Add Location
                    </Button>
                </div>
            </div>

            {/* Locations Table */}
            {hasLocations && (
                <div className="rounded-md border">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Location Name</TableHead>
                                <TableHead>Type</TableHead>
                                <TableHead>Description</TableHead>
                                <TableHead>Delivery Point</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead>Action</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {/* Existing Locations */}
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
                                        <TableCell>
                                            <AlertDialog>
                                                <AlertDialogTrigger asChild>
                                                    <Button
                                                        type="button"
                                                        variant="ghost"
                                                        size="icon"
                                                    >
                                                        <Trash2 className="h-4 w-4" />
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
                                    </TableRow>
                                );
                            })}

                            {/* New Locations */}
                            {locationFields.map((field, index) => {
                                const selectedLocationId = watch(`locations.add.${index}.location_id`);
                                const storeLocation = storeLocations.find(loc => loc.id === selectedLocationId) as StoreLocation;

                                return (
                                    <TableRow key={field.id}>
                                        <TableCell className="font-medium">
                                            <FormField
                                                control={control}
                                                name={`locations.add.${index}.location_id`}
                                                render={({ field }) => (
                                                    <FormItem className="flex-1 space-y-0">
                                                        <FormControl>
                                                            <Select onValueChange={field.onChange} value={field.value}>
                                                                <SelectTrigger>
                                                                    <SelectValue placeholder="Select location" />
                                                                </SelectTrigger>
                                                                <SelectContent>
                                                                    {storeLocations.map((location) => (
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
                                        <TableCell>
                                            <Button
                                                type="button"
                                                variant="ghost"
                                                size="icon"
                                                onClick={() => removeLocation(index)}
                                            >
                                                <Trash2 className="h-4 w-4" />
                                            </Button>
                                        </TableCell>
                                    </TableRow>
                                );
                            })}
                        </TableBody>
                    </Table>
                </div>
            )}
        </div>
    );
}
