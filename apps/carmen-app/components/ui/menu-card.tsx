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
        "grid gap-2 sm:gap-3 md:gap-4",
        "grid-cols-2 sm:grid-cols-3 md:grid-cols-4",
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
      <Card className="h-full transition-all duration-300 group-hover:shadow-xl group-focus-visible:shadow-xl group-hover:border-primary/50 group-focus-visible:border-primary/50 group-hover:-translate-y-1 group-focus-visible:-translate-y-1 relative overflow-hidden border-muted/60 group-focus-visible:ring-2 group-focus-visible:ring-ring group-focus-visible:ring-offset-2">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 group-focus-visible:opacity-100 transition-opacity duration-300" />
        <CardContent className="flex flex-col items-center justify-center p-2 sm:p-3 md:p-4 space-y-1 sm:space-y-2 relative z-10">
          <div className="p-1.5 sm:p-2 md:p-2.5 rounded-full bg-primary/10 text-primary group-hover:bg-primary group-focus-visible:bg-primary group-hover:text-primary-foreground group-focus-visible:text-primary-foreground transition-all duration-300 shadow-sm">
            <item.icon className="h-4 w-4 sm:h-5 sm:w-5 md:h-6 md:w-6" />
          </div>
          <h2 className="text-xs sm:text-sm md:text-base font-semibold text-muted-foreground group-hover:text-primary group-focus-visible:text-primary transition-colors duration-300 text-center tracking-tight">
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
      <h1 className="text-4xl font-extrabold mb-6 bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent inline-block tracking-tight">
        {title}
      </h1>
      <MenuCardGrid items={subMenu} />
    </div>
  );
}
