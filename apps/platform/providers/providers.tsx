import { ThemeProvider } from "@/components/ui/theme-provider";
import { AuthProvider } from "@/contexts/auth-context";
import { Suspense } from "react";

export function Providers({ children }: Readonly<{ children: React.ReactNode }>) {
    return (
        <Suspense fallback={<div>Loading Suspense...</div>}>
            <ThemeProvider>
                <AuthProvider>{children}</AuthProvider>
            </ThemeProvider>
        </Suspense>
    );
}