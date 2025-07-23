import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion";
import { Separator } from "@/components/ui/separator";
import { TableCell, TableRow } from "@/components/ui/table";
import { formType } from "@/dtos/form.dto";
import { PurchaseRequestDetail, PurchaseRequestCreateFormDto, PurchaseRequestUpdateFormDto } from "@/dtos/purchase-request.dto";
import { UseFormReturn } from "react-hook-form";
import CardItem from "./CardItem";
import { format } from "date-fns";
import DateInput from "@/components/form-custom/DateInput";
import { FormField, FormControl, FormItem, FormLabel } from "@/components/ui/form";
import { LookupDeliveryPoint } from "@/components/lookup/DeliveryPointLookup";
import VendorRow from "./VendorRow";

interface ItemDetailAccordionProps {
    readonly index: number;
    readonly item: PurchaseRequestDetail;
    readonly mode: formType;
    readonly form: UseFormReturn<PurchaseRequestCreateFormDto | PurchaseRequestUpdateFormDto>;
}

export default function ItemDetailAccordion({
    index,
    item,
    mode,
    form
}: ItemDetailAccordionProps) {

    // ตรวจสอบว่าเป็น new item หรือ existing item
    const isNewItem = item.id?.startsWith('temp-') || false;

    // สร้าง field paths ที่ถูกต้องตามประเภท item
    const getFieldPath = (fieldName: string) => {
        if (mode === formType.ADD || isNewItem) {
            // สำหรับ new items ใช้ add array
            const newItemIndex = isNewItem ?
                (form.getValues("purchase_request_detail.add") || []).findIndex((_, i) =>
                    form.getValues(`purchase_request_detail.add.${i}`) !== undefined
                ) : index;
            return `purchase_request_detail.add.${newItemIndex >= 0 ? newItemIndex : index}.${fieldName}`;
        } else {
            // สำหรับ existing items ใช้ update array
            return `purchase_request_detail.update.${index}.${fieldName}`;
        }
    };

    const onHand = `${item.on_hand_qty} ${item.inventory_unit_name}`;
    const onOrder = `${item.on_order_qty} ${item.inventory_unit_name}`;
    const reOrderQty = `${item.re_order_qty} ${item.inventory_unit_name}`;
    const reStockQty = `${item.re_stock_qty} ${item.inventory_unit_name}`;
    const dateRequested = `${item.delivery_date}`;
    const deliveryPoint = `${item.delivery_point_name}`;

    const dpId = getFieldPath("delivery_point_id");

    return (
        <TableRow>
            <TableCell colSpan={8} className="p-0">
                <Accordion type="single" collapsible className="w-full">
                    <AccordionItem value={`item-${index}`}>
                        <div className="flex items-center gap-4 w-full px-2 py-2">
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
                            <CardItem title="On Hand" value={onHand} color="blue" />
                            <CardItem title="On Order" value={onOrder} color="orange" />
                            <CardItem title="Reorder Level" value={reOrderQty} color="yellow" />
                            <CardItem title="Restock Level" value={reStockQty} color="red" />

                            {mode === formType.VIEW ? (
                                <>
                                    <CardItem title="Date Requested" value={format(new Date(dateRequested), 'dd/MM/yyyy')} color="green" />
                                    <CardItem title="Delivery Point" value={deliveryPoint} color="purple" />
                                </>
                            ) : (
                                <>
                                    <FormField
                                        control={form.control}
                                        name={getFieldPath("delivery_date") as any}
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Date Requested</FormLabel>
                                                <FormControl>
                                                    <DateInput
                                                        field={{
                                                            ...field,
                                                            value: field.value || item.delivery_date || ""
                                                        }}
                                                    />
                                                </FormControl>
                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        control={form.control}
                                        name={getFieldPath("delivery_point_id") as any}
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Delivery Point</FormLabel>
                                                <FormControl>
                                                    <LookupDeliveryPoint
                                                        value={field.value}
                                                        onValueChange={(value) => field.onChange(value)}
                                                    />
                                                </FormControl>
                                            </FormItem>
                                        )}
                                    />
                                </>
                            )}
                        </div>
                        <Separator className="my-2" />
                        <VendorRow
                            index={index}
                            item={item}
                            mode={mode}
                            form={form}
                        />

                        <AccordionContent className="p-4 space-y-4 bg-muted">
                            {/* <BusinessDimensions />
                            <PricingCard
                                item={item}
                                // onItemUpdate={onUpdate}
                                mode={mode}
                            /> */}
                            hello content
                        </AccordionContent>
                    </AccordionItem>
                </Accordion>
            </TableCell>
        </TableRow>
    );
};
