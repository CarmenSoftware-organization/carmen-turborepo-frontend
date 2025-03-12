import React from 'react'
import { ModuleType } from '@/types/main';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Building2, Users } from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { format } from 'date-fns';

interface TableAccessControlProps {
    modules: ModuleType[];
}

const TableAccessControl = ({ modules }: TableAccessControlProps) => {
    return (
        <Card>
            <CardHeader>
                <CardTitle>Module Access</CardTitle>
            </CardHeader>
            <CardContent>
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Module</TableHead>
                            <TableHead>Hotel Group</TableHead>
                            <TableHead>Usage</TableHead>
                            <TableHead>Active Users</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead>Last Updated</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {modules.map((module) => (
                            <TableRow key={module.name}>
                                <TableCell>{module.name}</TableCell>
                                <TableCell>
                                    <div className="flex items-center gap-2">
                                        <Building2 className="h-4 w-4 text-muted-foreground" />
                                        {module.hotel_groups}
                                    </div>
                                </TableCell>
                                <TableCell>
                                    <div className="space-y-2">
                                        <div className="flex items-center justify-between text-sm">
                                            <span>{module.users} of {module.usage} users</span>
                                            <span className="text-muted-foreground">
                                                {Math.round((module.usage / module.users) * 100)}%
                                            </span>
                                        </div>
                                        <Progress
                                            value={(module.usage / module.users) * 100}
                                            className={
                                                module.status === "Exceeded Limit" ? "bg-red-100" :
                                                    module.status === "Near Limit" ? "bg-yellow-100" :
                                                        undefined
                                            }
                                        />
                                    </div>
                                </TableCell>
                                <TableCell>
                                    <div className="flex items-center gap-2">
                                        <Users className="h-4 w-4 text-muted-foreground" />
                                        <span>{module.active_users} active</span>
                                    </div>
                                </TableCell>
                                <TableCell>
                                    <Badge
                                        variant={
                                            module.status === "Exceeded Limit" ? "default" :
                                                module.status === "Near Limit" ? "secondary" :
                                                    "destructive"
                                        }
                                    >
                                        {module.status === "Exceeded Limit" ? "Limit Exceeded" :
                                            module.status === "Near Limit" ? "Near Limit" :
                                                "Active"}
                                    </Badge>
                                </TableCell>
                                <TableCell className="text-muted-foreground">
                                    {format(new Date(module.last_active), 'MMM d, yyyy')}
                                </TableCell>
                            </TableRow>

                        ))}
                    </TableBody>
                </Table>
            </CardContent>
        </Card>
    )
}

export default TableAccessControl