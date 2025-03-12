import React from 'react'
import DashboardStatus from './DashboardStatus';
import ReportsOverview from './ReportsOverview';
import HotelsOverview from './HotelsOverview';
import Cluster from './Cluster';
import RecentActivity from './RecentActivity';

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

const Dashboard = async () => {
    await delay(2000);
    return (
        <div className="space-y-6">
            <div>
                <h2 className="text-2xl font-bold tracking-tight">Dashboard</h2>
                <p className="text-muted-foreground">
                    Platform overview and key metrics
                </p>
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <DashboardStatus />
            </div>
            <div className="grid gap-6 lg:grid-cols-2">
                <div className='space-y-6'>
                    <ReportsOverview />
                    <HotelsOverview />
                </div>
                <div className='space-y-6'>
                    <Cluster />
                    <RecentActivity />
                </div>
            </div>
        </div>
    )
}

export default Dashboard