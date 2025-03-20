import BillingInfo from "./BillingInfo";
import FilterInvoice from "./FilterInvoice";
import TableInvoice from "./TableInvoice";

export default function InvoiceComponent() {
    return (
        <div className="space-y-4">
            <div>
                <h2 className="text-2xl font-bold tracking-tight">Business Units</h2>
                <p className="text-muted-foreground">
                    Manage all hotels and properties in the system
                </p>
            </div>
            <FilterInvoice />
            <TableInvoice />
            <BillingInfo />
        </div>
    )
}
