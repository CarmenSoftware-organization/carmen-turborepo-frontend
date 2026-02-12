"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { topVendors } from "./mock-data";

export default function ProcurementTopVendors() {
  const maxSpend = Math.max(...topVendors.map((v) => v.spend));

  return (
    <Card>
      <CardHeader className="flex-row items-center justify-between">
        <CardTitle className="text-sm">Top Vendors by Spend</CardTitle>
        <Button variant="link" size="sm" className="text-xs px-0">
          View all
        </Button>
      </CardHeader>
      <CardContent className="space-y-3">
        {topVendors.map((vendor) => (
          <div key={vendor.name} className="space-y-1.5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium">{vendor.name}</span>
              <span className="text-xs font-medium">
                ฿{(vendor.spend / 1000).toFixed(0)}K
              </span>
            </div>
            <div className="flex items-center gap-3">
              <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
                <div
                  className="h-full bg-blue-500 rounded-full transition-all"
                  style={{ width: `${(vendor.spend / maxSpend) * 100}%` }}
                />
              </div>
              <div className="flex items-center gap-2 text-[11px] text-muted-foreground shrink-0">
                <span>{vendor.orders} orders</span>
                <span className="text-emerald-600">{vendor.onTime}% on-time</span>
              </div>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
