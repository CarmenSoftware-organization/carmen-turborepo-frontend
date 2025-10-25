import LanguageSwitcher from "@/components/LanguageSwitcher";
import { SwitchTheme } from "@/components/SwitchTheme";
import { Link } from "@/lib/navigation";

export default function HeaderLegal() {
    return (
        <header className="bg-background border-b border-border sticky top-0 z-10 shadow-sm">
            <div className="max-w-7xl mx-auto px-6 py-4">
                <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                        <Link
                            href="/"
                            aria-label="home"
                            className="flex items-center space-x-2"
                        >
                            <span className="text-primary text-3xl font-extrabold tracking-tight">Carmen</span>
                        </Link>
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