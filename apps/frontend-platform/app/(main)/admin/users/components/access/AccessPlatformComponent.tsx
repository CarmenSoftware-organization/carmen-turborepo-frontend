import React from 'react'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { HOTEL_GROUP_OPTION, MODULE_OPTION } from '@/types/option'
import AccessControlList from './AccessControlList'
const AccessPlatformComponent = () => {
    return (
        <div className='space-y-6'>
            <div className='space-y-1'>
                <h2 className="text-2xl font-bold tracking-tight">Access Control</h2>
                <p className="text-muted-foreground">
                    Manage module access and user limits
                </p>
            </div>
            <div className="grid grid-cols-2 gap-2 w-full md:grid-cols-4 md:col-span-2">
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
            </div>
            <AccessControlList />
        </div>
    )
}

export default AccessPlatformComponent