import SidebarComponent from "@/components/layouts/SidebarComponent";
import { SidebarProvider } from "@/components/ui/sidebar";
import { Suspense } from "react";

export default function Layout({ children }: { children: React.ReactNode }) {
    return (
        <SidebarProvider>
            <SidebarComponent />
            <Suspense fallback={<p>Suspense Loading...</p>}>
                {children}
            </Suspense>
        </SidebarProvider>
    );
} 