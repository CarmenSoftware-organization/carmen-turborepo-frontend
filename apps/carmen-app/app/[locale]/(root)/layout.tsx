import { ReactNode } from "react";
import Navbar from "@/components/Navbar";
import SidebarComponent from "@/components/SidebarComponent";
import ProtectedRoute from "@/components/ProtectedRoute";

export default function RootLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  return (
    <ProtectedRoute>
      <div className="h-screen overflow-hidden flex flex-col">
        <Navbar />
        <div className="grid flex-1 min-h-0 md:grid-cols-[auto_1fr]">
          <aside className="hidden md:block z-30 relative overflow-y-auto">
            <SidebarComponent />
          </aside>
          <main className="overflow-auto px-4 py-3 relative z-0">{children}</main>
        </div>
      </div>
    </ProtectedRoute>
  );
}
