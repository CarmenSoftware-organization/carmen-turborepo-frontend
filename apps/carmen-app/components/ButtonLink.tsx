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
            <Link href={href} className="hover:underline text-primary hover:text-primary/80 font-medium">
                {children}
            </Link>
        </Button>
    )
}