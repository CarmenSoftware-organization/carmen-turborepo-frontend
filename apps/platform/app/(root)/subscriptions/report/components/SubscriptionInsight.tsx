import { Card } from "@/components/ui/card";

export default function SubscriptionInsight() {
    return (
        <Card className="p-4 space-y-4">
            <div>
                <p className="text-2xl font-medium">Subscription Insights</p>
                <p className="text-sm text-muted-foreground">Key metrics and recommendations</p>
            </div>

            <div className="space-y-2">
                <div>
                    <h3 className="text-base font-medium">License Optimization</h3>
                    <p className="text-sm text-muted-foreground">
                        3 business units are using less than 50% of their allocated licenses. Consider reallocating licenses to optimize costs.
                    </p>
                </div>
                <div>
                    <h3 className="text-base font-medium">Module Adoption</h3>
                    <p className="text-sm text-muted-foreground mt-1">
                        HR module has the lowest adoption rate at 30% with only 13 business units using it. Analytics module shows the highest growth rate at 20%.
                    </p>
                </div>

                <div>
                    <h3 className="text-base font-medium">Revenue Growth</h3>
                    <p className="text-sm text-muted-foreground mt-1">
                        Monthly recurring revenue has increased by 35% over the past 6 months, primarily driven by new business unit subscriptions.
                    </p>
                </div>

            </div>
        </Card>
    )
}
