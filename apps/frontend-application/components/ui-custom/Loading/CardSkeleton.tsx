import React from "react";
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

interface CardSkeletonProps {
    fields: number;
    withAction?: boolean;
}

export const CardSkeleton: React.FC<CardSkeletonProps> = ({
    fields,
    withAction = true
}) => (
    <Card>
        <CardContent className="p-4">
            <div className="space-y-2">
                {Array(fields).fill(0).map((_, index) => (
                    <div key={index} className="flex justify-between">
                        <Skeleton className="h-4 w-24" />
                        <Skeleton className="h-4 w-32" />
                    </div>
                ))}
            </div>
        </CardContent>
        {withAction && (
            <CardFooter className="flex justify-end gap-2 pt-0 pb-2 px-2">
                <Skeleton className="h-8 w-8" />
            </CardFooter>
        )}
    </Card>
);