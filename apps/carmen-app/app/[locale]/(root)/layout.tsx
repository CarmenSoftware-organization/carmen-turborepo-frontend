import { ReactNode } from 'react';
import Navbar from "@/components/Navbar";
import SidebarComponent from '@/components/SidebarComponent';
import ProtectedRoute from '@/components/ProtectedRoute';

export default function RootLayout({
    children
}: Readonly<{
    children: ReactNode
}>) {
    return (
        <ProtectedRoute>
            <div className="h-screen overflow-scroll">
                <div className="fixed top-0 left-0 right-0 z-50">
                    <Navbar />
                </div>
                <div className="grid w-full md:grid-cols-[auto_1fr] pt-16">
                    <aside className="hidden md:block z-30 relative">
                        <SidebarComponent />
                    </aside>
                    <main className="h-[calc(100vh-4rem)] overflow-auto p-4 relative z-0">
                        {children}
                    </main>
                </div>
            </div>
        </ProtectedRoute>
    );
}
