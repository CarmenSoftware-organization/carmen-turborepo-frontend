import LanguageSwitcher from "./LanguageSwitcher";
import ModuleList from "./ModuleList";
import ModuleMobile from "./ModuleMobile";
import { SwitchTheme } from "./SwitchTheme";
import TenantList from "./TenantList";
import UserAvatar from "./UserAvatar";

export default function Navbar() {
    return (
        <div className="flex justify-end items-center p-2 bg-background border-b gap-2">
            <ModuleList />
            <ModuleMobile />
            <div className="hidden md:flex items-center">
                <TenantList />
                <SwitchTheme />
                <LanguageSwitcher />
            </div>
            <UserAvatar />
        </div>
    );
}

