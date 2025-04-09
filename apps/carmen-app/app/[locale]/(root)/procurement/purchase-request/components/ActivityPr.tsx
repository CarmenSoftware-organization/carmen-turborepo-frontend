import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { mockActivities } from "@/mock-data/procurement";
export default function ActivityPr() {
    return (
        <div>
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Time</TableHead>
                        <TableHead>Action</TableHead>
                        <TableHead>User</TableHead>
                        <TableHead>Details</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {mockActivities.map((activity) => (
                        <TableRow key={activity.id}>
                            <TableCell className="text-xs text-muted-foreground">
                                {activity.timestamp}
                            </TableCell>
                            <TableCell>
                                <Badge variant="outline">
                                    {activity.action.label}
                                </Badge>
                            </TableCell>
                            <TableCell>{activity.user}</TableCell>
                            <TableCell>{activity.details}</TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </div>
    );
}

