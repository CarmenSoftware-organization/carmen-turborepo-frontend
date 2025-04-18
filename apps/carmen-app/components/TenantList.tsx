'use client';
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { useAuth } from "@/context/AuthContext";
import { useEffect } from "react";

export default function TenantList() {
    const { user, tenantId, handleChangeTenant, isLoading } = useAuth();

    useEffect(() => {
        console.log('TenantList rendered with:', {
            tenantId,
            businessUnits: user?.business_unit,
            isLoading
        });
    }, [tenantId, user, isLoading]);

    // Don't render while loading or if we don't have the necessary data
    if (isLoading || !user?.business_unit?.length) {
        return null;
    }

    return (
        <Select
            value={tenantId || undefined}
            onValueChange={handleChangeTenant}
        >
            <SelectTrigger className="w-40 bg-muted border-none focus:ring-ring text-xs h-8">
                <SelectValue placeholder="Select a tenant" />
            </SelectTrigger>
            <SelectContent>
                <SelectGroup>
                    {user.business_unit.map((bu) => (
                        <SelectItem key={bu.id} value={bu.id}>{bu.name}</SelectItem>
                    ))}
                </SelectGroup>
            </SelectContent>
        </Select>
    )
}
