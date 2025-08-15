import LeftSidebar from '@/components/layouts/LeftSidebar';
import Navbar from '@/components/layouts/Navbar';
import RightSidebar from '@/components/layouts/RightSidebar';
import { ReactNode } from 'react';

export default function RootLayout({
    children
}: Readonly<{
    children: ReactNode
}>) {
    return (
        <div className="h-screen grid grid-rows-[auto_1fr] overflow-hidden">
            <div className="z-20">
                <Navbar />
            </div>
            <div className="flex overflow-hidden">
                <LeftSidebar />
                <div className="flex-1 flex flex-col overflow-hidden">
                    <main className="flex-1 overflow-y-auto m-2">
                        {children}
                    </main>
                </div>
                <RightSidebar />
            </div>
        </div>
    );
} 