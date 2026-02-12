import LanguageSwitcher from "./LanguageSwitcher";
import ModuleList from "./ModuleList";
import ModuleMobile from "./ModuleMobile";
import { SwitchTheme } from "./SwitchTheme";
import BusinessList from "./BusinessList";
import UserAvatar from "./UserAvatar";
import Notification from "./Notification";

import { Link } from "@/lib/navigation";

export default function Navbar() {
  return (
    <div className="flex items-center justify-between p-2 gap-2 border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 shadow-sm">
      <Link href="/dashboard" className="px-1 group flex flex-col justify-center">
        <span
          className="text-xl font-bold tracking-tight text-primary hover:text-primary/80 transition-colors duration-200"
          data-id="sidebar-logo-text"
        >
          Carmen
        </span>
        <div className="flex items-center gap-2">
          <span
            className="text-[9px] font-medium text-muted-foreground uppercase tracking-wider group-hover:text-primary/80 transition-colors duration-200"
            data-id="sidebar-logo-text-sub"
          >
            Hospitality Supply Chain
          </span>
          {process.env.NODE_ENV === "development" && (
            <p className="text-[10px] font-medium text-muted-foreground uppercase tracking-wider">
              (build latest 9/2/2026)
            </p>
          )}
        </div>
      </Link>
      <div className="flex items-center gap-2">
        <div className="hidden md:block">
          <ModuleList />
        </div>
        <div className="block md:hidden">
          <ModuleMobile />
        </div>

        <div className="h-4 w-px bg-border hidden md:block" />

        <div className="hidden md:flex items-center gap-2">
          <BusinessList />
          <SwitchTheme />
          <LanguageSwitcher dense />
        </div>

        <div className="h-4 w-px bg-border hidden md:block" />

        <div className="flex items-center gap-2">
          <Notification />
          <UserAvatar />
        </div>
      </div>
    </div>
  );
}
