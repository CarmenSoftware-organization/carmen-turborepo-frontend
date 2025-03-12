import React from 'react'
import { Card, CardContent } from '@/components/ui/card';
import { AlertTriangle, ArrowUp, Package, TrendingUp } from 'lucide-react';

const StockCard = () => {
    return (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card>
                <CardContent className="pt-4">
                    <div className="flex justify-between">
                        <div>
                            <p className="text-sm text-gray-500">Total SKUs</p>
                            <p className="text-2xl font-bold">1,234</p>
                        </div>
                        <Package className="h-8 w-8 text-blue-500" />
                    </div>
                </CardContent>
            </Card>

            <Card>
                <CardContent className="pt-4">
                    <div className="flex justify-between">
                        <div>
                            <p className="text-sm text-gray-500">Low Stock Items</p>
                            <p className="text-2xl font-bold text-red-500">28</p>
                        </div>
                        <AlertTriangle className="h-8 w-8 text-red-500" />
                    </div>
                </CardContent>
            </Card>
            <Card>
                <CardContent className="pt-4">
                    <div className="flex justify-between">
                        <div>
                            <p className="text-sm text-gray-500">Items on Order</p>
                            <p className="text-2xl font-bold text-orange-500">45</p>
                        </div>
                        <TrendingUp className="h-8 w-8 text-orange-500" />
                    </div>
                </CardContent>
            </Card>

            <Card>
                <CardContent className="pt-4">
                    <div className="flex justify-between">
                        <div>
                            <p className="text-sm text-gray-500">Stock Value</p>
                            <p className="text-2xl font-bold">$45,678</p>
                        </div>
                        <ArrowUp className="h-8 w-8 text-green-500" />
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}

export default StockCard