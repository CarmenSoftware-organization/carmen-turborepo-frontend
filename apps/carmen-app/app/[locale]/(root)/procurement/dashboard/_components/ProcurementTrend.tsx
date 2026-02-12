"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { monthlyProcurementData } from "./mock-data";

export default function ProcurementTrend() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-sm">Monthly Procurement Volume</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={280}>
          <BarChart data={monthlyProcurementData} barGap={2}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(220 10% 90%)" />
            <XAxis
              dataKey="month"
              tick={{ fontSize: 11, fill: "hsl(220 10% 42%)" }}
              axisLine={{ stroke: "hsl(220 10% 88%)" }}
              tickLine={false}
            />
            <YAxis
              tick={{ fontSize: 11, fill: "hsl(220 10% 42%)" }}
              axisLine={false}
              tickLine={false}
            />
            <Tooltip
              contentStyle={{
                fontSize: 12,
                borderRadius: 6,
                border: "1px solid hsl(220 10% 88%)",
              }}
            />
            <Legend wrapperStyle={{ fontSize: 11 }} />
            <Bar
              dataKey="pr"
              name="Purchase Requests"
              fill="#3b82f6"
              radius={[3, 3, 0, 0]}
              barSize={16}
            />
            <Bar
              dataKey="po"
              name="Purchase Orders"
              fill="#10b981"
              radius={[3, 3, 0, 0]}
              barSize={16}
            />
            <Bar
              dataKey="grn"
              name="GRN"
              fill="#8b5cf6"
              radius={[3, 3, 0, 0]}
              barSize={16}
            />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
