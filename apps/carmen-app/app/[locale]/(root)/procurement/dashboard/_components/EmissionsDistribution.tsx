"use client";

import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Cell, Legend, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";
import { currentYearBreakdown } from "@/mock-data/environment";
import { formatLargeNumber } from "@/utils/formatLargeNumber";

const COLORS = ["#0ea5e9", "#6366f1", "#7dd3fc"];

const EmissionsDistribution = () => {
  return (
    <Card className="h-[300px]">
      <CardHeader>
        <CardTitle>Current Year Emissions Distribution (tCO2e)</CardTitle>
      </CardHeader>
      <CardContent className="h-[calc(100%-80px)]">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={currentYearBreakdown}
              cx="50%"
              cy="50%"
              labelLine={false}
              label={({ percent }) => `${(percent * 100).toFixed(0)}%`}
              outerRadius={80}
              dataKey="value"
            >
              {currentYearBreakdown.map((entry, index) => (
                <Cell key={`cell-${entry.name}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip formatter={(value) => `${formatLargeNumber(Number(value))} tCO2e`} />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};

export default EmissionsDistribution;
