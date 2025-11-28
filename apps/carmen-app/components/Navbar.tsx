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
    <div className="fxb-c navbar-container border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 shadow-sm">
      <Link href="/dashboard" className="px-2 group flex flex-col justify-center">
        <span
          className="text-3xl font-bold tracking-tight text-primary hover:text-primary/80 transition-colors duration-200"
          data-id="sidebar-logo-text"
        >
          Carmen
        </span>
        <span
          className="text-[10px] font-medium text-muted-foreground uppercase tracking-wider group-hover:text-primary/80 transition-colors duration-200"
          data-id="sidebar-logo-text-sub"
        >
          Hospitality Supply Chain
        </span>
      </Link>
      <div className="flex items-center gap-4">
        <div className="hidden md:block">
          <ModuleList />
        </div>
        <div className="block md:hidden">
          <ModuleMobile />
        </div>

        <div className="h-6 w-px bg-border hidden md:block" />

        <div className="hidden md:flex items-center gap-3">
          <TenantList />
          <SwitchTheme />
          <LanguageSwitcher dense />
        </div>

        <div className="h-6 w-px bg-border hidden md:block" />

        <div className="flex items-center gap-3">
          <Notification />
          <UserAvatar />
        </div>
      </div>
    </div>
  );
}
