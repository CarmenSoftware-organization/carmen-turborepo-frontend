import { Link } from "@/lib/navigation";
import { Button } from "./ui/button";
import { cn } from "@/lib/utils";

interface Props {
    readonly href: string;
    readonly children: React.ReactNode;
    readonly className?: string;
}

export default function ButtonIcon({ href, children, className }: Props) {
    return (
        <Button variant={'ghost'} asChild className={cn("hover:text-muted-foreground hover:bg-transparent h-7 w-7", className)}>
            <Link href={href}>
                {children}
            </Link>
        </Button>
    )
}