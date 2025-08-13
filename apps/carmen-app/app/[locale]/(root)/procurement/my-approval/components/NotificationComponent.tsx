import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { NotificationDto } from "@/dtos/notification.dto";
import { mockNotiApproval } from "@/mock-data/procurement";
import { formatDistanceToNow } from "date-fns";
import { Badge } from "@/components/ui/badge";
import { Bell, Clock, UserRound } from "lucide-react";
export default function NotificationComponent() {
    return (
        <Card>
            <CardHeader className="border-b">
                <CardTitle className="fxr-c gap-2">
                    <Bell className="w-4 h-4" />
                    Notifications
                </CardTitle>
                <CardDescription className="text-xs">
                    Recent updates and alerts
                </CardDescription>
            </CardHeader>
            <ScrollArea className="h-[220px]">
                {mockNotiApproval.map((notification: NotificationDto) => (
                    <div key={notification.id} className="p-4 space-y-2 border-b">
                        <div className="fxr-c justify-between gap-2">
                            <div className="fxr-c gap-1">
                                <UserRound className="w-3 h-3" />
                                <p className="text-xs text-muted-foreground">{notification.user_posted}</p>
                            </div>
                            <Badge variant="outline" className="fxr-c gap-1">
                                <Clock className="w-3 h-3" />
                                <p className="text-xs text-muted-foreground">{formatDistanceToNow(new Date(notification.created_at), { addSuffix: true })}</p>
                            </Badge>
                        </div>

                        <p className="text-xs font-medium">{notification.title}</p>
                        <p className="text-xs text-muted-foreground">{notification.message}</p>
                    </div>
                ))}
            </ScrollArea>
        </Card>
    );
};
