import RoleTabList from "./RoleTabList";

export default function RoleComponent() {
    return (
        <div className="space-y-4">
            <div>
                <h2 className="text-2xl font-bold tracking-tight">Role Management</h2>
                <p className="text-muted-foreground">
                    Configure and manage user roles across the platform
                </p>
            </div>
            <RoleTabList />
        </div>
    )
}
