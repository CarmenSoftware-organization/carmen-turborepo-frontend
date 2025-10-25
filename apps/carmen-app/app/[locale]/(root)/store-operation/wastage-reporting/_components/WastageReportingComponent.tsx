import WastageCard from "./WastageCard";
import WastageChartLevel from "./WastageChartLevel";
import WastageTable from "./WastageTable";

export default function WastageReportingComponent() {
    return (
        <div className="space-y-4">
            <WastageCard />
            <WastageChartLevel />
            <WastageTable />
        </div>
    )
}
