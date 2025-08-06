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
            <div className="relative h-screen overflow-hidden">
                <div className="absolute top-0 left-0 right-0 z-20">
                    <Navbar />
                </div>
                <div className="flex h-screen">
                    <SidebarComponent />
                    <div className="flex-1 flex flex-col overflow-hidden">
                        <main className="flex-1 space-y-4 overflow-y-auto px-4 pt-20">
                            {children}
                        </main>
                    </div>
                </div>
            </div>
        </ProtectedRoute>
    );
} 