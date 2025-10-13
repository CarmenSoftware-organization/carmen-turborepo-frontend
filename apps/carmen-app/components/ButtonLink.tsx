import { Link } from "@/lib/navigation";
import { Button } from "./ui/button";
import { cn } from "@/lib/utils";

interface ButtonLinkProps {
    readonly href: string;
    readonly children: React.ReactNode;
    readonly className?: string;
}

export default function ButtonLink({ href, children, className }: ButtonLinkProps) {
    return (
        <Button variant={'ghost'} asChild className={cn("p-0 hover:bg-transparent", className)}>
            <Link href={href} className="text-base hover:underline hover:underline-offset text-primary dark:text-primary-foreground hover:text-primary/80">
                {children}
            </Link>
        </Button>
    )
}