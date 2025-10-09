"use client";

import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import DeleteConfirmDialog from "@/components/DeleteConfirmDialog";
import { formType } from "@/dtos/form.dto";
import { PurchaseRequestDetail } from "@/dtos/purchase-request.dto";
import { Fragment, useState } from "react";
import { Checkbox } from "@/components/ui/checkbox";
import { ChevronDown, ChevronRight, MapPin, Plus, Trash2Icon } from "lucide-react";
import { formatDateFns, formatPriceConf } from "@/utils/config-system";
import { useAuth } from "@/context/AuthContext";
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion"
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import VendorComparison from "./VendorComparison";
import LocationLookup from "@/components/lookup/LocationLookup";
import ProductLocationLookup from "@/components/lookup/ProductLocationLookup";
import NumberInput from "@/components/form-custom/NumberInput";
import UnitLookup from "@/components/lookup/UnitLookup";
import { Separator } from "@/components/ui/separator";
import DateInput from "@/components/form-custom/DateInput";
import { cn } from "@/lib/utils";
import InventoryInfo from "./InventoryInfo";
import InventoryProgress from "./InventoryProgress";
import { DeliveryPointSelectLookup } from "@/components/lookup/DeliveryPointSelectLookup";
import { useTranslations } from "next-intl";

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

export default function PurchaseItem({
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
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [itemToDelete, setItemToDelete] = useState<{ id: string; isAddItem: boolean; addIndex?: number } | null>(null);
    const [expandedRows, setExpandedRows] = useState<{ [key: string]: boolean }>({});
    const [hoveredRow] = useState<string | null>(null);

    const defaultAmount = { locales: 'en-US', minimumFractionDigits: 2 }

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


    const toggleRow = (itemId: string) => {
        setExpandedRows(prev => ({
            ...prev,
            [itemId]: !prev[itemId]
        }));
    };


    return (
        <div className="mt-4 min-h-56">
            {currentFormType !== formType.VIEW && (
                <div className="flex justify-end mb-4">
                    <Button
                        onClick={onAddItem}
                        size={"sm"}
                    >
                        <Plus />
                        {tPr("add_item")}
                    </Button>
                </div>
            )}
            <Table>
                <TableHeader className="bg-muted">
                    <TableRow>
                        <TableHead className="w-6"></TableHead>
                        <TableHead className="w-10">
                            <Checkbox className="w-3.5 h-3.5" />
                        </TableHead>
                        <TableHead className="text-center w-10">#</TableHead>
                        <TableHead className="w-80 text-left">{tHeader("location")}</TableHead>
                        <TableHead className="w-80 text-left">{tHeader("product")}</TableHead>
                        <TableHead className="w-40 text-right">{tHeader("requested")}</TableHead>
                        <TableHead className="w-40 text-right">{tHeader("approved")}</TableHead>
                        <TableHead className="w-56 text-center">{tHeader("date_required")}</TableHead>
                        <TableHead className="w-56 text-left">{tHeader("delivery_point")}</TableHead>
                        <TableHead className="w-40 text-right">{tHeader("pricing")}</TableHead>
                        <TableHead className="text-right"></TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {items?.length === 0 ? (
                        <TableRow>
                            <TableCell colSpan={11} className="text-center">
                                <p className="text-muted-foreground">No items found</p>
                            </TableCell>
                        </TableRow>
                    ) : (
                        items?.map((item, index) => {
                            // Check if this is a new item
                            const isNewItem = !initValues.some(initItem => initItem.id === item.id);

                            return (
                                <Fragment key={item.id}>
                                    <TableRow
                                        className={cn("border border-b-0 border-l-0 border-r-0 py-10",
                                            isNewItem ? 'bg-muted-foreground/10' : '')
                                        }
                                    // onMouseEnter={() => handleMouseEnterRow(item.id)}
                                    // onMouseLeave={handleMouseLeaveRow}
                                    >
                                        <TableCell className="w-10">
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                className="p-1"
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    e.preventDefault();
                                                    toggleRow(item.id)
                                                }}
                                            >
                                                {expandedRows[item.id] ?
                                                    <ChevronDown className="h-4 w-4" /> :
                                                    <ChevronRight className="h-4 w-4" />
                                                }
                                            </Button>
                                        </TableCell>
                                        <TableCell className="w-10">
                                            <Checkbox className="w-3.5 h-3.5" />
                                        </TableCell>
                                        <TableCell className="text-center w-10">
                                            {index + 1}
                                        </TableCell>
                                        <TableCell className="w-80 text-left font-bold">
                                            {currentFormType === formType.VIEW ? (
                                                <div className="flex items-center gap-2">
                                                    <MapPin className="h-4 w-4 text-primary" />
                                                    <p className="text-sm font-semibold">{item.location_name || "-"}</p>
                                                </div>
                                            ) : (
                                                <LocationLookup
                                                    value={getItemValue(item, 'location_id') as string | undefined}
                                                    onValueChange={(value) => onItemUpdate(item.id, 'location_id', value)}
                                                    classNames="text-xs h-7"
                                                />
                                            )}
                                        </TableCell>
                                        <TableCell className="w-96 text-left">
                                            {currentFormType === formType.VIEW ? (
                                                <div>
                                                    <p className="text-xs font-semibold">{item.product_name || "-"}</p>
                                                    <p className="text-xs text-muted-foreground">{item.description || "-"}</p>
                                                </div>
                                            ) : (
                                                <div className="space-y-1">
                                                    <ProductLocationLookup
                                                        location_id={getItemValue(item, 'location_id') as string || ''}
                                                        value={getItemValue(item, 'product_id') as string || ''}
                                                        onValueChange={(value, selectedProduct) => {
                                                            onItemUpdate(item.id, 'product_id', value, selectedProduct);
                                                            onItemUpdate(item.id, 'inventory_unit_id', selectedProduct?.inventory_unit?.id);
                                                            onItemUpdate(item.id, 'inventory_unit_name', selectedProduct?.inventory_unit?.name);
                                                        }}
                                                        classNames="text-xs h-7"
                                                        disabled={!getItemValue(item, 'location_id')}
                                                    />
                                                    {item.product_id && (
                                                        <p className="text-xs text-muted-foreground">{item.description || "-"}</p>
                                                    )}
                                                </div>
                                            )}
                                        </TableCell>
                                        <TableCell className="w-40 text-right">
                                            {currentFormType === formType.VIEW ? (
                                                <p className="text-xs font-semibold">
                                                    {item.requested_qty} {item.requested_unit_name || "-"}
                                                </p>
                                            ) : (
                                                <div className="flex items-center gap-1 justify-end">
                                                    <NumberInput
                                                        value={getItemValue(item, 'requested_qty') as number}
                                                        onChange={(value) => onItemUpdate(item.id, 'requested_qty', value)}
                                                        classNames="w-10 h-7 text-xs"
                                                        disabled={!getItemValue(item, 'product_id')}
                                                    />
                                                    <UnitLookup
                                                        value={getItemValue(item, 'requested_unit_id') as string}
                                                        onValueChange={(value) => onItemUpdate(item.id, 'requested_unit_id', value)}
                                                        classNames="h-7 text-xs"
                                                        disabled={!getItemValue(item, 'product_id')}
                                                    />
                                                </div>
                                            )}

                                        </TableCell>
                                        <TableCell className="w-40 text-right">
                                            <div>
                                                {currentFormType === formType.VIEW && (
                                                    <>
                                                        <p className="text-xs text-right font-semibold text-active">
                                                            {item.approved_qty} {item.approved_unit_name || "-"}
                                                        </p>
                                                        <Separator />
                                                        <p className="text-xs font-semibold text-active text-xs">
                                                            FOC: {item.foc_qty} {item.foc_unit_name || "-"}
                                                        </p>
                                                    </>
                                                )}
                                                {currentFormType !== formType.VIEW && isNewItem && (
                                                    <p>-</p>
                                                )}
                                                {currentFormType !== formType.VIEW && !isNewItem && (
                                                    <div className="flex flex-col gap-1">
                                                        <div className="flex items-center gap-1 justify-end">
                                                            <NumberInput
                                                                value={getItemValue(item, 'approved_qty') as number}
                                                                onChange={(value) => onItemUpdate(item.id, 'approved_qty', value)}
                                                                classNames="w-12 h-7 text-xs"
                                                            />
                                                            <UnitLookup
                                                                value={getItemValue(item, 'approved_unit_id') as string || ''}
                                                                onValueChange={(value) => onItemUpdate(item.id, 'approved_unit_id', value)}
                                                                classNames="h-7 text-xs"
                                                            />
                                                        </div>
                                                        <div className="flex items-center gap-1 justify-end">
                                                            <NumberInput
                                                                value={getItemValue(item, 'foc_qty') as number}
                                                                onChange={(value) => onItemUpdate(item.id, 'foc_qty', value)}
                                                                classNames="w-12 h-7 text-xs"
                                                            />
                                                            <UnitLookup
                                                                value={getItemValue(item, 'foc_unit_id') as string || ''}
                                                                onValueChange={(value) => onItemUpdate(item.id, 'foc_unit_id', value)}
                                                                classNames="h-7 text-xs"
                                                            />
                                                        </div>
                                                    </div>
                                                )}
                                            </div>
                                        </TableCell>
                                        <TableCell className="w-56 text-center">
                                            {currentFormType === formType.VIEW ? (
                                                <p className="text-sm font-medium">{formatDateFns(item.delivery_date, dateFormat || 'yyyy-MM-dd')}</p>
                                            ) : (
                                                <DateInput
                                                    field={{
                                                        value: getItemValue(item, 'delivery_date') as Date | undefined,
                                                        onChange: (value) => onItemUpdate(item.id, 'delivery_date', value)
                                                    }}
                                                    classNames="text-xs h-7"
                                                />
                                            )}
                                        </TableCell>
                                        <TableCell className="w-56 text-left">
                                            {currentFormType === formType.VIEW ? (
                                                <p className="text-sm font-medium">{item.delivery_point_name || "-"}</p>
                                            ) : (
                                                <DeliveryPointSelectLookup
                                                    value={getItemValue(item, 'delivery_point_id') as string || ''}
                                                    onValueChange={(value) => onItemUpdate(item.id, 'delivery_point_id', value)}
                                                    className="h-7 text-xs w-40"
                                                />
                                            )}
                                        </TableCell>
                                        <TableCell className="w-40 text-right text-xs text-active font-bold">
                                            <div className="flex items-center justify-end gap-1">
                                                {isNewItem ? (
                                                    <p>-</p>
                                                ) : (
                                                    <p>
                                                        {formatPriceConf(item.total_price, defaultAmount, currencyBase ?? 'THB')}
                                                    </p>
                                                )}
                                            </div>
                                        </TableCell>
                                        {currentFormType !== formType.VIEW && (
                                            <TableCell className="text-right">
                                                <button
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        e.preventDefault();
                                                        // For new items, we need to find the correct index in add array
                                                        const addIndex = isNewItem ?
                                                            addFields.findIndex((field: unknown) => (field as { id: string }).id === item.id) :
                                                            undefined;
                                                        handleRemoveItemClick(item.id, isNewItem, addIndex);
                                                    }}
                                                    className="hover:text-destructive/80 hover:bg-transparent mr-1 text-muted-foreground/80"
                                                >
                                                    <Trash2Icon className="w-4 h-4" />
                                                </button>
                                            </TableCell>
                                        )}

                                    </TableRow>
                                    {item.comment && (
                                        <TableRow>
                                            <TableCell colSpan={11} className="border-t-0">
                                                <div className="ml-20 border border-border p-2 rounded-md bg-card/80 text-xs">
                                                    {item.comment}
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                    )}

                                    {(expandedRows[item.id] || hoveredRow === item.id) && (
                                        <TableRow>
                                            <TableCell colSpan={11}>
                                                <Card className="m-2 rounded-md">
                                                    <Accordion
                                                        type="single"
                                                        collapsible
                                                        defaultValue="item-1"
                                                    >
                                                        <AccordionItem value="item-1">
                                                            <div className="flex items-center justify-between border-b border-border">
                                                                <AccordionTrigger iconPosition="left" className="px-2">
                                                                    <h4 className="font-semibold text-sm">{tPr("vendor_and_price_info")}</h4>
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
                                                                    <PrLabelItem label={tPr("vendor")} value={item.vendor_name ?? "-"} />
                                                                    <PrLabelItem label={tPr("pricelist")} value={item.pricelist_no ?? "-"} />
                                                                </div>

                                                                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-2 px-2">
                                                                    <PrLabelItem label={tPr("unit_price")} value={formatPriceConf(Number(item.pricelist_price) || item.base_price || 0, defaultAmount, currencyBase ?? 'THB')} position="text-right" />
                                                                    <PrLabelItem label={tPr("sub_total")} value={Number(item.base_sub_total_price).toFixed(2)} position="text-right" />
                                                                    <PrLabelItem label={tPr("discount")} value={Number(item.discount_amount ?? 0).toFixed(2)} position="text-right" />
                                                                    <PrLabelItem label={tPr("net_amount")} value={Number(item.net_amount).toFixed(2)} position="text-right" />
                                                                    <PrLabelItem label={tPr("tax")} value={Number(item.tax_amount ?? 0).toFixed(2)} position="text-right" />
                                                                    <div className="space-y-1 text-right">
                                                                        <Label className="text-muted-foreground/80 text-xs">{tPr("total")}</Label>
                                                                        <p className="font-bold text-sm text-active">{Number(item.total_price).toFixed(2)}</p>
                                                                    </div>
                                                                </div>
                                                            </AccordionContent>
                                                        </AccordionItem>
                                                    </Accordion>

                                                    <Accordion
                                                        type="single"
                                                        collapsible
                                                    >
                                                        <AccordionItem value="item-2">
                                                            <AccordionTrigger iconPosition="left" className="px-2">
                                                                <h4 className="font-bold text-sm">{tPr("inventory_info")}</h4>
                                                            </AccordionTrigger>

                                                            <AccordionContent className="space-y-1 flex flex-col gap-2 border-l border-l-4 border-green-100 mx-3 my-1 -mt-px">
                                                                <InventoryInfo item={item} token={token} buCode={buCode} />
                                                                <InventoryProgress item={item} token={token} buCode={buCode} />
                                                            </AccordionContent>
                                                        </AccordionItem>
                                                    </Accordion>

                                                    {item.dimension?.length > 0 && (
                                                        <Accordion
                                                            type="single"
                                                            collapsible
                                                        >
                                                            <AccordionItem value="item-3">
                                                                <AccordionTrigger iconPosition="left" className="px-2">
                                                                    <h4 className="font-bold text-sm">{tPr("business_dimensions")}</h4>
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
                                                                                            <Label className="text-muted-foreground/80 text-xs">{dim.label}</Label>
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
                                            </TableCell>
                                        </TableRow>
                                    )}
                                </Fragment>
                            );
                        })
                    )}
                </TableBody>
            </Table>

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
    sub_value }: {
        label: string,
        value: string | number | null,
        position?: 'text-left' | 'text-right',
        sub_value?: string | number | null
    }) => {
    return (
        <div className={`${position}`}>
            <Label className="text-muted-foreground/80 text-xs">{label}</Label>
            <p className="font-bold text-sm">{value}</p>
            {sub_value && (
                <p className="text-xs text-muted-foreground/80">{sub_value}</p>
            )}
        </div>
    )
}