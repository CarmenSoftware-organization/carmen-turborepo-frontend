import { Button } from "@/components/ui/button";
import { Table, TableCell, TableBody, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { mockItemDetailPrData } from "@/mock-data/procurement";
import { useState } from "react";
import ItemPrDialog from "./ItemPrDialog";
import { ItemDetailPrDto } from "@/dtos/procurement.dto";

export default function ItemPr() {
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (data: ItemDetailPrDto) => {
        try {
            setIsLoading(true);
            console.log('Form submitted:', data);
            setIsDialogOpen(false);
        } catch (error) {
            console.error('Error submitting form:', error);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="space-y-4">
            <div className="flex justify-end">
                <Button size={'sm'} onClick={() => setIsDialogOpen(true)}>Add Item</Button>
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
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {mockItemDetailPrData.map((item) => (
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
                            <TableCell>{item.status}</TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
            <ItemPrDialog
                open={isDialogOpen}
                onOpenChange={setIsDialogOpen}
                onSubmit={handleSubmit}
                isLoading={isLoading}
            />
        </div>
    )
}

