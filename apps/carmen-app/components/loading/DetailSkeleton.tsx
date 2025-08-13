import { Skeleton } from "@/components/ui/skeleton"

export function DetailSkeleton() {
    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="fxr-c gap-3">
                <Skeleton className="h-8 w-8 rounded-md" /> {/* Back button */}
                <Skeleton className="h-8 w-48" /> {/* Title */}
            </div>

            {/* Details */}
            <div className="px-6 space-y-4">
                <div className="grid grid-cols-[auto_1fr] gap-x-4 gap-y-3 items-start">
                    <Skeleton className="h-5 w-24" /> {/* Label */}
                    <Skeleton className="h-5 w-32" /> {/* Value */}

                    <Skeleton className="h-5 w-24" /> {/* Label */}
                    <Skeleton className="h-5 w-48" /> {/* Value */}
                </div>

                {/* Users */}
                <div className="space-y-2 pt-4">
                    <Skeleton className="h-5 w-36" /> {/* Users label */}
                    <div className="space-y-2">
                        {Array.from({ length: 3 }).map((_, i) => (
                            <Skeleton key={i} className="h-4 w-40" /> // List items
                        ))}
                    </div>
                </div>
            </div>

            {/* Edit Button */}
            <div className="px-6">
                <Skeleton className="h-8 w-24 rounded-md" />
            </div>
        </div>
    )
}
