import LanguageSwitcher from "./LanguageSwitcher";
import { SwitchTheme } from "./SwitchTheme";

export default function Navbar() {
    return (
        <div className="flex justify-end items-center p-2 bg-background">
            <SwitchTheme />
            <LanguageSwitcher />
        </div>
    );
}
