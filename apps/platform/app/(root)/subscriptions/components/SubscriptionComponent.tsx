import { Button } from "@/components/ui/button";
import { PlusIcon } from "lucide-react";
import SubscriptionList from "./SubscriptionList";

export default function SubscriptionComponent() {
    return (
        <div className="space-y-4">
            <div className="flex justify-between items-center">
                <div className="">
                    <h2 className="text-2xl font-bold tracking-tight">Subscriptions</h2>
                    <p className="text-muted-foreground">
                        Manage subscriptions across business units
                    </p>
                </div>
                <Button size="sm">
                    <PlusIcon className="w-4 h-4" />
                    Add Subscription
                </Button>
            </div>
            <SubscriptionList />
        </div>
    )
}
