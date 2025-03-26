import { ThemeProvider } from "./theme-provider";
import { AuthProvider } from "@/context/AuthContext";

export function Providers({ children }: Readonly<{ children: React.ReactNode }>) {
    return (
        <ThemeProvider>
            <AuthProvider>
                {children}
            </AuthProvider>
        </ThemeProvider>
    );
}