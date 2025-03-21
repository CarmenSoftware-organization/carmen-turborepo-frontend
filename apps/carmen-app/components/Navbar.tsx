import LanguageSwitcher from "./LanguageSwitcher";
import ModuleList from "./ModuleList";
import { SwitchTheme } from "./SwitchTheme";
import UserAvatar from "./UserAvatar";

export default function Navbar() {
    return (
        <div className="flex justify-end items-center p-2 bg-background border-b gap-2">
            <ModuleList />
            <SwitchTheme />
            <LanguageSwitcher />
            <UserAvatar />
        </div>
    );
}

