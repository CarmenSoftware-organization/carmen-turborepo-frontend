import { formType } from "@/dtos/form.dto";
import { ProductFormValues } from "./ProductDetail";
import { Control, useFieldArray, useWatch } from "react-hook-form";
import { Card } from "@/components/ui/card";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Plus, Trash } from "lucide-react";
import { FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useState } from "react";
import DeleteConfirmDialog from "@/components/ui-custom/DeleteConfirmDialog";
import { StoreLocationDto } from "@/dtos/config.dto";
import { Badge } from "@/components/ui/badge";

interface Location {
    id: string;
    location_id: string;
    location_name: string;
}

interface ProductFormFieldsProps {
    control: Control<ProductFormValues>;
    currentMode: formType;
    initValues?: Location[];
    storeLocations?: StoreLocationDto[];
}

export const LocationInfo = ({ control, currentMode, initValues, storeLocations }: ProductFormFieldsProps) => {
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [locationToDelete, setLocationToDelete] = useState<{ index: number; isEdit: boolean } | null>(null);

    const { fields: removeFields, replace: replaceRemove } = useFieldArray({
        control,
        name: "locations.remove",
    });

    const { fields: addFields, append, remove } = useFieldArray({
        control,
        name: "locations.add",
    });

    // Watch for changes in the add locations array
    const addLocations = useWatch({
        control,
        name: "locations.add",
    });

    const handleAddLocation = (e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault();
        e.stopPropagation();
        append({
            location_id: ""
        });
    };

    const handleRemoveLocation = (e: React.MouseEvent<HTMLButtonElement>, index: number, isEdit: boolean = false) => {
        e.preventDefault();
        e.stopPropagation();
        setLocationToDelete({ index, isEdit });
        setDeleteDialogOpen(true);
    };

    const handleConfirmDelete = () => {
        if (!locationToDelete) return;

        const { index, isEdit } = locationToDelete;
        if (isEdit && initValues) {
            const locationToRemove = initValues[index];
            // Add to remove array
            const currentRemove = removeFields.map(field => field.location_id);
            if (!currentRemove.includes(locationToRemove.location_id)) {
                replaceRemove([...currentRemove.map(id => ({ location_id: id })), { location_id: locationToRemove.location_id }]);
            }
            // Update initValues to remove the deleted location
            if (initValues) {
                initValues.splice(index, 1);
            }
        } else {
            // Remove from add array
            remove(index);
        }
        setDeleteDialogOpen(false);
        setLocationToDelete(null);
    };

    const handleDialogOpenChange = (open: boolean) => {
        setDeleteDialogOpen(open);
        if (!open) {
            setLocationToDelete(null);
        }
    };

    const handleLocationChange = (value: string, index: number) => {
        const location = storeLocations?.find(loc => loc.id === value);
        if (location) {
            // Update the form state with the selected location's details
            control._formValues.locations.add[index] = {
                location_id: value,
                location_name: location.name,
                location_type: location.location_type,
                delivery_point: location.delivery_point,
                is_active: location.is_active
            };
        }
    };

    // Function to calculate locations to display
    const calculateLocationsToDisplay = () => {
        if (currentMode === formType.VIEW) {
            return initValues ?? [];
        }
        return initValues?.filter((location) =>
            !removeFields.some(removeField => removeField.location_id === location.location_id)
        ) ?? [];
    };

    // คำนวณข้อมูลที่จะแสดงบน UI
    const locationsToDisplay = calculateLocationsToDisplay();

    // Function to get location name for display
    const getLocationName = (location: any) => {
        // First check if location has its own location_name
        if (location.location_name) {
            return location.location_name;
        }
        // Otherwise look up from storeLocations
        return storeLocations?.find(loc => loc.id === location.location_id)?.name ?? '';
    };

    // Function to get location by id
    const getLocationById = (locationId: string) => {
        return storeLocations?.find(loc => loc.id === locationId);
    };

    return (
        <Card className="p-4">
            <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold">Locations</h3>
                <Button
                    variant="outline"
                    size="sm"
                    onClick={handleAddLocation}
                    className="flex items-center gap-2"
                    disabled={currentMode === formType.VIEW}
                >
                    <Plus className="h-4 w-4" />
                    Add Location
                </Button>
            </div>

            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Name</TableHead>
                        <TableHead>Type</TableHead>
                        <TableHead>Delivery Point</TableHead>
                        <TableHead>Status</TableHead>
                        {(currentMode === formType.EDIT || currentMode === formType.ADD) && <TableHead>Actions</TableHead>}
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {/* แสดงข้อความเมื่อไม่มีข้อมูลทั้ง locationsToDisplay และ addFields */}
                    {(locationsToDisplay.length === 0 && addFields.length === 0) ? (
                        <TableRow>
                            <TableCell colSpan={5} className="text-center text-muted-foreground">No locations added</TableCell>
                        </TableRow>
                    ) : (
                        <>
                            {/* แสดงข้อมูลจาก initValues */}
                            {locationsToDisplay.map((location, index: number) => {
                                const locationData = getLocationById(location.location_id);
                                return (
                                    <TableRow key={location.id || `edit-${index}`}>
                                        <TableCell>
                                            {getLocationName(location)}
                                        </TableCell>
                                        <TableCell>
                                            <Badge variant={'default'}>
                                                {locationData?.location_type.toUpperCase() ?? '-'}
                                            </Badge>
                                        </TableCell>
                                        <TableCell>
                                            {locationData?.delivery_point?.name ?? '-'}
                                        </TableCell>
                                        <TableCell>
                                            <Badge variant={locationData?.is_active ? "default" : "destructive"}>
                                                {locationData?.is_active ? 'Active' : 'Inactive'}
                                            </Badge>
                                        </TableCell>
                                        {(currentMode === formType.EDIT || currentMode === formType.ADD) && (
                                            <TableCell>
                                                <Button
                                                    type="button"
                                                    variant="ghost"
                                                    size="sm"
                                                    className="text-destructive"
                                                    onClick={(e) => handleRemoveLocation(e, index, true)}
                                                >
                                                    <Trash className="h-4 w-4" />
                                                </Button>
                                            </TableCell>
                                        )}
                                    </TableRow>
                                )
                            })}

                            {/* แสดงข้อมูลที่กำลังเพิ่มใหม่เฉพาะในโหมด EDIT หรือ ADD */}
                            {(currentMode === formType.EDIT || currentMode === formType.ADD) && addFields.map((field, index) => {
                                const locationData = getLocationById(field.location_id);
                                return (
                                    <TableRow key={field.id || `add-${index}`}>
                                        <TableCell>
                                            <FormField
                                                control={control}
                                                name={`locations.add.${index}.location_id`}
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <FormControl>
                                                            <Select
                                                                onValueChange={(value) => {
                                                                    field.onChange(value);
                                                                    handleLocationChange(value, index);
                                                                }}
                                                                value={field.value}
                                                            >
                                                                <SelectTrigger>
                                                                    <SelectValue placeholder="Please select location">
                                                                        {storeLocations?.find(loc => loc.id === field.value)?.name}
                                                                    </SelectValue>
                                                                </SelectTrigger>
                                                                <SelectContent>
                                                                    {storeLocations?.map((location) => (
                                                                        <SelectItem
                                                                            key={location.id}
                                                                            value={location.id ?? ""}
                                                                        >
                                                                            {location.name}
                                                                        </SelectItem>
                                                                    ))}
                                                                </SelectContent>
                                                            </Select>
                                                        </FormControl>
                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />
                                        </TableCell>
                                        <TableCell>
                                            <Badge variant={'default'}>
                                                {locationData?.location_type ?? '-'}
                                            </Badge>
                                        </TableCell>
                                        <TableCell>
                                            {locationData?.delivery_point?.name ?? '-'}
                                        </TableCell>
                                        <TableCell>
                                            <Badge variant={locationData?.is_active ? "default" : "secondary"}>
                                                {locationData?.is_active ? 'Active' : 'Inactive'}
                                            </Badge>
                                        </TableCell>
                                        <TableCell>
                                            <Button
                                                type="button"
                                                variant="ghost"
                                                size="sm"
                                                onClick={(e) => handleRemoveLocation(e, index)}
                                            >
                                                <Trash className="h-4 w-4 text-destructive" />
                                            </Button>
                                        </TableCell>
                                    </TableRow>
                                )
                            })}
                        </>
                    )}
                </TableBody>
            </Table>

            <DeleteConfirmDialog
                open={deleteDialogOpen}
                onOpenChange={handleDialogOpenChange}
                onConfirm={handleConfirmDelete}
                title="Delete Location"
                description="Are you sure you want to delete this location?"
            />
        </Card>
    );
};
