import React from 'react'
import MetricCard from './MetricCard';
import { energyData, scopeData } from '../mock_data/data';
import * as m from '@/paraglide/messages.js';
import EmissionsScope from './EmissionsScope';
import EnergyUsageTrend from './EnergyUsageTrend';
import EmissionsDistribution from './EmissionsDistribution';
import ConsumptionBreakdown from './ConsumptionBreakdown';

const EnvironmentDashboard = () => {

    const latestYear = energyData.length ? energyData[energyData.length - 1] : null;
    const previousYear = energyData.length > 1 ? energyData[energyData.length - 2] : null;

    const energyChange = latestYear && previousYear
        ? ((latestYear.energy - previousYear.energy) / previousYear.energy * 100).toFixed(1)
        : '0.0';


    return (
        <div className="p-6 space-y-4">
            <h1 className="text-3xl font-bold">{m.Environmental_Dashboard_Title()}</h1>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <MetricCard
                    title="Total Energy Usage"
                    value={latestYear?.energy || 0}
                    unit="kWh"
                    subtext={`${energyChange}% vs previous year`}
                />
                <MetricCard
                    title="Current Scope 1"
                    value={scopeData[scopeData.length - 1]?.scope1 || 0}
                    unit="tCO2e"
                    subtext="Direct emissions"
                />
                <MetricCard
                    title="Current Scope 2"
                    value={scopeData[scopeData.length - 1]?.scope2 || 0}
                    unit="tCO2e"
                    subtext="Indirect emissions"
                />
                <MetricCard
                    title="Current Scope 3"
                    value={scopeData[scopeData.length - 1]?.scope3 || 0}
                    unit="tCO2e"
                    subtext="Value chain emissions"
                />
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                <EmissionsScope />
                <EnergyUsageTrend />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <EmissionsDistribution />
                <ConsumptionBreakdown />
            </div>
        </div>
    )
}

export default EnvironmentDashboard