import ClusterDistribution from "./ClusterDistribution";
import SubscriptionTrend from "./SubscriptionTrend";

export default function TabReportOverview() {
    return (
        <div className="grid grid-cols-2 gap-2">
            <SubscriptionTrend />
            <ClusterDistribution />
        </div>
    )
}
