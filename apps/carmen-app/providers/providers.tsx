import { Suspense } from "react";
import { ThemeProvider } from "./theme-provider";
import { AuthProvider } from "@/context/AuthContext";

export function Providers({ children }: Readonly<{ children: React.ReactNode }>) {
    return (
        <Suspense fallback={<div>Loading Suspense...</div>}>
            <ThemeProvider>
                <AuthProvider>
                    {children}
                </AuthProvider>
            </ThemeProvider>
        </Suspense>
    );
}