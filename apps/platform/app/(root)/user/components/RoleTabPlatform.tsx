import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { mockRolePlatform } from "@/mock-data/user.data";
import { format } from "date-fns";

export default function RoleTabPlatform() {
    const rolePlatforms = mockRolePlatform;
    return (
        <Table>
            <TableHeader>
                <TableRow>
                    <TableHead>Role Name</TableHead>
                    <TableHead>Scope</TableHead>
                    <TableHead>Permissions</TableHead>
                    <TableHead>Total Users</TableHead>
                    <TableHead>Last Active</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {rolePlatforms.map((role) => (
                    <TableRow key={role.id}>
                        <TableCell>{role.name}</TableCell>
                        <TableCell>{role.scope}</TableCell>
                        <TableCell className="flex flex-wrap gap-2">
                            {
                                role.permissions.map((permission) => (
                                    <Badge key={permission.id}>{permission.name}</Badge>
                                ))
                            }
                        </TableCell>
                        <TableCell>{role.total_users}</TableCell>
                        <TableCell>{format(new Date(role.last_active), "MMM d, yyyy")}</TableCell>
                    </TableRow>
                ))}

            </TableBody>
        </Table>
    )
}
