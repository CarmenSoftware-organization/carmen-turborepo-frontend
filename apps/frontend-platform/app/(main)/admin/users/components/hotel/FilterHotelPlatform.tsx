import React from 'react'
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { DEPARTMENT_OPTION, HOTEL_GROUP_OPTION, HOTEL_OPTION, MODULE_OPTION, ROLE_OPTION, STATUS_OPTION } from '@/types/option'
const FilterHotelPlatform = () => {
    return (
        <div className="flex flex-col gap-2">
            {/* Input อยู่บนสุด */}
            <Input placeholder="Search users" className="w-full md:w-1/3" />

            {/* Grid สำหรับ Select */}
            <div className="grid grid-cols-2 gap-2 w-full md:grid-cols-3 lg:grid-cols-6">
                <Select>
                    <SelectTrigger>
                        <SelectValue placeholder="Select Hotel Group" />
                    </SelectTrigger>
                    <SelectContent>
                        {HOTEL_GROUP_OPTION.map((hotelGroup) => (
                            <SelectItem key={hotelGroup.key} value={hotelGroup.key}>
                                {hotelGroup.value}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>

                <Select>
                    <SelectTrigger>
                        <SelectValue placeholder="Select Hotel" />
                    </SelectTrigger>
                    <SelectContent>
                        {HOTEL_OPTION.map((hotel) => (
                            <SelectItem key={hotel.key} value={hotel.key}>
                                {hotel.value}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>

                <Select>
                    <SelectTrigger>
                        <SelectValue placeholder="Select Department" />
                    </SelectTrigger>
                    <SelectContent>
                        {DEPARTMENT_OPTION.map((department) => (
                            <SelectItem key={department.key} value={department.key}>
                                {department.value}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>

                <Select>
                    <SelectTrigger>
                        <SelectValue placeholder="Select Module" />
                    </SelectTrigger>
                    <SelectContent>
                        {MODULE_OPTION.map((module) => (
                            <SelectItem key={module.key} value={module.key}>
                                {module.value}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>

                <Select>
                    <SelectTrigger>
                        <SelectValue placeholder="Select Role" />
                    </SelectTrigger>
                    <SelectContent>
                        {Object.values(ROLE_OPTION).map((role) => (
                            <SelectItem key={role} value={role}>
                                {role}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>

                <Select>
                    <SelectTrigger>
                        <SelectValue placeholder="Select Status" />
                    </SelectTrigger>
                    <SelectContent>
                        {Object.values(STATUS_OPTION).map((status) => (
                            <SelectItem key={status} value={status}>
                                {status}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </div>
        </div>

    )
}

export default FilterHotelPlatform