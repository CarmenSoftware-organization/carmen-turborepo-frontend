import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Link } from "@/lib/navigation";
import { AlertTriangle, CheckCircle2, Database, FileText, XCircle } from "lucide-react";

const systemStatus = {
    connected: true,
    lastSync: "Today at 14:32",
    unmappedItems: 12,
    failedTransactions: 3,
    pendingApprovals: 5
}

export default function SystemStatus() {
    return (
        <div className="grid grid-cols-1 gap-4 mb-4">
            <Card>
                <CardHeader className="pb-2">
                    <CardTitle className="flex items-center justify-between">
                        <span className="flex items-center gap-2">
                            <Database className="h-5 w-5" />
                            System Status
                        </span>
                        {systemStatus.connected ? (
                            <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                                <CheckCircle2 className="h-3 w-3 mr-1" />
                                Connected
                            </Badge>
                        ) : (
                            <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">
                                <XCircle className="h-3 w-3 mr-1" />
                                Disconnected
                            </Badge>
                        )}
                    </CardTitle>
                    <CardDescription>
                        Last synchronized: {systemStatus.lastSync}
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {systemStatus.unmappedItems > 0 && (
                            <Alert className="bg-amber-50 border-amber-200">
                                <AlertTriangle className="h-4 w-4 !text-amber-600" />
                                <AlertDescription className="flex items-center justify-between w-full">
                                    <span className="text-amber-600">{systemStatus.unmappedItems} Unmapped Items</span>
                                    <Button size="sm" variant="outline" asChild className="h-7 px-2 text-xs">
                                        <Link href="/system-administration/system-integrations/pos/mapping/recipes">
                                            Map Items
                                        </Link>
                                    </Button>
                                </AlertDescription>
                            </Alert>
                        )}

                        {systemStatus.failedTransactions > 0 && (
                            <Alert className="bg-red-50 border-red-200">
                                <XCircle className="h-4 w-4 !  !text-red-600" />
                                <AlertDescription className="flex items-center justify-between w-full">
                                    <span className="text-red-600">{systemStatus.failedTransactions} Failed Transactions</span>
                                    <Button size="sm" variant="outline" asChild className="h-7 px-2 text-xs">
                                        <Link href="/system-administration/system-integrations/pos/transactions?filter=failed">
                                            Review
                                        </Link>
                                    </Button>
                                </AlertDescription>
                            </Alert>
                        )}

                        {systemStatus.pendingApprovals > 0 && (
                            <Alert className="bg-blue-50 border-blue-200">
                                <FileText className="h-4 w-4 !text-blue-600" />
                                <AlertDescription className="flex items-center justify-between w-full">
                                    <span className="text-blue-600">{systemStatus.pendingApprovals} Pending Approvals</span>
                                    <Button size="sm" variant="outline" asChild className="h-7 px-2 text-xs">
                                        <Link href="/system-administration/system-integrations/pos/transactions/stock-out-review">
                                            Approve
                                        </Link>
                                    </Button>
                                </AlertDescription>
                            </Alert>
                        )}
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
