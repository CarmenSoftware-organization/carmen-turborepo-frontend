import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { mockHotelGroups, mockModules } from "@/constants/option";

export default function FilterAccess() {
    return (
        <div className="flex items-center gap-2">
            <Select>
                <SelectTrigger className="w-56">
                    <SelectValue placeholder="Hotel Group" />
                </SelectTrigger>
                <SelectContent>
                    {mockHotelGroups.map((hotelGroup) => (
                        <SelectItem key={hotelGroup.value} value={hotelGroup.value}>
                            {hotelGroup.label}
                        </SelectItem>
                    ))}
                </SelectContent>
            </Select>
            <Select>
                <SelectTrigger className="w-56">
                    <SelectValue placeholder="Module" />
                </SelectTrigger>
                <SelectContent>
                    {mockModules.map((module) => (
                        <SelectItem key={module.value} value={module.value}>
                            {module.label}
                        </SelectItem>
                    ))}
                </SelectContent>
            </Select>
        </div>
    )
}
