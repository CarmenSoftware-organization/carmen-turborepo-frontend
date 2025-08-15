import { SwitchTheme } from "../SwitchTheme"
import LangSwitch from "../LangSwitch"
import { useTranslations } from "next-intl";
import Profile from "./Profile";
import { AnimatedThemeToggler } from "../magicui/animated-theme-toggler";

export default function Navbar() {
    const t = useTranslations();

    return (
        <nav className="flex justify-between items-center px-4 py-2 border-b">
            <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center">
                    <p className="text-xl font-semibold">C</p>
                </div>
                <p className="text-base font-bold">{t("app.title")}</p>
            </div>
            <div className="flex items-center gap-2">
                <LangSwitch />
                {/* <SwitchTheme /> */}
                <AnimatedThemeToggler />
                <Profile />
            </div>
        </nav>
    )
}