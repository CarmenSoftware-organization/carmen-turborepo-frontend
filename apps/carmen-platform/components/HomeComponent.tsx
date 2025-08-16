"use client";

import { Link, useRouter } from "@/i18n/routing";
import { Button } from "./ui/button";
import { ArrowRight, CheckCircle2, LogIn } from "lucide-react";
import { useTranslations } from "next-intl";

export default function HomeComponent() {
    const t = useTranslations();
    const router = useRouter();

    const handleLogin = () => {
        router.push("/auth");
    }

    return (
        <div className="min-h-screen w-full bg-[#0a0a0a] relative">
            {/* Background gradient layer */}
            <div className="absolute inset-0 z-0 bg-gradient-overlay" />

            <div className="relative z-10 flex flex-col items-center justify-center h-screen">
                <h1 className="text-4xl font-bold text-white mb-8">Carmen Platform</h1>
                <div className="flex flex-row items-center justify-center space-x-4">
                    <Button
                        variant="outline"
                        onClick={handleLogin}
                        className="text-base font-medium transition-colors"
                    >
                        <LogIn className="w-4 h-4" />
                        Login
                    </Button>
                </div>
            </div>
        </div>
    );
}