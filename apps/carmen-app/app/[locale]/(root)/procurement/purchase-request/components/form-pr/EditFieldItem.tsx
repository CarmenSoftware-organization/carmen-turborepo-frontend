"use client";

import { Button } from "@/components/ui/button";
import { TableCell, TableRow } from "@/components/ui/table";
import LocationLookup from "@/components/lookup/LocationLookup";
import ProductLocationLookup from '@/components/lookup/ProductLocationLookup';
import UnitLookup from "@/components/lookup/UnitLookup";
import NumberInput from "@/components/form-custom/NumberInput";
import DateInput from "@/components/form-custom/DateInput";
import { Trash2 } from "lucide-react";
import { formType } from "@/dtos/form.dto";
import { PurchaseRequestDetail } from "@/dtos/purchase-request.dto";
import { format } from "date-fns";

interface EditFieldItemProps {
    initValues?: PurchaseRequestDetail[];
    removedItems: Set<string>;
    updatedItems: { [key: string]: any };
    currentFormType: formType;
    onFieldUpdate: (item: any, fieldName: string, value: any, selectedProduct?: any) => void;
    onRemoveItemClick: (id: string, isAddItem?: boolean, addIndex?: number) => void;
}

export default function EditFieldItem({
    initValues,
    removedItems,
    updatedItems,
    currentFormType,
    onFieldUpdate,
    onRemoveItemClick
}: EditFieldItemProps) {
    return (
        <>
            {initValues?.filter(item => !removedItems.has(item.id)).map((item) => (
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
                        {currentFormType === formType.VIEW ? (
                            <span>{format(new Date(item.delivery_date), "yyyy-MM-dd")}</span>
                        ) : (
                            <DateInput
                                field={{
                                    value: updatedItems[item.id]?.delivery_date ?? item.delivery_date,
                                    onChange: (value: string) => onFieldUpdate(item, 'delivery_date', value)
                                }}
                                wrapWithFormControl={false}
                            />
                        )}
                    </TableCell>
                    <TableCell className="text-center">
                        {currentFormType !== formType.VIEW && (
                            <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => onRemoveItemClick(item.id)}
                            >
                                <Trash2 className="w-4 h-4" />
                            </Button>
                        )}
                    </TableCell>
                </TableRow>
            ))}
        </>
    );
}   