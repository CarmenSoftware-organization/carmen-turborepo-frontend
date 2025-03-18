import { ClusterUserDto } from "@/dto/user.dto";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { ScrollArea } from "@/components/ui/scroll-area";
import { User, CheckCircle2, XCircle } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";

interface ClusterUserListProps {
    readonly users: ClusterUserDto[];
}

export default function ClusterUserList({ users }: ClusterUserListProps) {
    return (
        <div className="hidden md:block">
            <ScrollArea className="h-[calc(100vh-240px)]">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead className="w-[250px]">Name</TableHead>
                            <TableHead>Hotel Group</TableHead>
                            <TableHead>Role</TableHead>
                            <TableHead>Module</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead>Last Active</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {users.map((user) => (
                            <TableRow key={user.id}>
                                <TableCell>
                                    <div className="flex items-center gap-2">
                                        <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                                            <User className="h-4 w-4" />
                                        </div>
                                        <div>
                                            <p className="font-medium">{user.name}</p>
                                            <p className="text-xs text-muted-foreground">{user.email}</p>
                                        </div>
                                    </div>
                                </TableCell>
                                <TableCell>{user.hotel_group}</TableCell>
                                <TableCell>{user.role}</TableCell>
                                <TableCell className="flex flex-wrap gap-2">
                                    {user.module.map((module) => (
                                        <Badge
                                            key={module.id}
                                        >
                                            {module.name}
                                        </Badge>
                                    ))}
                                </TableCell>
                                <TableCell>
                                    <Badge
                                        variant={user.status ? "outline" : "destructive"}
                                        className="flex items-center gap-1 w-fit"
                                        aria-label={user.status ? "Active" : "Inactive"}
                                    >
                                        {user.status ? (
                                            <>
                                                <CheckCircle2 className="h-3 w-3" />
                                                <span>Active</span>
                                            </>
                                        ) : (
                                            <>
                                                <XCircle className="h-3 w-3" />
                                                <span>Inactive</span>
                                            </>
                                        )}
                                    </Badge>
                                </TableCell>
                                <TableCell>{user?.last_active ? format(user.last_active, "dd MMM yyyy") : "-"}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </ScrollArea>
        </div>
    )
}
