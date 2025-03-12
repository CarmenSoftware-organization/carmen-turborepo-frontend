import React from 'react'
import { Skeleton } from '@/components/ui/skeleton';

const SkeltonCategory = () => {
    return (
        <div className="flex flex-col md:flex-row items-center gap-4 p-6">
            <Skeleton className="h-56 md:h-[80vh] w-full rounded-xl" />
            <Skeleton className="h-56 md:h-[80vh] w-full rounded-xl" />
            <Skeleton className="h-56 md:h-[80vh] w-full rounded-xl" />
        </div>
    )
}

export default SkeltonCategory