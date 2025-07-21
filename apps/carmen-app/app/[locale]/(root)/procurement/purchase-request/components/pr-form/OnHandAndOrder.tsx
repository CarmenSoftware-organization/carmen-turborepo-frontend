import { Card } from "@/components/ui/card";
import { PurchaseRequestDetailItem } from "@/dtos/pr.dto";
import { format } from "date-fns";

const CardItem = ({ title, value, color }: { title: string, value: string, color: string }) => {
    return (
        <Card className={`flex items-center rounded-md justify-center h-12 bg-${color}-50 border border-${color}-200`}>
            <div className="flex flex-col items-center justify-center">
                <p className={`text-sm font-bold text-${color}-700`}>{value}</p>
                <p className={`text-xs font-medium text-${color}-600`}>{title}</p>
            </div>
        </Card>
    );
};

export default function OnHandAndOrder({ item }: { item: PurchaseRequestDetailItem }) {
    const onHand = `${item.on_hand_qty} ${item.inventory_unit_name}`;
    const onOrder = `${item.on_order_qty} ${item.inventory_unit_name}`;
    const reOrderQty = `${item.re_order_qty} ${item.inventory_unit_name}`;
    const reStockQty = `${item.re_stock_qty} ${item.inventory_unit_name}`;
    const dateRequested = `${item.delivery_date}`;
    const deliveryPoint = `${item.delivery_point_name}`;

    return (
        <div className="px-10 my-2 space-y-2">
            <div className="grid grid-cols-6 gap-4">
                <CardItem title="On Hand" value={onHand} color="blue" />
                <CardItem title="On Order" value={onOrder} color="orange" />
                <CardItem title="Reorder Level" value={reOrderQty} color="yellow" />
                <CardItem title="Restock Level" value={reStockQty} color="red" />
                <CardItem title="Date Requested" value={format(new Date(dateRequested), 'dd/MM/yyyy')} color="green" />
                <CardItem title="Delivery Point" value={deliveryPoint} color="purple" />
            </div>
        </div>
    );
}
