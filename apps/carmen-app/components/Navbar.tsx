import LanguageSwitcher from "./LanguageSwitcher";
import ModuleList from "./ModuleList";
import ModuleMobile from "./ModuleMobile";
import { SwitchTheme } from "./SwitchTheme";
import TenantList from "./TenantList";
import UserAvatar from "./UserAvatar";
import Notification from "./Notification";
import { useTranslations } from "next-intl";

export default function Navbar() {
    const tHome = useTranslations('HomePage');
    return (
        <div className="flex items-center justify-between p-2 bg-background border-b border-border gap-2">
            <div className="px-2">
                <span
                    className={"text-3xl text-primary font-bold block tracking-wide"}
                    data-id="sidebar-logo-text"
                >
                    {tHome('carmenTitle')}
                </span>
                <span
                    className="block tracking-wide text-xs text-muted-foreground"
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

