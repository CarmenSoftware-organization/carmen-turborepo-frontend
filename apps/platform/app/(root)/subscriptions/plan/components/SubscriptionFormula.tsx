import { Card } from "@/components/ui/card";

export default function SubscriptionFormula() {
    return (
        <Card className="p-4 space-y-4">
            <div>
                <h2 className="text-2xl font-bold tracking-tight">Subscription Formula</h2>
                <p className="text-muted-foreground">
                    Manage and configure subscription plans for your organization
                </p>
            </div>
            <p className="text-sm text-muted-foreground mb-4">
                Our subscription pricing model is based on the following components:
            </p>
            <ul className="space-y-2 text-sm">
                <li className="flex items-center">
                    <span className="font-medium mr-2">1.</span>
                    <span>Number of Business Units</span>
                </li>
                <li className="flex items-center">
                    <span className="font-medium mr-2">2.</span>
                    <span>Number of Cluster Users (with access to multiple business units)</span>
                </li>
                <li className="flex items-center">
                    <span className="font-medium mr-2">3.</span>
                    <span>Number of BU Staff per Business Unit (with access to a single business unit)</span>
                </li>
                <li className="flex items-center">
                    <span className="font-medium mr-2">4.</span>
                    <span>Modules activated per Business Unit</span>
                </li>
            </ul>
            <p className="text-sm text-muted-foreground mt-4">
                Contact our sales team for custom pricing options or to discuss specific requirements for your hotel group.
            </p>

        </Card>
    )
}
