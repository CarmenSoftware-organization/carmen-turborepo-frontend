import { fetchDepartmentRoles } from '@/services/role/role';
import React from 'react'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { format } from 'date-fns';
import { Badge } from '@/components/ui/badge';
import { ROLE_TYPE } from '@/types/main';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';


const TabDepartment = async () => {
    const departmentRoles = await fetchDepartmentRoles();
    return (
        <Card>
            <CardHeader>
                <CardTitle>Department Roles</CardTitle>
            </CardHeader>
            <CardContent>
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Name</TableHead>
                            <TableHead>Scope</TableHead>
                            <TableHead>Permissions</TableHead>
                            <TableHead>Users</TableHead>
                            <TableHead>Last Active</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {departmentRoles.map((role: ROLE_TYPE) => (
                            <TableRow key={role.id}>
                                <TableCell>{role.name}</TableCell>
                                <TableCell>{role.scope}</TableCell>
                                <TableCell className='space-x-1'>
                                    {role.permissions.map((permission: string) => (
                                        <Badge variant="outline" className="capitalize" key={permission}>
                                            {permission}
                                        </Badge>
                                    ))}
                                </TableCell>
                                <TableCell>{role.count_users}</TableCell>
                                <TableCell>{format(role.last_active, 'dd/MM/yyyy')}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </CardContent>
        </Card>
    )
}

export default TabDepartment