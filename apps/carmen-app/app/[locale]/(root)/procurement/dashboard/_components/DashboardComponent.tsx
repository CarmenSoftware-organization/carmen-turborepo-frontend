"use client";

import { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import { energyData, scopeData } from "@/mock-data/environment";
import { useAuth } from "@/context/AuthContext";
import MetricCard from "./MetricCard";

const EmissionsScope = dynamic(() => import("./EmissionsScope"), { ssr: false });
const EnergyUsageTrend = dynamic(() => import("./EnergyUsageTrend"), { ssr: false });
const EmissionsDistribution = dynamic(() => import("./EmissionsDistribution"), { ssr: false });
const ConsumptionBreakdown = dynamic(() => import("./ConsumptionBreakdown"), { ssr: false });

function getGreeting(): string {
  const hour = new Date().getHours();
  if (hour < 12) return "Good Morning";
  if (hour < 17) return "Good Afternoon";
  return "Good Evening";
}

export default function DashboardComponent() {
  const { user } = useAuth();
  const [greeting, setGreeting] = useState(getGreeting);

  useEffect(() => {
    const interval = setInterval(() => {
      setGreeting(getGreeting());
    }, 60_000);
    return () => clearInterval(interval);
  }, []);

  const firstName = user?.data.user_info.firstname;

  const latestYear = energyData.length ? energyData[energyData.length - 1] : null;
  const previousYear = energyData.length > 1 ? energyData[energyData.length - 2] : null;

  const energyChange =
    latestYear && previousYear
      ? (((latestYear.energy - previousYear.energy) / previousYear.energy) * 100).toFixed(1)
      : "0.0";
  return (
    <div className="space-y-4">
      <h1 className="text-xl font-semibold tracking-tight">
        {greeting}{firstName ? `, ${firstName}` : ""}
      </h1>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <MetricCard
          title="Total Energy Usage"
          value={latestYear?.energy ?? 0}
          unit="kWh"
          subtext={`${energyChange}% vs previous year`}
        />
        <MetricCard
          title="Current Scope 1"
          value={scopeData[scopeData.length - 1]?.scope1 ?? 0}
          unit="tCO2e"
          subtext="Direct emissions"
        />
        <MetricCard
          title="Current Scope 2"
          value={scopeData[scopeData.length - 1]?.scope2 ?? 0}
          unit="tCO2e"
          subtext="Indirect emissions"
        />
        <MetricCard
          title="Current Scope 3"
          value={scopeData[scopeData.length - 1]?.scope3 ?? 0}
          unit="tCO2e"
          subtext="Value chain emissions"
        />
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <EmissionsScope />
        <EnergyUsageTrend />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <EmissionsDistribution />
        <ConsumptionBreakdown />
      </div>
    </div>
  );
}
