import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";

export default function TenantList() {
    return (
        <Select defaultValue="tn-01">
            <SelectTrigger className="w-40 bg-muted border-none focus:ring-ring">
                <SelectValue placeholder="Select a tenant" />
            </SelectTrigger>
            <SelectContent>
                <SelectGroup>
                    <SelectItem value="tn-01">Tenant 1</SelectItem>
                    <SelectItem value="tn-02">Tenant 2</SelectItem>
                    <SelectItem value="tn-03">Tenant 3</SelectItem>
                </SelectGroup>
            </SelectContent>
        </Select>
    )
}
