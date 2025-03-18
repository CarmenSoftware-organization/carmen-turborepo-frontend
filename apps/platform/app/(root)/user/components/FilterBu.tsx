import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { mockDepartments, mockHotelGroups, mockHotelNames, mockModules, mockRoles, mockStatus } from "@/constants/option";

export default function FilterBu() {
    return (
        <div className="space-y-4">
            <Input placeholder="Search" />
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-2">
                <Select>
                    <SelectTrigger>
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
                    <SelectTrigger>
                        <SelectValue placeholder="Hotel Name" />
                    </SelectTrigger>
                    <SelectContent>
                        {mockHotelNames.map((hotelName) => (
                            <SelectItem key={hotelName.value} value={hotelName.value}>
                                {hotelName.label}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
                <Select>
                    <SelectTrigger>
                        <SelectValue placeholder="Department" />
                    </SelectTrigger>
                    <SelectContent>
                        {mockDepartments.map((department) => (
                            <SelectItem key={department.value} value={department.value}>
                                {department.label}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>

                <Select>
                    <SelectTrigger>
                        <SelectValue placeholder="Role" />
                    </SelectTrigger>
                    <SelectContent>
                        {mockRoles.map((role) => (
                            <SelectItem key={role.value} value={role.value}>
                                {role.label}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
                <Select>
                    <SelectTrigger>
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
                <Select>
                    <SelectTrigger>
                        <SelectValue placeholder="Status" />
                    </SelectTrigger>
                    <SelectContent>
                        {mockStatus.map((status) => (
                            <SelectItem key={status.value} value={status.value}>
                                {status.label}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </div>
        </div>
    )
}
