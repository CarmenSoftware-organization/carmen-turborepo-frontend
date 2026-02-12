"use client";

import dynamic from "next/dynamic";
import WastageCard from "./WastageCard";
import WastageTable from "./WastageTable";

const WastageChartLevel = dynamic(() => import("./WastageChartLevel"), { ssr: false });

export default function WastageReportingComponent() {
    return (
        <div className="space-y-4">
            <WastageCard />
            <WastageChartLevel />
            <WastageTable />
        </div>
    )
}
