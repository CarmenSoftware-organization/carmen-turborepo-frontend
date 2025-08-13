import LanguageSwitcher from "./LanguageSwitcher";
import ModuleList from "./ModuleList";
import ModuleMobile from "./ModuleMobile";
import { SwitchTheme } from "./SwitchTheme";
import TenantList from "./TenantList";
import UserAvatar from "./UserAvatar";
import Notification from "./Notification";
import { useTranslations } from "next-intl";
import "@/styles/layout.css";

export default function Navbar() {
    const tHome = useTranslations('HomePage');
    return (
        <div className="fxb-c navbar-container">
            <div className="px-2">
                <span
                    className="navbar-logo-text"
                    data-id="sidebar-logo-text"
                >
                    {tHome('carmenTitle')}
                </span>
                <span
                    className="navbar-logo-subtext"
                    data-id="sidebar-logo-text-sub"
                >
                    {tHome('HospitalitySupplyChain')}
                </span>
            </div>
            <div className="flex items-center gap-2">
                <div className="hidden md:block">
                    <ModuleList />
                </div>
                <div className="block md:hidden">
                    <ModuleMobile />
                </div>
                <div className="hidden md:flex items-center">
                    <TenantList />
                    <SwitchTheme />
                    <LanguageSwitcher />
                </div>
                <Notification />
                <UserAvatar />
            </div>
        </div>
    );
}

