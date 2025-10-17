import LanguageSwitcher from "@/components/LanguageSwitcher";
import { SwitchTheme } from "@/components/SwitchTheme";
import { Building2 } from "lucide-react";

export default function HeaderLegal() {
    return (
        <header className="bg-background border-b border-border sticky top-0 z-10 shadow-sm">
            <div className="max-w-7xl mx-auto px-6 py-4">
                <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                        <Building2 className="w-8 h-8 text-blue-600" />
                        <div>
                            <h1 className="text-xl font-bold">Carmen Software</h1>
                            <p className="text-sm">Hotel Finance Management</p>
                        </div>
                    </div>
                    <div className="flex items-center space-x-2 text-sm">
                        <SwitchTheme />
                        <LanguageSwitcher />
                    </div>
                </div>
            </div>
        </header>
    )
}