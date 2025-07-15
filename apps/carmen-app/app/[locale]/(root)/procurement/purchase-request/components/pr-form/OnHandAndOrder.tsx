import { Card } from "@/components/ui/card";

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

export default function OnHandAndOrder() {
    return (
        <div className="px-10 my-2 space-y-2">
            <div className="grid grid-cols-6 gap-4">
                <CardItem title="On Hand" value="12 Gram" color="blue" />
                <CardItem title="On Order" value="12 Gram" color="orange" />
                <CardItem title="Reorder Level" value="12 Gram" color="yellow" />
                <CardItem title="Restock Level" value="12 Gram" color="red" />
                <CardItem title="Date Requested" value="14/07/2025" color="green" />
                <CardItem title="Delivery Point" value="Warehouse" color="purple" />
            </div>
        </div>
    );
}
