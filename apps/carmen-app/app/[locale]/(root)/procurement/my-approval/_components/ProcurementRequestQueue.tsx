import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
    Tabs,
    TabsContent,
    TabsList,
    TabsTrigger,
} from "@/components/ui/tabs"
import ApprovalList from "./ApprovalList";
import { mockFlaggedApprovals, mockPendingApprovals } from "@/mock-data/procurement";
export default function ProcurementRequestQueue() {
    return (
        <Card className="col-span-8">
            <CardHeader>
                <CardTitle>Procurement Request Queue</CardTitle>
                <CardDescription>
                    Staff requests awaiting your approval
                </CardDescription>
            </CardHeader>
            <CardContent>
                <Tabs defaultValue="pending_approval" className="w-full">
                    <TabsList className="grid w-full grid-cols-2">
                        <TabsTrigger value="pending_approval">Pending Approval</TabsTrigger>
                        <TabsTrigger value="flagged">Flagged for Review</TabsTrigger>
                    </TabsList>
                    <TabsContent value="pending_approval">
                        <ApprovalList
                            approvals={mockPendingApprovals}
                            type="pending"
                        />
                    </TabsContent>
                    <TabsContent value="flagged">
                        <ApprovalList
                            approvals={mockFlaggedApprovals}
                            type="flagged"
                        />
                    </TabsContent>
                </Tabs>
            </CardContent>
        </Card>
    );
}
