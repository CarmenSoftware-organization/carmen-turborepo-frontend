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
            <div className="h-screen grid grid-rows-[auto_1fr] overflow-hidden">
                <div className="z-20">
                    <Navbar />
                </div>
                <div className="flex overflow-hidden">
                    <SidebarComponent />
                    <div className="flex-1 flex flex-col overflow-hidden">
                        <main className="flex-1 overflow-y-auto m-4">
                            {children}
                        </main>
                    </div>
                </div>
            </div>
        </ProtectedRoute>
    );
} 