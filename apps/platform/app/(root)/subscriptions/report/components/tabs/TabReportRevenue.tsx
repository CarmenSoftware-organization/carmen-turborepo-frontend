"use client";

import { Card } from "@/components/ui/card";
import { mockRevenueData } from "@/mock-data/subscription";
import { Line, CartesianGrid, LineChart, ResponsiveContainer, XAxis, YAxis, Tooltip, Legend } from "recharts";

export default function TabReportRevenue() {
    return (
        <Card className="p-4">
            <p className="text-2xl font-medium">Monthly Subscription Revenue</p>
            <p className="text-sm text-muted-foreground">Revenue trends over time</p>


            <ResponsiveContainer width="100%" height={400}>
                <LineChart
                    data={mockRevenueData}
                    margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip formatter={(value) => [`$${value}`, 'Revenue']} />
                    <Legend />
                    <Line type="monotone" dataKey="revenue" stroke="#8884d8" activeDot={{ r: 8 }} name="Revenue" />
                </LineChart>
            </ResponsiveContainer>
        </Card>
    )
}
