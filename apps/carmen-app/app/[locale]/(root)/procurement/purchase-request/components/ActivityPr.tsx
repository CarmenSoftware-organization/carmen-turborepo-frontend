import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { mockActivities } from "@/mock-data/procurement";

const activityStatusColor = (status: string) => {
    if (status === 'Approved') {
        return 'bg-green-100 text-green-800'
    } else if (status === 'Pending') {
        return 'bg-yellow-100 text-yellow-800'
    } else if (status === 'Rejected') {
        return 'bg-red-100 text-red-800'
    } else if (status === 'Created') {
        return 'bg-blue-100 text-blue-800'
    } else if (status === 'Submitted') {
        return 'bg-purple-100 text-purple-800'
    } else if (status === 'Modified') {
        return 'bg-orange-100 text-orange-800'
    }
}
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
                                <Badge variant="outline" className={`rounded-full ${activityStatusColor(activity.action.label ?? '')}`}>
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

