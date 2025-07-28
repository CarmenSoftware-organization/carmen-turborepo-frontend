"use client";

import { motion, AnimatePresence } from "framer-motion";
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
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Checkbox } from "@/components/ui/checkbox";
import { buttonVariants } from "@/utils/framer-variants";
import { Input } from "@/components/ui/input";

const cellContentVariants = {
    hidden: { opacity: 0, scale: 0.9 },
    visible: {
        opacity: 1,
        scale: 1,
        transition: {
            duration: 0.3,
            delay: 0.1
        }
    }
};

const inputVariants = {
    focus: {
        scale: 1.02,
        transition: { duration: 0.2 }
    },
    blur: {
        scale: 1,
        transition: { duration: 0.2 }
    }
};

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
                <motion.tr
                    key={item.id || `add-${index}`}
                    initial={{ opacity: 0, y: 20, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, x: -50, scale: 0.95 }}
                    layout
                    transition={{
                        duration: 0.5,
                        ease: "easeOut",
                        layout: { duration: 0.3 },
                        delay: index * 0.08
                    }}
                    className="border-b border-blue-100 transition-colors hover:bg-blue-50/30 data-[state=selected]:bg-blue-50"
                >
                    <TableCell>
                        <motion.div
                            variants={cellContentVariants}
                            initial="hidden"
                            animate="visible"
                        >
                            <motion.div
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.95 }}
                                transition={{ duration: 0.2 }}
                            >
                                <Checkbox />
                            </motion.div>
                        </motion.div>
                    </TableCell>
                    <TableCell>
                        <motion.div
                            variants={cellContentVariants}
                            initial="hidden"
                            animate="visible"
                        >
                            <motion.span
                                className="inline-flex items-center justify-center w-6 h-6 text-xs font-semibold text-blue-600 bg-blue-100 rounded-full"
                                whileHover={{ scale: 1.1, rotate: 5 }}
                                transition={{ duration: 0.2 }}
                            >
                                +
                            </motion.span>
                        </motion.div>
                    </TableCell>
                    <TableCell>
                        <motion.div
                            variants={cellContentVariants}
                            initial="hidden"
                            animate="visible"
                        >
                            <FormField
                                control={form.control}
                                name={`purchase_request_detail.add.${index}.location_id`}
                                render={({ field }) => (
                                    <FormItem>
                                        <FormControl>
                                            <motion.div
                                                variants={inputVariants}
                                                whileFocus="focus"
                                                initial="blur"
                                            >
                                                <LocationLookup
                                                    value={field.value}
                                                    onValueChange={(value) => {
                                                        field.onChange(value);
                                                    }}
                                                />
                                            </motion.div>
                                        </FormControl>
                                    </FormItem>
                                )}
                            />
                        </motion.div>
                    </TableCell>
                    <TableCell>
                        <motion.div
                            variants={cellContentVariants}
                            initial="hidden"
                            animate="visible"
                            className="space-y-2"
                        >
                            <FormField
                                control={form.control}
                                name={`purchase_request_detail.add.${index}.product_id`}
                                render={({ field }) => {
                                    const currentLocationId = form.watch(`purchase_request_detail.add.${index}.location_id`) ?? '';

                                    return (
                                        <FormItem>
                                            <FormControl>
                                                <motion.div
                                                    variants={inputVariants}
                                                    whileFocus="focus"
                                                    initial="blur"
                                                >
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
                                                </motion.div>
                                            </FormControl>
                                        </FormItem>
                                    );
                                }}
                            />
                            <FormField
                                control={form.control}
                                name={`purchase_request_detail.add.${index}.description`}
                                render={({ field }) => (
                                    <FormItem>
                                        <FormControl>
                                            <Input value={field.value} onChange={field.onChange} />
                                        </FormControl>
                                    </FormItem>
                                )}
                            />
                        </motion.div>
                    </TableCell>
                    <TableCell className="text-right flex items-center justify-end gap-2">
                        <motion.div
                            variants={cellContentVariants}
                            initial="hidden"
                            animate="visible"
                            className="flex items-center justify-center gap-2"
                        >
                            <FormField
                                control={form.control}
                                name={`purchase_request_detail.add.${index}.requested_qty`}
                                render={({ field }) => (
                                    <FormItem>
                                        <FormControl>
                                            <motion.div
                                                variants={inputVariants}
                                                whileFocus="focus"
                                                initial="blur"
                                            >
                                                <NumberInput
                                                    value={field.value}
                                                    onChange={field.onChange}
                                                />
                                            </motion.div>
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
                                            <motion.div
                                                variants={inputVariants}
                                                whileFocus="focus"
                                                initial="blur"
                                            >
                                                <UnitLookup
                                                    value={field.value}
                                                    onValueChange={field.onChange}
                                                />
                                            </motion.div>
                                        </FormControl>
                                    </FormItem>
                                )}
                            />
                        </motion.div>
                    </TableCell>
                    <TableCell>
                        <motion.div
                            variants={cellContentVariants}
                            initial="hidden"
                            animate="visible"
                        >
                            <FormField
                                control={form.control}
                                name={`purchase_request_detail.add.${index}.delivery_date`}
                                render={({ field }) => (
                                    <FormItem>
                                        <FormControl>
                                            <motion.div
                                                variants={inputVariants}
                                                whileFocus="focus"
                                                initial="blur"
                                            >
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
                                            </motion.div>
                                        </FormControl>
                                    </FormItem>
                                )}
                            />
                        </motion.div>
                    </TableCell>
                    <TableCell className="text-center">
                        <motion.div
                            variants={cellContentVariants}
                            initial="hidden"
                            animate="visible"
                        >
                            <motion.div
                                variants={buttonVariants}
                                initial="idle"
                                whileHover="hover"
                                whileTap="tap"
                            >
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => onRemoveItemClick(item.id, true, index)}
                                    className="hover:bg-red-50 hover:text-red-600 transition-colors duration-200"
                                >
                                    <motion.div
                                        whileHover={{ rotate: 15, scale: 1.1 }}
                                        transition={{ duration: 0.2 }}
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </motion.div>
                                </Button>
                            </motion.div>
                        </motion.div>
                    </TableCell>
                </motion.tr>
            ))}
        </>
    );
}