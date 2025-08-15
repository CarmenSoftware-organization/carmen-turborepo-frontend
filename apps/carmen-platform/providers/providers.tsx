"use client";

import { Suspense, useState } from "react";
import { ThemeProvider } from "./theme-provider";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

export function Providers({ children }: Readonly<{ children: React.ReactNode }>) {
    const [queryClient] = useState(() => new QueryClient());

    return (
        <Suspense fallback={<div>Loading Suspense...</div>}>
            <QueryClientProvider client={queryClient}>
                <ThemeProvider>
                    {children}
                </ThemeProvider>
            </QueryClientProvider>
        </Suspense>
    );
}