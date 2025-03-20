"use client";

import { Card } from "@/components/ui/card";
import { Bar, BarChart, CartesianGrid, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { mockSubscriptionTrendData } from "@/mock-data/subscription";

export default function SubscriptionTrend() {
    return (
        <Card className="p-4">
            <p className="text-2xl font-medium">Subscription Trends</p>
            <p className="text-sm text-muted-foreground">Active vs. Inactive subscriptions over time</p>
            <ResponsiveContainer width="100%" height={300}>
                <BarChart
                    data={mockSubscriptionTrendData}
                    margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="active" stackId="a" fill="#8884d8" name="Active" />
                    <Bar dataKey="inactive" stackId="a" fill="#82ca9d" name="Inactive" />
                </BarChart>
            </ResponsiveContainer>
        </Card>
    )
}
