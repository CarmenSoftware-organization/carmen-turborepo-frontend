import { cn } from "@/lib/utils"

export const StatusBadge = ({ status, children }: { status: string, children: React.ReactNode }) => {

    const getStatusColor = (status: string) => {
        if (status === 'in_progress') {
            return 'bg-sunshinePrimary'
        }
        if (status === 'pending') {
            return 'bg-azurePrimary'
        }
        if (status === 'approved') {
            return 'bg-tealPrimary'
        }
        if (status === 'rejected') {
            return 'bg-crimsonPrimary'
        }
        if (status === 'cancelled') {
            return 'bg-rosePrimary'
        }
        return 'bg-slatePrimary'
    }

    const getStatusTextColor = (status: string) => {
        if (status === 'in_progress') {
            return 'text-sunshinePrimary'
        }
        if (status === 'pending') {
            return 'text-azurePrimary'
        }
        if (status === 'approved') {
            return 'text-tealPrimary'
        }
        if (status === 'rejected') {
            return 'text-crimsonPrimary'
        }
        if (status === 'cancelled') {
            return 'text-rosePrimary'
        }
        return 'text-slatePrimary'
    }

    return (
        <div className="inline-flex items-center gap-1 bg-muted/50 dark:bg-muted border border-border rounded-lg px-2">
            <div
                className={cn(
                    "w-2 h-2 rounded-full",
                    getStatusColor(status)
                )}
            ></div>
            <p className={cn(
                "font-medium",
                getStatusTextColor(status)
            )}>{children}</p>
        </div>
    )
}