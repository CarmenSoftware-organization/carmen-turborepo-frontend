'use client';

import { NavbarComponent } from "@/components/layouts/NavbarComponent";
import SidebarComponent from "@/components/layouts/SidebarComponent";
import ProtectedRoute from "@/components/ProtectedRoute";
import { SidebarProvider } from "@/components/ui/sidebar";

export default function Layout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <ProtectedRoute>
      <SidebarProvider>
        <SidebarComponent />
        <div className="flex-1 flex flex-col overflow-auto">
          <NavbarComponent />
          <main className="p-4 space-y-4">
            {children}
          </main>
        </div>
      </SidebarProvider>
    </ProtectedRoute>
  );
} 