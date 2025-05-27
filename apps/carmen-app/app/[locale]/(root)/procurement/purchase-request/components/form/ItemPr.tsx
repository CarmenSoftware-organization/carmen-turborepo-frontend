import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { formType } from "@/dtos/form.dto";
import { PurchaseRequestDetailItemDto } from "@/dtos/pr.dto";
import { Edit, Plus, Trash2 } from "lucide-react";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import useProduct from "@/hooks/useProduct";
import { useUnit } from "@/hooks/useUnit";
import { v4 as uuidv4 } from 'uuid';

interface ItemPrProps {
    readonly itemsPr: (PurchaseRequestDetailItemDto & { id?: string })[];
    readonly mode: formType;
    readonly openDetail: (e: React.MouseEvent, data: PurchaseRequestDetailItemDto & { id?: string }) => void;
    readonly onDeleteItem?: (itemId: string) => void;
}

export default function ItemPr({ itemsPr, mode, openDetail, onDeleteItem }: ItemPrProps) {
    const isDisabled = mode === formType.VIEW;
    const { getProductName } = useProduct();
    const { getUnitName } = useUnit();
    // Create empty item template for new items
    const handleAddNewItem = (e: React.MouseEvent) => {
        const tempId = `temp-${Date.now()}`;

        // Create empty item with required UUID fields
        const emptyItem: PurchaseRequestDetailItemDto & { id?: string } = {
            id: tempId,
            location_id: uuidv4(),
            product_id: uuidv4(),
            vendor_id: uuidv4(),
            price_list_id: uuidv4(),
            description: '',
            requested_qty: 0,
            requested_unit_id: uuidv4(),
            approved_qty: 0,
            approved_unit_id: uuidv4(),
            approved_base_qty: 0,
            approved_base_unit_id: uuidv4(),
            approved_conversion_rate: 0,
            requested_conversion_rate: 0,
            requested_base_qty: 0,
            requested_base_unit_id: uuidv4(),
            currency_id: uuidv4(),
            exchange_rate: 1.0,
            exchange_rate_date: new Date().toISOString(),
            price: 0.0,
            total_price: 0.0,
            foc: 0,
            foc_unit_id: uuidv4(),
            tax_type_inventory_id: uuidv4(),
            tax_type: '',
            tax_rate: 0.0,
            tax_amount: 0.0,
            is_tax_adjustment: false,
            is_discount: false,
            discount_rate: 0.0,
            discount_amount: 0.0,
            is_discount_adjustment: false,
            is_active: true,
            note: '',
            info: {
                specifications: ''
            },
            dimension: {
                project: '',
                cost_center: ''
            }
        };

        openDetail(e, emptyItem);
    };

    const handleDeleteItem = (itemId: string) => {
        if (onDeleteItem) {
            onDeleteItem(itemId);
        }
    };

    return (
        <Card>
            <CardHeader className="flex flex-row items-center justify-between p-4">
                <p className="text-sm font-medium px-2">Items Details</p>
                {!isDisabled && (
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={handleAddNewItem}
                        className="flex items-center gap-2"
                    >
                        <Plus className="h-4 w-4" />
                        Add Item
                    </Button>
                )}
            </CardHeader>
            <CardContent className="p-2">
                <Table>
                    <TableHeader className="bg-muted/80">
                        <TableRow>
                            <TableHead>Product ID</TableHead>
                            <TableHead>Description</TableHead>
                            <TableHead>Requested Qty</TableHead>
                            <TableHead>Approved Qty</TableHead>
                            <TableHead>Requested Inventory Unit</TableHead>
                            <TableHead>Approved Inventory Unit</TableHead>
                            <TableHead>Price</TableHead>
                            <TableHead>Total</TableHead>
                            {!isDisabled && (
                                <TableHead>Actions</TableHead>
                            )}
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {itemsPr.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={7} className="h-24 text-center">
                                    No items added yet.
                                </TableCell>
                            </TableRow>
                        ) : (
                            itemsPr.map((item, index) => (
                                <TableRow key={item.id ?? `item-${index}`}>
                                    <TableCell>{getProductName(item.product_id)}</TableCell>
                                    <TableCell>{item.description}</TableCell>
                                    <TableCell>{item.requested_qty} {getUnitName(item.requested_unit_id)}</TableCell>
                                    <TableCell>{item.approved_qty} {getUnitName(item.approved_unit_id)}</TableCell>
                                    <TableCell>{item.requested_qty} {getUnitName(item.requested_base_unit_id)}</TableCell>
                                    <TableCell>{item.approved_qty} {getUnitName(item.approved_base_unit_id)}</TableCell>
                                    <TableCell>{item.price}</TableCell>
                                    <TableCell>{item.total_price}</TableCell>
                                    {!isDisabled && (
                                        <TableCell>
                                            <div className="flex justify-center gap-1">
                                                <Button
                                                    size="sm"
                                                    variant="ghost"
                                                    onClick={(e) => openDetail(e, item)}
                                                    className="h-8 w-8"
                                                    disabled={isDisabled}
                                                >
                                                    <Edit className="h-4 w-4" />
                                                </Button>
                                                <Button
                                                    size="sm"
                                                    variant="ghost"
                                                    onClick={() => item.id && handleDeleteItem(item.id)}
                                                    className="h-8 w-8 text-destructive"
                                                    disabled={!item.id}
                                                >
                                                    <Trash2 className="h-4 w-4" />
                                                </Button>
                                            </div>
                                        </TableCell>
                                    )}
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </CardContent>
        </Card>
    );
}