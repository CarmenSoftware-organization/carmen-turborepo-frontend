"use client";
import React from 'react'
import WastageCard from './WastageCard';
import WastageChartLevel from './WastageChartLevel';
import WastageTable from './WastageTable';

const WastageReportingDashboard = () => {
    return (
        <div className="space-y-4 p-6">
            <WastageCard />
            <WastageChartLevel />
            <WastageTable />
        </div>
    )
}

export default WastageReportingDashboard