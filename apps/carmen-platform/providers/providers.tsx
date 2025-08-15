"use client";

import { Suspense, useState } from "react";
import { ThemeProvider } from "./theme-provider";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { AuthProvider } from "@/app/context/AuthContext";

export function Providers({ children }: Readonly<{ children: React.ReactNode }>) {
    const [queryClient] = useState(() => new QueryClient());

    return (
        <Suspense fallback={<div>Loading Suspense...</div>}>
            <QueryClientProvider client={queryClient}>
                <AuthProvider>
                    <ThemeProvider>
                        {children}
                    </ThemeProvider>
                </AuthProvider>
            </QueryClientProvider>
        </Suspense>
    );
}