import { Card } from "@/components/ui/card"

const transactionData = {
    total_items: 10,
    total_quantity: 100,
    total_approved: 80,
    total_issued: 70,
    total_amount: 1000,
}
export default function TransactionSummary() {
    return (
        <Card className="p-4 space-y-2 mt-2">
            <p className="text-base font-medium">Transaction Summary</p>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-2">
                <div className="flex flex-col">
                    <p className="text-xs text-muted-foreground">Total Items</p>
                    <p className="text-base font-medium">{transactionData.total_items}</p>
                </div>
                <div className="flex flex-col">
                    <p className="text-xs text-muted-foreground">Total Quantity</p>
                    <p className="text-base font-medium">{transactionData.total_quantity}</p>
                </div>
                <div className="flex flex-col">
                    <p className="text-xs text-muted-foreground">Total Approved</p>
                    <p className="text-base font-medium">{transactionData.total_approved}</p>
                </div>
                <div className="flex flex-col">
                    <p className="text-xs text-muted-foreground">Total Issued</p>
                    <p className="text-base font-medium">{transactionData.total_issued}</p>
                </div>
                <div className="flex flex-col">
                    <p className="text-xs text-muted-foreground">Total Amount</p>
                    <p className="text-base font-medium">{transactionData.total_amount}</p>
                </div>
            </div>
        </Card>
    )
}
