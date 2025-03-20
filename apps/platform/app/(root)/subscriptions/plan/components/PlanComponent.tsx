import { Button } from "@/components/ui/button";
import SubscriptionFormula from "./SubscriptionFormula";
import TabsPlan from "./TabsPlan";

export default function PlanComponent() {
    return (
        <div className="space-y-4">
            <div>
                <h2 className="text-2xl font-bold tracking-tight">Subscription Plans</h2>
                <p className="text-muted-foreground">
                    Manage and configure subscription plans for your organization
                </p>
            </div>
            <div className="flex items-center justify-end gap-2">
                <Button variant="outline">Manage Business Units</Button>
                <Button variant="outline">Manage Cluster</Button>
                <Button variant="default">Add Plan</Button>
            </div>
            <TabsPlan />
            <SubscriptionFormula />
        </div>
    )
}
