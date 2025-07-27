import React from 'react';
import {
    Table,
    TableBody,
    TableCell,
    TableRow,
} from '@/components/ui/table';
import { Checkbox } from '@/components/ui/checkbox';
import { Separator } from '@/components/ui/separator';
import { MapPin, Package, Trash2 } from 'lucide-react';
import { UpdatableItem, DeletionTarget } from './MainForm';
import TableRowMotion from '@/components/framer-motion/TableRowMotion';
import TableHeadItemPr from './TableHeadItemPr';
import { formType } from '@/dtos/form.dto';
import LocationLookup from "@/components/lookup/LocationLookup";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { motion } from "framer-motion";
import { buttonVariants } from "@/utils/framer-variants";
import ProductLocationLookup from '@/components/lookup/ProductLocationLookup';

interface EditItemsProps {
    readonly currentFormType: formType;
    readonly updatableItems: UpdatableItem[];
    readonly handleProductSelect: (
        productId: string,
        context: { type: "add" | "update"; index: number } | { type: "pristine"; item: UpdatableItem }
    ) => void;
    readonly setDeletionTarget: (target: DeletionTarget | null) => void;
}

export default function EditItems({
    currentFormType,
    updatableItems,
    handleProductSelect,
    setDeletionTarget,
}: EditItemsProps) {
    if (currentFormType !== formType.EDIT) return null;

    return (
        <div>
            {updatableItems.map((item, index) => (
                <TableRowMotion key={item.id} index={index}>
                    <Table>
                        <TableHeadItemPr mode={currentFormType} />
                        <TableBody>
                            <TableRow className="bg-blue-50/50 hover:bg-blue-50 transition-colors">
                                <TableCell>
                                    <Checkbox />
                                </TableCell>
                                <TableCell>{index + 1}</TableCell>
                                <TableCell>
                                    <LocationLookup
                                        value={item.location_id}
                                        onValueChange={(value) => {
                                            handleProductSelect(value, { type: 'update', index });
                                        }}
                                    />
                                </TableCell>
                                <TableCell>
                                    <ProductLocationLookup
                                        location_id={item.location_id}
                                        value={item.product_id}
                                        onValueChange={(value, inventoryUnit) => {
                                            console.log('inventoryUnit', inventoryUnit);
                                            handleProductSelect(value, {
                                                type: 'pristine',
                                                item: {
                                                    ...item,
                                                    inventory_unit_id: inventoryUnit?.id || '',
                                                    inventory_unit_name: inventoryUnit?.name || ''
                                                }
                                            });
                                        }}
                                        placeholder={"Select product"}
                                        disabled={!item.location_id}
                                    />
                                </TableCell>
                                <TableCell className="w-[120px]">
                                    <div className="space-y-2">
                                        <div className="text-right">
                                            <p className="text-sm text-right font-semibold">
                                                {item.requested_qty} {item.requested_unit_name || "-"}
                                            </p>
                                            <p className="text-xs text-muted-foreground">
                                                (≈ {item.requested_base_qty} {item.inventory_unit_name || "-"})
                                            </p>
                                        </div>
                                        <Input
                                            type="number"
                                            defaultValue={item.requested_qty}
                                            className="text-right"
                                            placeholder="Qty"
                                        />
                                    </div>
                                </TableCell>
                                <TableCell className="w-[100px] text-right">
                                    <p className="text-sm text-right font-semibold">
                                        {item.approved_qty} {item.approved_unit_name || "-"}
                                    </p>
                                    <Separator />
                                    <p className="text-xs font-semibold text-blue-500">
                                        FOC: {item.foc_qty} {item.foc_unit_name || "-"}
                                    </p>
                                </TableCell>
                                <TableCell className="w-[100px] text-right">
                                    <p className="text-sm text-right font-semibold">
                                        THB {item.total_price}
                                    </p>
                                    <p className="text-xs font-semibold text-blue-500">
                                        THB {item.base_total_price}
                                    </p>
                                </TableCell>
                                <TableCell className="w-[120px] text-right">
                                    <motion.div
                                        variants={buttonVariants}
                                        initial="idle"
                                        whileHover="hover"
                                        whileTap="tap"
                                    >
                                        <Button
                                            variant="ghost"
                                            onClick={() => setDeletionTarget({ type: 'pristine', item })}
                                            className="h-10 w-10 p-0 text-destructive hover:bg-destructive/10"
                                        >
                                            <Trash2 className="h-4 w-4" />
                                        </Button>
                                    </motion.div>
                                </TableCell>
                            </TableRow>
                        </TableBody>
                    </Table>
                </TableRowMotion>
            ))}
        </div>
    );
}
