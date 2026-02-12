"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Check, X, Clock } from "lucide-react";
import { cn } from "@/lib/utils";
import { pendingApprovalItems } from "./mock-data";

const priorityConfig = {
  high: { label: "High", variant: "destructive" as const },
  medium: { label: "Medium", variant: "warning" as const },
  low: { label: "Low", variant: "draft" as const },
};

export default function ProcurementPendingApprovals() {
  return (
    <Card>
      <CardHeader className="flex-row items-center justify-between">
        <CardTitle className="text-sm">My Pending Approvals</CardTitle>
        <Button variant="link" size="sm" className="text-xs px-0">
          View all
        </Button>
      </CardHeader>
      <CardContent className="space-y-2">
        {pendingApprovalItems.map((item) => {
          const priority = priorityConfig[item.priority];
          return (
            <div
              key={item.id}
              className="flex items-center gap-3 p-3 rounded-md border border-border bg-background"
            >
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-xs font-medium text-primary">{item.id}</span>
                  <Badge variant={priority.variant} className="text-[10px] px-1.5 py-0">
                    {priority.label}
                  </Badge>
                </div>
                <p className="text-xs font-medium truncate">{item.title}</p>
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-[11px] text-muted-foreground">
                    {item.requester}
                  </span>
                  <span className="text-[11px] text-muted-foreground">•</span>
                  <span className="text-[11px] text-muted-foreground flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {item.submittedAt}
                  </span>
                </div>
              </div>
              <div className="text-right shrink-0 mr-2">
                <p className="text-xs font-medium">฿{item.amount.toLocaleString()}</p>
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
          );
        })}
      </CardContent>
    </Card>
  );
}
