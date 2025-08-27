"use client";

import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import DeleteConfirmDialog from "@/components/DeleteConfirmDialog";
import { formType } from "@/dtos/form.dto";
import { PurchaseRequestDetail } from "@/dtos/purchase-request.dto";
import { UseFormReturn, useFieldArray } from "react-hook-form";
import { nanoid } from "nanoid";
import { Fragment, useState } from "react";
import AddfieldItem from "./AddfieldItem";
import EditFieldItem from "./EditFieldItem";
import { Checkbox } from "@/components/ui/checkbox";
import { ArrowRight, ChevronDown, ChevronRight, Package, Plus } from "lucide-react";
import { formatDateFns, formatPriceConf } from "@/utils/config-system";
import { useAuth } from "@/context/AuthContext";
import { useCurrenciesQuery } from "@/hooks/useCurrencie";
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion"
import { Separator } from "@radix-ui/react-select";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import VendorComparison from "./VendorComparison";



interface Props {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    form: UseFormReturn<any>;
    currentFormType: formType;
    initValues?: PurchaseRequestDetail[];
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    updatedItems: { [key: string]: any };
    removedItems: Set<string>;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    onFieldUpdate: (item: any, fieldName: string, value: any, selectedProduct?: any) => void;
    onRemoveItem: (id: string, isAddItem?: boolean, addIndex?: number) => void;
}

export default function PurchaseItem({
    form,
    currentFormType,
    initValues,
    updatedItems,
    removedItems,
    onFieldUpdate,
    onRemoveItem
}: Props) {
    const { dateFormat, token, tenantId, currencyBase } = useAuth();
    const { getCurrencyCode } = useCurrenciesQuery(token, tenantId);
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [itemToDelete, setItemToDelete] = useState<{ id: string; isAddItem: boolean; addIndex?: number } | null>(null);
    const [expandedRows, setExpandedRows] = useState<{ [key: string]: boolean }>({});

    const defaultAmount = { locales: 'en-US', minimumFractionDigits: 2 }

    const {
        fields: addFields,
        append: addAppend,
        remove: addRemove,
    } = useFieldArray({
        control: form.control,
        name: "purchase_request_detail.add",
    });

    const handleAddItem = () => {
        addAppend({
            id: nanoid(),
            location_id: "",
            product_id: "",
            inventory_unit_id: "",
            description: "",
            requested_qty: 0,
            requested_unit_id: "",
            delivery_date: undefined,
        });
    };

    const handleRemoveItemClick = (id: string, isAddItem: boolean = false, addIndex?: number) => {
        if (isAddItem && addIndex !== undefined) {
            addRemove(addIndex);
        } else {
            setItemToDelete({ id, isAddItem, addIndex });
            setDeleteDialogOpen(true);
        }
    };

    const handleConfirmDelete = () => {
        if (itemToDelete) {
            if (itemToDelete.isAddItem && itemToDelete.addIndex !== undefined) {
                addRemove(itemToDelete.addIndex);
            } else {
                onRemoveItem(itemToDelete.id, itemToDelete.isAddItem, itemToDelete.addIndex);
            }
        }
        setDeleteDialogOpen(false);
        setItemToDelete(null);
    };

    console.log('initValues', initValues);

    const toggleRow = (itemId: string) => {
        setExpandedRows(prev => ({
            ...prev,
            [itemId]: !prev[itemId]
        }));
    };

    return (
        <div className="mt-4">
            {currentFormType !== formType.VIEW && (
                <div className="flex justify-end mb-4">
                    <Button
                        onClick={handleAddItem}
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
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {initValues?.map((item, index) => (
                        <Fragment key={item.id}>
                            <TableRow className="border border-b-0 border-l-0 border-r-0">
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
                                <TableCell className="w-56 text-left font-bold">{item.location_name}</TableCell>
                                <TableCell className="text-left">
                                    <div className="flex flex-col gap-1">
                                        <div className="text-sm font-bold">{item.product_name}</div>
                                        <div className="text-xs text-muted-foreground">{item.description}</div>
                                    </div>
                                </TableCell>
                                <TableCell className="w-40 text-right">{item.requested_qty} {item.requested_unit_name}</TableCell>
                                <TableCell className="w-40 text-right">
                                    <div className="flex flex-col gap-1 items-end">
                                        <div className="flex items-center gap-1">
                                            <p className="text-active font-semibold">{item.approved_qty} {item.approved_unit_name}</p>
                                        </div>
                                        <div className="flex items-center gap-1 border-t border-border">
                                            <p className="text-active text-xs font-semibold">FOC: {item.foc_qty} {item.foc_unit_name}</p>
                                        </div>
                                    </div>
                                </TableCell>
                                <TableCell className="w-56 text-center">{formatDateFns(item.delivery_date, dateFormat || 'yyyy-MM-dd')}</TableCell>
                                <TableCell className="w-56 text-left">{item.delivery_point_name}</TableCell>
                                <TableCell className="w-40 text-right">
                                    <div className="flex items-center justify-end gap-1">
                                        <p className="font-bold">
                                            {formatPriceConf(item.total_price, defaultAmount, currencyBase ?? 'THB')}
                                        </p>
                                        {/* <p className="text-muted-foreground/80">{getCurrencyCode(item.currency_id)}</p> */}
                                    </div>
                                </TableCell>

                            </TableRow>
                            {item.comment && (
                                <TableRow>
                                    <TableCell colSpan={10} className="border-t-0">
                                        <div className="ml-20 border border-border px-2 py-1 rounded-md bg-card/80">
                                            {item.comment}
                                        </div>
                                        {/* <Textarea className="ml-20 h-auto h-max-content" defaultValue={item.comment} /> */}
                                    </TableCell>
                                </TableRow>
                            )}

                            {expandedRows[item.id] && (
                                <TableRow>
                                    <TableCell colSpan={10}>
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

                                                    <AccordionContent className="flex flex-col gap-2 border-l border-l-4 border-green-100 mx-3 my-1">
                                                        <div className="grid grid-cols-2 md:grid-cols-4 gap-2 px-2">
                                                            <div>
                                                                <Label className="text-primary text-xs">On Hand</Label>
                                                                <p className="text-sm font-semibold">{item.on_hand_qty}</p>
                                                            </div>
                                                            <div>
                                                                <Label className="text-primary text-xs">On Order</Label>
                                                                <p className="text-sm font-semibold">{item.on_order_qty}</p>
                                                            </div>
                                                            <div>
                                                                <Label className="text-muted-foreground/80 text-xs">Reorder</Label>
                                                                <p className="text-sm font-semibold">{item.re_order_qty}</p>
                                                            </div>
                                                            <div>
                                                                <Label className="text-muted-foreground/80 text-xs">Restock</Label>
                                                                <p className="text-sm font-semibold">{item.re_stock_qty}</p>
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
                                                                    <div className="space-y-1">
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
                    ))}
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

const PrLabelItem = ({ label, value, position = 'text-left' }: { label: string, value: string | number | null, position?: 'text-left' | 'text-right' }) => {
    return (
        <div className={`${position}`}>
            <Label className="text-muted-foreground/80 text-xs">{label}</Label>
            <p className="font-bold text-sm">{value}</p>
        </div>
    )
}