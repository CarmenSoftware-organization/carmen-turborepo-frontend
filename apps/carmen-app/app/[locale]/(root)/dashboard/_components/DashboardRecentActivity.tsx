"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  CheckCircle,
  PackageCheck,
  AlertTriangle,
  FileCheck,
  UserPlus,
} from "lucide-react";
import { recentActivities } from "./mock-data";

const iconMap = {
  approve: { icon: CheckCircle, bg: "bg-emerald-50", color: "text-emerald-600" },
  complete: { icon: PackageCheck, bg: "bg-blue-50", color: "text-blue-600" },
  alert: { icon: AlertTriangle, bg: "bg-amber-50", color: "text-amber-600" },
  match: { icon: FileCheck, bg: "bg-violet-50", color: "text-violet-600" },
  vendor: { icon: UserPlus, bg: "bg-emerald-50", color: "text-emerald-600" },
} as const;

export default function DashboardRecentActivity() {
  return (
    <Card>
      <CardHeader className="flex-row items-center justify-between">
        <CardTitle className="text-sm">Recent Activity</CardTitle>
        <Button variant="link" size="sm" className="text-xs px-0">
          View all
        </Button>
      </CardHeader>
      <CardContent className="space-y-2">
        {recentActivities.map((activity) => {
          const config = iconMap[activity.icon];
          const IconComp = config.icon;
          return (
            <div key={activity.id} className="flex items-start gap-3 py-1.5">
              <div
                className={`flex items-center justify-center w-8 h-8 rounded-md shrink-0 ${config.bg}`}
              >
                <IconComp className={`w-4 h-4 ${config.color}`} />
              </div>
              <div className="min-w-0">
                <p className="text-xs font-medium truncate">{activity.title}</p>
                <p className="text-[11px] text-muted-foreground truncate">
                  {activity.subtitle}
                </p>
              </div>
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
}
