import AccessModuleList from "./AccessModuleList";
import AccessStatusCard from "./AccessStatusCard";
import FilterAccess from "./FilterAccess";

export default function AccessControlComponent() {
    return (
        <div className="space-y-4">
            <div>
                <h2 className="text-2xl font-bold tracking-tight">Access Control</h2>
                <p className="text-muted-foreground">
                    Manage module access and user limits
                </p>
            </div>
            <FilterAccess />
            <AccessStatusCard />
            <AccessModuleList />
        </div>
    )
}
