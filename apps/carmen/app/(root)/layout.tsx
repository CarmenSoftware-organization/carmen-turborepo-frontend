"use client";

import NavbarComponent from "@/components/NavbarComponent";
import { SidebarComponent } from "@/components/SidebarComponent";
import { SidebarProvider } from "@/components/ui/sidebar";

export default function Layout({ children }: Readonly<{ children: React.ReactNode }>) {
    return (
        <SidebarProvider>
            <SidebarComponent />
            <div className="flex-1 flex flex-col overflow-auto">
                <NavbarComponent />
                <main className="p-4 space-y-4">
                    {children}
                </main>
            </div>
        </SidebarProvider>
    );
} 
