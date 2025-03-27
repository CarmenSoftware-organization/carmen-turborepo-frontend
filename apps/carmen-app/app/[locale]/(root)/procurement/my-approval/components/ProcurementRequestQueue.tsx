import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

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

            </CardContent>
        </Card>
    );
}
