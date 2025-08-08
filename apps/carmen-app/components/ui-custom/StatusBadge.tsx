import { cn } from "@/lib/utils"

export const StatusBadge = ({ status, children }: { status: string, children: React.ReactNode }) => {

    const getStatusColor = (status: string) => {
        if (status === 'draft') {
            return 'bg-gray-500'
        }
        if (status === 'in_progress') {
            return 'bg-yellow-500'
        }
        return 'bg-gray-500'
    }

    return (
        <div className="inline-flex items-center gap-1 bg-muted border border-border rounded-lg px-2">
            <div
                className={cn(
                    "w-2 h-2 rounded-full",
                    getStatusColor(status)
                )}
            ></div>
            <p className="font-medium">{children}</p>
        </div>
    )
}