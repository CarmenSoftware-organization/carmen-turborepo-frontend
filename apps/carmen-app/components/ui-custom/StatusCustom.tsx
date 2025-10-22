import { cn } from "@/lib/utils";

interface Props {
    is_active: boolean;
    dense?: boolean;
    children: React.ReactNode
}

export const StatusCustom = ({
    is_active,
    dense,
    children
}: Props) => {
    return (
        <div className="flex items-center gap-1">
            <div className={cn(
                "w-2 h-2 rounded-full",
                is_active ? "bg-active" : "bg-inactive"
            )}></div>
            <p className={cn(
                "font-medium",
                is_active ? "text-active" : "text-inactive",
                dense ? "text-xs" : "text-sm"
            )}>
                {children}
            </p>
        </div>
    );
};