import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { InventoryDataDto } from "@/dtos/product.dto";
import { AlertCircle, Package } from "lucide-react";
import StockInventLocation from "./StockInventLocation";

interface InventoryInfoProps {
    readonly inventoryData: InventoryDataDto;
}

export default function InventoryInfo({ inventoryData }: InventoryInfoProps) {
    return (
        <div className="space-y-4">
            <Card className="p-4 space-y-2">
                <div className="fxr-c space-x-2 border-b pb-3">
                    <Package className="w-5 h-5 text-gray-500" />
                    <h2 className="text-sm font-medium">Total Stock Position</h2>
                </div>

                <div className="grid grid-cols-2 gap-6">
                    <div>
                        <Label className="text-xs text-gray-500">On Hand</Label>
                        <div className="text-2xl font-semibold tabular-nums text-right">
                            {inventoryData.totalStock.onHand.toLocaleString()}
                        </div>
                    </div>
                    <div>
                        <Label className="text-xs text-gray-500">On Order</Label>
                        <div className="text-2xl font-semibold tabular-nums text-right">
                            {inventoryData.totalStock.onOrder.toLocaleString()}
                        </div>
                    </div>
                </div>
            </Card>

            <StockInventLocation locations={inventoryData.locations} />

            <Card className="p-4">
                <div className="flex items-start space-x-2">
                    <AlertCircle className="w-5 h-5 text-gray-500 mt-0.5" />
                    <div>
                        <h4 className="text-sm font-medium text-gray-900">Status Indicators</h4>
                        <div className="mt-2 grid grid-cols-2 gap-4">
                            <div className="fxr-c text-sm">
                                <div className="w-2 h-2 bg-red-500 rounded-full mr-2" />
                                <span className="text-gray-600">Below Minimum Level</span>
                            </div>
                            <div className="fxr-c text-sm">
                                <div className="w-2 h-2 bg-amber-500 rounded-full mr-2" />
                                <span className="text-gray-600">Reorder Point Reached</span>
                            </div>
                            <div className="fxr-c text-sm">
                                <div className="w-2 h-2 bg-blue-500 rounded-full mr-2" />
                                <span className="text-gray-600">Exceeds Maximum Level</span>
                            </div>
                            <div className="fxr-c text-sm">
                                <div className="w-2 h-2 bg-green-500 rounded-full mr-2" />
                                <span className="text-gray-600">Normal Stock Level</span>
                            </div>
                        </div>
                    </div>
                </div>
            </Card>
        </div>
    );
}