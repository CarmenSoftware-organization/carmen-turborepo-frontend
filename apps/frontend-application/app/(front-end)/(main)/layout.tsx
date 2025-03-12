"use client"
import React, { useEffect } from "react";
import { useAuth } from "@/app/context/AuthContext";
import { useRouter } from "@/lib/i18n";
import Navbar from "@/components/Navbar/Navbar";
import NewSidebar from "@/components/Sidebar/NewSidebar";

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const { accessToken } = useAuth();

  useEffect(() => {
    if (!accessToken) {
      router.push("/");
    }
  }, [accessToken, router]);

  return (
    <div className="flex h-screen overflow-hidden">
      <NewSidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Navbar />
        <main className="flex-1 pt-16 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
