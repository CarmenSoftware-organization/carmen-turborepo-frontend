'use client';

import React, { useState } from 'react'
import { User } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ROLE_OPTION, STATUS_OPTION } from '@/types/option';
import DialogPlatform from './DialogPlatform';
import UserPlatform from './UserPlatform';
import { UserPlatformType } from '@/types/form/form';

interface UserPlatformClientProps {
    users: UserPlatformType[];
}

const UserPlatformClient = ({ users }: UserPlatformClientProps) => {
    const [userPlatform, setUserPlatform] = useState<UserPlatformType[]>(users);

    return (
        <div className="space-y-6">
            <div className='space-y-1 flex items-end justify-between'>
                <div>
                    <h2 className="text-2xl font-bold tracking-tight">Platform Users</h2>
                    <p className="text-muted-foreground">
                        Manage platform-wide user access and roles
                    </p>
                </div>
                <div className='flex items-center gap-2'>
                    <User className='w-6 h-6' />
                    <span className='text-lg font-medium text-muted-foreground'>{users.length} users</span>
                </div>
            </div>
            <div className='flex items-center justify-between'>
                <Input placeholder='Search users' className='w-1/2' />
                <div className='flex items-center gap-2 w-1/3'>
                    <Select>
                        <SelectTrigger>
                            <SelectValue placeholder='Select Role' />
                        </SelectTrigger>
                        <SelectContent>
                            {Object.values(ROLE_OPTION).map((role) => (
                                <SelectItem key={role} value={role}>{role}</SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                    <Select>
                        <SelectTrigger>
                            <SelectValue placeholder='Select Status' />
                        </SelectTrigger>
                        <SelectContent>
                            {Object.values(STATUS_OPTION).map((status) => (
                                <SelectItem key={status} value={status}>{status}</SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>
            </div>
            <div className='flex items-center justify-end'>
                <DialogPlatform setUserPlatform={setUserPlatform} userPlatform={userPlatform} />
            </div>
            <UserPlatform users={userPlatform} />
        </div>
    )
}


export default UserPlatformClient