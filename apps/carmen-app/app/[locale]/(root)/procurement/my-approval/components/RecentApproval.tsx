import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";

export default function RecentApproval() {
    return (
        <Card>
            <CardHeader>
                <CardTitle>Recent Approvals</CardTitle>
                <CardDescription>
                    Log of your recent approval actions
                </CardDescription>
            </CardHeader>
            <ScrollArea className="h-[200px]">

            </ScrollArea>
        </Card>
    );
}
