import { Button } from "@/components/ui/button";
import { PlusIcon } from "lucide-react";
import SupportTabs from "./SupportTabs";

export default function SupportComponent() {
    return (
        <div className="space-y-4"  >
            <div className="flex justify-between items-center">
                <div className="">
                    <h2 className="text-2xl font-bold tracking-tight">Support</h2>
                    <p className="text-muted-foreground">
                        Manage your support requests and issues
                    </p>
                </div>
                <Button size="sm">
                    <PlusIcon className="w-4 h-4" />
                    Create Ticket
                </Button>
            </div>
            <SupportTabs />
        </div>
    )
}
