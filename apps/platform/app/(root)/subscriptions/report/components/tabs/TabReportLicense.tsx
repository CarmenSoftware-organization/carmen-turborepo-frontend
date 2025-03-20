"use client";
import { Card } from "@/components/ui/card";
import { mockLicenseUtilizationData } from "@/mock-data/subscription";
import { Bar, BarChart, CartesianGrid, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

export default function TabLicense() {
    return (
        <Card className="p-4 space-y-4">
            <div>
                <p className="text-2xl font-medium">License Utilization by Business Unit</p>
                <p className="text-sm text-muted-foreground">BU Staff and Cluster User license usage</p>
            </div>

            <ResponsiveContainer width="100%" height={400}>
                <BarChart
                    data={mockLicenseUtilizationData}
                    margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                    layout="vertical"
                >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis type="number" />
                    <YAxis dataKey="name" type="category" width={150} />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="buStaff" name="BU Staff (Used)" stackId="a" fill="#8884d8" />
                    <Bar dataKey="buStaffMax" name="BU Staff (Available)" stackId="a" fill="#8884d8" fillOpacity={0.3} />
                    <Bar dataKey="clusterUsers" name="Cluster Users (Used)" stackId="b" fill="#82ca9d" />
                    <Bar dataKey="clusterUsersMax" name="Cluster Users (Available)" stackId="b" fill="#82ca9d" fillOpacity={0.3} />
                </BarChart>
            </ResponsiveContainer>
        </Card>
    )
}
