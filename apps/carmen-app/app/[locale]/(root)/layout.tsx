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
            <div className="flex">
                <SidebarComponent />
                <div className="flex-1 overflow-auto">
                    <Navbar />
                    <main className="p-4 space-y-4">
                        {children}
                    </main>
                </div>
            </div>
        </ProtectedRoute>
    );
} 