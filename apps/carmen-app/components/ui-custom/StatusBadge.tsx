import { cn } from "@/lib/utils";
import { Ban, CircleCheck, CircleDashed, CircleX, ClipboardList, Loader, Send } from "lucide-react";

type StatusType =
    | "submit"
    | "Completed"
    | "sent"
    | "in_progress"
    | "voided"
    | "pending"
    | "approved"
    | "rejected"
    | "cancelled"
    | "default";

const STATUS_CONFIG: Record<StatusType, { color: string; icon: React.ElementType }> = {
    sent: {
        color: "text-sky-700",
        icon: Send,
    },
    in_progress: {
        color: "text-sunshinePrimary",
        icon: Loader,
    },
    pending: {
        color: "text-yellow-700",
        icon: CircleDashed,
    },
    approved: {
        color: "text-active",
        icon: CircleCheck,
    },
    rejected: {
        color: "text-crimsonPrimary",
        icon: Ban,
    },
    cancelled: {
        color: "text-rosePrimary",
        icon: CircleX,
    },
    voided: {
        color: "text-destructive",
        icon: CircleX,
    },
    default: {
        color: "text-slatePrimary",
        icon: ClipboardList,
    },
    submit: {
        color: "text-muted-foreground",
        icon: Send,
    },
    Completed: {
        color: "text-green-700 dark:text-green-500",
        icon: CircleCheck,
    },
};

export const StatusBadge = ({
    status,
    children,
}: {
    status: string;
    children: React.ReactNode;
}) => {
    const config =
        STATUS_CONFIG[(status as StatusType) || "default"] ?? STATUS_CONFIG.default;
    const Icon = config.icon;

    return (
        <div className="inline-flex items-center gap-1 bg-muted/50 dark:bg-muted border border-border rounded-md px-2 py-0.5">
            <Icon className={cn("w-3 h-3", config.color)} />
            <p className={cn("font-bold text-xs", config.color)}>{children}</p>
        </div>
    );
};
