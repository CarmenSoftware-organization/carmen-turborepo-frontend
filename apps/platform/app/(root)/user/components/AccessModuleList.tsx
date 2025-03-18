import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { mockAccessModules } from "@/mock-data/user.data";
import { format } from "date-fns";
import { Users } from "lucide-react";

const getProgressBackground = (currentUsage: number, limit: number) => {
    if (currentUsage >= limit) return "bg-red-100";
    if (currentUsage >= limit * 0.8) return "bg-yellow-100";
    return undefined;
};

export default function AccessModuleList() {
    const accessModules = mockAccessModules;
    return (
        <Table>
            <TableHeader>
                <TableRow>
                    <TableHead>Module</TableHead>
                    <TableHead>Hotel Group</TableHead>
                    <TableHead>Users Active</TableHead>
                    <TableHead>Usage</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Last Active</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {accessModules.map((module) => (
                    <TableRow key={module.id}>
                        <TableCell>{module.name}</TableCell>
                        <TableCell>{module.hotel_group}</TableCell>
                        <TableCell>
                            <div className="flex items-center gap-2">
                                <Users className="h-4 w-4 text-muted-foreground" />
                                {module.users}
                                <p>active</p>
                            </div>
                        </TableCell>
                        <TableCell>
                            <div className="flex items-center justify-between text-sm">
                                <span>{module.current_usage} of {module.limit} users</span>
                                <span className="text-muted-foreground">
                                    {Math.round((module.current_usage / module.limit) * 100)}%
                                </span>
                            </div>
                            <Progress
                                value={(module.current_usage / module.limit) * 100}
                                className={getProgressBackground(module.current_usage, module.limit)}
                            />
                        </TableCell>
                        <TableCell>
                            <Badge variant={module.status === "active" ? "default" : "destructive"} className="capitalize">
                                {module.status}
                            </Badge>
                        </TableCell>
                        <TableCell>{format(module.last_active, "MMM d, yyyy")}</TableCell>
                    </TableRow>
                ))}
            </TableBody>
        </Table>
    )
}
