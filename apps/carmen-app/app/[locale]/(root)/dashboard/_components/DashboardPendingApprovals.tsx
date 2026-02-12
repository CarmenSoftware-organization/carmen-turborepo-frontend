"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FileText, Check, X } from "lucide-react";
import { pendingApprovals } from "./mock-data";

export default function DashboardPendingApprovals() {
  return (
    <Card>
      <CardHeader className="flex-row items-center justify-between">
        <CardTitle className="text-sm">Pending Approvals</CardTitle>
        <Button variant="link" size="sm" className="text-xs px-0">
          View all
        </Button>
      </CardHeader>
      <CardContent className="space-y-2">
        {pendingApprovals.map((item) => (
          <div
            key={item.id}
            className="flex items-center gap-3 p-2.5 rounded-md border border-border bg-background"
          >
            <div className="flex items-center justify-center w-8 h-8 rounded-md bg-blue-50 shrink-0">
              <FileText className="w-4 h-4 text-blue-600" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-medium truncate">{item.id}</p>
              <p className="text-[11px] text-muted-foreground truncate">
                {item.description} - ฿{item.amount.toLocaleString()}
              </p>
            </div>
            <div className="flex items-center gap-1.5 shrink-0">
              <button className="flex items-center justify-center w-7 h-7 rounded-md bg-emerald-50 text-emerald-600 hover:bg-emerald-100 transition-colors cursor-pointer">
                <Check className="w-4 h-4" />
              </button>
              <button className="flex items-center justify-center w-7 h-7 rounded-md bg-rose-50 text-rose-600 hover:bg-rose-100 transition-colors cursor-pointer">
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
