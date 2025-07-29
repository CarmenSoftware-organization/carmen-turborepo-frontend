"use client";

import JsonViewer from "@/components/JsonViewer";
import {
    mockPrDto,
    ItemDetail,
    PrFormValue,
    prSchemaCreateFormValue,
    prSchemaUpdateFormValue,
    mockProducts,
    PrCreateFormValue,
    PrUpdateFormValue,
} from "./mock-pr";
import { useFieldArray, useForm } from "react-hook-form";
import { useEffect, useMemo, useState } from "react";
import { formType } from "@/dtos/form.dto";
import { Button } from "@/components/ui/button";
import { zodResolver } from "@hookform/resolvers/zod";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Trash2 } from "lucide-react";
import { nanoid } from "nanoid";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import FormDisplay from "./FormDisplay";

export interface UpdatableItem extends ItemDetail {
    isDirty: boolean;
}

export type DeletionTarget =
    | { type: "pristine"; item: UpdatableItem }
    | { type: "update"; index: number }
    | { type: "add"; index: number };


export default function PrPage() {
    const [currentFormType, setCurrentFormType] = useState<formType>(formType.ADD);
    const [updatableItems, setUpdatableItems] = useState<UpdatableItem[]>([]);
    const [deletionTarget, setDeletionTarget] = useState<DeletionTarget | null>(null);

    const form = useForm<PrFormValue>({
        resolver: (data, context, options) => {
            const schema =
                currentFormType === formType.ADD
                    ? prSchemaCreateFormValue
                    : prSchemaUpdateFormValue;
            return zodResolver(schema)(data, context, options);
        },
        defaultValues: {
            no: "",
            items: {
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
        name: "items.add",
    });

    const {
        fields: updateFields,
        append: updateAppend,
        remove: updateRemove,
    } = useFieldArray({
        control: form.control,
        name: "items.update",
    });

    useEffect(() => {
        if (currentFormType === formType.EDIT) {
            form.reset({
                id: mockPrDto.id,
                no: mockPrDto.no,
                items: { add: [], update: [], remove: [] },
            });
            setUpdatableItems(
                mockPrDto.items.map((item) => ({ ...item, isDirty: false }))
            );
        } else if (currentFormType === formType.VIEW) {
            form.reset({
                id: mockPrDto.id,
                no: mockPrDto.no,
                items: { add: [], update: mockPrDto.items, remove: [] },
            });
            setUpdatableItems([]);
        } else {
            form.reset({
                no: "",
                items: { add: [], update: [], remove: [] },
            });
            setUpdatableItems([]);
        }
    }, [currentFormType, form]);

    const watchForm = form.watch();

    const selectedProductIds = useMemo(() => {
        const ids = new Set<string>();
        watchForm.items?.add?.forEach((item) => item.product_id && ids.add(item.product_id));
        watchForm.items?.update?.forEach((item) => item.product_id && ids.add(item.product_id));
        updatableItems.forEach((item) => !item.isDirty && item.product_id && ids.add(item.product_id));
        return ids;
    }, [watchForm.items, updatableItems]);

    const handleSubmit = (data: PrFormValue) => {
        if (currentFormType === formType.EDIT) {
            console.log("update", data as PrUpdateFormValue);
        } else {
            console.log("create", data as PrCreateFormValue);
        }
    };

    const handleConfirmDelete = () => {
        if (!deletionTarget) return;

        switch (deletionTarget.type) {
            case "pristine":
                handleRemovePristineItem(deletionTarget.item);
                break;
            case "update":
                handleRemoveUpdateItem(deletionTarget.index);
                break;
            case "add":
                addRemove(deletionTarget.index);
                break;
        }
        setDeletionTarget(null);
    };


    const handleChangeFormType = (formType: formType) => {
        setCurrentFormType(formType);
    };

    const handleAddNewItem = () => {
        addAppend({ id: nanoid(), product_id: "", products: "", quantity: 0, unit: "" });
    };

    const handleProductSelect = (
        productId: string,
        context: { type: "add" | "update"; index: number } | { type: "pristine"; item: UpdatableItem }
    ) => {
        const product = mockProducts.find((p) => p.id === productId);
        if (!product) return;

        const newValues = {
            product_id: product.id,
            products: product.name,
            unit: product.inventory_unit.name,
        };

        if (context.type === "pristine") {
            const { ...itemForRHF } = { ...context.item, ...newValues, quantity: 0 };
            updateAppend(itemForRHF);
            setUpdatableItems((current) => current.filter((i) => i.id !== context.item.id));
        } else {
            form.setValue(`items.${context.type}.${context.index}.product_id`, newValues.product_id);
            form.setValue(`items.${context.type}.${context.index}.products`, newValues.products);
            form.setValue(`items.${context.type}.${context.index}.unit`, newValues.unit);
        }
    };

    const handleRemovePristineItem = (item: UpdatableItem) => {
        const currentRemoved = form.getValues("items.remove") || [];
        form.setValue("items.remove", [...currentRemoved, { id: item.id }]);
        setUpdatableItems((currentItems) => currentItems.filter((i) => i.id !== item.id));
    };

    const handleRemoveUpdateItem = (index: number) => {
        const itemToRemove = form.getValues("items.update")?.[index];
        if (itemToRemove?.id) {
            const currentRemoved = form.getValues("items.remove") || [];
            form.setValue("items.remove", [...currentRemoved, { id: itemToRemove.id }]);
        }
        updateRemove(index);
    };

    const isViewMode = currentFormType === formType.VIEW;

    return (
        <div className="space-y-4">
            <div className="flex gap-4">
                <Button onClick={() => handleChangeFormType(formType.ADD)}>Add</Button>
                <Button onClick={() => handleChangeFormType(formType.EDIT)}>Update</Button>
                <Button onClick={() => handleChangeFormType(formType.VIEW)}>View</Button>
            </div>
            <div>
                <h1 className="text-xl font-bold">Current Form Type: {currentFormType}</h1>
            </div>
            <div className="grid grid-cols-2 gap-8">
                <div>
                    <h2 className="text-lg font-semibold mb-2">PR Form</h2>
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
                            <FormField
                                control={form.control}
                                name="no"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>PR No.</FormLabel>
                                        <FormControl>
                                            <Input placeholder="PR No." {...field} disabled={isViewMode} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <Separator />
                            <h3 className="text-md font-semibold">Items</h3>

                            {/* Pristine Items (Only in Edit mode) */}
                            {currentFormType === formType.EDIT &&
                                updatableItems.map((item) => (
                                    <div key={item.id} className="flex gap-2 items-start p-2 border rounded-md border-dashed">
                                        <div className="grid grid-cols-3 gap-2 flex-grow">
                                            <FormItem>
                                                <FormLabel>Product</FormLabel>
                                                <Select onValueChange={(value) => handleProductSelect(value, { type: 'pristine', item })} defaultValue={item.product_id}>
                                                    <FormControl>
                                                        <SelectTrigger>
                                                            <SelectValue placeholder="Select a product" />
                                                        </SelectTrigger>
                                                    </FormControl>
                                                    <SelectContent>
                                                        {mockProducts.filter(p => !selectedProductIds.has(p.id) || p.id === item.product_id).map(p => (
                                                            <SelectItem key={p.id} value={p.id}>{p.name}</SelectItem>
                                                        ))}
                                                    </SelectContent>
                                                </Select>
                                            </FormItem>
                                            <FormItem><FormLabel>Quantity</FormLabel><FormControl><Input type="number" defaultValue={item.quantity} disabled /></FormControl></FormItem>
                                            <FormItem><FormLabel>Unit</FormLabel><FormControl><Input defaultValue={item.unit} disabled /></FormControl></FormItem>
                                        </div>
                                        <Button type="button" variant="destructive" size="icon" onClick={() => setDeletionTarget({ type: 'pristine', item })} aria-label="Remove Item"><Trash2 className="h-4 w-4" /></Button>
                                    </div>
                                ))}

                            {/* Updated Items (Dirty in Edit mode, or all in View mode) */}
                            <FormDisplay
                                fields={updateFields}
                                form={form}
                                formPath="items.update"
                                allProducts={mockProducts}
                                selectedProductIds={selectedProductIds}
                                isViewMode={isViewMode}
                                handleProductSelect={handleProductSelect}
                                setDeletionTarget={setDeletionTarget}
                            />

                            {/* Added Items */}
                            <FormDisplay
                                fields={addFields}
                                form={form}
                                formPath="items.add"
                                allProducts={mockProducts}
                                selectedProductIds={selectedProductIds}
                                isViewMode={isViewMode}
                                itemClassName="bg-green-50"
                                handleProductSelect={handleProductSelect}
                                setDeletionTarget={setDeletionTarget}
                            />

                            {!isViewMode && (<Button type="button" variant="outline" onClick={handleAddNewItem}>Add New Item</Button>)}
                            <Separator />
                            {!isViewMode && (<Button type="submit">{currentFormType === formType.ADD ? "Create PR" : "Update PR"}</Button>)}
                        </form>
                    </Form>
                </div>
                <div>
                    <JsonViewer data={mockPrDto} title="Mock PR DTO" />
                    <div className="mt-4"><JsonViewer data={watchForm} title="Watch Form Value" /></div>
                </div>
            </div>

            <AlertDialog open={!!deletionTarget} onOpenChange={(isOpen) => !isOpen && setDeletionTarget(null)}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                        <AlertDialogDescription>
                            This action cannot be undone. This will permanently delete the
                            item from the list.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={handleConfirmDelete}>Continue</AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>

        </div>
    );
}