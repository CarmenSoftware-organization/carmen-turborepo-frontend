import { Link } from "@/i18n/routing";
import { Building2, Info, ChevronRight } from "lucide-react";

const menuItems = [
  {
    id: 1,
    label: "Register BU",
    description: "Register a new business unit",
    href: "/playground/register-bu",
    icon: Building2,
  },
  {
    id: 2,
    label: "About",
    description: "Learn more about the playground",
    href: "/playground/about",
    icon: Info,
  },
];

export default function PlaygroundComponent() {
  return (
    <div className="max-w-2xl py-6 px-4">
      <h1 className="text-2xl font-bold mb-4">Playground</h1>

      <div className="space-y-2">
        {menuItems.map((item) => {
          const Icon = item.icon;
          return (
            <Link
              key={item.id}
              href={item.href}
              className="group flex items-center gap-3 p-3 rounded-lg border hover:bg-accent transition-colors"
            >
              <div className="flex h-8 w-8 items-center justify-center rounded-md bg-primary/10">
                <Icon className="h-4 w-4 text-primary" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-medium text-sm">{item.label}</p>
                <p className="text-xs text-muted-foreground truncate">
                  {item.description}
                </p>
              </div>
              <ChevronRight className="h-4 w-4 text-muted-foreground transition-transform group-hover:translate-x-0.5" />
            </Link>
          );
        })}
      </div>
    </div>
  );
}
