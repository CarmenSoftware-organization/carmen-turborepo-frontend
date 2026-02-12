"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { monthlySpendData } from "./mock-data";

export default function DashboardSpendTrend() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-sm">Monthly Spend Trend</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={260}>
          <LineChart data={monthlySpendData}>
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
              tickFormatter={(v) => `${(v / 1000000).toFixed(1)}M`}
            />
            <Tooltip
              formatter={(value: number) => [`฿${value.toLocaleString()}`, ""]}
              contentStyle={{
                fontSize: 12,
                borderRadius: 6,
                border: "1px solid hsl(220 10% 88%)",
              }}
            />
            <Legend
              iconType="plainline"
              wrapperStyle={{ fontSize: 11 }}
            />
            <Line
              type="monotone"
              dataKey="budget"
              stroke="hsl(220 10% 70%)"
              strokeDasharray="6 3"
              strokeWidth={2}
              dot={false}
              name="Budget"
            />
            <Line
              type="monotone"
              dataKey="actual"
              stroke="#3b82f6"
              strokeWidth={2}
              dot={false}
              name="Actual"
            />
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
