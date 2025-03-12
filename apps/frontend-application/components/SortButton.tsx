import React from 'react'
import { Button } from './ui/button';
import { ChevronDown, ChevronUp } from 'lucide-react';


export type SortDirection = 'asc' | 'desc';

interface Props {
    field: string;
    label: string;
    isActive: boolean;
    direction: SortDirection;
    onSort: (field: string) => void;
}

const SortButton: React.FC<Props> = ({
    field,
    label,
    isActive,
    direction,
    onSort,
}) => {
    return (
        <div className="flex items-center gap-1">
            <span>{label}</span>
            <Button
                variant="ghost"
                size="sm"
                className="h-6 w-6 p-0"
                onClick={() => onSort(field)}
                aria-label={`Sort by ${label} ${isActive ? direction === 'asc' ? 'descending' : 'ascending' : ''}`}
            >
                {isActive ? (
                    direction === 'asc' ? (
                        <ChevronUp className="h-4 w-4" />
                    ) : (
                        <ChevronDown className="h-4 w-4" />
                    )
                ) : (
                    <div className="flex flex-col -space-y-2">
                        <ChevronUp className="h-3 w-3 opacity-50" />
                        <ChevronDown className="h-3 w-3 opacity-50" />
                    </div>
                )}
            </Button>
        </div>
    )
}

export default SortButton;