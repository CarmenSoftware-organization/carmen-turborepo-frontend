import ClusterDashboard from "./ClusterDashboard";
import DashboardStatus from "./DashboardStatus";
import HotelsOverview from "./HotelsOverview";
import RecentActivity from "./RecentActivity";
import ReportsOverview from "./ReportsOverview";

export default function DashboardComponent() {
    return (
        <div>
            <div>
                <h2 className="text-2xl font-bold tracking-tight">Dashboard</h2>
                <p className="text-muted-foreground">
                    Platform overview and key metrics
                </p>
            </div>
            <DashboardStatus />
            <div className="grid gap-6 lg:grid-cols-2">
                <div className='space-y-6'>
                    <ReportsOverview />
                    <HotelsOverview />
                </div>
                <div className='space-y-6'>
                    <ClusterDashboard />
                    <RecentActivity />
                </div>
            </div>
        </div>
    )
}
