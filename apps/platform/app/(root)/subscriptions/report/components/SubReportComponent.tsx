import CardReport from "./CardReport";
import FilterSubReport from "./FilterSubReport";
import TabReport from "./TabReport";

export default function SubReportComponent() {
    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-2xl font-bold tracking-tight">Subscription Report</h2>
                    <p className="text-muted-foreground">
                        Analytics and insights for subscription management
                    </p>
                </div>
                <div className="flex items-center gap-2">
                    <FilterSubReport />
                </div>
            </div>
            <CardReport />
            <TabReport />
        </div>
    )
}
