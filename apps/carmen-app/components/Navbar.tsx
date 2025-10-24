import LanguageSwitcher from "./LanguageSwitcher";
import ModuleList from "./ModuleList";
import ModuleMobile from "./ModuleMobile";
import { SwitchTheme } from "./SwitchTheme";
import TenantList from "./TenantList";
import UserAvatar from "./UserAvatar";
import Notification from "./Notification";
import "@/styles/layout.css";
import { Link } from "@/lib/navigation";

export default function Navbar() {

    return (
        <div className="fxb-c navbar-container">
            <Link href="/dashboard" className="px-2">
                <span
                    className="navbar-logo-text"
                    data-id="sidebar-logo-text"
                >
                    Carmen
                </span>
                <span
                    className="navbar-logo-subtext"
                    data-id="sidebar-logo-text-sub"
                >
                    Hospitality Supply Chain
                </span>
            </Link>
            <div className="flex items-center gap-2">
                <div className="hidden md:block">
                    <ModuleList />
                </div>
                <div className="block md:hidden">
                    <ModuleMobile />
                </div>
                <div className="hidden md:flex items-center gap-2">
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

