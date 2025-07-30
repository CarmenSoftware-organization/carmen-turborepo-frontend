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
            <div className="flex h-screen overflow-hidden">
                <SidebarComponent />
                <div className="flex-1 flex flex-col overflow-hidden">
                    <Navbar />
                    <main className="flex-1 p-4 space-y-4 overflow-y-auto">
                        {children}
                    </main>
                </div>
            </div>
        </ProtectedRoute>
    );
} 