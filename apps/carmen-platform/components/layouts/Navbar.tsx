import { Home } from "lucide-react"
import { SwitchTheme } from "../SwitchTheme"
import LangSwitch from "../LangSwitch"

export default function Navbar() {
    return (
        <nav className="flex justify-between items-center px-4 py-2 border-b">
            <div className="flex items-center gap-2">
                <Home />
                <p className="text-sm text-primary font-bold">Carmen Platform</p>
            </div>
            <div className="flex items-center gap-2">
                <LangSwitch />
                <SwitchTheme />
                <div className="w-7 h-7 rounded-full bg-amber-500 dark:bg-amber-600 flex items-center justify-center">
                    <p className="text-sm font-bold">T</p>
                </div>
            </div>
        </nav>
    )
}