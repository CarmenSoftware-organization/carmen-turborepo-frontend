"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { energyWithChanges } from "@/mock-data/environment";
import { formatLargeNumber } from "@/utils/formatLargeNumber";

const EnergyUsageTrend = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Energy Usage Trend & YoY Change (kWh)</CardTitle>
      </CardHeader>
      <CardContent className="h-[calc(100%-80px)]">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={energyWithChanges}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="year" />
            <YAxis yAxisId="left" tickFormatter={(value) => `${formatLargeNumber(value)}`} />
            <YAxis yAxisId="right" orientation="right" unit="%" />
            <Tooltip
              formatter={(value: number | string, name: string) => {
                if (name === "change" && typeof value === "number") {
                  return [`${value.toFixed(1)}%`, "YoY Change"];
                }
                return [`${formatLargeNumber(Number(value))} kWh`, "Energy Usage"];
              }}
            />
            <Legend />
            <Line
              yAxisId="left"
              type="monotone"
              dataKey="energy"
              name="Energy Usage"
              stroke="#6366f1"
            />
            <Line
              yAxisId="right"
              type="monotone"
              dataKey="change"
              name="YoY Change %"
              stroke="#0ea5e9"
            />
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};

export default EnergyUsageTrend;
