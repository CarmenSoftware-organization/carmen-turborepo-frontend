import LangSwitch from "../LangSwitch"
import { useTranslations } from "next-intl";
import Profile from "./Profile";
import { AnimatedThemeToggler } from "../magicui/animated-theme-toggler";
import HambergerMenu from "./HambergerMenu";

export default function Navbar() {
    const t = useTranslations();

    return (
        <nav className="flex justify-between items-center px-4 py-2 border-b">
            <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center">
                    <p className="text-xl font-semibold">C</p>
                </div>
                <p className="text-base font-bold hidden md:block">{t("app.title")}</p>
            </div>
            <div className="flex items-center gap-2">
                <div className="hidden md:block">
                    <LangSwitch />
                </div>
                <div className="hidden md:block">
                    <AnimatedThemeToggler />
                </div>
                <div className="block md:hidden">
                    <HambergerMenu />
                </div>
                <Profile />
            </div>
        </nav>
    )
}