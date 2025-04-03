import { FileText, ExternalLink } from "lucide-react";
import Link from "next/link";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";

interface ActivityItem {
    id: string;
    time: string;
    type: {
        label: string;
        variant: "blue" | "yellow" | "purple";
    };
    description: string;
    status: {
        label: string;
        variant: "green" | "amber" | "blue";
    };
    action: {
        label: string;
        href: string;
    };
}

const mockActivities: ActivityItem[] = [
    {
        id: "1",
        time: "Today 14:30",
        type: {
            label: "Transaction",
            variant: "blue"
        },
        description: "12 sales transactions processed from Main Restaurant",
        status: {
            label: "Success",
            variant: "green"
        },
        action: {
            label: "View",
            href: "/system-administration/system-integrations/pos/transactions"
        }
    },
    {
        id: "2",
        time: "Today 13:15",
        type: {
            label: "Mapping",
            variant: "yellow"
        },
        description: "New items detected from POS system",
        status: {
            label: "Pending",
            variant: "amber"
        },
        action: {
            label: "Map Items",
            href: "/system-administration/system-integrations/pos/mapping/recipes"
        }
    },
    {
        id: "3",
        time: "Today 10:45",
        type: {
            label: "Stock-out",
            variant: "purple"
        },
        description: "Stock-out approval requested for Coffee Shop",
        status: {
            label: "Awaiting Approval",
            variant: "blue"
        },
        action: {
            label: "Review",
            href: "/system-administration/system-integrations/pos/transactions/stock-out-review"
        }
    }
];

const getBadgeVariant = (variant: ActivityItem["type"]["variant"] | ActivityItem["status"]["variant"]) => {
    const variants = {
        blue: "bg-blue-50 text-blue-700 border-blue-200",
        yellow: "bg-yellow-50 text-yellow-700 border-yellow-200",
        purple: "bg-purple-50 text-purple-700 border-purple-200",
        green: "bg-green-50 text-green-700 border-green-200",
        amber: "bg-amber-50 text-amber-700 border-amber-200"
    };
    return variants[variant];
};

export default function SystemRecentActivity() {
    return (
        <div className="space-y-4">
            <div className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                <span className="text-lg font-medium">
                    System Recent Activity
                </span>
            </div>
            <Card>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Time</TableHead>
                                <TableHead>Type</TableHead>
                                <TableHead>Description</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead className="text-right">Action</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {mockActivities.map((activity) => (
                                <TableRow key={activity.id}>
                                    <TableCell className="text-xs">{activity.time}</TableCell>
                                    <TableCell>
                                        <Badge variant="outline" className={getBadgeVariant(activity.type.variant)}>
                                            {activity.type.label}
                                        </Badge>
                                    </TableCell>
                                    <TableCell>{activity.description}</TableCell>
                                    <TableCell>
                                        <Badge variant="outline" className={getBadgeVariant(activity.status.variant)}>
                                            {activity.status.label}
                                        </Badge>
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <Button size="sm" variant="ghost" asChild>
                                            <Link href={activity.action.href}>
                                                {activity.action.label}
                                            </Link>
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </CardContent>
                <CardFooter className="flex justify-end">
                    <Button variant="outline" size="sm" asChild>
                        <Link href="/system-administration/system-integrations/pos/activity">
                            View All Activity
                            <ExternalLink className="h-3 w-3" />
                        </Link>
                    </Button>
                </CardFooter>
            </Card>
        </div>
    );
}
