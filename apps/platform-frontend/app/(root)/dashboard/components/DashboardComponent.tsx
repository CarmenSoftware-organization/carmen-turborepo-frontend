import React from 'react'
import DashboardStatus from './DashboardStatus'

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
        </>

    )
}

export default DashboardComponent