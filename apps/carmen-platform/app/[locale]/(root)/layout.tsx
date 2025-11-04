import { AppSidebar } from "@/components/layouts/app-sidebar";
import Navbar from "@/components/layouts/Navbar";
import RightSidebar from "@/components/layouts/RightSidebar";
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import { ReactNode } from "react";

export default function RootLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  return (
    <SidebarProvider defaultOpen={true}>
      <div className="flex h-screen w-full">
        <AppSidebar />
        <div className="flex flex-col flex-1 min-w-0">
          <Navbar />
          <SidebarInset className="flex-1 overflow-hidden">
            <main className="h-full overflow-y-auto p-4">{children}</main>
          </SidebarInset>
        </div>
        <div className="hidden md:block border-l">
          <RightSidebar />
        </div>
      </div>
    </SidebarProvider>
  );
}
