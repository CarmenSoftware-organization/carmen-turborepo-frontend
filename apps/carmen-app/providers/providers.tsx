import { ThemeProvider } from "./theme-provider";
import { AuthProvider } from "@/context/AuthContext";
import { BuConfigProvider } from "@/context/BuConfigContext";
import { QueryProvider } from "./query-provider";

export function Providers({ children }: Readonly<{ children: React.ReactNode }>) {
    return (
        <ThemeProvider>
            <QueryProvider>
                <AuthProvider>
                    <BuConfigProvider>
                        {children}
                    </BuConfigProvider>
                </AuthProvider>
            </QueryProvider>
        </ThemeProvider>
    );
}