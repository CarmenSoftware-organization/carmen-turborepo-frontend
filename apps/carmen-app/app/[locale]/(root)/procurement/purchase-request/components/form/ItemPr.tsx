import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { formType } from "@/dtos/form.dto";
import { ItemPrDetailDto } from "@/dtos/pr.dto";
import { Edit, Plus, Trash2 } from "lucide-react";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
interface ItemPrProps {
    readonly itemsPr: ItemPrDetailDto[];
    readonly mode: formType;
    readonly openDetail: (e: React.MouseEvent, data: ItemPrDetailDto) => void;
    readonly onDeleteItem?: (itemId: string) => void;
}

export default function ItemPr({ itemsPr, mode, openDetail, onDeleteItem }: ItemPrProps) {
    const isDisabled = mode === formType.VIEW;

    // Create empty item template for new items
    const handleAddNewItem = (e: React.MouseEvent) => {
        // Generate a temporary unique ID for this item
        const tempId = `temp-${Date.now()}`;

        // Create empty item with required fields
        const emptyItem: ItemPrDetailDto = {
            id: tempId,
            location_id: '',
            location_name: '',
            product_id: '',
            product_name: '',
            vendor_id: '',
            vendor_name: '',
            price_list_id: '',
            description: '',

            requested_qty: 0,
            requested_unit_id: '',
            requested_unit_name: '',

            approved_qty: 0,
            approved_unit_id: '',
            approved_unit_name: '',

            approved_base_qty: 0,
            approved_base_unit_id: '',
            approved_conversion_rate: 0,
            approved_base_unit_name: '',

            requested_conversion_rate: 0,
            requested_inventory_qty: 0,
            requested_inventory_unit_id: '',
            requested_inventory_unit_name: '',

            currency_id: '',
            currency_name: null,
            exchange_rate: 0,
            dimension: {
                project: '',
                cost_center: ''
            },
            price: 0,
            total_price: 0,
            foc: 0,
            foc_unit_id: '',
            foc_unit_name: '',
            tax_type_inventory_id: '',
            tax_type: ''
        };

        console.log("Creating new item with ID:", tempId);
        openDetail(e, emptyItem);
    };

    const handleDeleteItem = (itemId: string) => {
        if (onDeleteItem) {
            onDeleteItem(itemId);
        }
    };

    // Calculate total amount
    // const totalAmount = itemsPr.reduce((sum, item) => sum + (item.total_price || 0), 0);

    // Ensure each row has a valid unique key
    const getItemKey = (item: ItemPrDetailDto, index: number): string => {
        if (item.id) return item.id;
        if (item.product_id) return `product-${item.product_id}`;
        return `row-${index}`;
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
                            <TableHead>Locations</TableHead>
                            <TableHead>Product</TableHead>
                            <TableHead>Order Unit</TableHead>
                            <TableHead>
                                <p className="text-xs">Requested</p>
                                <p className="text-xs">Qty / Unit</p>
                            </TableHead>
                            <TableHead>
                                <p className="text-xs">Approved</p>
                                <p className="text-xs">Qty / Unit</p>
                            </TableHead>
                            <TableHead>Currency Base</TableHead>
                            <TableHead>Price</TableHead>
                            <TableHead>Total</TableHead>
                            <TableHead>Status</TableHead>
                            {!isDisabled && (
                                <TableHead>Actions</TableHead>
                            )}
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {itemsPr.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={6} className="h-24 text-center">
                                    No items added yet.
                                </TableCell>
                            </TableRow>
                        ) : (
                            itemsPr.map((item, index) => (
                                <TableRow key={getItemKey(item, index)}>
                                    <TableCell>
                                        {item.location_name}
                                    </TableCell>
                                    <TableCell>
                                        <div className="truncate">
                                            <p className="font-medium">{item.product_name}</p>
                                            <p className="text-xs text-muted-foreground mt-1">
                                                {item.description ?? 'No description'}
                                            </p>
                                        </div>
                                    </TableCell>
                                    <TableCell>{item.approved_base_unit_name ?? '-'}</TableCell>
                                    <TableCell className="text-center">
                                        <div className="flex flex-row items-center gap-2">
                                            <p className="text-xs">{item.requested_qty}</p>
                                            <p className="text-xs font-semibold">{item.requested_unit_name}</p>
                                        </div>
                                    </TableCell>
                                    <TableCell className="text-center">
                                        <div className="flex flex-row items-center gap-2">
                                            <p className="text-xs">{item.approved_qty}</p>
                                            <p className="text-xs font-semibold">{item.approved_unit_name}</p>
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        {item.currency_name}
                                    </TableCell>
                                    <TableCell>
                                        {item.price}
                                    </TableCell>
                                    <TableCell>
                                        {item.total_price}
                                    </TableCell>
                                    <TableCell>
                                        รอ api
                                    </TableCell>
                                    {!isDisabled && (
                                        <TableCell>
                                            <div className="flex justify-center">
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