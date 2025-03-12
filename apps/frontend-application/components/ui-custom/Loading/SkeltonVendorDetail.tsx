import { Skeleton } from "@/components/ui/skeleton"
import React from "react"
const SkeltonVendorDetail = () => {
    return (
        <div className="flex flex-col space-y-3 p-4">
            <Skeleton className="h-[225px] rounded-xl" />
            <div className="space-y-2">
                <Skeleton className="h-[125px] rounded-xl" />
                <Skeleton className="h-[125px] rounded-xl" />
                <Skeleton className="h-[125px] rounded-xl" />
            </div>
        </div>
    )
}

export default SkeltonVendorDetail