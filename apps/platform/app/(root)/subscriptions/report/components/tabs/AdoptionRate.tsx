"use client";

import { Card } from "@/components/ui/card";
import { mockModuleUsageData } from "@/mock-data/subscription";
import { BarChart, Bar, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

export default function AdoptionRate() {
    return (
        <Card className="p-4">
            <p className="text-2xl font-medium">Module Adoption Rate</p>
            <p className="text-sm text-muted-foreground">Percentage of business units using each module</p>
            <ResponsiveContainer width="100%" height={300}>
                <BarChart
                    data={mockModuleUsageData}
                    margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                    layout="vertical"
                >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis type="number" domain={[0, 100]} />
                    <YAxis dataKey="name" type="category" width={100} />
                    <Tooltip formatter={(value) => [`${value}%`, 'Adoption Rate']} />
                    <Bar dataKey="adoptionRate" fill="#8884d8" name="Adoption %" radius={[0, 4, 4, 0]} />
                </BarChart>
            </ResponsiveContainer>
        </Card>
    )
}
