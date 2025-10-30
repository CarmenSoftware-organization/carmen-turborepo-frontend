"use client";

import { Link } from "@/lib/navigation";
import { FileText, Shield } from "lucide-react";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { useTranslations } from "next-intl";

export default function SidebarLegal() {
  const tLegal = useTranslations("Legal");
  const pathname = usePathname();

  const navigation = [
    { link: "/terms", label: tLegal("terms_and_conditions"), icon: FileText },
    { link: "/policy", label: tLegal("privacy_policy"), icon: Shield },
  ];

  return (
    <aside className="w-64 flex-shrink-0">
      <div className="bg-background rounded-lg shadow-sm border border-border p-4 sticky top-24">
        <nav className="space-y-1">
          {navigation.map((item) => {
            const Icon = item.icon;
            const isActive = pathname.endsWith(item.link);

            return (
              <Link
                key={item.link}
                href={item.link}
                className={cn(
                  "flex items-center gap-2 px-3 py-2 rounded-md transition-colors",
                  isActive
                    ? "bg-primary text-primary-foreground"
                    : "hover:bg-accent hover:text-accent-foreground"
                )}
              >
                <Icon className="w-5 h-5" />
                {item.label}
              </Link>
            );
          })}
        </nav>
      </div>
    </aside>
  );
}
