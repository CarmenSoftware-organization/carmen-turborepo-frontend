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

export default function TenantList() {
    const { user } = useAuth();
    return (
        <Select defaultValue={user?.business_unit[0].id}>
            <SelectTrigger className="w-40 bg-muted border-none focus:ring-ring text-xs h-8">
                <SelectValue placeholder="Select a tenant" />
            </SelectTrigger>
            <SelectContent>
                <SelectGroup>
                    {user?.business_unit.map((bu) => (
                        <SelectItem key={bu.id} value={bu.id} >{bu.name}</SelectItem>
                    ))}
                </SelectGroup>
            </SelectContent>
        </Select>
    )
}
