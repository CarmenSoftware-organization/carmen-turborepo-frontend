import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";

export default function NotificationComponent() {
    return (
        <Card>
            <CardHeader>
                <CardTitle>Notifications</CardTitle>
                <CardDescription>
                    Recent updates and alerts
                </CardDescription>
            </CardHeader>
            <ScrollArea className="h-[200px]">

            </ScrollArea>
        </Card>
    );
}
