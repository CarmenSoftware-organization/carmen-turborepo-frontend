import { Badge } from "@/components/ui/badge"
import { Card } from "@/components/ui/card"

enum PurchaseOrderStatus {
    Open = "Open",
    Voided = "Voided",
    Closed = "Closed",
    Draft = "Draft",
    Sent = "Sent",
    Partial = "Partial",
    FullyReceived = "FullyReceived",
    Cancelled = "Cancelled",
    Deleted = "Deleted",
}

const dataStatusCard = [
    {
        id: "po-status-01",
        status: PurchaseOrderStatus.Open,
        order: 11,
        amount: 1000,
        classNames: "bg-green-100 text-green-800",
    },
    {
        id: "po-status-02",
        status: PurchaseOrderStatus.Voided,
        order: 12,
        amount: 1100,
        classNames: "bg-red-100 text-red-800",
    },
    {
        id: "po-status-03",
        status: PurchaseOrderStatus.Closed,
        order: 13,
        amount: 1200,
        className: "bg-blue-100 text-blue-800",
    },
    {
        id: "po-status-04",
        status: PurchaseOrderStatus.Draft,
        order: 14,
        amount: 1300,
        classNames: "bg-yellow-100 text-yellow-800",
    },
    {
        id: "po-status-05",
        status: PurchaseOrderStatus.Sent,
        order: 15,
        amount: 1400,
        classNames: "bg-purple-100 text-purple-800",
    },
    {
        id: "po-status-06",
        status: PurchaseOrderStatus.Partial,
        order: 16,
        amount: 1500,
        classNames: "bg-orange-100 text-orange-800",
    },
    {
        id: "po-status-07",
        status: PurchaseOrderStatus.FullyReceived,
        order: 17,
        amount: 1600,
        classNames: "bg-green-100 text-green-800",
    },
    {
        id: "po-status-08",
        status: PurchaseOrderStatus.Cancelled,
        order: 18,
        amount: 1700,
        classNames: "bg-red-100 text-red-800",
    },
    {
        id: "po-status-09",
        status: PurchaseOrderStatus.Deleted,
        order: 19,
        amount: 1800,
        classNames: "bg-gray-100 text-gray-800",
    }
]

export default function PoStatusCard() {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4">
            {dataStatusCard.map((item) => (
                <Card key={item.id} className="p-4 space-y-2">
                    <Badge variant="outline" className={`${item.classNames} rounded-full`}>
                        {item.status}
                    </Badge>
                    <div>
                        <p className="text-sm font-medium">{item.order} Orders</p>
                        <p className="text-xs text-muted-foreground">{item.amount.toLocaleString('en-US', { style: 'currency', currency: 'USD' })}</p>
                    </div>
                </Card>
            ))}
        </div>
    )
}
