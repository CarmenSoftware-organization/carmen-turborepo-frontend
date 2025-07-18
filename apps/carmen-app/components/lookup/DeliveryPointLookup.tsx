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
import { Check, ChevronsUpDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { PropsLookup } from "@/dtos/lookup.dto";
import { useDeliveryPointQuery } from "@/hooks/use-delivery-point";
import { useAuth } from "@/context/AuthContext";
import { DeliveryPointGetDto } from "@/dtos/delivery-point.dto";

export default function DeliveryPointLookup({
    value,
    onValueChange,
    placeholder = "Select delivery point",
    disabled = false
}: Readonly<PropsLookup>) {
    const { token, tenantId } = useAuth();
    const { deliveryPoints } = useDeliveryPointQuery({ token, tenantId });

    const [open, setOpen] = useState(false);

    const selectedDeliveryPointName = useMemo(() => {
        if (!value || !deliveryPoints || !Array.isArray(deliveryPoints)) return null;
        const found = deliveryPoints?.data.find((deliveryPoint: DeliveryPointGetDto) => deliveryPoint.id === value);
        return found?.name ?? null;
    }, [value, deliveryPoints]);

    return (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
                <Button
                    variant="outline"
                    aria-expanded={open}
                    className="w-full justify-between"
                    disabled={disabled}
                >
                    {value && selectedDeliveryPointName ? selectedDeliveryPointName : placeholder}
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
                        <CommandEmpty>No delivery points found.</CommandEmpty>
                        <CommandGroup>
                            {deliveryPoints && deliveryPoints.length > 0 ? (
                                deliveryPoints?.data.map((deliveryPoint: DeliveryPointGetDto) => (
                                    <CommandItem
                                        key={deliveryPoint.id}
                                        value={deliveryPoint.name}
                                        onSelect={() => {
                                            if (deliveryPoint.id) {
                                                onValueChange(deliveryPoint.id);
                                            }
                                            setOpen(false);
                                        }}
                                    >
                                        {deliveryPoint.name}
                                        <Check
                                            className={cn(
                                                "ml-auto h-4 w-4",
                                                value === deliveryPoint.id ? "opacity-100" : "opacity-0"
                                            )}
                                        />
                                    </CommandItem>
                                ))
                            ) : (
                                <CommandItem disabled>No delivery points available.</CommandItem>
                            )}
                        </CommandGroup>
                    </CommandList>
                </Command>
            </PopoverContent>
        </Popover>
    )
}