import React, { useCallback, useState } from 'react';
import { Check, ChevronsUpDown, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
} from "@/components/ui/command";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";
import { DeliveryPointCreateModel } from '@/dtos/delivery-point.dto';
import {
    Pagination,
    PaginationContent,
    PaginationItem,
    PaginationLink,
    PaginationNext,
    PaginationPrevious,
} from "@/components/ui/pagination";

interface DeliveryPointComboboxProps {
    value: string;
    onValueChange: (value: string) => void;
    items: DeliveryPointCreateModel[];
    placeholder?: string;
    className?: string;
    disabled?: boolean;
    error?: string;
    isLoading?: boolean;
    page: string;
    pages: string;
    onPopoverOpenChange: (open: boolean) => void;
    onPageChange: (page: string) => void;
    onSearchChange: (search: string) => void;
}

const DeliveryPointCombobox: React.FC<DeliveryPointComboboxProps> = ({
    value,
    onValueChange,
    items,
    placeholder = "Select delivery point",
    className,
    disabled = false,
    error,
    isLoading = false,
    page,
    pages,
    onPopoverOpenChange,
    onPageChange,
    onSearchChange,
}) => {
    const [open, setOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");

    const handleOpenChange = useCallback((newOpen: boolean) => {
        setOpen(newOpen);
        onPopoverOpenChange?.(newOpen);
    }, [onPopoverOpenChange]);

    const handleSearch = useCallback((search: string) => {
        setSearchQuery(search);
        onSearchChange(search);
    }, [onSearchChange]);

    const handleSelect = useCallback((currentValue: string) => {
        onValueChange(currentValue);
        setOpen(false);
    }, [onValueChange]);

    const handlePaginationClick = useCallback((newPage: string, e: React.MouseEvent) => {
        e.stopPropagation(); // ป้องกัน event bubbling
        onPageChange(newPage);
    }, [onPageChange]);

    const selectedItem = items.find((point) => point.id === value);

    const renderPaginationNumbers = useCallback(() => {
        const totalPages = parseInt(pages);
        const currentPage = parseInt(page);
        const pagesToShow = [];

        for (let i = 1; i <= totalPages; i++) {
            if (
                i === 1 ||
                i === totalPages ||
                (i >= currentPage - 1 && i <= currentPage + 1)
            ) {
                pagesToShow.push(
                    <PaginationItem key={i}>
                        <PaginationLink
                            onClick={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                onPageChange(i.toString());
                            }}
                            isActive={currentPage === i}
                        >
                            {i}
                        </PaginationLink>
                    </PaginationItem>
                );
            } else if (i === currentPage - 2 || i === currentPage + 2) {
                pagesToShow.push(
                    <PaginationItem key={i}>
                        <PaginationLink
                            onClick={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                            }}
                        >
                            ...
                        </PaginationLink>
                    </PaginationItem>
                );
            }
        }
        return pagesToShow;
    }, [page, pages, onPageChange]);

    return (
        <div className="flex flex-col gap-2">
            <Popover open={open} onOpenChange={handleOpenChange}>
                <PopoverTrigger asChild>
                    <Button
                        variant="outline"
                        role="combobox"
                        aria-expanded={open}
                        className={cn(
                            "w-full justify-between h-8",
                            error ? "border-red-500" : "",
                            className
                        )}
                        disabled={disabled}
                        onClick={(e) => e.stopPropagation()} // ป้องกัน event bubbling
                    >
                        {selectedItem ? selectedItem.name : placeholder}
                        <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                    </Button>
                </PopoverTrigger>
                <PopoverContent
                    className="w-[var(--radix-popover-trigger-width)] p-0 z-50"
                    align="start"
                    side="bottom"
                    sideOffset={4}
                    onClick={(e) => e.stopPropagation()}
                >
                    <Command className="max-h-[300px]" shouldFilter={false}>
                        <CommandInput
                            placeholder="Search delivery point..."
                            value={searchQuery}
                            onValueChange={(search) => {
                                setSearchQuery(search);
                                onSearchChange(search);
                            }}
                            className="h-9"
                        />
                        <div className="max-h-[200px] overflow-auto">
                            {isLoading ? (
                                <div className="flex items-center justify-center py-6">
                                    <Loader2 className="h-6 w-6 animate-spin text-primary" />
                                </div>
                            ) : items.length === 0 ? (
                                <CommandEmpty>No delivery point found.</CommandEmpty>
                            ) : (
                                <CommandGroup>
                                    {items.map((point) => (
                                        <CommandItem
                                            key={point.id}
                                            value={point.id}
                                            onSelect={handleSelect}
                                            className="cursor-pointer"
                                            onClick={(e) => e.stopPropagation()}
                                        >
                                            <Check
                                                className={cn(
                                                    "mr-2 h-4 w-4",
                                                    value === point.id ? "opacity-100" : "opacity-0"
                                                )}
                                            />
                                            {point.name}
                                        </CommandItem>
                                    ))}
                                </CommandGroup>
                            )}
                        </div>
                        {parseInt(pages) > 1 && !isLoading && (
                            <div className="border-t p-2">
                                <Pagination>
                                    <PaginationContent>
                                        <PaginationItem>
                                            <PaginationPrevious
                                                onClick={(e) => {
                                                    if (parseInt(page) > 1) {
                                                        handlePaginationClick(
                                                            (parseInt(page) - 1).toString(),
                                                            e
                                                        );
                                                    }
                                                }}
                                                className={cn(
                                                    "cursor-pointer",
                                                    parseInt(page) <= 1 && "pointer-events-none opacity-50"
                                                )}
                                            />
                                        </PaginationItem>
                                        {renderPaginationNumbers()}
                                        <PaginationItem>
                                            <PaginationNext
                                                onClick={(e) => {
                                                    if (parseInt(page) < parseInt(pages)) {
                                                        handlePaginationClick(
                                                            (parseInt(page) + 1).toString(),
                                                            e
                                                        );
                                                    }
                                                }}
                                                className={cn(
                                                    "cursor-pointer",
                                                    parseInt(page) >= parseInt(pages) && "pointer-events-none opacity-50"
                                                )}
                                            />
                                        </PaginationItem>
                                    </PaginationContent>
                                </Pagination>
                            </div>
                        )}
                    </Command>
                </PopoverContent>
            </Popover>
            {error && (
                <p className="text-xs text-red-500" data-testid="delivery-point-combobox-error">
                    {error}
                </p>
            )}
        </div>
    );
};

export default DeliveryPointCombobox;