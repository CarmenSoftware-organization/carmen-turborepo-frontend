"use client";

import { sidebarItems } from "@/lib/menuSidebar"
import SidebarLink from "./SidebarLink"

const Sidebar = () => {
  return (
    <div className="flex h-full w-56 flex-col border-r bg-muted/10">
      <div className="flex h-14 items-center border-b px-4">
        <span className="font-semibold">Carmen Platform</span>
      </div>
      <div className="flex-1 overflow-auto py-2">
        <nav className="grid items-start gap-1 px-2 text-sm">
          {sidebarItems.map((item, index) => (
            <SidebarLink key={index} item={item} />
          ))}
        </nav>
      </div>
    </div>
  )
}

export default Sidebar;
