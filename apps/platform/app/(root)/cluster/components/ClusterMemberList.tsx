import { ClusterMemberDto } from "@/dto/cluster.dto";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface Props {
    readonly clusterMembers: ClusterMemberDto[];
}

export default function ClusterMemberList({ clusterMembers }: Props) {

    return (
        <>
            {/* Desktop view - visible on md screens and above */}
            <div className="hidden md:block overflow-x-auto">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Name</TableHead>
                            <TableHead>Email</TableHead>
                            <TableHead>Platform Role</TableHead>
                            <TableHead>BU Role</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead>Last Active</TableHead>
                            <TableHead>Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {clusterMembers.map((member) => (
                            <TableRow key={member.id}>
                                <TableCell className="font-medium">{member.name}</TableCell>
                                <TableCell>{member.email}</TableCell>
                                <TableCell>{member.platform_role}</TableCell>
                                <TableCell>{member.bu_role}</TableCell>
                                <TableCell>
                                    <Badge variant={member.status ? 'default' : 'destructive'}>
                                        {member.status ? 'Active' : 'Inactive'}
                                    </Badge>
                                </TableCell>
                                <TableCell>{member.last_active}</TableCell>
                                <TableCell>
                                    <Button
                                        variant="destructive"
                                        size="sm"
                                        aria-label="More options"
                                    >
                                        Diactivate
                                    </Button>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>

            {/* Mobile view - visible only on small screens (below md breakpoint) */}
            <div className="grid grid-cols-1 gap-4 md:hidden">
                {clusterMembers.map((member) => (
                    <Card key={member.id} className="overflow-hidden">
                        <CardContent className="p-4">
                            <div className="space-y-4">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <div className="font-medium text-lg">{member.name}</div>
                                        <div className="text-sm text-muted-foreground">{member.email}</div>
                                    </div>
                                    <Badge variant={member.status ? 'default' : 'destructive'}>
                                        {member.status ? 'Active' : 'Inactive'}
                                    </Badge>
                                </div>

                                <div className="grid grid-cols-2 gap-2 text-sm">
                                    <div className="text-muted-foreground">Platform Role</div>
                                    <div>{member.platform_role}</div>

                                    <div className="text-muted-foreground">BU Role</div>
                                    <div>{member.bu_role}</div>

                                    <div className="text-muted-foreground">Last Active</div>
                                    <div>{member.last_active}</div>
                                </div>

                                <div className="flex justify-between gap-2 pt-2">
                                    <Button
                                        variant="destructive"
                                        size="sm"
                                        className="flex-1"
                                    >
                                        Diactivate
                                    </Button>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </>
    );
}
