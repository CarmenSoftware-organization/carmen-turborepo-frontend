import { Card } from "@/components/ui/card";
import { mockSummaryMovementHistory } from "@/mock-data/inventory-balance";

export default function SummaryMovementHistoryCard() {
    return (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Card className="p-4">
                <p className="text-sm font-medium text-muted-foreground">Total In</p>
                <p className="text-2xl font-bold text-green-500">{mockSummaryMovementHistory.total_in.quantity}</p>
                <p className="text-sm text-muted-foreground">${mockSummaryMovementHistory.total_in.value}</p>
            </Card>
            <Card className="p-4">
                <p className="text-sm font-medium text-muted-foreground">Total Out</p>
                <p className="text-2xl font-bold text-red-500">{mockSummaryMovementHistory.total_out.quantity}</p>
                <p className="text-sm text-muted-foreground">${mockSummaryMovementHistory.total_out.value}</p>
            </Card>
            <Card className="p-4">
                <p className="text-sm font-medium text-muted-foreground">Net Change</p>
                <p className="text-2xl font-bold text-green-500">{mockSummaryMovementHistory.net_change.change_quantity}</p>
                <p className="text-sm text-muted-foreground">${mockSummaryMovementHistory.net_change.change_value}</p>
            </Card>
            <Card className="p-4">
                <p className="text-sm font-medium text-muted-foreground">Transaction Count</p>
                <p className="text-2xl font-bold">{mockSummaryMovementHistory.transaction_count}</p>
                <p className="text-sm text-muted-foreground">Total Movement</p>
            </Card>
        </div>
    );
}
