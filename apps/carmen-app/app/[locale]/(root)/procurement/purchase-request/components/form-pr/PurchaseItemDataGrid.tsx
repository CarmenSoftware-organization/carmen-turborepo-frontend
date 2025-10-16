"use client";

import { Button } from "@/components/ui/button";
import { formType } from "@/dtos/form.dto";
import { PurchaseRequestDetail } from "@/dtos/purchase-request.dto";
import { useState, useMemo, useEffect } from "react";
import { ChevronDown, ChevronRight, Plus, Trash2 } from "lucide-react";
import { formatDateFns, formatPriceConf } from "@/utils/config-system";
import { useAuth } from "@/context/AuthContext";
import { useOrderUnitByProduct } from "@/hooks/use-unit";
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import VendorComparison from "./VendorComparison";
import LocationLookup from "@/components/lookup/LocationLookup";
import ProductLocationLookup from "@/components/lookup/ProductLocationLookup";
import NumberInput from "@/components/form-custom/NumberInput";
import UnitLookup from "@/components/lookup/UnitLookup";
import { Separator } from "@/components/ui/separator";
import DateInput from "@/components/form-custom/DateInput";
import InventoryInfo from "./InventoryInfo";
import InventoryProgress from "./InventoryProgress";
import { DeliveryPointSelectLookup } from "@/components/lookup/DeliveryPointSelectLookup";
import { useTranslations } from "next-intl";
import {
    ColumnDef,
    getCoreRowModel,
    useReactTable,
    SortingState,
    getExpandedRowModel,
} from "@tanstack/react-table";
import { DataGrid, DataGridContainer } from "@/components/ui/data-grid";
import { DataGridTable, DataGridTableRowSelect, DataGridTableRowSelectAll } from "@/components/ui/data-grid-table";
import { DataGridColumnHeader } from "@/components/ui/data-grid-column-header";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import DeleteConfirmDialog from "@/components/DeleteConfirmDialog";

interface Props {
    currentFormType: formType;
    items: PurchaseRequestDetail[];
    initValues?: PurchaseRequestDetail[];
    addFields: unknown[];
    onItemUpdate: (itemId: string, fieldName: string, value: unknown, selectedProduct?: unknown) => void;
    onItemRemove: (itemId: string, isNewItem?: boolean, itemIndex?: number) => void;
    onAddItem: () => void;
    getItemValue: (item: PurchaseRequestDetail, fieldName: string) => unknown;
}

interface UnitOderProduct {
    id: string
    name: string
    conversion: number
}

export default function PurchaseItemDataGrid({
    currentFormType,
    items,
    initValues = [],
    addFields,
    onItemUpdate,
    onItemRemove,
    onAddItem,
    getItemValue
}: Props) {
    const { dateFormat, currencyBase, token, buCode } = useAuth();
    const tPr = useTranslations("PurchaseRequest");
    const tHeader = useTranslations("TableHeader");
    const tCommon = useTranslations("Common");

    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [itemToDelete, setItemToDelete] = useState<{ id: string; isAddItem: boolean; addIndex?: number } | null>(null);
    const [sorting, setSorting] = useState<SortingState>([]);
    const [selectedProductId, setSelectedProductId] = useState<string>("");
    const [selectedItemId, setSelectedItemId] = useState<string>("");

    const defaultAmount = { locales: 'en-US', minimumFractionDigits: 2 };

    const { data: orderUnitsData, isLoading: isLoadingOrderUnits } = useOrderUnitByProduct({
        token,
        buCode,
        productId: selectedProductId,
        enabled: !!selectedProductId
    });

    // Auto-set first unit when product is selected
    useEffect(() => {
        if (orderUnitsData && orderUnitsData.length > 0 && selectedItemId) {
            const firstUnit = orderUnitsData[0];
            const currentItem = items.find(item => item.id === selectedItemId);

            if (currentItem && !currentItem.requested_unit_id) {
                // Set both id and name
                onItemUpdate(currentItem.id, 'requested_unit_id', firstUnit.id);
                onItemUpdate(currentItem.id, 'requested_unit_name', firstUnit.name);
            }
        }
    }, [orderUnitsData, selectedItemId, items, onItemUpdate]);

    // Auto-init units for items with product but no unit (e.g., when adding new items)
    useEffect(() => {
        items.forEach((item) => {
            if (item.product_id && currentFormType !== formType.VIEW) {
                // Set selected product to trigger API call for fetching order units
                if (!item.requested_unit_id) {
                    setSelectedProductId(item.product_id);
                    setSelectedItemId(item.id);
                }
            }
        });
    }, [items, currentFormType]);

    const handleRemoveItemClick = (id: string, isNewItem: boolean = false, itemIndex?: number) => {
        setItemToDelete({ id, isAddItem: isNewItem, addIndex: itemIndex });
        setDeleteDialogOpen(true);
    };

    const handleConfirmDelete = () => {
        if (itemToDelete) {
            onItemRemove(itemToDelete.id, itemToDelete.isAddItem, itemToDelete.addIndex);
        }
        setDeleteDialogOpen(false);
        setItemToDelete(null);
    };


    // Define columns
    const columns = useMemo<ColumnDef<PurchaseRequestDetail>[]>(
        () => {
            const baseColumns: ColumnDef<PurchaseRequestDetail>[] = [
                {
                    id: "expander",
                    header: () => null,
                    cell: ({ row }) => {
                        return row.getCanExpand() ? (
                            <Button
                                onClick={row.getToggleExpandedHandler()}
                                variant={'outline'}
                                size={'sm'}
                                className="w-4 h-7"
                            >
                                {row.getIsExpanded() ? (
                                    <ChevronDown className="h-3 w-3" />
                                ) : (
                                    <ChevronRight className="h-3 w-3" />
                                )}
                            </Button>
                        ) : null;
                    },
                    size: currentFormType === formType.VIEW ? 1 : 40,
                    enableSorting: false,
                    meta: {
                        expandedContent: (item: PurchaseRequestDetail) => (
                            <Card className="m-2 rounded-md">
                                <Accordion type="single" collapsible defaultValue="item-1">
                                    <AccordionItem value="item-1">
                                        <div className="flex items-center justify-between border-b border-border">
                                            <AccordionTrigger iconPosition="left" className="px-2">
                                                <h4 className="font-semibold text-xs text-muted-foreground">{tPr("vendor_and_price_info")}</h4>
                                            </AccordionTrigger>
                                            <VendorComparison
                                                req_qty={item.requested_qty}
                                                req_unit={item.requested_unit_name ?? '-'}
                                                apv_qty={item.approved_qty}
                                                apv_unit={item.approved_unit_name ?? '-'}
                                                pricelist_detail_id={item.pricelist_detail_id ?? ''}
                                                itemId={item.id}
                                                onItemUpdate={onItemUpdate}
                                            />
                                        </div>
                                        <AccordionContent className="flex flex-col gap-2 border-l border-l-4 border-sky-100 mx-3 my-1 -mt-px">
                                            <div className="grid grid-cols-1 md:grid-cols-2 border-t border-border mx-4 pt-2 -mt-px">
                                                <PrLabelItem label={tPr("vendor")} value={(getItemValue(item, 'vendor_name') as string) ?? "-"} />
                                                <PrLabelItem label={tPr("pricelist")} value={(getItemValue(item, 'pricelist_no') as string) ?? "-"} />
                                            </div>
                                            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-1 px-2">
                                                <PrLabelItem label={tPr("unit_price")} value={formatPriceConf(Number(getItemValue(item, 'pricelist_price')) || item.base_price || 0, defaultAmount, currencyBase ?? 'THB')} position="text-right" />
                                                <PrLabelItem label={tPr("sub_total")} value={Number(getItemValue(item, 'base_sub_total_price') ?? item.base_sub_total_price).toFixed(2)} position="text-right" />
                                                <PrLabelItem label={tPr("discount")} value={Number(getItemValue(item, 'discount_amount') ?? item.discount_amount ?? 0).toFixed(2)} position="text-right" />
                                                <PrLabelItem label={tPr("net_amount")} value={Number(getItemValue(item, 'net_amount') ?? item.net_amount).toFixed(2)} position="text-right" />
                                                <PrLabelItem label={tPr("tax")} value={Number(getItemValue(item, 'tax_amount') ?? item.tax_amount ?? 0).toFixed(2)} position="text-right" />
                                                <div className="space-y-1 text-right">
                                                    <Label className="text-muted-foreground/80 text-xs">{tPr("total")}</Label>
                                                    <p className="font-bold text-sm text-active">{Number(getItemValue(item, 'total_price') ?? item.total_price).toFixed(2)}</p>
                                                </div>
                                            </div>
                                        </AccordionContent>
                                    </AccordionItem>
                                </Accordion>

                                <Accordion type="single" collapsible>
                                    <AccordionItem value="item-2">
                                        <AccordionTrigger iconPosition="left" className="px-2">
                                            <h4 className="font-bold text-xs text-muted-foreground">{tPr("inventory_info")}</h4>
                                        </AccordionTrigger>
                                        <AccordionContent className="space-y-1 flex flex-col gap-2 border-l border-l-4 border-green-100 mx-3 my-1 -mt-px">
                                            <InventoryInfo item={item} token={token} buCode={buCode} />
                                            <InventoryProgress item={item} token={token} buCode={buCode} />
                                        </AccordionContent>
                                    </AccordionItem>
                                </Accordion>

                                {item.dimension?.length > 0 && (
                                    <Accordion type="single" collapsible>
                                        <AccordionItem value="item-3">
                                            <AccordionTrigger iconPosition="left" className="px-2">
                                                <h4 className="font-bold text-sm text-muted-foreground">{tPr("business_dimensions")}</h4>
                                            </AccordionTrigger>
                                            <AccordionContent className="flex flex-col gap-2 border-l border-l-4 border-purple-100 mx-3 my-1 -mt-px">
                                                <div className="grid grid-cols-2 md:grid-cols-4 gap-2 px-2">
                                                    {item.dimension?.map((dimension: unknown) => {
                                                        if (
                                                            typeof dimension === "object" &&
                                                            dimension !== null &&
                                                            "key" in dimension &&
                                                            "label" in dimension &&
                                                            "value" in dimension
                                                        ) {
                                                            const dim = dimension as { key: string | number, label: string, value: string | number };
                                                            return (
                                                                <div key={dim.key}>
                                                                    <div className="space-y-1 text-right">
                                                                        <Label className="text-muted-foreground text-xs">{dim.label}</Label>
                                                                        <p className="text-sm font-semibold">{dim.value}</p>
                                                                    </div>
                                                                </div>
                                                            );
                                                        }
                                                        return null;
                                                    })}
                                                </div>
                                            </AccordionContent>
                                        </AccordionItem>
                                    </Accordion>
                                )}
                            </Card>
                        ),
                    },
                },
                {
                    id: "select",
                    header: () => currentFormType !== formType.VIEW ? <DataGridTableRowSelectAll /> : null,
                    cell: ({ row }) => currentFormType !== formType.VIEW ? <DataGridTableRowSelect row={row} /> : null,
                    enableSorting: false,
                    enableHiding: false,
                    size: 30,
                },
                {
                    id: "no",
                    header: () => <div className="text-center text-muted-foreground">#</div>,
                    cell: ({ row }) => <div className="text-center text-xs">{row.index + 1}</div>,
                    enableSorting: false,
                    size: 30,
                    meta: {
                        cellClassName: "text-center",
                        headerClassName: "text-center",
                    },
                },
                {
                    accessorKey: "location_name",
                    header: ({ column }) => (
                        <DataGridColumnHeader column={column} title={tHeader("location")} />
                    ),
                    cell: ({ row }) => {
                        const item = row.original;

                        return currentFormType === formType.VIEW ? (
                            <p className="font-semibold text-muted-foreground text-xs break-words">
                                {item.location_name || "-"}
                            </p>
                        ) : (
                            <div className="min-w-[200px] pr-4">
                                <LocationLookup
                                    value={getItemValue(item, 'location_id') as string | undefined}
                                    onValueChange={(value, selectedLocation) => {
                                        onItemUpdate(item.id, 'location_id', value);
                                        // Auto-init delivery point from location
                                        if (selectedLocation?.delivery_point) {
                                            onItemUpdate(item.id, 'delivery_point_id', selectedLocation.delivery_point.id);
                                            onItemUpdate(item.id, 'delivery_point_name', selectedLocation.delivery_point.name);
                                        }
                                    }}
                                    classNames="text-xs h-7 w-full"
                                />
                            </div>
                        );
                    },
                    enableSorting: false,
                    size: currentFormType === formType.VIEW ? 120 : 200,
                    meta: {
                        headerTitle: tHeader("location"),
                    },
                },
                {
                    accessorKey: "product_name",
                    header: ({ column }) => (
                        <DataGridColumnHeader
                            column={column}
                            title={tHeader("product")}
                        />
                    ),
                    cell: ({ row }) => {
                        const item = row.original;
                        return currentFormType === formType.VIEW ? (
                            <div>
                                <p className="font-semibold text-muted-foreground text-xs break-words">
                                    {item.product_name || "-"}
                                </p>
                                {item.description && (
                                    <p className="text-xs text-muted-foreground break-words">
                                        {item.description}
                                    </p>
                                )}
                            </div>
                        ) : (
                            <div className="space-y-1 min-w-[250px] pr-4">
                                <ProductLocationLookup
                                    location_id={getItemValue(item, 'location_id') as string || ''}
                                    value={getItemValue(item, 'product_id') as string || ''}
                                    onValueChange={(value, selectedProduct) => {
                                        onItemUpdate(item.id, 'product_id', value, selectedProduct);
                                        onItemUpdate(item.id, 'inventory_unit_id', selectedProduct?.inventory_unit?.id);
                                        onItemUpdate(item.id, 'inventory_unit_name', selectedProduct?.inventory_unit?.name);
                                        if (value) {
                                            setSelectedProductId(value);
                                        }
                                    }}
                                    classNames="text-xs h-7 w-full"
                                    disabled={!getItemValue(item, 'location_id')}
                                />
                                {item.product_id && item.description && (
                                    <p className="text-xs text-muted-foreground break-words">
                                        {item.description}
                                    </p>
                                )}
                            </div>
                        );
                    },
                    enableSorting: false,
                    size: currentFormType === formType.VIEW ? 150 : 250,
                    meta: {
                        headerTitle: tHeader("product"),
                    },
                },
                {
                    accessorKey: "requested_qty",
                    header: ({ column }) => (
                        <div className="flex justify-end">
                            <DataGridColumnHeader column={column} title={tHeader("requested")} />
                        </div>
                    ),
                    cell: ({ row }) => {
                        const item = row.original;

                        return currentFormType === formType.VIEW ? (
                            <p className="text-xs text-right">
                                {item.requested_qty} {item.requested_unit_name || "-"}
                            </p>
                        ) : (
                            <div className="flex items-center gap-1 justify-end min-w-[120px]">
                                <NumberInput
                                    value={getItemValue(item, 'requested_qty') as number}
                                    onChange={(value) => onItemUpdate(item.id, 'requested_qty', value)}
                                    classNames="h-7 text-xs bg-background w-16"
                                    disabled={!getItemValue(item, 'product_id')}
                                />
                                {(() => {
                                    const currentValue = (getItemValue(item, 'requested_unit_id') as string) || orderUnitsData?.[0]?.id || '';
                                    return (
                                        <Select
                                            value={currentValue}
                                            onValueChange={(value) => {
                                                const selectedUnit = orderUnitsData?.find((unit: UnitOderProduct) => unit.id === value);
                                                if (selectedUnit) {
                                                    onItemUpdate(item.id, 'requested_unit_name', selectedUnit?.name);
                                                    onItemUpdate(item.id, 'requested_unit_id', selectedUnit?.id);
                                                }
                                            }}
                                            disabled={!getItemValue(item, 'product_id') || isLoadingOrderUnits}
                                        >
                                            <SelectTrigger className="h-7 text-xs">
                                                <SelectValue placeholder={isLoadingOrderUnits ? "Loading..." : "Select unit"} />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {orderUnitsData?.map((unit: UnitOderProduct) => (
                                                    <SelectItem key={unit.id} value={unit.id}>
                                                        {unit?.name}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    );
                                })()}
                            </div>
                        );
                    },
                    enableSorting: false,
                    size: currentFormType === formType.VIEW ? 100 : 180,
                    meta: {
                        headerTitle: tHeader("requested"),
                        cellClassName: "text-right",
                        headerClassName: "text-right",
                    },
                },
                {
                    accessorKey: "approved_qty",
                    header: ({ column }) => (
                        <div className="flex justify-end">
                            <DataGridColumnHeader column={column} title={tHeader("approved")} />
                        </div>
                    ),
                    cell: ({ row }) => {
                        const item = row.original;
                        const isNewItem = !initValues.some(initItem => initItem.id === item.id);

                        if (currentFormType === formType.VIEW) {
                            return (
                                <div className="text-right">
                                    <p className="text-xs text-active">
                                        {item.approved_qty} {item.approved_unit_name || "-"}
                                    </p>
                                    <Separator className="my-0.5" />
                                    <p className="text-xs text-active">
                                        FOC: {item.foc_qty} {item.foc_unit_name || "-"}
                                    </p>
                                </div>
                            );
                        }

                        if (isNewItem) {
                            return <p className="text-right text-sm">-</p>;
                        }

                        return (
                            <div className="flex flex-col gap-1 min-w-[180px] pr-4">
                                <div className="flex items-center gap-1 justify-end">
                                    <NumberInput
                                        value={getItemValue(item, 'approved_qty') as number}
                                        onChange={(value) => onItemUpdate(item.id, 'approved_qty', value)}
                                        classNames="w-16 h-7 text-xs bg-background"
                                    />
                                    <UnitLookup
                                        value={getItemValue(item, 'approved_unit_id') as string || ''}
                                        onValueChange={(value) => onItemUpdate(item.id, 'approved_unit_id', value)}
                                        classNames="h-7 text-xs min-w-16"
                                    />
                                </div>
                                <div className="flex items-center gap-1 justify-end">
                                    <NumberInput
                                        value={getItemValue(item, 'foc_qty') as number}
                                        onChange={(value) => onItemUpdate(item.id, 'foc_qty', value)}
                                        classNames="w-16 h-7 text-xs bg-background"
                                    />
                                    <UnitLookup
                                        value={getItemValue(item, 'foc_unit_id') as string || ''}
                                        onValueChange={(value) => onItemUpdate(item.id, 'foc_unit_id', value)}
                                        classNames="h-7 text-xs min-w-16"
                                    />
                                </div>
                            </div>
                        );
                    },
                    enableSorting: false,
                    size: currentFormType === formType.VIEW ? 100 : 180,
                    meta: {
                        headerTitle: tHeader("approved"),
                        cellClassName: "text-right",
                        headerClassName: "text-right",
                    },
                },
                {
                    accessorKey: "delivery_date",
                    header: ({ column }) => (
                        <div className="flex justify-center">
                            <DataGridColumnHeader column={column} title={tHeader("date_required")} />
                        </div>
                    ),
                    cell: ({ row }) => {
                        const item = row.original;

                        return currentFormType === formType.VIEW ? (
                            <p className="text-sm text-center text-xs">
                                {formatDateFns(item.delivery_date, dateFormat || 'yyyy-MM-dd')}
                            </p>
                        ) : (
                            <div className="flex justify-center min-w-[120px] pr-4">
                                <DateInput
                                    field={{
                                        value: getItemValue(item, 'delivery_date') as Date | undefined,
                                        onChange: (value) => onItemUpdate(item.id, 'delivery_date', value)
                                    }}
                                    classNames="text-xs h-7 w-full"
                                />
                            </div>
                        );
                    },
                    enableSorting: false,
                    size: currentFormType === formType.VIEW ? 110 : 155,
                    meta: {
                        headerTitle: tHeader("date_required"),
                        cellClassName: "text-center",
                        headerClassName: "text-center",
                    },
                },
                {
                    accessorKey: "delivery_point_name",
                    header: ({ column }) => (
                        <DataGridColumnHeader column={column} title={tHeader("delivery_point")} />
                    ),
                    cell: ({ row }) => {
                        const item = row.original;

                        return currentFormType === formType.VIEW ? (
                            <p className="text-xs">{item.delivery_point_name || "-"}</p>
                        ) : (
                            <div className="min-w-[200px] pr-4">
                                <DeliveryPointSelectLookup
                                    value={getItemValue(item, 'delivery_point_id') as string || ''}
                                    onValueChange={(value) => onItemUpdate(item.id, 'delivery_point_id', value)}
                                    className="h-7 text-xs w-full"
                                />
                            </div>
                        );
                    },
                    enableSorting: false,
                    size: currentFormType === formType.VIEW ? 130 : 200,
                    meta: {
                        headerTitle: tHeader("delivery_point"),
                    },
                },
                {
                    accessorKey: "total_price",
                    header: ({ column }) => (
                        <div className="flex justify-end">
                            <DataGridColumnHeader column={column} title={tHeader("pricing")} />
                        </div>
                    ),
                    cell: ({ row }) => {
                        const item = row.original;
                        const isNewItem = !initValues.some(initItem => initItem.id === item.id);

                        return (
                            <div className="text-right text-xs text-active font-bold">
                                {isNewItem ? (
                                    <p>-</p>
                                ) : (
                                    <p>{formatPriceConf(item.total_price, defaultAmount, currencyBase ?? 'THB')}</p>
                                )}
                            </div>
                        );
                    },
                    enableSorting: false,
                    size: 90,
                    meta: {
                        headerTitle: tHeader("pricing"),
                        cellClassName: "text-right",
                        headerClassName: "text-right",
                    },
                },
                {
                    id: "action",
                    header: ({ column }) => (
                        <div className="flex justify-end">
                            <DataGridColumnHeader column={column} title={tHeader("action")} />
                        </div>
                    ),
                    cell: ({ row }) => {
                        if (currentFormType === formType.VIEW) return null;
                        const item = row.original;
                        const isNewItem = !initValues.some(initItem => initItem.id === item.id);
                        const addIndex = isNewItem ?
                            addFields.findIndex((field: unknown) => (field as { id: string }).id === item.id) :
                            undefined;

                        return (
                            <Button
                                variant="ghost"
                                size="icon"
                                className="h-7 w-7 text-muted-foreground hover:text-destructive"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    handleRemoveItemClick(item.id, isNewItem, addIndex);
                                }}
                            >
                                <Trash2 className="h-4 w-4" />
                            </Button>
                        );
                    },
                    enableSorting: false,
                    size: 60,
                    meta: {
                        headerTitle: tHeader("action"),
                        cellClassName: "text-right",
                        headerClassName: "text-right",
                    },
                },
            ];

            // Filter out action column in VIEW mode
            if (currentFormType === formType.VIEW) {
                return baseColumns.filter(col => col.id !== 'action');
            }

            return baseColumns;
        },
        [
            tHeader,
            tPr,
            currentFormType,
            initValues,
            getItemValue,
            onItemUpdate,
            addFields,
            dateFormat,
            currencyBase,
            defaultAmount,
            token,
            buCode,
        ]
    );

    // Initialize table
    const table = useReactTable({
        data: items,
        columns,
        getRowId: (row) => row.id,
        state: {
            sorting,
        },
        enableRowSelection: currentFormType !== formType.VIEW,
        onSortingChange: setSorting,
        getCoreRowModel: getCoreRowModel(),
        getExpandedRowModel: getExpandedRowModel(),
        getRowCanExpand: () => true,
    });

    return (
        <div className="mt-4 space-y-4">
            <div className="flex items-center justify-between">
                <p className="font-semibold text-muted-foreground ">Items</p>
                {currentFormType !== formType.VIEW && (
                    <Button onClick={onAddItem} size="sm">
                        <Plus className="h-4 w-4" />
                        {tPr("add_item")}
                    </Button>
                )}
            </div>

            <DataGrid
                table={table}
                recordCount={items.length}
                isLoading={false}
                loadingMode="skeleton"
                emptyMessage={tCommon("no_data")}
                tableLayout={{
                    headerSticky: true,
                    dense: true,
                    rowBorder: true,
                    headerBackground: false,
                    headerBorder: true,
                    width: "fixed",
                }}
            >
                <div className="w-full space-y-2.5">
                    <DataGridContainer>
                        <ScrollArea className="max-h-[calc(100vh-350px)] pb-4">
                            <DataGridTable />
                            <ScrollBar orientation="horizontal" />
                        </ScrollArea>
                    </DataGridContainer>
                </div>
            </DataGrid>

            <DeleteConfirmDialog
                open={deleteDialogOpen}
                onOpenChange={setDeleteDialogOpen}
                onConfirm={handleConfirmDelete}
            />
        </div>
    );
}

const PrLabelItem = ({
    label,
    value,
    position = 'text-left',
    sub_value
}: {
    label: string;
    value: string | number | null;
    position?: 'text-left' | 'text-right';
    sub_value?: string | number | null;
}) => {
    return (
        <div className={position}>
            <Label className="text-muted-foreground text-xs">{label}</Label>
            <p className="font-bold text-sm text-muted-foreground">{value}</p>
            {sub_value && (
                <p className="text-xs text-muted-foreground">{sub_value}</p>
            )}
        </div>
    );
};
