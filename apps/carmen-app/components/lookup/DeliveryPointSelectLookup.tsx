"use client";

import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Loader2 } from "lucide-react";
import { useDeliveryPointQuery } from "@/hooks/use-delivery-point";
import { useAuth } from "@/context/AuthContext";
import { DeliveryPointGetDto } from "@/dtos/delivery-point.dto";
import { cn } from "@/lib/utils";

interface Props {
    readonly value?: string;
    readonly onValueChange?: (value: string) => void;
    readonly placeholder?: string;
    readonly className?: string;
}

export function DeliveryPointSelectLookup({
    value = "",
    onValueChange,
    placeholder = "Select delivery point...",
    className = "",
}: Props) {
    const { token, tenantId } = useAuth();

    const { deliveryPoints, isLoading } = useDeliveryPointQuery({
        token: token,
        tenantId: tenantId,
        params: {
            perpage: "-1"
        }
    });

    return (
        <Select
            value={value}
            onValueChange={onValueChange}
            disabled={isLoading}
        >
            <SelectTrigger className={cn("w-full", className)}>
                <SelectValue placeholder={isLoading ? "Loading..." : placeholder} />
                {isLoading && (
                    <Loader2 className="h-4 w-4 animate-spin text-gray-400 ml-2" />
                )}
            </SelectTrigger>
            <SelectContent className="max-h-60">
                {(() => {
                    if (isLoading) {
                        return (
                            <div className="p-3 text-center">
                                <Loader2 className="h-4 w-4 animate-spin mx-auto mb-2" />
                                <div className="text-sm text-gray-500">Loading delivery points...</div>
                            </div>
                        );
                    }

                    if (deliveryPoints?.data?.length > 0) {
                        return deliveryPoints.data.map((item: DeliveryPointGetDto) => (
                            <SelectItem
                                key={item.id}
                                value={item.id || ""}
                                className="cursor-pointer"
                            >
                                {item.name}
                            </SelectItem>
                        ));
                    }

                    return (
                        <div className="p-3 text-center text-sm text-muted-foreground">
                            No delivery points available
                        </div>
                    );
                })()}
            </SelectContent>
        </Select>
    );
}