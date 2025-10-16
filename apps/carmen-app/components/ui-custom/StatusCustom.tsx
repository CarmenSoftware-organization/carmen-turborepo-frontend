import { cn } from "@/lib/utils";

export const StatusCustom = ({ is_active, children }: { is_active: boolean, children: React.ReactNode }) => {
    return (
        <div className="flex items-center gap-1">
            <div className={cn(
                "w-2 h-2 rounded-full",
                is_active ? "bg-active" : "bg-inactive"
            )}></div>
            <p className={cn(
                "font-medium text-sm",
                is_active ? "text-active" : "text-inactive"
            )}>
                {children}
            </p>
        </div>
    );
};