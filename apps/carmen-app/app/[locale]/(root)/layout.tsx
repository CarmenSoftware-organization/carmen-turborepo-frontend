import { SidebarProvider } from "@/components/ui/sidebar";

export default function Layout({ children }: Readonly<{ children: React.ReactNode }>) {
    return (
        <SidebarProvider>
            <div>Sidebar</div>
            <div className="flex-1 flex flex-col overflow-auto">
                <div>Navbar</div>
                <main className="p-4 space-y-4">
                    {children}
                </main>
            </div>
        </SidebarProvider>
    );
} 