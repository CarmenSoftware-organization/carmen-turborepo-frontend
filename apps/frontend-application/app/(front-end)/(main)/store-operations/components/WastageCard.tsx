import { Card, CardContent } from '@/components/ui/card'
import React from 'react'

const WastageCard = () => {
    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
                <CardContent className="pt-4">
                    <div>
                        <p className="text-sm text-gray-500">Total Wastage This Month</p>
                        <p className="text-2xl font-bold text-red-500">$3,458.50</p>
                        <p className="text-sm text-green-500">-12% vs last month</p>
                    </div>
                </CardContent>
            </Card>

            <Card>
                <CardContent className="pt-4">
                    <div>
                        <p className="text-sm text-gray-500">Items Written Off</p>
                        <p className="text-2xl font-bold">45</p>
                        <p className="text-sm text-red-500">+8% vs last month</p>
                    </div>
                </CardContent>
            </Card>

            <Card>
                <CardContent className="pt-4">
                    <div>
                        <p className="text-sm text-gray-500">Pending Reviews</p>
                        <p className="text-2xl font-bold text-orange-500">12</p>
                        <p className="text-sm">Requires attention</p>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}

export default WastageCard