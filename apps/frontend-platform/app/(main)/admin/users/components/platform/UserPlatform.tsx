'use client';

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { format } from 'date-fns';
import { Badge } from '@/components/ui/badge';
import { UserPlatformType } from '@/types/form/form';

interface UserPlatformProps {
    users: UserPlatformType[];
}

const UserPlatform = ({ users }: UserPlatformProps) => {
    console.log('users', users);

    return (
        <Card>
            <CardHeader>
                <CardTitle>User Platform</CardTitle>
            </CardHeader>
            <CardContent>
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Name</TableHead>
                            <TableHead>Email</TableHead>
                            <TableHead>Roles</TableHead>
                            <TableHead>Business Units</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead>Last Active</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {users.map((user) => (
                            <TableRow key={user.id}>
                                <TableCell>{user.name}</TableCell>
                                <TableCell>{user.email}</TableCell>
                                <TableCell className='space-x-1'>
                                    {user.roles?.map((role: { name: string; status: boolean; id?: string | undefined; }) => (
                                        <Badge variant="outline" className="capitalize" key={role.id}>
                                            {role.name}
                                        </Badge>
                                    )) || null}
                                </TableCell>
                                <TableCell className='space-x-1'>
                                    {user.business_units?.map((bu: { name: string; id?: string | undefined; }) => (
                                        <Badge variant="outline" className="capitalize" key={bu.id}>
                                            {bu.name}
                                        </Badge>
                                    )) || null}
                                </TableCell>
                                <TableCell>{user.status}</TableCell>
                                <TableCell>{format(user.lastActive, 'dd/MM/yyyy')}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </CardContent>
        </Card>
    )
}

export default UserPlatform;