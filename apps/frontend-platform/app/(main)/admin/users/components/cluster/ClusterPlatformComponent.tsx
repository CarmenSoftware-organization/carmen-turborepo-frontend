"use client";

import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { HOTEL_GROUP_OPTION, MODULE_OPTION, ROLE_OPTION, STATUS_OPTION } from '@/types/option'
import { User } from 'lucide-react'
import React, { useState } from 'react'
import ClusterPlatformList from './ClusterPlatformList'
import { UserPlatformType } from '@/types/form/form'
import DialogCluster from './DialogCluster';
interface Props {
    users: UserPlatformType[]
}
const ClusterPlatformComponent = ({ users }: Props) => {
    const [clusterUsers, setClusterUsers] = useState<UserPlatformType[]>(users);
    return (
        <div className='space-y-6'>
            <div className='space-y-1 flex items-end justify-between'>
                <div>
                    <h2 className="text-2xl font-bold tracking-tight">Cluster Users</h2>
                    <p className="text-muted-foreground">
                        Manage users and access across hotel groups
                    </p>
                </div>
                <div className='flex items-center gap-2'>
                    <User className='w-6 h-6' />
                    <span className='text-lg font-medium text-muted-foreground'>{clusterUsers?.length} users</span>
                </div>
            </div>
            <div className="flex flex-col gap-2 md:grid md:grid-cols-3 md:items-center">
                <Input
                    placeholder="Search users"
                    className="w-full md:w-auto md:col-span-1"
                />
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
            <div className='flex justify-end'>
                <DialogCluster setClusterUsers={setClusterUsers} />
            </div>
            <ClusterPlatformList users={clusterUsers} />
        </div>
    )
}

export default ClusterPlatformComponent