import React from 'react';
import { Skeleton } from '@/components/ui/skeleton';

const SkeltonCardLoading = () => {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {Array.from({ length: 6 }).map((_, rowIndex) => (
                <Skeleton key={rowIndex} className="h-[125px] w-full rounded-xl" />
            ))}
        </div>
    )
}

export default SkeltonCardLoading