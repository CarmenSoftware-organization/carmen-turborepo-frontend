import { LucideIcon } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { Link } from "@/lib/navigation";

export interface MenuCardItem {
  name: string;
  href: string;
  icon: LucideIcon;
}

interface MenuCardGridProps {
  readonly items: MenuCardItem[];
  readonly className?: string;
}

export function MenuCardGrid({ items, className }: MenuCardGridProps) {
  return (
    <div className={cn("grid grid-cols-2 lg:grid-cols-4 gap-6", className)}>
      {items.map((item) => (
        <MenuCard key={item.name} item={item} />
      ))}
    </div>
  );
}

interface MenuCardProps {
  readonly item: MenuCardItem;
  readonly className?: string;
}

export function MenuCard({ item, className }: MenuCardProps) {
  return (
    <Link
      href={item.href}
      className={cn("block", className)}
      aria-label={`Navigate to ${item.name}`}
      tabIndex={0}
    >
      <Card className="h-full transition-all duration-300 hover:shadow-xl hover:border-primary/50 hover:-translate-y-1 group relative overflow-hidden border-muted/60">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        <CardContent className="flex flex-col items-center justify-center p-8 space-y-4 relative z-10">
          <div className="p-4 rounded-full bg-primary/10 text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-all duration-300 shadow-sm">
            <item.icon className="h-8 w-8" />
          </div>
          <h2 className="text-lg font-semibold text-muted-foreground group-hover:text-primary transition-colors duration-300 text-center tracking-tight">
            {item.name}
          </h2>
        </CardContent>
      </Card>
    </Link>
  );
}

export function GenericMenuPage({
  title,
  subMenu,
}: {
  readonly title: string;
  readonly subMenu: MenuCardItem[];
}) {
  return (
    <div>
      <h1 className="text-3xl font-bold mb-8">{title}</h1>
      <MenuCardGrid items={subMenu} />
    </div>
  );
}
