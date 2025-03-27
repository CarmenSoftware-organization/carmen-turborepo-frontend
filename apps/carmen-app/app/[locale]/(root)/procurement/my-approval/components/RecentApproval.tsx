import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function RecentApproval() {
    return (
        <Card>
            <CardHeader>
                <CardTitle>Recent Approvals</CardTitle>
                <CardDescription>
                    Log of your recent approval actions
                </CardDescription>
            </CardHeader>
        </Card>
    );
}
