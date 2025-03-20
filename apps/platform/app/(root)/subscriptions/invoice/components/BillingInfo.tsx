import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

export default function BillingInfo() {
    return (
        <Card className="p-4 space-y-4">
            <div>
                <h2 className="text-lg font-bold">Billing Information</h2>
                <p className="text-sm text-muted-foreground">
                    Hotel organization billing details
                </p>
            </div>

            <div className="space-y-1">
                <div className="text-sm font-medium">Company Name</div>
                <div className="text-sm">Carmen Hospitality Group</div>
            </div>
            <div className="space-y-1">
                <div className="text-sm font-medium">Billing Address</div>
                <div className="text-sm">123 Hospitality Road</div>
                <div className="text-sm">Singapore, 123456</div>
            </div>
            <div className="space-y-1">
                <div className="text-sm font-medium">Tax ID</div>
                <div className="text-sm">SG-12345678</div>
            </div>
            <div className="space-y-1">
                <div className="text-sm font-medium">Billing Contact</div>
                <div className="text-sm">finance@carmenhospitality.com</div>
            </div>
            <Button variant="default">Edit Billing Information</Button>
        </Card>
    )
}
