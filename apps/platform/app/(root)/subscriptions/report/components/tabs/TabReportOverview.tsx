import ClusterDistribution from "./ClusterDistribution";
import SubscriptionInsight from "./SubscriptionInsight";
import SubscriptionTrend from "./SubscriptionTrend";

export default function TabReportOverview() {
    return (
        <div className="flex flex-col gap-2">
            <div className="grid grid-cols-2 gap-2">
                <SubscriptionTrend />
                <ClusterDistribution />
            </div>
            <SubscriptionInsight />
        </div>
    )
}
