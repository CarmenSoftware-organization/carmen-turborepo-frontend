import { Card, CardTitle, CardHeader, CardContent } from "@/components/ui/card";

export default function SystemUserPage() {
    return (
        <div className="space-y-4">
            <h1>System User Management</h1>
            <div className="grid grid-cols-2 gap-4">
                <Card>
                    <CardHeader>
                        <CardTitle>Cluster</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div>

                        </div>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader>
                        <CardTitle>Business Unit</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div>

                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}