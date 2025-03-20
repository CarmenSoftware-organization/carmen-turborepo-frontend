import ActiveUsers from "./ActiveUsers";
import AdoptionRate from "./AdoptionRate";
import UsageSummary from "./UsageSummary";

export default function TabReportModule() {
    return (
        <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2 w-full">
                <AdoptionRate />
                <ActiveUsers />
            </div>
            <UsageSummary />
        </div>
    )
}
