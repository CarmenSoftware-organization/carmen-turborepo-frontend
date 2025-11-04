"use client";

import { useAuth } from "@/app/context/AuthContext";
import { useMemo } from "react";

export default function DashboardComponent() {
  const { user } = useAuth();

  const userFullName = user?.user_info.firstname + " " + user?.user_info.lastname;

  const greeting = useMemo(() => {
    const hour = new Date().getHours();
    if (hour >= 5 && hour < 12) return "Good morning";
    if (hour >= 12 && hour < 17) return "Good afternoon";
    if (hour >= 17 && hour < 21) return "Good evening";
    return "Good night";
  }, []);

  return (
    <div className="space-y-8 pt-4 max-w-xl mx-auto">
      <div className="space-y-4">
        <h1 className="text-3xl font-medium">
          {greeting}, {userFullName}
        </h1>
        <p className="text-base text-muted-foreground">
          Here&apos;s what&apos;s happening with {user?.business_unit?.[0]?.name || "your business"}
        </p>
      </div>
    </div>
  );
}
