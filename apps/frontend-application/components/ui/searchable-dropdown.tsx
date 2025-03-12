'use client';

import React, { useState, useMemo, useEffect, useRef, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Check, ChevronDown, Search, Loader2 } from "lucide-react";

// Helper function to highlight matched text
const HighlightedText = ({ text, highlight }: { text: string; highlight: string }) => {
    if (!highlight.trim()) {
        return <span className="font-medium">{text}</span>;
    }

    // Case insensitive match
    const regex = new RegExp(`(${highlight.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi');
    const parts = text.split(regex);

    return (
        <span className="font-medium">
            {parts.map((part, i) => (
                regex.test(part) ? (
                    <span key={i} className="text-red-500">{part}</span>
                ) : (
                    <span key={i}>{part}</span>
                )
            ))}
        </span>
    );
};

export type SearchableDropdownProps<T extends Record<string, unknown>> = {
    data: T[];
    value: T | null;
    onChange: (item: T) => void;
    displayValue: (item: T | null) => string;
    getItemText: (item: T) => string;
    getItemId: (item: T) => string | number;
    searchFields?: Array<keyof T>;
    placeholder?: string;
    searchPlaceholder?: string;
    noResultsText?: string;
    noDataText?: string;
    itemsPerBatch?: number;
    className?: string;
    readOnly?: boolean;
};

export function SearchableDropdown<T extends Record<string, unknown>>({
    data,
    value,
    onChange,
    displayValue,
    getItemText,
    getItemId,
    searchFields = ['name'] as Array<keyof T>,
    placeholder = "Select an item",
    searchPlaceholder = "Search...",
    noResultsText = "No matching items found",
    noDataText = "No items available",
    itemsPerBatch = 10,
    className = "",
    readOnly = false,
}: SearchableDropdownProps<T>) {
    const [searchTerm, setSearchTerm] = useState('');
    const [isOpen, setIsOpen] = useState(false);
    const [displayCount, setDisplayCount] = useState(itemsPerBatch);
    const [isLoading, setIsLoading] = useState(false);

    const observerRef = useRef<IntersectionObserver | null>(null);
    const loadMoreRef = useRef<HTMLDivElement>(null);

    // Filter items based on search term
    const filteredItems = useMemo(() => {
        if (!searchTerm.trim()) return data;

        return data.filter(item => {
            // Search in all specified fields
            return searchFields.some(field => {
                const fieldValue = String(item[field] || '').toLowerCase();
                return fieldValue.includes(searchTerm.toLowerCase());
            });
        });
    }, [data, searchTerm, searchFields]);

    // Get current items to display
    const currentItems = useMemo(() => {
        return filteredItems.slice(0, displayCount);
    }, [filteredItems, displayCount]);

    // Check if we have more items to load
    const hasMoreItems = useMemo(() => {
        return displayCount < filteredItems.length;
    }, [filteredItems, displayCount]);

    // Reset to initial items when search term changes
    useEffect(() => {
        setDisplayCount(itemsPerBatch);
    }, [searchTerm, itemsPerBatch]);

    // Reset when dropdown opens
    useEffect(() => {
        if (isOpen) {
            setDisplayCount(itemsPerBatch);
        }
    }, [isOpen, itemsPerBatch]);

    // Load more items function
    const loadMoreItems = useCallback(() => {
        if (!hasMoreItems || isLoading) return;

        setIsLoading(true);

        // Simulate an API call with setTimeout
        setTimeout(() => {
            setDisplayCount(prev => Math.min(prev + itemsPerBatch, filteredItems.length));
            setIsLoading(false);
        }, 300);
    }, [hasMoreItems, isLoading, itemsPerBatch, filteredItems.length]);

    // Set up intersection observer
    useEffect(() => {
        if (!isOpen) return;

        const observer = new IntersectionObserver(
            (entries) => {
                if (entries[0].isIntersecting && hasMoreItems) {
                    loadMoreItems();
                }
            },
            {
                root: document.querySelector('.scroll-container'),
                rootMargin: '0px 0px 50px 0px',
                threshold: 0.1
            }
        );

        observerRef.current = observer;

        const currentLoadMoreRef = loadMoreRef.current;
        if (currentLoadMoreRef) {
            observer.observe(currentLoadMoreRef);
        }

        return () => {
            if (currentLoadMoreRef) {
                observer.disconnect();
            }
        };
    }, [isOpen, hasMoreItems, loadMoreItems]);

    return (
        <div className={`relative ${className}`}>
            <DropdownMenu onOpenChange={setIsOpen}>
                <DropdownMenuTrigger asChild disabled={readOnly}>
                    <Button className="w-full justify-between" variant={'outline'} size={'sm'} disabled={readOnly}>
                        {displayValue(value) || placeholder}
                        <ChevronDown className="ml-2 h-4 w-4" />
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                    <div className="px-2 py-2 sticky top-0 bg-white border-b z-10">
                        <div className="relative">
                            <Input
                                placeholder={searchPlaceholder}
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="pl-8 w-full"
                                autoComplete="off"
                                // Prevent closing dropdown when clicking input
                                onClick={(e) => e.stopPropagation()}
                                disabled={readOnly}
                            />
                            <Search className="h-4 w-4 text-muted-foreground absolute left-2.5 top-1/2 transform -translate-y-1/2" />
                        </div>
                    </div>

                    {currentItems.length > 0 ? (
                        <>
                            <div className="max-h-[200px] overflow-y-auto scroll-container">
                                {currentItems.map((item) => {
                                    const id = getItemId(item);
                                    const isSelected = value ? getItemId(value) === id : false;

                                    return (
                                        <DropdownMenuItem
                                            key={id}
                                            className="flex items-center gap-2 p-2 cursor-pointer"
                                            onSelect={() => onChange(item)}
                                        >
                                            <div className="flex h-4 w-4 items-center justify-center">
                                                {isSelected && <Check className="h-4 w-4" />}
                                            </div>
                                            <HighlightedText
                                                text={getItemText(item)}
                                                highlight={searchTerm}
                                            />
                                        </DropdownMenuItem>
                                    );
                                })}

                                {hasMoreItems && (
                                    <div
                                        ref={loadMoreRef}
                                        className="flex items-center justify-center p-2 text-xs text-muted-foreground h-8"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            if (!isLoading) loadMoreItems();
                                        }}
                                    >
                                        {isLoading ? (
                                            <div className="flex items-center gap-2">
                                                <Loader2 className="h-3 w-3 animate-spin" />
                                                <span>Loading more...</span>
                                            </div>
                                        ) : (
                                            <span>Scroll for more items</span>
                                        )}
                                    </div>
                                )}
                            </div>
                        </>
                    ) : (
                        <div className="px-2 py-1.5 text-sm text-muted-foreground">
                            {data.length > 0 ? noResultsText : noDataText}
                        </div>
                    )}
                </DropdownMenuContent>
            </DropdownMenu>
        </div>
    );
} 