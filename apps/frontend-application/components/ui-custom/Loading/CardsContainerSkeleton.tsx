import React from "react";

import { CardSkeleton } from './CardSkeleton';

interface CardsContainerSkeletonProps {
    cards?: number;
    fields: number;
    withAction?: boolean;
}

export const CardsContainerSkeleton: React.FC<CardsContainerSkeletonProps> = ({
    cards = 5,
    fields,
    withAction
}) => (
    <div className="grid grid-cols-1 gap-4">
        {Array(cards).fill(0).map((_, index) => (
            <CardSkeleton
                key={index}
                fields={fields}
                withAction={withAction}
            />
        ))}
    </div>
);