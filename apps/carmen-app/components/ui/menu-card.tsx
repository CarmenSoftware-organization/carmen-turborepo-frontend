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

export function MenuCardGrid({
    items,
    className
}: MenuCardGridProps) {
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
            <Card className="h-full transition-all hover:shadow-md hover:border-primary">
                <CardContent className="flex flex-col items-center justify-center p-4 space-y-2">
                    <item.icon className="h-8 w-8 text-muted-foreground" />
                    <h2 className="text-lg text-muted-foreground font-semibold text-center">{item.name}</h2>
                </CardContent>
            </Card>
        </Link>
    );
} 