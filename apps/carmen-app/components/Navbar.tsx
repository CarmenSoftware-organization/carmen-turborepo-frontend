import LanguageSwitcher from "./LanguageSwitcher";
import { SwitchTheme } from "./SwitchTheme";

export default function Navbar() {
    return (
        <div className="flex justify-between items-center p-4">
            <SwitchTheme />
            <LanguageSwitcher />
        </div>
    );
}
