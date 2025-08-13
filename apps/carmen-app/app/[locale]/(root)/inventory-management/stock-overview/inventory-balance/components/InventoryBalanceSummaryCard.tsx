
import { Card } from "@/components/ui/card";
import { mockInventoryBalanceSummaryCard } from "@/mock-data/inventory-balance";

export default function InventoryBalanceSummaryCard() {
    return (
        <div className="grid grid-cols-3 gap-4">
            <Card className="p-4">
                <div className="flex justify-between items-center">
                    <div>
                        <h1 className="text-sm font-medium">Total Item</h1>
                        <p className="text-2xl font-bold">{mockInventoryBalanceSummaryCard.total_item}</p>
                    </div>

                    <div className="bg-blue-200 rounded-full w-10 h-10 fxr-c justify-center">
                        <p className="text-blue-800 font-bold text-xl">#</p>
                    </div>
                </div>
            </Card>

            <Card className="p-4">
                <div className="flex justify-between items-center">
                    <div>
                        <h1 className="text-sm font-medium">Total Value</h1>
                        <p className="text-2xl font-bold">{mockInventoryBalanceSummaryCard.total_value}</p>
                    </div>

                    <div className="bg-green-200 rounded-full w-10 h-10 fxr-c justify-center">
                        <p className="text-green-800 font-bold text-xl">$</p>
                    </div>
                </div>
            </Card>

            <Card className="p-4">
                <div className="flex justify-between items-center">
                    <div>
                        <h1 className="text-sm font-medium">Valuation Method</h1>
                        <p className="text-2xl font-bold">{mockInventoryBalanceSummaryCard.valuation_method}</p>
                    </div>
                    <div className="bg-yellow-200 rounded-full w-10 h-10 fxr-c justify-center">
                        <p className="text-yellow-800 font-bold text-xl">%</p>
                    </div>
                </div>
            </Card>
        </div>
    );
}
