import { Button } from "@/components/ui/button";
import { Table, TableCell, TableBody, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { mockItemDetailPrData } from "@/mock-data/procurement";
import { useState } from "react";
import { ItemDetailPrDto } from "@/dtos/procurement.dto";
import { Plus, Check, X } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { useStoreLocation } from "@/hooks/useStoreLocation";

const prStatusColor = (status: string) => {
    if (status === 'Approved') {
        return 'bg-green-100 text-green-800'
    } else if (status === 'Pending') {
        return 'bg-yellow-100 text-yellow-800'
    } else if (status === 'Rejected') {
        return 'bg-red-100 text-red-800'
    }
}

const defaultNewItem: Partial<ItemDetailPrDto> = {
    location: '',
    product_name: '',
    description: '',
    order_unit: '',
    inv_unit: '',
    request_qty: 0,
    on_order_qty: 0,
    approved_qty: 0,
    on_hand_qty: 0,
    base_currency: '',
    price: 0,
    total_price: 0,
    status: 'Pending'
};

export default function ItemPr() {
    const [isEditing, setIsEditing] = useState(false);
    const [items, setItems] = useState<ItemDetailPrDto[]>(mockItemDetailPrData);
    const [newItem, setNewItem] = useState<Partial<ItemDetailPrDto>>(defaultNewItem);
    const { storeLocations } = useStoreLocation();

    console.log('storeLocations', storeLocations);


    const handleInputChange = (field: keyof ItemDetailPrDto, value: string | number) => {
        setNewItem(prev => ({
            ...prev,
            [field]: value
        }));
    };

    const handleSave = () => {
        const itemToAdd = {
            ...newItem,
            id: Date.now().toString(),
            total_price: Number(newItem.price) * Number(newItem.request_qty)
        } as ItemDetailPrDto;

        setItems(prev => [...prev, itemToAdd]);
        setIsEditing(false);
        setNewItem(defaultNewItem);
    };

    const handleCancel = () => {
        setIsEditing(false);
        setNewItem(defaultNewItem);
    };

    return (
        <div className="space-y-4">
            <div className="flex justify-end">
                <Button
                    size={'sm'}
                    onClick={() => setIsEditing(true)}
                    disabled={isEditing}
                >
                    <Plus className="h-4 w-4" />
                    Add Item
                </Button>
            </div>
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Location</TableHead>
                        <TableHead>Product Name</TableHead>
                        <TableHead>Description</TableHead>
                        <TableHead>Order Unit</TableHead>
                        <TableHead>Inventory Unit</TableHead>
                        <TableHead>Request Qty</TableHead>
                        <TableHead>On Order Qty</TableHead>
                        <TableHead>Approved Qty</TableHead>
                        <TableHead>On Hand Qty</TableHead>
                        <TableHead>Base Currency</TableHead>
                        <TableHead>Price</TableHead>
                        <TableHead>Total Price</TableHead>
                        <TableHead>Status</TableHead>
                        {isEditing && <TableHead>Actions</TableHead>}
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {items.map((item) => (
                        <TableRow key={item.id}>
                            <TableCell>{item.location}</TableCell>
                            <TableCell>{item.product_name}</TableCell>
                            <TableCell>{item.description}</TableCell>
                            <TableCell>{item.order_unit}</TableCell>
                            <TableCell>{item.inv_unit}</TableCell>
                            <TableCell>{item.request_qty}</TableCell>
                            <TableCell>{item.on_order_qty}</TableCell>
                            <TableCell>{item.approved_qty}</TableCell>
                            <TableCell>{item.on_hand_qty}</TableCell>
                            <TableCell>{item.base_currency}</TableCell>
                            <TableCell>{item.price}</TableCell>
                            <TableCell>{item.total_price}</TableCell>
                            <TableCell>
                                <Badge variant="outline" className={`rounded-full ${prStatusColor(item.status ?? '')}`}>
                                    {item.status}
                                </Badge>
                            </TableCell>
                            {isEditing && <TableCell />}
                        </TableRow>
                    ))}
                    {isEditing && (
                        <TableRow>
                            <TableCell>
                                <Input
                                    value={newItem.location}
                                    onChange={(e) => handleInputChange('location', e.target.value)}
                                    className="w-full"
                                />
                            </TableCell>
                            <TableCell>
                                <Input
                                    value={newItem.product_name}
                                    onChange={(e) => handleInputChange('product_name', e.target.value)}
                                    className="w-full"
                                />
                            </TableCell>
                            <TableCell>
                                <Input
                                    value={newItem.description}
                                    onChange={(e) => handleInputChange('description', e.target.value)}
                                    className="w-full"
                                />
                            </TableCell>
                            <TableCell>
                                <Input
                                    value={newItem.order_unit}
                                    onChange={(e) => handleInputChange('order_unit', e.target.value)}
                                    className="w-full"
                                />
                            </TableCell>
                            <TableCell>
                                <Input
                                    value={newItem.inv_unit}
                                    onChange={(e) => handleInputChange('inv_unit', e.target.value)}
                                    className="w-full"
                                />
                            </TableCell>
                            <TableCell>
                                <Input
                                    type="number"
                                    value={newItem.request_qty}
                                    onChange={(e) => handleInputChange('request_qty', Number(e.target.value))}
                                    className="w-full"
                                />
                            </TableCell>
                            <TableCell>
                                <Input
                                    type="number"
                                    value={newItem.on_order_qty}
                                    onChange={(e) => handleInputChange('on_order_qty', Number(e.target.value))}
                                    className="w-full"
                                />
                            </TableCell>
                            <TableCell>
                                <Input
                                    type="number"
                                    value={newItem.approved_qty}
                                    onChange={(e) => handleInputChange('approved_qty', Number(e.target.value))}
                                    className="w-full"
                                />
                            </TableCell>
                            <TableCell>
                                <Input
                                    type="number"
                                    value={newItem.on_hand_qty}
                                    onChange={(e) => handleInputChange('on_hand_qty', Number(e.target.value))}
                                    className="w-full"
                                />
                            </TableCell>
                            <TableCell>
                                <Input
                                    value={newItem.base_currency}
                                    onChange={(e) => handleInputChange('base_currency', e.target.value)}
                                    className="w-full"
                                />
                            </TableCell>
                            <TableCell>
                                <Input
                                    type="number"
                                    value={newItem.price}
                                    onChange={(e) => handleInputChange('price', Number(e.target.value))}
                                    className="w-full"
                                />
                            </TableCell>
                            <TableCell>
                                {Number(newItem.price) * Number(newItem.request_qty)}
                            </TableCell>
                            <TableCell>
                                <Badge variant="outline" className={`rounded-full ${prStatusColor('Pending')}`}>
                                    Pending
                                </Badge>
                            </TableCell>
                            <TableCell>
                                <div className="flex gap-2">
                                    <Button
                                        size="icon"
                                        variant="ghost"
                                        onClick={handleSave}
                                        className="h-8 w-8"
                                    >
                                        <Check className="h-4 w-4" />
                                    </Button>
                                    <Button
                                        size="icon"
                                        variant="ghost"
                                        onClick={handleCancel}
                                        className="h-8 w-8"
                                    >
                                        <X className="h-4 w-4" />
                                    </Button>
                                </div>
                            </TableCell>
                        </TableRow>
                    )}
                </TableBody>
            </Table>
        </div>
    )
}

