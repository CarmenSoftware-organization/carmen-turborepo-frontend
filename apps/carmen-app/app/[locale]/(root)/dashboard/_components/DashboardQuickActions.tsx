"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Plus,
  PackageCheck,
  ClipboardCheck,
  ChefHat,
  FileCheck,
} from "lucide-react";

const quickActions = [
  { label: "Create PR", icon: Plus, color: "text-blue-600 bg-blue-50 border-blue-200" },
  { label: "Receive Goods", icon: PackageCheck, color: "text-emerald-600 bg-emerald-50 border-emerald-200" },
  { label: "Stock Count", icon: ClipboardCheck, color: "text-amber-600 bg-amber-50 border-amber-200" },
  { label: "New Recipe", icon: ChefHat, color: "text-violet-600 bg-violet-50 border-violet-200" },
  { label: "Match Invoice", icon: FileCheck, color: "text-rose-600 bg-rose-50 border-rose-200" },
];

export default function DashboardQuickActions() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-sm">Quick Actions</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex items-center gap-4">
          {quickActions.map((action) => (
            <button
              key={action.label}
              className="flex flex-col items-center gap-2 group cursor-pointer"
            >
              <div
                className={`flex items-center justify-center w-12 h-12 rounded-xl border transition-shadow group-hover:shadow-md ${action.color}`}
              >
                <action.icon className="w-5 h-5" />
              </div>
              <span className="text-xs text-muted-foreground group-hover:text-foreground transition-colors">
                {action.label}
              </span>
            </button>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
