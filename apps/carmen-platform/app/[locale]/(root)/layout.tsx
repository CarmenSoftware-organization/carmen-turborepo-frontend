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

                <div className="w-[10%] border-r">
                    Left Sidebar
                </div>

                <div className="w-[86%] flex flex-col overflow-hidden">
                    <main className="flex-1 overflow-y-auto m-4">
                        {children}
                    </main>
                </div>

                <div className="w-[4%] border-l">
                    <RightSidebar />
                </div>
            </div>
        </div>
    );
} 