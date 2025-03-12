"use client";

import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { formatLargeNumber } from '../utils';
import { Bar, BarChart, CartesianGrid, Legend, ResponsiveContainer, XAxis, YAxis } from 'recharts';
import { consumptionData } from '../mock_data/data';

const ConsumptionBreakdown = () => {
    return (
        <Card className="h-[300px]">
            <CardHeader>
                <CardTitle>Consumption Breakdown Trends</CardTitle>
            </CardHeader>
            <CardContent className="h-[calc(100%-80px)]">
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={consumptionData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="year" />
                        <YAxis tickFormatter={(value) => formatLargeNumber(Number(value))} />
                        {/* <Tooltip
                            formatter={(value, name: string, props: any) => {
                                const unit = props.payload.units[name];
                                return [`${formatLargeNumber(Number(value))} ${unit}`, name];
                            }}
                        /> */}
                        <Legend />
                        <Bar dataKey="employeeTravel" name="Employee Travel" fill="#0ea5e9" />
                        <Bar dataKey="foodWaste" name="Food Waste" fill="#7dd3fc" />
                        <Bar dataKey="purchasedGoods" name="Purchased Goods" fill="#6366f1" />
                        <Bar dataKey="water" name="Water" fill="#818cf8" />
                        <Bar dataKey="energy" name="Energy" fill="#a5b4fc" />
                    </BarChart>
                </ResponsiveContainer>
            </CardContent>
        </Card>
    )
}

export default ConsumptionBreakdown