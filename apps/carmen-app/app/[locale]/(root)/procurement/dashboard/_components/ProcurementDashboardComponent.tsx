"use client";

import { useAuth } from "@/context/AuthContext";
import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { Button } from "@/components/ui/button";
import { Calendar, Download } from "lucide-react";
import ProcurementKpiCards from "./ProcurementKpiCards";
import ProcurementPendingApprovals from "./ProcurementPendingApprovals";
import ProcurementTopVendors from "./ProcurementTopVendors";
import ProcurementRecentDocuments from "./ProcurementRecentDocuments";

const ProcurementDocumentStatus = dynamic(
  () => import("./ProcurementDocumentStatus"),
  { ssr: false }
);
const ProcurementTrend = dynamic(() => import("./ProcurementTrend"), {
  ssr: false,
});

const getGreeting = (): string => {
  const hour = new Date().getHours();
  if (hour < 12) return "Good Morning";
  if (hour < 17) return "Good Afternoon";
  return "Good Evening";
};

export default function ProcurementDashboardComponent() {
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
          <h1 className="text-xl font-semibold tracking-tight">
            Procurement Overview
          </h1>
          <p className="text-xs text-muted-foreground mt-0.5">
            {greeting}
            {firstName ? `, ${firstName}` : ""}! Track your procurement
            pipeline.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="default">
            <Calendar className="w-3.5 h-3.5" />
            This Month
          </Button>
          <Button variant="default" size="default">
            <Download className="w-3.5 h-3.5" />
            Export
          </Button>
        </div>
      </div>

      {/* KPI Cards */}
      <ProcurementKpiCards />

      {/* Document Status Charts (PR + PO pie charts) */}
      <ProcurementDocumentStatus />

      {/* Procurement Trend + Top Vendors */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-3">
        <div className="lg:col-span-2">
          <ProcurementTrend />
        </div>
        <ProcurementTopVendors />
      </div>

      {/* Pending Approvals */}
      <ProcurementPendingApprovals />

      {/* Recent PR + PO Tables */}
      <ProcurementRecentDocuments />
    </div>
  );
}
