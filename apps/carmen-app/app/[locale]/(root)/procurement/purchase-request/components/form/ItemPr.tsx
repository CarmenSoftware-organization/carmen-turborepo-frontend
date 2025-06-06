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
import { useStoreLocation } from "@/hooks/useStoreLocation";

interface ItemPrProps {
    readonly itemsPr: (PurchaseRequestDetailItemDto & { id: string })[];
    readonly mode: formType;
    readonly openDetail: (e: React.MouseEvent, data: PurchaseRequestDetailItemDto & { id?: string }) => void;
    readonly onDeleteItem?: (itemId: string) => void;
}

export default function ItemPr({ itemsPr, mode, openDetail, onDeleteItem }: ItemPrProps) {
    const isDisabled = mode === formType.VIEW;
    const { getProductName } = useProduct();
    const { getUnitName } = useUnit();
    const { getLocationName } = useStoreLocation();
    // Create empty item template for new items
    const handleAddNewItem = (e: React.MouseEvent) => {
        // Create empty item without ID - the reducer will generate UUID
        const emptyItem: Omit<PurchaseRequestDetailItemDto, 'id'> = {
            location_id: '',
            product_id: '',
            vendor_id: '',
            price_list_id: '',
            description: '',
            requested_qty: 0,
            requested_unit_id: '',
            approved_qty: 0,
            approved_unit_id: '',
            approved_base_qty: 0,
            approved_base_unit_id: '',
            approved_conversion_rate: 0,
            requested_conversion_rate: 0,
            requested_base_qty: 0,
            requested_base_unit_id: '',
            currency_id: '',
            exchange_rate: 1.0,
            exchange_rate_date: new Date().toISOString(),
            price: 0.0,
            total_price: 0.0,
            foc: 0,
            foc_unit_id: '',
            tax_type_inventory_id: '',
            tax_type: 'include',
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

        console.log('Creating new item without ID');
        openDetail(e, emptyItem as PurchaseRequestDetailItemDto & { id?: string });
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
                            <TableHead>Location</TableHead>
                            <TableHead>Product</TableHead>
                            <TableHead className="text-right">Requested</TableHead>
                            <TableHead className="text-right">Approved</TableHead>
                            <TableHead className="text-right">Price</TableHead>
                            <TableHead className="text-right">Total</TableHead>
                            {!isDisabled && (
                                <TableHead className="text-right">Actions</TableHead>
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
                            itemsPr.map((item) => (
                                <TableRow key={item.id}>
                                    <TableCell>{getLocationName(item.location_id)}</TableCell>
                                    <TableCell>
                                        <p>{getProductName(item.product_id)}</p>
                                        <p className="text-xs text-muted-foreground">{item.description}</p>

                                    </TableCell>
                                    <TableCell className="text-right">
                                        <div>
                                            <p>{item.requested_qty} {getUnitName(item.requested_unit_id)}</p>
                                        </div>
                                        <div>
                                            <p className="text-[10px] text-muted-foreground">{item.requested_base_qty} {getUnitName(item.requested_base_unit_id)}</p>
                                        </div>
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <div>
                                            <p>{item.approved_qty} {getUnitName(item.approved_unit_id)}</p>
                                        </div>
                                        <div>
                                            <p className="text-[10px] text-muted-foreground">{item.approved_base_qty} {getUnitName(item.approved_base_unit_id)}</p>
                                        </div>
                                    </TableCell>
                                    <TableCell className="text-right">{item.price} {item.currency_name}</TableCell>
                                    <TableCell className="text-right">{item.total_price} {item.currency_name}</TableCell>
                                    {!isDisabled && (
                                        <TableCell className="text-right">
                                            <div className="flex justify-end gap-1">
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