"use client";

import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import {
  ClipboardList,
  FileText,
  Truck,
  Clock,
  TrendingUp,
  TrendingDown,
} from "lucide-react";
import { procurementKpi } from "./mock-data";

interface KpiCardProps {
  title: string;
  value: number;
  change: number;
  subtitle: string;
  icon: React.ReactNode;
  iconBg: string;
}

function KpiCard({ title, value, change, subtitle, icon, iconBg }: KpiCardProps) {
  const isPositive = change >= 0;

  return (
    <Card className="p-4">
      <div className="flex items-start justify-between mb-3">
        <div className={cn("flex items-center justify-center w-10 h-10 rounded-lg", iconBg)}>
          {icon}
        </div>
        <div
          className={cn(
            "flex items-center gap-0.5 text-xs font-medium rounded-md px-1.5 py-0.5",
            isPositive
              ? "text-emerald-700 bg-emerald-50"
              : "text-rose-700 bg-rose-50"
          )}
        >
          {isPositive ? (
            <TrendingUp className="w-3 h-3" />
          ) : (
            <TrendingDown className="w-3 h-3" />
          )}
          {Math.abs(change)}%
        </div>
      </div>
      <p className="text-xs text-muted-foreground mb-0.5">{title}</p>
      <p className="text-xl font-bold tracking-tight">{value}</p>
      <p className="text-[11px] text-muted-foreground mt-1">{subtitle}</p>
    </Card>
  );
}

export default function ProcurementKpiCards() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
      <KpiCard
        title="Purchase Requests"
        value={procurementKpi.purchaseRequests.total}
        change={procurementKpi.purchaseRequests.change}
        subtitle={procurementKpi.purchaseRequests.subtitle}
        icon={<ClipboardList className="w-5 h-5 text-blue-600" />}
        iconBg="bg-blue-100"
      />
      <KpiCard
        title="Purchase Orders"
        value={procurementKpi.purchaseOrders.total}
        change={procurementKpi.purchaseOrders.change}
        subtitle={procurementKpi.purchaseOrders.subtitle}
        icon={<FileText className="w-5 h-5 text-emerald-600" />}
        iconBg="bg-emerald-100"
      />
      <KpiCard
        title="Goods Received"
        value={procurementKpi.goodsReceived.total}
        change={procurementKpi.goodsReceived.change}
        subtitle={procurementKpi.goodsReceived.subtitle}
        icon={<Truck className="w-5 h-5 text-violet-600" />}
        iconBg="bg-violet-100"
      />
      <KpiCard
        title="Pending Approvals"
        value={procurementKpi.pendingApprovals.total}
        change={procurementKpi.pendingApprovals.change}
        subtitle={procurementKpi.pendingApprovals.subtitle}
        icon={<Clock className="w-5 h-5 text-amber-600" />}
        iconBg="bg-amber-100"
      />
    </div>
  );
}
