import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion";
import { Separator } from "@/components/ui/separator";
import { TableCell, TableRow } from "@/components/ui/table";
import { PurchaseRequestDetailItem } from "@/dtos/pr.dto";
import { formType } from "@/dtos/form.dto";
import BusinessDimensions from "./BusinessDimensions";
import OnHandAndOrder from "./OnHandAndOrder";
import PricingCard from "./PricingCard";
import VendorFields from "./VendorFields";

interface ItemDetailAccordionProps {
    index: number;
    item: PurchaseRequestDetailItem;
    mode: formType;
    onUpdate: (field: keyof PurchaseRequestDetailItem, value: any) => void;
}

/**
 * ItemDetailAccordion component
 * 
 * Displays additional item details in an expandable accordion
 * Includes comment display, on-hand information, vendor fields, business dimensions, and pricing
 */
export default function ItemDetailAccordion({
    index,
    item,
    mode,
    onUpdate,
}: ItemDetailAccordionProps) {
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
                        <OnHandAndOrder />
                        <Separator />
                        <VendorFields item={item} />
                        <AccordionContent className="p-4 space-y-4 bg-muted">
                            <BusinessDimensions />
                            <PricingCard
                                item={item}
                                onItemUpdate={onUpdate}
                                mode={mode}
                            />
                        </AccordionContent>
                    </AccordionItem>
                </Accordion>
            </TableCell>
        </TableRow>
    );
}