"use client";

import { Button } from "@/components/ui/button";
import { FormControl, FormField, FormItem } from "@/components/ui/form";
import { TableCell, TableRow } from "@/components/ui/table";
import LocationLookup from "@/components/lookup/LocationLookup";
import ProductLocationLookup from '@/components/lookup/ProductLocationLookup';
import UnitLookup from "@/components/lookup/UnitLookup";
import NumberInput from "@/components/form-custom/NumberInput";
import DateInput from "@/components/form-custom/DateInput";
import { Trash2 } from "lucide-react";
import { UseFormReturn, FieldArrayWithId } from "react-hook-form";

interface AddfieldItemProps {
    form: UseFormReturn<any>;
    addFields: FieldArrayWithId<any, "purchase_request_detail.add", "id">[];
    onRemoveItemClick: (id: string, isAddItem: boolean, addIndex?: number) => void;
}

export default function AddfieldItem({
    form,
    addFields,
    onRemoveItemClick
}: AddfieldItemProps) {
    return (
        <>
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
                        <FormField
                            control={form.control}
                            name={`purchase_request_detail.add.${index}.delivery_date`}
                            render={({ field }) => (
                                <FormItem>
                                    <FormControl>
                                        <DateInput
                                            key={`date-${item.id}-${index}`}
                                            field={{
                                                value: field.value,
                                                onChange: (value: string) => {
                                                    field.onChange(value);
                                                    form.trigger(`purchase_request_detail.add.${index}.delivery_date`);
                                                }
                                            }}
                                            wrapWithFormControl={false}
                                        />
                                    </FormControl>
                                </FormItem>
                            )}
                        />
                    </TableCell>
                    <TableCell className="text-center">
                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => onRemoveItemClick(item.id, true, index)}
                        >
                            <Trash2 className="w-4 h-4" />
                        </Button>
                    </TableCell>
                </TableRow>
            ))}
        </>
    );
}