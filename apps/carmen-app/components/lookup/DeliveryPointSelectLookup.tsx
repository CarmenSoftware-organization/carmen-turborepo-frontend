"use client";

import { useMemo, useState } from "react";
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
} from "@/components/ui/command";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";
import { Check, ChevronsUpDown, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useDeliveryPointQuery } from "@/hooks/use-delivery-point";
import { useAuth } from "@/context/AuthContext";
import { DeliveryPointGetDto } from "@/dtos/delivery-point.dto";

interface Props {
    readonly value?: string;
    readonly onValueChange?: (value: string) => void;
    readonly placeholder?: string;
    readonly className?: string;
    readonly disabled?: boolean;
}

export function DeliveryPointSelectLookup({
    value = "",
    onValueChange,
    placeholder = "Select delivery point...",
    className = "",
    disabled = false,
}: Props) {
    const [open, setOpen] = useState(false);
    const { token, buCode } = useAuth();

    const { deliveryPoints, isLoading } = useDeliveryPointQuery({
        token: token,
        buCode: buCode,
        params: {
            perpage: "-1"
        }
    });

    const deliveryPointsData = deliveryPoints?.data;

    const selectedDeliveryPointName = useMemo(() => {
        if (!value || !deliveryPointsData || !Array.isArray(deliveryPointsData)) return null;
        const found = deliveryPointsData.find(dp => dp.id === value);
        return found?.name ?? null;
    }, [value, deliveryPointsData]);

    return (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild className={className}>
                <Button
                    variant="outline"
                    aria-expanded={open}
                    className="w-full justify-between"
                    disabled={disabled || isLoading}
                    title={value && selectedDeliveryPointName ? selectedDeliveryPointName : placeholder}
                >
                    <span className="truncate">
                        {value && selectedDeliveryPointName ? selectedDeliveryPointName : placeholder}
                    </span>
                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-full p-0">
                <Command filter={(value, search) => {
                    if (!search) return 1;
                    if (value.toLowerCase().includes(search.toLowerCase())) return 1;
                    return 0;
                }}>
                    <CommandInput placeholder="Search delivery point..." className="w-full pr-10" />
                    <CommandList>
                        {isLoading ? (
                            <div className="flex items-center justify-center py-6">
                                <Loader2 className="h-6 w-6 animate-spin text-gray-400" />
                            </div>
                        ) : (
                            <>
                                <CommandEmpty>No delivery points found.</CommandEmpty>
                                <CommandGroup>
                                    {deliveryPointsData && deliveryPointsData.length > 0 ? (
                                        deliveryPointsData.map((item: DeliveryPointGetDto) => (
                                            <CommandItem
                                                key={item.id}
                                                value={item.name}
                                                onSelect={() => {
                                                    if (item.id && onValueChange) {
                                                        onValueChange(item.id);
                                                    }
                                                    setOpen(false);
                                                }}
                                            >
                                                {item.name}
                                                <Check
                                                    className={cn(
                                                        "ml-auto h-4 w-4",
                                                        value === item.id ? "opacity-100" : "opacity-0"
                                                    )}
                                                />
                                            </CommandItem>
                                        ))
                                    ) : (
                                        <CommandItem disabled>No delivery points available.</CommandItem>
                                    )}
                                </CommandGroup>
                            </>
                        )}
                    </CommandList>
                </Command>
            </PopoverContent>
        </Popover>
    );
}