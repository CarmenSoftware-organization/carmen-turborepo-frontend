"use client";

import { Card } from "@/components/ui/card";
import { mockClusterDistributionData } from "@/mock-data/subscription";
import { Cell, Legend, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#82ca9d']

export default function ClusterDistribution() {
    return (
        <Card className="p-4">
            <p className="text-2xl font-medium">Cluster Distribution</p>
            <p className="text-sm text-muted-foreground">Subscription distribution by cluster</p>
            <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                    <Pie
                        data={mockClusterDistributionData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                    >
                        {mockClusterDistributionData.map((entry, index) => (
                            <Cell key={entry.name} fill={COLORS[index % COLORS.length]} />
                        ))}
                    </Pie>
                    <Tooltip />
                    <Legend />
                </PieChart>
            </ResponsiveContainer>
        </Card>
    )
}
