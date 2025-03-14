import React from 'react'
import DashboardStatus from './DashboardStatus'
import RecentActivity from './RecentActivity'
import ReportsOverview from './ReportsOverview'
import HotelsOverview from './HotelsOverview'
import ClusterDashboard from './ClusterDashboard'

const DashboardComponent = () => {
    return (
        <>
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
        </>

    )
}

export default DashboardComponent