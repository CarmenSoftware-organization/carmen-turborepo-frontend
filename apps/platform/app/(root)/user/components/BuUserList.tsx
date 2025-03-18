import { Badge } from "@/components/ui/badge";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { BusinessUnitUserDto } from "@/dto/user.dto";
import { format } from "date-fns";
import { CheckCircle2, User, XCircle } from "lucide-react";

interface BuUserListProps {
    readonly users: BusinessUnitUserDto[];
}

export default function BuUserList({ users }: BuUserListProps) {
    return (
        <>
            <div className="hidden md:block">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>User</TableHead>
                            <TableHead>Cluster</TableHead>
                            <TableHead>Hotel</TableHead>
                            <TableHead>Department</TableHead>
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
                                <TableCell>{user.cluster_name}</TableCell>
                                <TableCell>{user.hotel_name}</TableCell>
                                <TableCell>{user.department}</TableCell>
                                <TableCell>{user.role}</TableCell>
                                <TableCell className="flex flex-wrap gap-2">
                                    {user.module?.map((module) => (
                                        <Badge
                                            key={module.id}
                                        >
                                            {module.name}
                                        </Badge>
                                    )) || "-"}
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
                                <TableCell>{user?.last_active ? format(new Date(user.last_active), "dd MMM yyyy") : "-"}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>

            <div className="block md:hidden">
                <h1>Business Unit User List</h1>
            </div>
        </>
    )
}