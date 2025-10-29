"use client";

import { Control, useFieldArray, useWatch } from "react-hook-form";
import { formType } from "@/dtos/form.dto";
import { FormField, FormItem, FormControl } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Plus, Trash2 } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useLocationsQuery } from "@/hooks/use-locations";
import { useAuth } from "@/context/AuthContext";
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
import { useMemo, useCallback, useState } from "react";
import {
    ColumnDef,
    getCoreRowModel,
    useReactTable,
} from "@tanstack/react-table";
import { DataGrid, DataGridContainer } from "@/components/ui/data-grid";
import { DataGridTable } from "@/components/ui/data-grid-table";
import { DataGridColumnHeader } from "@/components/ui/data-grid-column-header";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import SearchInput from "@/components/ui-custom/SearchInput";
import { Link } from "@/lib/navigation";
import { ProductFormValues } from "@/dtos/product.dto";
import { useRowBgClass } from "../../_hooks/use-row-bg-class";

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
    const [searchQuery, setSearchQuery] = useState("");

    // Use useWatch instead of watch() to prevent infinite re-renders
    const locations = useWatch({
        control,
        name: "locations"
    }) as LocationsFormData | undefined;

    const storeLocations = useMemo(() => locationsData?.data || [], [locationsData?.data]);

    // Create lookup map for O(1) access instead of O(n) find operations
    const storeLocationsMap = useMemo(() => {
        const map = new Map<string, StoreLocation>();
        for (const loc of storeLocations) {
            map.set(loc.id, loc);
        }
        return map;
    }, [storeLocations]);

    const existingLocations = useMemo(() => locations?.data || [], [locations?.data]);
    const newLocations = useMemo(() => locations?.add || [], [locations?.add]);
    const removedLocations = useMemo(() => locations?.remove || [], [locations?.remove]);

    const { fields: locationFields, prepend: prependLocation, remove: removeLocation } = useFieldArray({
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

    const removedLocationIds = useMemo(() => {
        const set = new Set<string>();
        for (const removed of removedLocations) {
            set.add(removed.id);
        }
        return set;
    }, [removedLocations]);

    const existingLocationIds = useMemo(() => {
        const set = new Set<string>();
        for (const location of existingLocations) {
            set.add(location.location_id);
        }
        return set;
    }, [existingLocations]);

    const displayLocations = useMemo(() =>
        existingLocations.filter(
            (location: LocationData) => !removedLocationIds.has(location.id)
        ),
        [existingLocations, removedLocationIds]
    );

    const hasLocations = displayLocations.length > 0 || newLocations.length > 0;

    const filteredStoreLocations = useMemo(() =>
        filteredStoreLocationsByProduct.filter(
            (location: StoreLocation) => !existingLocationIds.has(location.id)
        ),
        [filteredStoreLocationsByProduct, existingLocationIds]
    );

    const getLocationType = useCallback((location_type?: INVENTORY_TYPE) => {
        if (location_type === INVENTORY_TYPE.DIRECT) {
            return tStoreLocation("direct");
        } else if (location_type === INVENTORY_TYPE.CONSIGNMENT) {
            return tStoreLocation("consignment");
        }
        return tStoreLocation("inventory");
    }, [tStoreLocation]);

    const allLocations: LocationDisplayData[] = useMemo(() => [
        ...locationFields.map((field, index) => ({
            ...newLocations[index],
            id: field.id,
            isNew: true,
            fieldIndex: index
        })),
        ...displayLocations.map((loc: LocationData) => ({ ...loc, isNew: false }))
    ], [displayLocations, locationFields, newLocations]);

    const filteredLocations = useMemo(() => {
        if (!searchQuery.trim()) return allLocations;

        const query = searchQuery.toLowerCase();
        return allLocations.filter((location) => {
            const storeLocation = storeLocationsMap.get(location.location_id);
            if (!storeLocation) return false;

            const searchableFields = [
                storeLocation.name,
                storeLocation.description,
                storeLocation.delivery_point?.name,
                getLocationType(storeLocation.location_type as INVENTORY_TYPE),
            ].filter(Boolean);

            return searchableFields.some((field) =>
                field?.toLowerCase().includes(query)
            );
        });
    }, [allLocations, searchQuery, storeLocationsMap, getLocationType]);

    const getRowBgClass = useRowBgClass();

    const columns = useMemo<ColumnDef<LocationDisplayData>[]>(
        () => [
            {
                accessorKey: "location_id",
                header: ({ column }) => (
                    <DataGridColumnHeader
                        column={column}
                        title={tProducts("location_name")}
                    />
                ),
                cell: ({ row }) => {
                    const location = row.original;
                    const storeLocation = storeLocationsMap.get(location.location_id);

                    return (
                        <div className="font-medium">
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
                                                                {tStoreLocation("no_locations_available")}
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
                                <Link
                                    href={`/configuration/location/${storeLocation?.id}`}
                                    className="hover:underline text-xs">
                                    {storeLocation?.name || "-"}
                                </Link>
                            )}
                        </div>
                    );
                },
                enableSorting: false,
                size: 250,
                meta: {
                    cellClassName: (rowData: any) => rowData ? getRowBgClass(rowData) : '',
                },
            },
            {
                id: "type",
                header: ({ column }) => (
                    <DataGridColumnHeader
                        column={column}
                        title={tProducts("type")}
                    />
                ),
                cell: ({ row }) => {
                    const location = row.original;
                    const storeLocation = storeLocationsMap.get(location.location_id);

                    return (
                        <p className="text-xs">
                            {getLocationType(storeLocation?.location_type as INVENTORY_TYPE)}
                        </p>
                    );
                },
                enableSorting: false,
                size: 150,
                meta: {
                    cellClassName: (rowData: any) => rowData ? getRowBgClass(rowData) : '',
                },
            },
            {
                id: "description",
                header: ({ column }) => (
                    <DataGridColumnHeader
                        column={column}
                        title={tProducts("description")}
                    />
                ),
                cell: ({ row }) => {
                    const location = row.original;
                    const storeLocation = storeLocationsMap.get(location.location_id);

                    return (
                        <span className="truncate max-w-[200px] inline-block text-xs">
                            {storeLocation?.description || "-"}
                        </span>
                    );
                },
                enableSorting: false,
                size: 150,
                meta: {
                    cellClassName: (rowData: any) => rowData ? getRowBgClass(rowData) : '',
                },
            },
            {
                id: "delivery_point",
                header: ({ column }) => (
                    <DataGridColumnHeader
                        column={column}
                        title={tProducts("delivery_point")}
                    />
                ),
                cell: ({ row }) => {
                    const location = row.original;
                    const storeLocation = storeLocationsMap.get(location.location_id);

                    return (
                        <span className="text-xs">
                            {storeLocation?.delivery_point?.name || "-"}
                        </span>
                    );
                },
                enableSorting: false,
                size: 200,
                meta: {
                    cellClassName: (rowData: any) => rowData ? getRowBgClass(rowData) : '',
                },
            },
            {
                id: "status",
                header: ({ column }) => (
                    <DataGridColumnHeader
                        column={column}
                        title={tProducts("status")}
                    />
                ),
                cell: ({ row }) => {
                    const location = row.original;
                    const storeLocation = storeLocationsMap.get(location.location_id);

                    return (
                        <div className="flex justify-center">
                            <StatusCustom
                                is_active={!!storeLocation?.is_active}
                                dense={true}
                            >
                                {storeLocation?.is_active ? tCommon("active") : tCommon("inactive")}
                            </StatusCustom>
                        </div>
                    );
                },
                enableSorting: false,
                size: 120,
                meta: {
                    cellClassName: (rowData: any) => rowData ? `text-center ${getRowBgClass(rowData)}` : 'text-center',
                    headerClassName: "text-center",
                },
            },
            ...(currentMode !== formType.VIEW ? [{
                id: "action",
                header: () => (
                    <span className="text-muted-foreground text-[0.8rem]">{tProducts("action")}</span>
                ),
                cell: ({ row }: { row: { original: LocationDisplayData } }) => {
                    const location = row.original;
                    return (
                        <div className="text-right">
                            {location.isNew ? (
                                <Button
                                    type="button"
                                    variant="ghost"
                                    size="icon"
                                    onClick={() => removeLocation(location.fieldIndex!)}
                                    className="text-destructive hover:text-destructive/80 hover:bg-transparent h-7 w-7"
                                >
                                    <Trash2 className="h-4 w-4" />
                                </Button>
                            ) : (
                                <AlertDialog>
                                    <AlertDialogTrigger asChild>
                                        <Button
                                            type="button"
                                            variant="ghost"
                                            size="icon"
                                            className="text-destructive hover:text-destructive/80 hover:bg-transparent h-7 w-7"
                                        >
                                            <Trash2 className="h-4 w-4" />
                                        </Button>
                                    </AlertDialogTrigger>
                                    <AlertDialogContent>
                                        <AlertDialogHeader>
                                            <AlertDialogTitle>{tStoreLocation("del_location")}</AlertDialogTitle>
                                            <AlertDialogDescription className="space-y-2">
                                                {tStoreLocation("del_location_description")}
                                            </AlertDialogDescription>
                                        </AlertDialogHeader>
                                        <AlertDialogFooter>
                                            <AlertDialogCancel>{tCommon("cancel")}</AlertDialogCancel>
                                            <AlertDialogAction
                                                onClick={() => appendLocationRemove({ id: location.id })}
                                                className="bg-destructive hover:bg-destructive/90"
                                            >
                                                {tCommon("delete")}
                                            </AlertDialogAction>
                                        </AlertDialogFooter>
                                    </AlertDialogContent>
                                </AlertDialog>
                            )}
                        </div>
                    );
                },
                enableSorting: false,
                size: 100,
                meta: {
                    cellClassName: (rowData: any) => rowData ? `text-right ${getRowBgClass(rowData)}` : 'text-right',
                    headerClassName: "text-right",
                },
            }] : [])
        ],
        [tProducts, tCommon, storeLocationsMap, control, currentMode, filteredStoreLocations, getLocationType, removeLocation, appendLocationRemove, getRowBgClass]
    );

    const table = useReactTable({
        data: filteredLocations,
        columns,
        getRowId: (row) => row.id ?? "",
        state: {},
        getCoreRowModel: getCoreRowModel(),
    });

    return (
        <Card className="p-4 space-y-4">
            <div className="flex justify-between items-center">
                <div className="flex items-center gap-4">
                    <h2 className="text-base text-muted-foreground font-semibold whitespace-nowrap">{tProducts("location")}</h2>
                    <SearchInput
                        defaultValue={searchQuery}
                        onSearch={setSearchQuery}
                        placeholder={tCommon("search")}
                        inputClassName="h-7 text-xs"
                    />
                </div>

                {currentMode !== formType.VIEW && (
                    <TooltipProvider>
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <Button
                                    size="sm"
                                    className="w-6 h-6"
                                    onClick={(e?: React.MouseEvent<HTMLButtonElement>) => {
                                        if (e) {
                                            e.preventDefault();
                                            e.stopPropagation();
                                        }
                                        prependLocation({ location_id: "" });
                                    }}
                                    disabled={isLoading}
                                >
                                    <Plus />
                                </Button>
                            </TooltipTrigger>
                            <TooltipContent>
                                <p>{tProducts("add_locations")}</p>
                            </TooltipContent>
                        </Tooltip>
                    </TooltipProvider>
                )}
            </div>

            {(hasLocations || isLoading) && (
                <DataGrid
                    table={table}
                    recordCount={filteredLocations.length}
                    isLoading={isLoading}
                    loadingMode="skeleton"
                    emptyMessage={searchQuery.trim() ? tCommon("data_not_found") : tCommon("no_data")}
                    tableLayout={{
                        headerSticky: true,
                        dense: true,
                        rowBorder: true,
                        headerBackground: true,
                        headerBorder: true,
                    }}
                >
                    <div className="w-full">
                        <DataGridContainer>
                            <DataGridTable />
                        </DataGridContainer>
                    </div>
                </DataGrid>
            )}
        </Card>
    );
}
