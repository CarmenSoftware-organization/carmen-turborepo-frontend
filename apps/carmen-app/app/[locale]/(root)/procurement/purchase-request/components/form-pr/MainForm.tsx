"use client";

import JsonViewer from "@/components/JsonViewer";
import { formType } from "@/dtos/form.dto";
import { CreatePurchaseRequestSchema, PurchaseRequestByIdDto, PurchaseRequestCreateFormDto, PurchaseRequestDetail, PurchaseRequestUpdateFormDto, UpdatePurchaseRequestDetailDto, UpdatePurchaseRequestSchema } from "@/dtos/purchase-request.dto";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState, useEffect } from "react";
import { useFieldArray, useForm } from "react-hook-form";
import { format } from "date-fns";
import { useAuth } from "@/context/AuthContext";
import { mockPr } from "./payload-pr";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel } from "@/components/ui/form";
import DateInput from "@/components/form-custom/DateInput";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import LocationLookup from "@/components/lookup/LocationLookup";
import ProductLocationLookup from '@/components/lookup/ProductLocationLookup';
import { nanoid } from "nanoid";
import UnitLookup from "@/components/lookup/UnitLookup";
import NumberInput from "@/components/form-custom/NumberInput";
import { Trash2 } from "lucide-react";
import DeleteConfirmDialog from "@/components/DeleteConfirmDialog";

interface Props {
    mode: formType;
    initValues?: PurchaseRequestByIdDto;
}

export default function MainForm({ mode, initValues }: Props) {
    const [currentFormType, setCurrentFormType] = useState<formType>(mode);
    const [updatedItems, setUpdatedItems] = useState<{ [key: string]: any }>({});
    const [removedItems, setRemovedItems] = useState<Set<string>>(new Set());
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [itemToDelete, setItemToDelete] = useState<string | null>(null);
    const { user, departments } = useAuth();

    const form = useForm<PurchaseRequestCreateFormDto | PurchaseRequestUpdateFormDto>({
        resolver: (data, context, options) => {
            const schema =
                currentFormType === formType.ADD
                    ? CreatePurchaseRequestSchema
                    : UpdatePurchaseRequestSchema;
            return zodResolver(schema)(data, context, options);
        },
        defaultValues: {
            pr_date: format(new Date(), "yyyy-MM-dd"),
            description: "",
            requestor_id: user?.id,
            department_id: departments?.id,
            workflow_id: "",
            note: "",
            purchase_request_detail: {
                add: [],
                update: [],
                remove: [],
            },
        },
        mode: "onBlur",
    });

    const {
        fields: addFields,
        append: addAppend,
        remove: addRemove,
    } = useFieldArray({
        control: form.control,
        name: "purchase_request_detail.add",
    });

    const {
        fields: updateFields,
        append: updateAppend,
        remove: updateRemove,
    } = useFieldArray({
        control: form.control,
        name: "purchase_request_detail.update",
    });

    const { append: appendRemove } = useFieldArray({
        control: form.control,
        name: "purchase_request_detail.remove",
    });

    const handleFieldUpdate = (item: any, fieldName: string, value: any, selectedProduct?: any) => {

        // Update local state สำหรับ UI
        const updateData: any = { [fieldName]: value };

        // ถ้าเป็น product_id และมี selectedProduct ให้ set inventory_unit_id ด้วย
        if (fieldName === 'product_id' && selectedProduct?.inventory_unit?.id) {
            updateData.inventory_unit_id = selectedProduct.inventory_unit.id;
        }

        setUpdatedItems(prev => ({
            ...prev,
            [item.id]: {
                ...prev[item.id],
                ...updateData
            }
        }));

        const currentUpdateArray = form.getValues('purchase_request_detail.update') || [];
        const existingIndex = currentUpdateArray.findIndex(field => field.id === item.id);

        const updatedItem = {
            id: item.id,
            location_id: updatedItems[item.id]?.location_id ?? item.location_id,
            product_id: updatedItems[item.id]?.product_id ?? item.product_id,
            inventory_unit_id: updatedItems[item.id]?.inventory_unit_id ?? item.inventory_unit_id,
            description: item.description,
            requested_qty: item.requested_qty,
            requested_unit_id: item.requested_unit_id,
            delivery_date: new Date(item.delivery_date),
            ...updateData
        };


        if (existingIndex >= 0) {
            // อัพเดทค่าเดิม
            form.setValue(`purchase_request_detail.update.${existingIndex}`, updatedItem);
        } else {
            // เพิ่มใหม่
            updateAppend(updatedItem);
        }
    };

    const handleSubmit = (data: PurchaseRequestCreateFormDto | PurchaseRequestUpdateFormDto) => {
        console.log('handleSubmit', data);
    }

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
        })
    };

    const handleRemoveItemClick = (id: string, isAddItem: boolean = false, addIndex?: number) => {
        if (isAddItem && addIndex !== undefined) {
            // สำหรับ add items ลบออกจาก array ทันที
            addRemove(addIndex);
        } else {
            // สำหรับ existing items แสดง confirm dialog
            setItemToDelete(id);
            setDeleteDialogOpen(true);
        }
    };

    const handleConfirmDelete = () => {
        if (itemToDelete) {
            setRemovedItems(prev => new Set(Array.from(prev).concat(itemToDelete)));
            appendRemove({ id: itemToDelete });
        }
        setDeleteDialogOpen(false);
        setItemToDelete(null);
    };

    return (
        <div className="space-y-4">
            <h1>Current Mode: {currentFormType}</h1>
            <Button variant="outline" onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                setCurrentFormType(formType.EDIT);
            }}>
                Edit
            </Button>
            <Form {...form}>
                <form onSubmit={form.handleSubmit(handleSubmit)}>
                    <FormField
                        control={form.control}
                        name="pr_date"
                        disabled={mode === formType.VIEW}
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Date</FormLabel>
                                <FormControl>
                                    <DateInput field={field} />
                                </FormControl>
                            </FormItem>
                        )}
                    />
                    <div className="flex justify-end">
                        <Button variant="outline" onClick={handleAddItem}>
                            Add Item
                        </Button>
                    </div>

                    <div className="mt-4">
                        <h3 className="text-lg font-semibold mb-4">รายการ Product ID</h3>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Location</TableHead>
                                    <TableHead>Product</TableHead>
                                    <TableHead>Requested</TableHead>
                                    <TableHead>More</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
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
                                                                        console.log('Product onChange:', value, selectedProduct);

                                                                        // Set product_id ก่อน
                                                                        field.onChange(value);

                                                                        // ใช้ setTimeout เพื่อให้ field.onChange ทำงานเสร็จก่อน
                                                                        setTimeout(() => {
                                                                            if (selectedProduct?.inventory_unit?.id) {
                                                                                form.setValue(
                                                                                    `purchase_request_detail.add.${index}.inventory_unit_id`,
                                                                                    selectedProduct.inventory_unit.id,
                                                                                    { shouldValidate: true, shouldDirty: true }
                                                                                );
                                                                                console.log('Inventory unit id set:', selectedProduct.inventory_unit.id);
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
                                        <TableCell>
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
                                {initValues?.purchase_request_detail?.filter(item => !removedItems.has(item.id)).map((item, index) => (
                                    <TableRow key={item.id}>
                                        <TableCell>
                                            {currentFormType === formType.VIEW ? (
                                                <span>
                                                    {item.location_name}
                                                </span>
                                            ) : (
                                                <LocationLookup
                                                    value={updatedItems[item.id]?.location_id ?? item.location_id}
                                                    onValueChange={(value) => handleFieldUpdate(item, 'location_id', value)}
                                                />
                                            )}

                                        </TableCell>
                                        <TableCell>
                                            {currentFormType === formType.VIEW ? (
                                                <span>
                                                    {item.product_name}
                                                </span>
                                            ) : (
                                                <ProductLocationLookup
                                                    location_id={updatedItems[item.id]?.location_id ? updatedItems[item.id]?.location_id : item.location_id}
                                                    value={updatedItems[item.id]?.product_id ?? item.product_id}
                                                    onValueChange={(value, selectedProduct) => handleFieldUpdate(item, 'product_id', value, selectedProduct)}
                                                    disabled={!updatedItems[item.id]?.location_id}
                                                />
                                            )}
                                        </TableCell>
                                        <TableCell>
                                            {currentFormType === formType.VIEW ? (
                                                <div className="flex items-center gap-2">
                                                    <span>{item.requested_qty}</span>
                                                    <span>{item.requested_unit_name}</span>
                                                </div>
                                            ) : (
                                                <div className="flex items-center gap-2">
                                                    <NumberInput
                                                        value={item.requested_qty}
                                                        onChange={(value) => handleFieldUpdate(item, 'requested_qty', value)}
                                                    />
                                                    <UnitLookup
                                                        value={item.requested_unit_id}
                                                        onValueChange={(value) => handleFieldUpdate(item, 'requested_unit_id', value)}
                                                    />
                                                </div>
                                            )}
                                        </TableCell>
                                        <TableCell>
                                            <Button variant="ghost" size="icon" onClick={() => handleRemoveItemClick(item.id)}>
                                                <Trash2 className="w-4 h-4" />
                                            </Button>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </div>
                </form>
            </Form>
            <div className="grid grid-cols-2 gap-2">
                <JsonViewer data={form.getValues()} title="Form Values" />
                <JsonViewer data={mockPr} title="Mock Values" />
            </div>

            {/* แสดงรายการ Product ID */}

            {/* Delete Confirm Dialog */}
            <DeleteConfirmDialog
                open={deleteDialogOpen}
                onOpenChange={setDeleteDialogOpen}
                onConfirm={handleConfirmDelete}
            />
        </div>
    )
}