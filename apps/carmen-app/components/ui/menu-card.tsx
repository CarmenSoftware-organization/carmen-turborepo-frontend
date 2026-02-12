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
    <div
      className={cn(
        "grid gap-2",
        "grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5",
        className
      )}
    >
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
      className={cn("block group focus:outline-none", className)}
      aria-label={`Navigate to ${item.name}`}
    >
      <Card className="h-full border-l-2 border-l-transparent group-hover:border-l-primary group-focus-visible:border-l-primary transition-all duration-150 group-hover:bg-muted/40 group-focus-visible:ring-1 group-focus-visible:ring-ring">
        <CardContent className="flex items-center gap-3 p-3">
          <div className="shrink-0 p-2 rounded-md bg-primary/8 text-primary group-hover:bg-primary/15 transition-colors duration-150">
            <item.icon className="h-4 w-4" strokeWidth={1.5} />
          </div>
          <h2 className="text-xs font-medium text-foreground/80 group-hover:text-primary transition-colors duration-150 leading-tight tracking-tight">
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
      <h1 className="text-base font-semibold mb-4 text-primary tracking-tight">
        {title}
      </h1>
      <MenuCardGrid items={subMenu} />
    </div>
  );
}
