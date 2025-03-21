import { Suspense } from "react";
import { ThemeProvider } from "./theme-provider";

export function Providers({ children }: Readonly<{ children: React.ReactNode }>) {
    return (
        <Suspense fallback={<div>Loading Suspense...</div>}>
            <ThemeProvider>
                {children}
            </ThemeProvider>
        </Suspense>
    );
}