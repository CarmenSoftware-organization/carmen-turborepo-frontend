import LanguageSwitcher from "./LanguageSwitcher";
import ModuleList from "./ModuleList";
import { SwitchTheme } from "./SwitchTheme";

export default function Navbar() {
    return (
        <div className="flex justify-end items-center p-2 bg-background">
            <ModuleList />
            <SwitchTheme />
            <LanguageSwitcher />
        </div>
    );
}
