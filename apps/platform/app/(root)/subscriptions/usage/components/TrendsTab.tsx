'use client'

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { usageChartData } from "@/mock-data/subscription"

export default function TrendsTab() {
    return (
        <Card>
            <CardHeader>
                <CardTitle>Usage Trends (Last 6 Months)</CardTitle>
                <CardDescription>Aggregated usage across all business units</CardDescription>
            </CardHeader>
            <CardContent>
                <div className="h-[400px]">
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={usageChartData}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="month" />
                            <YAxis yAxisId="left" orientation="left" stroke="#8884d8" />
                            <YAxis yAxisId="right" orientation="right" stroke="#82ca9d" />
                            <Tooltip />
                            <Bar yAxisId="left" dataKey="users" name="Users" fill="#8884d8" />
                            <Bar yAxisId="right" dataKey="storage" name="Storage (GB)" fill="#82ca9d" />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </CardContent>
        </Card>
    )
};