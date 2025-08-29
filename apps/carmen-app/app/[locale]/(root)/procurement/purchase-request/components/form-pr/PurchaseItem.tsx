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
import { Input } from "@/components/ui/input";

import VendorComparison from "./VendorComparison";
import LocationLookup from "@/components/lookup/LocationLookup";
import ProductLocationLookup from "@/components/lookup/ProductLocationLookup";
import { MotionDiv } from "@/components/framer-motion/MotionWrapper";
import NumberInput from "@/components/form-custom/NumberInput";
import UnitLookup from "@/components/lookup/UnitLookup";
import { cellContentVariants } from "@/utils/framer-variants";
import { LookupDeliveryPoint } from "@/components/lookup/DeliveryPointLookup";
import { Separator } from "@/components/ui/separator";
import DateInput from "@/components/form-custom/DateInput";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";



interface Props {
    currentFormType: formType;
    items: PurchaseRequestDetail[];
    initValues?: PurchaseRequestDetail[];
    addFields: any[];
    onItemUpdate: (itemId: string, fieldName: string, value: any, selectedProduct?: any) => void;
    onItemRemove: (itemId: string, isNewItem?: boolean, itemIndex?: number) => void;
    onAddItem: () => void;
    getItemValue: (item: PurchaseRequestDetail, fieldName: string) => any;
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
    const { dateFormat, currencyBase } = useAuth();
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


    const calculateStockLevel = (onHandQty: number, onOrderQty: number, reOrderQty: number, reStockQty: number) => {
        const totalQty = onHandQty + onOrderQty + reOrderQty + reStockQty;
        const stockLevel = (onHandQty / totalQty) * 100;
        return Number(stockLevel.toFixed(2));
    };


    console.log('items', items);

    return (
        <div className="mt-4">
            {currentFormType !== formType.VIEW && (
                <div className="flex justify-end mb-4">
                    <Button
                        onClick={onAddItem}
                        size={"sm"}
                    >
                        <Plus />
                        Add Item
                    </Button>
                </div>
            )}
            <Table>
                <TableHeader className="bg-muted">
                    <TableRow>
                        <TableHead className="w-10"></TableHead>
                        <TableHead className="w-10">
                            <Checkbox />
                        </TableHead>
                        <TableHead className="text-center w-10">#</TableHead>
                        <TableHead className="w-80 text-left">Location</TableHead>
                        <TableHead className="w-80 text-left">Product</TableHead>
                        <TableHead className="w-40 text-right">Requested</TableHead>
                        <TableHead className="w-40 text-right">Approved</TableHead>
                        <TableHead className="w-56 text-center">Date Required</TableHead>
                        <TableHead className="w-56 text-left">Delivery Point</TableHead>
                        <TableHead className="w-40 text-right">Pricing</TableHead>
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
                                        className={cn("border border-b-0 border-l-0 border-r-0",
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
                                            <Checkbox />
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
                                                    value={getItemValue(item, 'location_id')}
                                                    onValueChange={(value) => onItemUpdate(item.id, 'location_id', value)}
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
                                                <div className="space-y-2">
                                                    <ProductLocationLookup
                                                        location_id={getItemValue(item, 'location_id')}
                                                        value={getItemValue(item, 'product_id')}
                                                        onValueChange={(value, selectedProduct) => {
                                                            onItemUpdate(item.id, 'product_id', value, selectedProduct);
                                                            onItemUpdate(item.id, 'inventory_unit_id', selectedProduct?.inventory_unit?.id);
                                                            onItemUpdate(item.id, 'inventory_unit_name', selectedProduct?.inventory_unit?.name);
                                                        }}
                                                        disabled={!getItemValue(item, 'location_id')}
                                                    />
                                                    <p className="text-xs text-muted-foreground">{item.description || "-"}</p>
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
                                                        key={`requested_qty_${item.id}`}
                                                        value={getItemValue(item, 'requested_qty')}
                                                        onChange={(value) => onItemUpdate(item.id, 'requested_qty', value)}
                                                        classNames="w-12"
                                                        disabled={!getItemValue(item, 'product_id')}
                                                    />
                                                    <UnitLookup
                                                        value={getItemValue(item, 'requested_unit_id')}
                                                        onValueChange={(value) => onItemUpdate(item.id, 'requested_unit_id', value)}
                                                        classNames="w-20"
                                                        disabled={!getItemValue(item, 'product_id')}
                                                    />
                                                </div>
                                            )}

                                        </TableCell>
                                        <TableCell className="w-40 text-right">
                                            <MotionDiv
                                                variants={cellContentVariants}
                                                initial="hidden"
                                                animate="visible"
                                            >
                                                {currentFormType === formType.VIEW ? (
                                                    <>
                                                        <p className="text-xs text-right font-semibold text-active">
                                                            {item.approved_qty} {item.approved_unit_name || "-"}
                                                        </p>
                                                        <Separator />
                                                        <p className="text-xs font-semibold text-active">
                                                            FOC: {item.foc_qty} {item.foc_unit_name || "-"}
                                                        </p>
                                                    </>
                                                ) : isNewItem ? (
                                                    <p>-</p>
                                                ) : (
                                                    <div className="flex flex-col gap-1">
                                                        <div className="flex items-center gap-2 justify-end">
                                                            <NumberInput
                                                                key={`approved_qty_${item.id}`}
                                                                value={getItemValue(item, 'approved_qty')}
                                                                onChange={(value) => onItemUpdate(item.id, 'approved_qty', value)}
                                                                classNames="w-12"
                                                            />
                                                            <UnitLookup
                                                                value={getItemValue(item, 'approved_unit_id')}
                                                                onValueChange={(value) => onItemUpdate(item.id, 'approved_unit_id', value)}
                                                                classNames="w-20"
                                                            />
                                                        </div>
                                                        <div className="flex items-center gap-2 justify-end">
                                                            <p>FOC:</p>
                                                            <NumberInput
                                                                key={`foc_qty_${item.id}`}
                                                                value={getItemValue(item, 'foc_qty')}
                                                                onChange={(value) => onItemUpdate(item.id, 'foc_qty', value)}
                                                                classNames="w-12"
                                                            />
                                                            <UnitLookup
                                                                value={getItemValue(item, 'foc_unit_id')}
                                                                onValueChange={(value) => onItemUpdate(item.id, 'foc_unit_id', value)}
                                                                classNames="w-20"
                                                            />
                                                        </div>
                                                    </div>
                                                )}
                                            </MotionDiv>
                                        </TableCell>
                                        <TableCell className="w-56 text-center">
                                            {currentFormType === formType.VIEW ? (
                                                <p className="text-sm font-medium">{formatDateFns(item.delivery_date, dateFormat || 'yyyy-MM-dd')}</p>
                                            ) : (
                                                <DateInput
                                                    field={{
                                                        value: getItemValue(item, 'delivery_date'),
                                                        onChange: (value) => onItemUpdate(item.id, 'delivery_date', value)
                                                    }}
                                                />
                                            )}
                                        </TableCell>
                                        <TableCell className="w-56 text-left">
                                            {currentFormType === formType.VIEW ? (
                                                <p className="text-sm font-medium">{item.delivery_point_name || "-"}</p>
                                            ) : (
                                                <LookupDeliveryPoint
                                                    value={getItemValue(item, 'delivery_point_id')}
                                                    onValueChange={(value) => onItemUpdate(item.id, 'delivery_point_id', value)}
                                                    className="w-32"
                                                />
                                            )}
                                        </TableCell>
                                        <TableCell className="w-40 text-right">
                                            <div className="flex items-center justify-end gap-1">
                                                {isNewItem ? (
                                                    <p className="font-bold text-active">-</p>
                                                ) : (
                                                    <p className="font-bold text-active">
                                                        {formatPriceConf(item.total_price, defaultAmount, currencyBase ?? 'THB')}
                                                    </p>
                                                )}
                                            </div>
                                        </TableCell>
                                        {currentFormType !== formType.VIEW && (
                                            <TableCell className="text-right">
                                                <Button
                                                    variant={"ghost"}
                                                    size={"sm"}
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        e.preventDefault();
                                                        // For new items, we need to find the correct index in add array
                                                        const addIndex = isNewItem ?
                                                            addFields.findIndex((field: any) => field.id === item.id) :
                                                            undefined;
                                                        handleRemoveItemClick(item.id, isNewItem, addIndex);
                                                    }}
                                                    className="hover:text-destructive/80 hover:bg-transparent"
                                                >
                                                    <Trash2Icon className="w-4 h-4" />
                                                </Button>
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
                                                                    <h4 className="font-semibold text-sm">Vendor & Pricing Information</h4>
                                                                </AccordionTrigger>
                                                                <VendorComparison />
                                                            </div>

                                                            <AccordionContent className="flex flex-col gap-2 border-l border-l-4 border-sky-100 mx-3 my-1">
                                                                <div className="grid grid-cols-1 md:grid-cols-2 border-b border-border mx-4 pb-2">
                                                                    <PrLabelItem label="Vendor" value={item.vendor_name} />
                                                                    <PrLabelItem label="Pricelist" value={item.pricelist_no ?? "-"} />
                                                                </div>

                                                                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-2 px-2">
                                                                    <PrLabelItem label="Unit Price" value={formatPriceConf(item.base_price ?? 0, defaultAmount, currencyBase ?? 'THB')} position="text-right" />
                                                                    <PrLabelItem label="Sub Total" value={Number(item.base_sub_total_price).toFixed(2)} position="text-right" />
                                                                    <PrLabelItem label="Discount" value={Number(item.discount_amount).toFixed(2)} position="text-right" />
                                                                    <PrLabelItem label="Net Amount" value={Number(item.net_amount).toFixed(2)} position="text-right" />
                                                                    <PrLabelItem label="Tax (VAT)" value={Number(item.tax_amount).toFixed(2)} position="text-right" />
                                                                    <div className="space-y-1 text-right">
                                                                        <Label className="text-muted-foreground/80 text-xs">Total</Label>
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
                                                            <AccordionTrigger iconPosition="left" className="px-2 border-b border-border">
                                                                <h4 className="font-bold text-sm">Inventory Information</h4>
                                                            </AccordionTrigger>

                                                            <AccordionContent className="space-y-1 flex flex-col gap-2 border-l border-l-4 border-green-100 mx-3 my-1">
                                                                <div className="grid grid-cols-2 md:grid-cols-4 gap-2 px-2">
                                                                    <div className="text-right">
                                                                        <Label className="text-primary text-xs">On Hand</Label>
                                                                        <p className="text-sm font-semibold">{item.on_hand_qty}</p>
                                                                        <p className="text-xs text-muted-foreground/80">{item.inventory_unit_name}</p>
                                                                    </div>
                                                                    <div className="text-right">
                                                                        <Label className="text-primary text-xs">On Order</Label>
                                                                        <p className="text-sm font-semibold">{item.on_order_qty}</p>
                                                                        <p className="text-xs text-muted-foreground/80">{item.inventory_unit_name}</p>
                                                                    </div>
                                                                    <div className="text-right">
                                                                        <Label className="text-muted-foreground/80 text-xs">Reorder</Label>
                                                                        <p className="text-sm font-semibold">{item.re_order_qty}</p>
                                                                        <p className="text-xs text-muted-foreground/80">{item.inventory_unit_name}</p>
                                                                    </div>
                                                                    <div className="text-right">
                                                                        <Label className="text-muted-foreground/80 text-xs">Restock</Label>
                                                                        <p className="text-sm font-semibold">{item.re_stock_qty}</p>
                                                                        <p className="text-xs text-muted-foreground/80">{item.inventory_unit_name}</p>
                                                                    </div>
                                                                </div>
                                                                <div className="px-2">
                                                                    <Progress value={calculateStockLevel(item.on_hand_qty, item.on_order_qty, item.re_order_qty, item.re_stock_qty)} />
                                                                    <div className="flex items-center justify-between">
                                                                        <p className="text-xs text-muted-foreground/80">Needs Reorder</p>
                                                                        <p className="text-xs text-muted-foreground/80">Stock Level: {calculateStockLevel(item.on_hand_qty, item.on_order_qty, item.re_order_qty, item.re_stock_qty)}%</p>
                                                                    </div>
                                                                </div>
                                                            </AccordionContent>
                                                        </AccordionItem>
                                                    </Accordion>
                                                    <Accordion
                                                        type="single"
                                                        collapsible
                                                    >
                                                        <AccordionItem value="item-3">
                                                            <AccordionTrigger iconPosition="left" className="px-2 border-b border-border">
                                                                <h4 className="font-bold text-sm">Business Dimensions</h4>
                                                            </AccordionTrigger>
                                                            <AccordionContent className="flex flex-col gap-2 border-l border-l-4 border-purple-100 mx-3 my-1">
                                                                <div className="grid grid-cols-2 md:grid-cols-4 gap-2 px-2">
                                                                    {item.dimension?.map((dimension: any) => (
                                                                        <div key={dimension.key}>
                                                                            <div className="space-y-1 text-right">
                                                                                <Label className="text-muted-foreground/80 text-xs">{dimension.label}</Label>
                                                                                <p className="text-sm font-semibold">{dimension.value}</p>
                                                                            </div>
                                                                        </div>
                                                                    ))}
                                                                </div>
                                                            </AccordionContent>
                                                        </AccordionItem>
                                                    </Accordion>
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