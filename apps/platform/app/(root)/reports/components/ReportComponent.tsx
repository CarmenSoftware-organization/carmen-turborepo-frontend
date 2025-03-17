import ReportTabList from "./ReportTabList";

export default function ReportComponent() {
    return (
        <div className="space-y-4">
            <div>
                <h2 className="text-2xl font-bold tracking-tight">Reports</h2>
                <p className="text-muted-foreground">
                    Manage report assignments and templates
                </p>
            </div>
            <ReportTabList />
        </div>
    )
}
