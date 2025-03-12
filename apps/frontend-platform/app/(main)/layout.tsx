import MainLayout from "@/components/layouts/MainLayout";
import LoadingSpinner from "@/components/ui/LoadingSpinner";
import { Suspense } from "react";

export default function Layout({ children }: { children: React.ReactNode }) {
    return (
        <MainLayout>
            <Suspense fallback={<LoadingSpinner />}>
                {children}
            </Suspense>
        </MainLayout>
    );
} 