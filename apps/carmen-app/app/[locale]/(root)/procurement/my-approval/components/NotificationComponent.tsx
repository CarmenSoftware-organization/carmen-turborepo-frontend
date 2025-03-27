import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function NotificationComponent() {
    return (
        <Card>
            <CardHeader>
                <CardTitle>Notifications</CardTitle>
                <CardDescription>
                    Recent updates and alerts
                </CardDescription>
            </CardHeader>
        </Card>
    );
}
