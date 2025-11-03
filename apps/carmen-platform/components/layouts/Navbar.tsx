import LangSwitch from "../LangSwitch";
import Profile from "./Profile";
import { AnimatedThemeToggler } from "../magicui/animated-theme-toggler";
import HambergerMenu from "./HambergerMenu";
import { SidebarTrigger } from "@/components/ui/sidebar";

export default function Navbar() {
  return (
    <nav className="flex justify-between items-center px-4 py-2 border-b">
      <div className="flex items-center gap-2">
        <SidebarTrigger />
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
  );
}
