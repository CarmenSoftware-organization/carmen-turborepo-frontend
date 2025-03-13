import { NavbarComponent } from "@/components/layouts/NavbarComponent";
import SidebarComponent from "@/components/layouts/SidebarComponent";
import { SidebarProvider } from "@/components/ui/sidebar";
import { Suspense } from "react";

export default function Layout({ children }: { children: React.ReactNode }) {
    return (
        <SidebarProvider>
            <SidebarComponent />
            <div className="flex-1 flex flex-col overflow-auto">
                <NavbarComponent />
                <main className="p-4">
                    <Suspense fallback={<p>Suspense Loading...</p>}>
                        {children}
                    </Suspense>
                </main>
            </div>
        </SidebarProvider>
    );
} 