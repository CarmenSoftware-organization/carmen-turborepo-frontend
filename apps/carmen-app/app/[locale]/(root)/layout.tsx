import Navbar from "@/components/Navbar";
import SidebarComponent from "@/components/SidebarComponent";
import { Sidebar, SidebarContent, SidebarProvider } from "@/components/ui/sidebar";

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
    return (
        <SidebarProvider>
            <Sidebar>
                <SidebarContent>
                    <SidebarComponent />
                </SidebarContent>
            </Sidebar>
            <div className="flex-1 flex flex-col overflow-auto">
                <Navbar />
                <main className="p-4 space-y-4">
                    {children}
                </main>
            </div>
        </SidebarProvider>
    );
} 