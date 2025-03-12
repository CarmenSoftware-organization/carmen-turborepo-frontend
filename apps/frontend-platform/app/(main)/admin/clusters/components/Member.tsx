import { Button } from '@/components/ui/button'
import { fetchMembers } from '@/services/cluster/member'
import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Mail } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { format } from 'date-fns'
import DialogFormMember from './DialogFormMember'

const Member = async () => {
    const members = await fetchMembers();
    return (
        <div className="space-y-6">

            <div className='space-y-1'>
                <h2 className="text-2xl font-bold tracking-tight">Cluster Members</h2>
                <p className="text-muted-foreground">
                    Manage users and roles across clusters
                </p>
            </div>
            {/* <ClusterUsers /> */}
            <div className='flex items-center justify-between'>
                <h2 className="text-2xl font-bold tracking-tight">Cluster Members</h2>
                <DialogFormMember />
            </div>
            <Card>
                <CardHeader>
                    <CardTitle className="text-lg font-medium">Users & Roles</CardTitle>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Name</TableHead>
                                <TableHead>Platform Role</TableHead>
                                <TableHead>Business Unit Roles</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead>Last Active</TableHead>
                                <TableHead className="text-right">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
                            {members.map((member: any) => (
                                <TableRow key={member.id}>
                                    <TableCell>
                                        <div>
                                            <div className="font-medium">{member.name}</div>
                                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                                <Mail className="h-4 w-4" />
                                                {member.email}
                                            </div>
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        {member.platformRole ? (
                                            <Badge variant="outline" className="capitalize">
                                                {member.platformRole}
                                            </Badge>
                                        ) : (
                                            <span className="text-muted-foreground">-</span>
                                        )}
                                    </TableCell>
                                    <TableCell>
                                        {member.roles.map((role: string) => (
                                            <Badge variant="outline" className="capitalize" key={role}>
                                                {role}
                                            </Badge>
                                        ))}
                                    </TableCell>
                                    <TableCell>
                                        <Badge variant="outline" className="capitalize">{member.status}</Badge>
                                    </TableCell>
                                    <TableCell>
                                        {format(member.lastActive, 'MMM d, yyyy')}
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <Button variant="destructive" size="sm">
                                            Deactivate
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </div>
    )
}

export default Member