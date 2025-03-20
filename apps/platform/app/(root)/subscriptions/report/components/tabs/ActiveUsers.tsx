
"use client";

import { Card } from "@/components/ui/card";
import { mockModuleUsageData } from "@/mock-data/subscription";
import { BarChart, Bar, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis, Legend } from "recharts";

export default function ActiveUsers() {
    return (
        <Card className="p-4">
            <p className="text-2xl font-medium">Module Active Users</p>
            <p className="text-sm text-muted-foreground">Number of active users per module</p>
            <ResponsiveContainer width="100%" height={300}>
                <BarChart
                    data={mockModuleUsageData}
                    margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="activeUsers" fill="#82ca9d" name="Active Users" />
                </BarChart>
            </ResponsiveContainer>
        </Card>
    )
}
