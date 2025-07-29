"use client";

import { Button } from "@/components/ui/button";
import { TableCell } from "@/components/ui/table";
import LocationLookup from "@/components/lookup/LocationLookup";
import ProductLocationLookup from '@/components/lookup/ProductLocationLookup';
import UnitLookup from "@/components/lookup/UnitLookup";
import NumberInput from "@/components/form-custom/NumberInput";
import DateInput from "@/components/form-custom/DateInput";
import { MapPin, Package, Trash2 } from "lucide-react";
import { formType } from "@/dtos/form.dto";
import { PurchaseRequestDetail } from "@/dtos/purchase-request.dto";
import { format } from "date-fns";
import { Separator } from "@/components/ui/separator";
import { useAuth } from "@/context/AuthContext";
import { useCurrency } from "@/hooks/useCurrency";
import CurrencyLookup from "@/components/lookup/CurrencyLookup";
import { Checkbox } from "@/components/ui/checkbox";
import { buttonVariants, cellContentVariants } from "@/utils/framer-variants";
import { Input } from "@/components/ui/input";
import { Fragment } from "react";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import CardItem from "./CardItem";
import { LookupDeliveryPoint } from "@/components/lookup/DeliveryPointLookup";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import VendorRow from "./VendorRow";
import BusinessDimensions from "./BusinessDimensions";
import PricingCard from "./PricingCard";
import { AnimatePresence, MotionDiv, MotionP, MotionTr } from "@/components/framer-motion/MotionWrapper";
interface EditFieldItemProps {
    initValues?: PurchaseRequestDetail[];
    removedItems: Set<string>;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    updatedItems: { [key: string]: any };
    currentFormType: formType;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
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
        <AnimatePresence>
            {initValues?.filter(item => !removedItems.has(item.id)).map((item, index) => (
                <Fragment key={item.id}>
                    <MotionTr
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
                            <MotionDiv
                                variants={cellContentVariants}
                                initial="hidden"
                                animate="visible"
                            >
                                <Checkbox />
                            </MotionDiv>
                        </TableCell>
                        <TableCell>
                            <MotionDiv
                                variants={cellContentVariants}
                                initial="hidden"
                                animate="visible"
                            >
                                {index + 1}
                            </MotionDiv>
                        </TableCell>
                        <TableCell>
                            <MotionDiv
                                variants={cellContentVariants}
                                initial="hidden"
                                animate="visible"
                            >
                                {currentFormType === formType.VIEW ? (
                                    <div>
                                        <div className="flex items-center gap-2">
                                            <MotionDiv
                                                whileHover={{ scale: 1.1, rotate: 5 }}
                                                transition={{ duration: 0.2 }}
                                            >
                                                <MapPin className="h-4 w-4 text-blue-500" />
                                            </MotionDiv>
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
                            </MotionDiv>
                        </TableCell>
                        <TableCell>
                            <MotionDiv
                                variants={cellContentVariants}
                                initial="hidden"
                                animate="visible"
                            >
                                {currentFormType === formType.VIEW ? (
                                    <div className="flex gap-2">
                                        <MotionDiv
                                            whileHover={{ scale: 1.1, rotate: 5 }}
                                            transition={{ duration: 0.2 }}
                                        >
                                            <Package className="h-4 w-4 text-blue-500" />
                                        </MotionDiv>
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
                            </MotionDiv>
                        </TableCell>
                        <TableCell className="text-right">
                            <MotionDiv
                                variants={cellContentVariants}
                                initial="hidden"
                                animate="visible"
                            >
                                {currentFormType === formType.VIEW ? (
                                    <>
                                        <MotionP
                                            className="text-right font-semibold"
                                            whileHover={{ scale: 1.02 }}
                                            transition={{ duration: 0.2 }}
                                        >
                                            {item.requested_qty} {item.requested_unit_name || "-"}
                                        </MotionP>
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
                            </MotionDiv>
                        </TableCell>
                        <TableCell className="text-right">
                            <MotionDiv
                                variants={cellContentVariants}
                                initial="hidden"
                                animate="visible"
                            >
                                {currentFormType === formType.VIEW ? (
                                    <>
                                        <MotionP
                                            className="text-sm text-right font-semibold"
                                            whileHover={{ scale: 1.02 }}
                                            transition={{ duration: 0.2 }}
                                        >
                                            {item.approved_qty} {item.approved_unit_name || "-"}
                                        </MotionP>
                                        <Separator />
                                        <MotionP
                                            className="text-xs font-semibold text-blue-500"
                                            whileHover={{ scale: 1.02 }}
                                            transition={{ duration: 0.2 }}
                                        >
                                            FOC: {item.foc_qty} {item.foc_unit_name || "-"}
                                        </MotionP>
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
                            </MotionDiv>
                        </TableCell>
                        <TableCell className="text-right">
                            <MotionDiv
                                variants={cellContentVariants}
                                initial="hidden"
                                animate="visible"
                            >
                                {currentFormType === formType.VIEW ? (
                                    <>
                                        <MotionP
                                            className="text-sm text-right font-semibold"
                                            whileHover={{ scale: 1.02 }}
                                            transition={{ duration: 0.2 }}
                                        >
                                            {getCurrencyCode(item.currency_id)} {item.total_price}
                                        </MotionP>
                                        <MotionP
                                            className="text-xs font-semibold text-blue-500"
                                            whileHover={{ scale: 1.02 }}
                                            transition={{ duration: 0.2 }}
                                        >
                                            {currencyBase?.name} {item.base_total_price || 0}
                                        </MotionP>
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
                            </MotionDiv>
                        </TableCell>
                        <TableCell className="text-center">
                            <MotionDiv
                                variants={cellContentVariants}
                                initial="hidden"
                                animate="visible"
                            >
                                {currentFormType !== formType.VIEW && (
                                    <MotionDiv
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
                                            <MotionDiv
                                                whileHover={{ rotate: 10 }}
                                                transition={{ duration: 0.2 }}
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </MotionDiv>
                                        </Button>
                                    </MotionDiv>
                                )}
                            </MotionDiv>
                        </TableCell>
                    </MotionTr>
                    <MotionTr>
                        <TableCell colSpan={8}>
                            <Accordion type="single" collapsible className="w-full">
                                <AccordionItem value={`item-${index}`} className="space-y-4">
                                    <div className="flex items-center gap-4 w-full px-2">
                                        <AccordionTrigger
                                            iconPosition="left"
                                            className="p-0 h-5"
                                        />
                                        <div className="flex items-center gap-2 bg-blue-50 p-2 w-full border-l-4 border-blue-500">
                                            <p className="text-sm text-blue-500">
                                                {item.comment ? item.comment : "No comment"}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="grid grid-cols-6 gap-4">
                                        <CardItem title="On Hand" value={`${item.on_hand_qty} ${item.inventory_unit_name}`} color="blue" />
                                        <CardItem title="On Order" value={`${item.on_order_qty} ${item.inventory_unit_name}`} color="orange" />
                                        <CardItem title="Reorder Level" value={`${item.re_order_qty} ${item.inventory_unit_name}`} color="yellow" />
                                        <CardItem title="Restock Level" value={`${item.re_stock_qty} ${item.inventory_unit_name}`} color="red" />
                                        {currentFormType === formType.VIEW ? (
                                            <>
                                                <CardItem title="Date Requested" value={format(new Date(item.delivery_date), 'dd/MM/yyyy')} color="green" />
                                                <CardItem title="Delivery Point" value={item.delivery_point_name} color="purple" />
                                            </>
                                        ) : (
                                            <>
                                                <Card className={`flex items-center rounded-md justify-center h-20 bg-green-50 border border-green-200`}>
                                                    <div className="flex flex-col items-center justify-center gap-2">
                                                        <Label className="text-green-700">Date Requested</Label>
                                                        <DateInput
                                                            field={{
                                                                value: updatedItems[item.id]?.delivery_date ?? item.delivery_date,
                                                                onChange: (value) => onFieldUpdate(item, 'delivery_date', value)
                                                            }}
                                                        />
                                                    </div>
                                                </Card>
                                                <Card className={`flex items-center rounded-md justify-center h-20 bg-purple-50 border border-purple-200`}>
                                                    <div className="flex flex-col items-center justify-center gap-2">
                                                        <Label className="text-purple-700">Delivery Point</Label>
                                                        <LookupDeliveryPoint
                                                            value={updatedItems[item.id]?.delivery_point_id ?? item.delivery_point_id}
                                                            onValueChange={(value) => onFieldUpdate(item, 'delivery_point_id', value)}
                                                            className="w-32"
                                                        />
                                                    </div>
                                                </Card>
                                            </>
                                        )}

                                    </div>
                                    <Separator />
                                    <VendorRow item={item} />
                                    <AccordionContent className="p-4 space-y-4 bg-muted">
                                        <BusinessDimensions />
                                        <PricingCard
                                            item={item}
                                            onFieldUpdate={onFieldUpdate}
                                            mode={currentFormType}
                                        />
                                    </AccordionContent>
                                </AccordionItem>
                            </Accordion>
                        </TableCell>
                    </MotionTr>
                </Fragment>
            ))}
        </AnimatePresence>
    );
}   