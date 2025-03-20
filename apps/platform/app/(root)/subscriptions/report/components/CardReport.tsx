import { Card } from "@/components/ui/card";
import { mockSubscriptionReport } from "@/mock-data/subscription";
import { calculatePercentage } from "@/้helpers/calculate";
import { CreditCard, DollarSign, Building2, FolderArchive } from "lucide-react";

export default function CardReport() {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card className="p-4 space-y-1">
                <div className="flex items-center justify-between">
                    <p className="text-sm text-muted-foreground">
                        Total Subscription
                    </p>
                    <CreditCard />
                </div>
                <p className="text-2xl font-bold tracking-tight">
                    {mockSubscriptionReport.subscription}
                </p>

                <div className="flex items-center justify-between">
                    <p className="text-sm text-muted-foreground">
                        Active Subscription
                    </p>
                    <p className="text-sm text-green-500">
                        + {calculatePercentage(mockSubscriptionReport.new_subscription, mockSubscriptionReport.subscription)}% this month
                    </p>
                </div>
            </Card>
            <Card className="p-4 space-y-1">
                <div className="flex items-center justify-between">
                    <p className="text-sm text-muted-foreground">
                        Total Revenue
                    </p>
                    <DollarSign />
                </div>
                <p className="text-2xl font-bold tracking-tight">
                    {mockSubscriptionReport.revenue}
                </p>

                <div className="flex items-center justify-between">
                    <p className="text-sm text-muted-foreground">
                        Monthly recurring
                    </p>
                    <p className="text-sm text-green-500">
                        + {calculatePercentage(mockSubscriptionReport.new_revenue, mockSubscriptionReport.revenue)}% from last month
                    </p>
                </div>
            </Card>
            <Card className="p-4 space-y-1">
                <div className="flex items-center justify-between">
                    <p className="text-sm text-muted-foreground">
                        Business Units
                    </p>
                    <Building2 />
                </div>
                <p className="text-2xl font-bold tracking-tight">
                    {mockSubscriptionReport.bu}
                </p>

                <div className="flex items-center justify-between">
                    <p className="text-sm text-muted-foreground">
                        With active subscriptions
                    </p>
                    <p className="text-sm text-green-500">
                        + {calculatePercentage(mockSubscriptionReport.new_bu, mockSubscriptionReport.bu)}% this month
                    </p>
                </div>

            </Card>
            <Card className="p-4 space-y-1">
                <div className="flex items-center justify-between">
                    <p className="text-sm text-muted-foreground">
                        Active Clusters
                    </p>
                    <FolderArchive />
                </div>
                <p className="text-2xl font-bold tracking-tight">
                    {mockSubscriptionReport.cluster}
                </p>

                <div className="flex items-center justify-between">
                    <p className="text-sm text-muted-foreground">
                        With active subscriptions
                    </p>
                    <p className="text-sm text-green-500">
                        + {calculatePercentage(mockSubscriptionReport.new_cluster, mockSubscriptionReport.cluster)}% this quarter
                    </p>
                </div>
            </Card>

        </div>
    )
}
