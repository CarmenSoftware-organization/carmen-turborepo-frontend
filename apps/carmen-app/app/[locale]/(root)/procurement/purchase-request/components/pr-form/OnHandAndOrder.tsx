import { Card } from "@/components/ui/card";

export default function OnHandAndOrder() {
    return (
        <div className="px-10 my-2 space-y-2">
            <div className="grid grid-cols-4 gap-4">
                <Card className="flex items-center justify-center h-20 bg-blue-50 border border-blue-200">
                    <div className="flex flex-col items-center justify-center">
                        <p className="text-lg font-bold text-blue-700">
                            12 Gram
                        </p>
                        <p className="text-xs font-medium text-blue-600">
                            On Hand
                        </p>
                    </div>
                </Card>
                <Card className="flex items-center justify-center h-20 bg-orange-50 border border-orange-200">
                    <div className="flex flex-col items-center justify-center">
                        <p className="text-lg font-bold text-orange-700">
                            12 Gram
                        </p>
                        <p className="text-xs font-medium text-orange-600">
                            On Order
                        </p>
                    </div>
                </Card>
                <Card className="flex items-center justify-center h-20 bg-yellow-50 border border-yellow-200">
                    <div className="flex flex-col items-center justify-center">
                        <p className="text-lg font-bold text-yellow-700">
                            12 Gram
                        </p>
                        <p className="text-xs font-medium text-yellow-600">
                            Reorder Level
                        </p>
                    </div>
                </Card>
                <Card className="flex items-center justify-center h-20 bg-purple-50 border border-purple-200">
                    <div className="flex flex-col items-center justify-center">
                        <p className="text-lg font-bold text-purple-700">
                            12 Gram
                        </p>
                        <p className="text-xs font-medium text-purple-600">
                            Restock Level
                        </p>
                    </div>
                </Card>
            </div>
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <p>Date Requested</p>
                    <p>14/07/2025</p>
                </div>
                <div className="flex items-center gap-2">
                    <p>Delivery Point</p>
                    <p>Warehouse</p>
                </div>
            </div>
        </div>
    );
}