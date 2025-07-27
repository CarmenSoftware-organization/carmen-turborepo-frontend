"use client";

import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem } from "@/components/ui/form";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import LocationLookup from "@/components/lookup/LocationLookup";
import ProductLocationLookup from '@/components/lookup/ProductLocationLookup';
import UnitLookup from "@/components/lookup/UnitLookup";
import NumberInput from "@/components/form-custom/NumberInput";
import { Trash2 } from "lucide-react";
import DeleteConfirmDialog from "@/components/DeleteConfirmDialog";
import { formType } from "@/dtos/form.dto";
import { PurchaseRequestDetail } from "@/dtos/purchase-request.dto";
import { UseFormReturn, useFieldArray, FieldArrayWithId } from "react-hook-form";
import { nanoid } from "nanoid";
import { useState } from "react";

interface Props {
    form: UseFormReturn<any>;
    currentFormType: formType;
    initValues?: {
        purchase_request_detail?: PurchaseRequestDetail[];
    };
    updatedItems: { [key: string]: any };
    removedItems: Set<string>;
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
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [itemToDelete, setItemToDelete] = useState<{ id: string; isAddItem: boolean; addIndex?: number } | null>(null);

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
            delivery_date: new Date(),
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

    return (
        <div className="mt-4">
            <div className="flex justify-end mb-4">
                <Button variant="outline" onClick={handleAddItem}>
                    เพิ่มรายการ
                </Button>
            </div>

            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead className="w-52">Location</TableHead>
                        <TableHead className="w-52">Product</TableHead>
                        <TableHead className="text-right">Requested</TableHead>
                        {currentFormType !== formType.VIEW && (
                            <TableHead className="text-center">More</TableHead>
                        )}
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {/* รายการใหม่ที่เพิ่ม */}
                    {addFields.map((item, index) => (
                        <TableRow key={item.id || `add-${index}`}>
                            <TableCell>
                                <FormField
                                    control={form.control}
                                    name={`purchase_request_detail.add.${index}.location_id`}
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormControl>
                                                <LocationLookup
                                                    value={field.value}
                                                    onValueChange={(value) => {
                                                        field.onChange(value);
                                                    }}
                                                />
                                            </FormControl>
                                        </FormItem>
                                    )}
                                />
                            </TableCell>
                            <TableCell>
                                <FormField
                                    control={form.control}
                                    name={`purchase_request_detail.add.${index}.product_id`}
                                    render={({ field }) => {
                                        const currentLocationId = form.watch(`purchase_request_detail.add.${index}.location_id`) ?? '';

                                        return (
                                            <FormItem>
                                                <FormControl>
                                                    <ProductLocationLookup
                                                        location_id={currentLocationId}
                                                        value={field.value ?? ''}
                                                        onValueChange={(value, selectedProduct) => {
                                                            field.onChange(value);
                                                            setTimeout(() => {
                                                                if (selectedProduct?.inventory_unit?.id) {
                                                                    form.setValue(
                                                                        `purchase_request_detail.add.${index}.inventory_unit_id`,
                                                                        selectedProduct.inventory_unit.id,
                                                                        { shouldValidate: true, shouldDirty: true }
                                                                    );
                                                                }
                                                            }, 0);
                                                        }}
                                                        disabled={!currentLocationId}
                                                    />
                                                </FormControl>
                                            </FormItem>
                                        );
                                    }}
                                />
                            </TableCell>
                            <TableCell className="text-right">
                                <div className="flex items-center gap-2">
                                    <FormField
                                        control={form.control}
                                        name={`purchase_request_detail.add.${index}.requested_qty`}
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormControl>
                                                    <NumberInput
                                                        value={field.value}
                                                        onChange={field.onChange}
                                                    />
                                                </FormControl>
                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        control={form.control}
                                        name={`purchase_request_detail.add.${index}.requested_unit_id`}
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormControl>
                                                    <UnitLookup
                                                        value={field.value}
                                                        onValueChange={field.onChange}
                                                    />
                                                </FormControl>
                                            </FormItem>
                                        )}
                                    />
                                </div>
                            </TableCell>
                            <TableCell className="text-center">
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    onClick={() => handleRemoveItemClick(item.id, true, index)}
                                >
                                    <Trash2 className="w-4 h-4" />
                                </Button>
                            </TableCell>
                        </TableRow>
                    ))}

                    {/* รายการที่มีอยู่แล้ว */}
                    {initValues?.purchase_request_detail?.filter(item => !removedItems.has(item.id)).map((item, index) => (
                        <TableRow key={item.id}>
                            <TableCell>
                                {currentFormType === formType.VIEW ? (
                                    <span>{item.location_name}</span>
                                ) : (
                                    <LocationLookup
                                        value={updatedItems[item.id]?.location_id ?? item.location_id}
                                        onValueChange={(value) => onFieldUpdate(item, 'location_id', value)}
                                    />
                                )}
                            </TableCell>
                            <TableCell>
                                {currentFormType === formType.VIEW ? (
                                    <span>{item.product_name}</span>
                                ) : (
                                    <ProductLocationLookup
                                        location_id={updatedItems[item.id]?.location_id ? updatedItems[item.id]?.location_id : item.location_id}
                                        value={updatedItems[item.id]?.product_id ?? item.product_id}
                                        onValueChange={(value, selectedProduct) => onFieldUpdate(item, 'product_id', value, selectedProduct)}
                                        disabled={!updatedItems[item.id]?.location_id && !item.location_id}
                                    />
                                )}
                            </TableCell>
                            <TableCell className="text-right flex items-center justify-end gap-2">
                                {currentFormType === formType.VIEW ? (
                                    <>
                                        <span>{item.requested_qty}</span>
                                        <span>{item.requested_unit_name}</span>
                                    </>
                                ) : (
                                    <>
                                        <NumberInput
                                            value={updatedItems[item.id]?.requested_qty ?? item.requested_qty}
                                            onChange={(value) => onFieldUpdate(item, 'requested_qty', value)}
                                            classNames="w-20"
                                        />
                                        <UnitLookup
                                            value={updatedItems[item.id]?.requested_unit_id ?? item.requested_unit_id}
                                            onValueChange={(value) => onFieldUpdate(item, 'requested_unit_id', value)}
                                            classNames="w-20"
                                        />
                                    </>
                                )}
                            </TableCell>
                            <TableCell className="text-center">
                                {currentFormType !== formType.VIEW && (
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        onClick={() => handleRemoveItemClick(item.id)}
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </Button>
                                )}
                            </TableCell>
                        </TableRow>
                    ))}

                    {/* แสดงข้อความเมื่อไม่มีรายการ */}
                    {addFields.length === 0 && (!initValues?.purchase_request_detail || initValues.purchase_request_detail.filter(item => !removedItems.has(item.id)).length === 0) && (
                        <TableRow>
                            <TableCell colSpan={6} className="text-center py-8 text-gray-500">
                                No product
                            </TableCell>
                        </TableRow>
                    )}
                </TableBody>
            </Table>

            {/* Delete Confirm Dialog */}
            <DeleteConfirmDialog
                open={deleteDialogOpen}
                onOpenChange={setDeleteDialogOpen}
                onConfirm={handleConfirmDelete}
            />
        </div>
    );
}