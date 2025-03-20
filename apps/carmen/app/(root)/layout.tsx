"use client";

import { SidebarProvider } from "@/components/ui/sidebar";

export default function Layout({ children }: Readonly<{ children: React.ReactNode }>) {
    return (
        <SidebarProvider>
            <div>Sidebar</div>
            <main className="p-4 space-y-4">
                <div>Header</div>
                {children}
            </main>
        </SidebarProvider>
    );
} 
