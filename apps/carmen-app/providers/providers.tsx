import { ThemeProvider } from "./theme-provider";
import { AuthProvider } from "@/context/AuthContext";
import { QueryProvider } from "./query-provider";

export function Providers({ children }: Readonly<{ children: React.ReactNode }>) {
    return (
        <ThemeProvider>
            <AuthProvider>
                <QueryProvider>
                    {children}
                </QueryProvider>
            </AuthProvider>
        </ThemeProvider>
    );
}