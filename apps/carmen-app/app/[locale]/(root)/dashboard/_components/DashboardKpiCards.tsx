"use client";

import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import {
  FileText,
  ShieldCheck,
  AlertTriangle,
  Star,
  TrendingUp,
  TrendingDown,
} from "lucide-react";
import { kpiData } from "./mock-data";

interface KpiCardProps {
  title: string;
  value: string;
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

export default function DashboardKpiCards() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
      <KpiCard
        title="Total Spend"
        value={`฿${kpiData.totalSpend.value.toLocaleString()}`}
        change={kpiData.totalSpend.change}
        subtitle={kpiData.totalSpend.comparison}
        icon={<FileText className="w-5 h-5 text-blue-600" />}
        iconBg="bg-blue-100"
      />
      <KpiCard
        title="Active POs"
        value={String(kpiData.activePOs.value)}
        change={kpiData.activePOs.change}
        subtitle={kpiData.activePOs.subtitle}
        icon={<ShieldCheck className="w-5 h-5 text-emerald-600" />}
        iconBg="bg-emerald-100"
      />
      <KpiCard
        title="Low Stock Items"
        value={String(kpiData.lowStockItems.value)}
        change={kpiData.lowStockItems.change}
        subtitle={kpiData.lowStockItems.subtitle}
        icon={<AlertTriangle className="w-5 h-5 text-amber-600" />}
        iconBg="bg-amber-100"
      />
      <KpiCard
        title="Vendor Rating"
        value={kpiData.vendorRating.value}
        change={kpiData.vendorRating.change}
        subtitle={kpiData.vendorRating.subtitle}
        icon={<Star className="w-5 h-5 text-violet-600" />}
        iconBg="bg-violet-100"
      />
    </div>
  );
}
