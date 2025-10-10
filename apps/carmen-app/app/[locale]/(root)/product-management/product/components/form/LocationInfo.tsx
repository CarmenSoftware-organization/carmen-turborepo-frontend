import { Control, useFieldArray, useFormContext } from "react-hook-form";
import { formType } from "@/dtos/form.dto";
import { ProductFormValues } from "../../pd-schema";
import { FormField, FormItem, FormControl } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Plus, Trash2 } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useLocationsQuery } from "@/hooks/useLocation";
import { TableBodySkeleton } from "@/components/loading/TableBodySkeleton";
import { useAuth } from "@/context/AuthContext";
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
import { useTranslations } from "next-intl";
import { Card } from "@/components/ui/card";
import { INVENTORY_TYPE } from "@/constants/enum";
import { StatusCustom } from "@/components/ui-custom/StatusCustom";
import { useMemo, useCallback } from "react";

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

interface LocationDisplayData extends LocationData {
    isNew: boolean;
    fieldIndex?: number;
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
    const tProducts = useTranslations("Products");
    const tStoreLocation = useTranslations("StoreLocation");
    const tCommon = useTranslations("Common");
    const { token, buCode } = useAuth();
    const { data: locationsData, isLoading } = useLocationsQuery({ token, buCode });
    const { watch } = useFormContext<ProductFormValues>();
    const locations = watch("locations") as LocationsFormData;
    const newLocations = watch("locations.add") || [];

    const storeLocations = useMemo(() => locationsData?.data || [], [locationsData?.data]);
    const existingLocations = useMemo(() => locations?.data || [], [locations?.data]);
    const removedLocations = useMemo(() => watch("locations.remove") || [], [watch]);

    const { fields: locationFields, append: appendLocation, remove: removeLocation } = useFieldArray({
        control,
        name: "locations.add"
    });

    const { append: appendLocationRemove } = useFieldArray({
        control,
        name: "locations.remove"
    });

    const filteredStoreLocationsByProduct = useMemo(() => {
        if (!productData) return storeLocations;

        return storeLocations.filter((location: StoreLocation) => {
            if (productData.category.name === "Fixed Assets") {
                return location.location_type.toLowerCase() === 'inventory';
            }
            if (productData.is_used_in_recipe) {
                return location.location_type.toLowerCase() === 'inventory';
            }
            if (productData.is_sold_directly) {
                return ['direct', 'consignment', 'inventory'].includes(location.location_type.toLowerCase());
            }
            return location.is_active;
        });
    }, [productData, storeLocations]);

    const displayLocations = useMemo(() =>
        existingLocations.filter(
            (location: LocationData) => !removedLocations.some((removed: { id: string }) => removed.id === location.id)
        ),
        [existingLocations, removedLocations]
    );

    const hasLocations = displayLocations.length > 0 || newLocations.length > 0;

    const filteredStoreLocations = useMemo(() =>
        filteredStoreLocationsByProduct.filter(
            (location: StoreLocation) => !existingLocations.some((existing: LocationData) => existing.location_id === location.id)
        ),
        [filteredStoreLocationsByProduct, existingLocations]
    );

    const getLocationType = useCallback((location_type?: INVENTORY_TYPE) => {
        if (location_type === INVENTORY_TYPE.DIRECT) {
            return tStoreLocation("direct");
        } else if (location_type === INVENTORY_TYPE.CONSIGNMENT) {
            return tStoreLocation("consignment");
        }
        return tStoreLocation("inventory");
    }, [tStoreLocation]);

    // Merge into one list for display only
    const allLocations: LocationDisplayData[] = [
        ...displayLocations.map((loc: LocationData) => ({ ...loc, isNew: false })),
        ...locationFields.map((field, index) => ({
            ...newLocations[index],
            id: field.id,
            isNew: true,
            fieldIndex: index
        }))
    ];

    return (
        <Card className="p-4 space-y-4">
            <div className="flex justify-between items-center">
                <h2 className="text-lg font-semibold">{tProducts("location")}</h2>
                {currentMode !== formType.VIEW && (
                    <Button
                        type="button"
                        variant="outlinePrimary"
                        size="sm"
                        onClick={() => appendLocation({ location_id: "" })}
                        disabled={isLoading}
                    >
                        <Plus />
                        {tProducts("add_locations")}
                    </Button>
                )}
            </div>

            {(hasLocations || isLoading) && (
                <div className="max-h-96 overflow-auto rounded-md">
                    <Table>
                        <TableHeader className="sticky top-0 bg-background z-10">
                            <TableRow>
                                <TableHead>{tProducts("location_name")}</TableHead>
                                <TableHead>{tProducts("type")}</TableHead>
                                <TableHead>{tProducts("description")}</TableHead>
                                <TableHead>{tProducts("delivery_point")}</TableHead>
                                <TableHead className="text-center">{tProducts("status")}</TableHead>
                                {currentMode !== formType.VIEW && (
                                    <TableHead className="text-right">{tProducts("action")}</TableHead>
                                )}
                            </TableRow>
                        </TableHeader>

                        {isLoading ? (
                            <TableBodySkeleton rows={currentMode !== formType.VIEW ? 6 : 5} />
                        ) : (
                            <TableBody>
                                {allLocations.map((location, idx) => {
                                    const storeLocation = storeLocations.find(
                                        (loc: StoreLocation) => loc.id === location.location_id
                                    ) as StoreLocation | undefined;

                                    return (
                                        <TableRow key={location.id || `new-${idx}`}>
                                            {/* Location name */}
                                            <TableCell className="font-medium">
                                                {location.isNew && currentMode !== formType.VIEW ? (
                                                    <FormField
                                                        control={control}
                                                        name={`locations.add.${location.fieldIndex!}.location_id`}
                                                        render={({ field }) => (
                                                            <FormItem className="flex-1 space-y-0">
                                                                <FormControl>
                                                                    <Select
                                                                        onValueChange={field.onChange}
                                                                        value={field.value}
                                                                    >
                                                                        <SelectTrigger>
                                                                            <SelectValue placeholder="Select location" />
                                                                        </SelectTrigger>
                                                                        <SelectContent>
                                                                            {filteredStoreLocations.length === 0 ? (
                                                                                <div className="flex items-center justify-center py-2 text-sm text-gray-500">
                                                                                    No locations available
                                                                                </div>
                                                                            ) : (
                                                                                filteredStoreLocations.map((loc: StoreLocation) => (
                                                                                    <SelectItem
                                                                                        key={loc.id}
                                                                                        value={loc.id?.toString() ?? ""}
                                                                                    >
                                                                                        {loc.name}
                                                                                    </SelectItem>
                                                                                ))
                                                                            )}
                                                                        </SelectContent>
                                                                    </Select>
                                                                </FormControl>
                                                            </FormItem>
                                                        )}
                                                    />
                                                ) : (
                                                    storeLocation?.name ?? "Unknown Location"
                                                )}
                                            </TableCell>

                                            {/* Type */}
                                            <TableCell>
                                                <p className="text-xs md:text-base">
                                                    {getLocationType(storeLocation?.location_type as INVENTORY_TYPE)}
                                                </p>
                                            </TableCell>

                                            {/* Description */}
                                            <TableCell className="text-gray-500">
                                                {storeLocation?.description || "-"}
                                            </TableCell>

                                            {/* Delivery Point */}
                                            <TableCell className="text-gray-500">
                                                {storeLocation?.delivery_point?.name || "-"}
                                            </TableCell>

                                            {/* Status */}
                                            <TableCell>
                                                <div className="flex justify-center">
                                                    <StatusCustom is_active={!!storeLocation?.is_active}>
                                                        {storeLocation?.is_active ? tCommon("active") : tCommon("inactive")}
                                                    </StatusCustom>
                                                </div>
                                            </TableCell>

                                            {/* Actions */}
                                            {currentMode !== formType.VIEW && (
                                                <TableCell className="text-right">
                                                    {location.isNew ? (
                                                        <Button
                                                            type="button"
                                                            variant="ghost"
                                                            size="icon"
                                                            onClick={() => removeLocation(location.fieldIndex!)}
                                                            className="hover:text-destructive hover:bg-transparent"
                                                        >
                                                            <Trash2 className="h-4 w-4" />
                                                        </Button>
                                                    ) : (
                                                        <AlertDialog>
                                                            <AlertDialogTrigger asChild>
                                                                <Button
                                                                    type="button"
                                                                    variant="ghost"
                                                                    size="sm"
                                                                    className="hover:text-destructive hover:bg-transparent"
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
                                                    )}
                                                </TableCell>
                                            )}
                                        </TableRow>
                                    );
                                })}
                            </TableBody>
                        )}
                    </Table>
                </div>
            )}
        </Card>
    );
}

