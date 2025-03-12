import { fetchPlatformRoles } from '@/services/role/role';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { format } from 'date-fns';
import { Badge } from '@/components/ui/badge';
import { ROLE_TYPE } from '@/types/main';


const TabPlatform = async () => {
    const platformRoles = await fetchPlatformRoles();
    return (
        <Card>
            <CardHeader>
                <CardTitle>Platform Roles</CardTitle>
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
                        {platformRoles.map((role: ROLE_TYPE) => (
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

export default TabPlatform