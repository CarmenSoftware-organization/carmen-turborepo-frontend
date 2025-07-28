"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { TableCell, TableRow } from "@/components/ui/table";
import LocationLookup from "@/components/lookup/LocationLookup";
import ProductLocationLookup from '@/components/lookup/ProductLocationLookup';
import UnitLookup from "@/components/lookup/UnitLookup";
import NumberInput from "@/components/form-custom/NumberInput";
import DateInput from "@/components/form-custom/DateInput";
import { Divide, MapPin, Package, Trash2 } from "lucide-react";
import { formType } from "@/dtos/form.dto";
import { PurchaseRequestDetail } from "@/dtos/purchase-request.dto";
import { format } from "date-fns";
import { Separator } from "@/components/ui/separator";
import { useAuth } from "@/context/AuthContext";
import { useCurrency } from "@/hooks/useCurrency";
import CurrencyLookup from "@/components/lookup/CurrencyLookup";
import { Checkbox } from "@/components/ui/checkbox";
import { fadeVariants, slideUpVariants, buttonVariants } from "@/utils/framer-variants";
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
    const { getCurrencyCode } = useCurrency();
    const { currencyBase } = useAuth();

    return (
        <>
            {initValues?.filter(item => !removedItems.has(item.id)).map((item, index) => (
                <motion.tr
                    key={item.id}
                    initial={{ opacity: 0, y: 20, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, x: -50, scale: 0.95 }}
                    layout
                    transition={{
                        duration: 0.4,
                        ease: "easeOut",
                        layout: { duration: 0.3 },
                        delay: index * 0.05
                    }}
                    className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted"
                >
                    <TableCell>
                        <motion.div
                            variants={cellContentVariants}
                            initial="hidden"
                            animate="visible"
                        >
                            <Checkbox />
                        </motion.div>
                    </TableCell>
                    <TableCell>
                        <motion.div
                            variants={cellContentVariants}
                            initial="hidden"
                            animate="visible"
                        >
                            {index + 1}
                        </motion.div>
                    </TableCell>
                    <TableCell>
                        <motion.div
                            variants={cellContentVariants}
                            initial="hidden"
                            animate="visible"
                        >
                            {currentFormType === formType.VIEW ? (
                                <div>
                                    <div className="flex items-center gap-2">
                                        <motion.div
                                            whileHover={{ scale: 1.1, rotate: 5 }}
                                            transition={{ duration: 0.2 }}
                                        >
                                            <MapPin className="h-4 w-4 text-blue-500" />
                                        </motion.div>
                                        <p className="text-sm font-medium">{item.location_name || "-"}</p>
                                    </div>
                                    <p className="text-xs text-muted-foreground">
                                        {item.stages_status ? item.stages_status : ''}
                                    </p>
                                </div>
                            ) : (
                                <LocationLookup
                                    value={updatedItems[item.id]?.location_id ?? item.location_id}
                                    onValueChange={(value) => onFieldUpdate(item, 'location_id', value)}
                                />
                            )}
                        </motion.div>
                    </TableCell>
                    <TableCell>
                        <motion.div
                            variants={cellContentVariants}
                            initial="hidden"
                            animate="visible"
                        >
                            {currentFormType === formType.VIEW ? (
                                <div className="flex gap-2">
                                    <motion.div
                                        whileHover={{ scale: 1.1, rotate: 5 }}
                                        transition={{ duration: 0.2 }}
                                    >
                                        <Package className="h-4 w-4 text-blue-500" />
                                    </motion.div>
                                    <div>
                                        <p>{item.product_name || "-"}</p>
                                        <p className="text-muted-foreground">{item.description}</p>
                                    </div>
                                </div>
                            ) : (
                                <div className="space-y-2">
                                    <ProductLocationLookup
                                        location_id={updatedItems[item.id]?.location_id ? updatedItems[item.id]?.location_id : item.location_id}
                                        value={updatedItems[item.id]?.product_id ?? item.product_id}
                                        onValueChange={(value, selectedProduct) => onFieldUpdate(item, 'product_id', value, selectedProduct)}
                                        disabled={!updatedItems[item.id]?.location_id && !item.location_id}
                                    />
                                    <Input
                                        value={updatedItems[item.id]?.description ?? item.description}
                                        onChange={(e) => onFieldUpdate(item, 'description', e.target.value)}
                                    />
                                </div>
                            )}
                        </motion.div>
                    </TableCell>
                    <TableCell className="text-right">
                        <motion.div
                            variants={cellContentVariants}
                            initial="hidden"
                            animate="visible"
                        >
                            {currentFormType === formType.VIEW ? (
                                <>
                                    <motion.p
                                        className="text-right font-semibold"
                                        whileHover={{ scale: 1.02 }}
                                        transition={{ duration: 0.2 }}
                                    >
                                        {item.requested_qty} {item.requested_unit_name || "-"}
                                    </motion.p>
                                    <p className="text-xs text-muted-foreground">
                                        (≈ {item.requested_base_qty} {item.inventory_unit_name || "-"})
                                    </p>
                                </>
                            ) : (
                                <div className="flex items-center gap-1 justify-end">
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
                                </div>
                            )}
                        </motion.div>
                    </TableCell>
                    <TableCell className="text-right">
                        <motion.div
                            variants={cellContentVariants}
                            initial="hidden"
                            animate="visible"
                        >
                            {currentFormType === formType.VIEW ? (
                                <>
                                    <motion.p
                                        className="text-sm text-right font-semibold"
                                        whileHover={{ scale: 1.02 }}
                                        transition={{ duration: 0.2 }}
                                    >
                                        {item.approved_qty} {item.approved_unit_name || "-"}
                                    </motion.p>
                                    <Separator />
                                    <motion.p
                                        className="text-xs font-semibold text-blue-500"
                                        whileHover={{ scale: 1.02 }}
                                        transition={{ duration: 0.2 }}
                                    >
                                        FOC: {item.foc_qty} {item.foc_unit_name || "-"}
                                    </motion.p>
                                </>
                            ) : (
                                <div className="flex flex-col gap-1">
                                    <div className="flex items-center gap-2 justify-end">
                                        <NumberInput
                                            value={updatedItems[item.id]?.approved_qty ?? item.approved_qty}
                                            onChange={(value) => onFieldUpdate(item, 'approved_qty', value)}
                                            classNames="w-20"
                                        />
                                        <UnitLookup
                                            value={updatedItems[item.id]?.approved_unit_id ?? item.approved_unit_id}
                                            onValueChange={(value) => onFieldUpdate(item, 'approved_unit_id', value)}
                                            classNames="w-20"
                                        />
                                    </div>
                                    <div className="flex items-center gap-2 justify-end">
                                        <p>FOC:</p>
                                        <NumberInput
                                            value={updatedItems[item.id]?.foc_qty ?? item.foc_qty}
                                            onChange={(value) => onFieldUpdate(item, 'foc_qty', value)}
                                            classNames="w-20"
                                        />
                                        <UnitLookup
                                            value={updatedItems[item.id]?.foc_unit_id ?? item.foc_unit_id}
                                            onValueChange={(value) => onFieldUpdate(item, 'foc_unit_id', value)}
                                            classNames="w-20"
                                        />
                                    </div>
                                </div>
                            )}
                        </motion.div>
                    </TableCell>
                    <TableCell className="text-right">
                        <motion.div
                            variants={cellContentVariants}
                            initial="hidden"
                            animate="visible"
                        >
                            {currentFormType === formType.VIEW ? (
                                <>
                                    <motion.p
                                        className="text-sm text-right font-semibold"
                                        whileHover={{ scale: 1.02 }}
                                        transition={{ duration: 0.2 }}
                                    >
                                        {getCurrencyCode(item.currency_id)} {item.total_price}
                                    </motion.p>
                                    <motion.p
                                        className="text-xs font-semibold text-blue-500"
                                        whileHover={{ scale: 1.02 }}
                                        transition={{ duration: 0.2 }}
                                    >
                                        {currencyBase?.name} {item.base_total_price || 0}
                                    </motion.p>
                                </>
                            ) : (
                                <div className="flex items-center gap-2 justify-end">
                                    <CurrencyLookup
                                        value={updatedItems[item.id]?.currency_id ?? item.currency_id}
                                        onValueChange={(value) => onFieldUpdate(item, 'currency_id', value)}
                                        classNames="w-20"
                                    />
                                    <NumberInput
                                        value={updatedItems[item.id]?.total_price ?? item.total_price}
                                        onChange={(value) => onFieldUpdate(item, 'total_price', value)}
                                        classNames="w-20"
                                    />
                                </div>
                            )}
                        </motion.div>
                    </TableCell>
                    <TableCell className="text-center">
                        <motion.div
                            variants={cellContentVariants}
                            initial="hidden"
                            animate="visible"
                        >
                            {currentFormType !== formType.VIEW && (
                                <motion.div
                                    variants={buttonVariants}
                                    initial="idle"
                                    whileHover="hover"
                                    whileTap="tap"
                                >
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        onClick={() => onRemoveItemClick(item.id)}
                                        className="hover:bg-red-50 hover:text-red-600 transition-colors duration-200"
                                    >
                                        <motion.div
                                            whileHover={{ rotate: 10 }}
                                            transition={{ duration: 0.2 }}
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </motion.div>
                                    </Button>
                                </motion.div>
                            )}
                        </motion.div>
                    </TableCell>
                </motion.tr>
            ))}
        </>
    );
}   