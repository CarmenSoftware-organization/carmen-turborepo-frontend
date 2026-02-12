"use client";

import { useAuth } from "@/context/AuthContext";
import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { Button } from "@/components/ui/button";
import { Calendar, Download } from "lucide-react";
import DashboardKpiCards from "./DashboardKpiCards";
import DashboardQuickActions from "./DashboardQuickActions";
import DashboardPendingApprovals from "./DashboardPendingApprovals";
import DashboardRecentActivity from "./DashboardRecentActivity";
import DashboardInventoryAlerts from "./DashboardInventoryAlerts";

const DashboardSpendTrend = dynamic(() => import("./DashboardSpendTrend"), {
  ssr: false,
});
const DashboardSpendCategory = dynamic(() => import("./DashboardSpendCategory"), {
  ssr: false,
});

const getGreeting = (): string => {
  const hour = new Date().getHours();
  if (hour < 12) return "Good Morning";
  if (hour < 17) return "Good Afternoon";
  return "Good Evening";
};

export default function MainDashboardComponent() {
  const { user } = useAuth();
  const [greeting, setGreeting] = useState(getGreeting);

  useEffect(() => {
    const interval = setInterval(() => {
      setGreeting(getGreeting());
    }, 60_000);
    return () => clearInterval(interval);
  }, []);

  const firstName = user?.data.user_info.firstname;

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-xl font-semibold tracking-tight">Dashboard Overview</h1>
          <p className="text-xs text-muted-foreground mt-0.5">
            {greeting}{firstName ? `, ${firstName}` : ""}! Here&apos;s what&apos;s happening today.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="default">
            <Calendar className="w-3.5 h-3.5" />
            Last 30 days
          </Button>
          <Button variant="default" size="default">
            <Download className="w-3.5 h-3.5" />
            Export Report
          </Button>
        </div>
      </div>

      {/* KPI Cards */}
      <DashboardKpiCards />

      {/* Quick Actions */}
      <DashboardQuickActions />

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
        <DashboardSpendTrend />
        <DashboardSpendCategory />
      </div>

      {/* Pending Approvals + Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
        <DashboardPendingApprovals />
        <DashboardRecentActivity />
      </div>

      {/* Inventory Alerts */}
      <DashboardInventoryAlerts />
    </div>
  );
}
