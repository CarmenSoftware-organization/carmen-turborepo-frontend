import React from 'react';
import { Skeleton } from '@/components/ui/skeleton';

const SkeletonTableLoading = () => {
    return (
        <div className="border border-gray-200 rounded-md p-5">
            <Skeleton className="h-[250px] w-full" />
            <div className="py-3 border-b border-gray-200">
                <Skeleton className="h-4 w-full" />
            </div>

            <div className="divide-y divide-gray-200 space-y-5">
                {Array.from({ length: 8 }).map((_, rowIndex) => (
                    <div
                        key={rowIndex}
                        className="grid grid-cols-4 gap-4"
                    >
                        {Array.from({ length: 4 }).map((_, colIndex) => (
                            <Skeleton
                                key={colIndex}
                                className="h-4 w-full"
                            />
                        ))}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default SkeletonTableLoading;