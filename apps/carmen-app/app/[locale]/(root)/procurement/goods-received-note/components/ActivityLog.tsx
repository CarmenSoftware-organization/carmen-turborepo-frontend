import ActivityLogComponent, { ActivityLogItem } from "@/components/ui-custom/ActivityLogComponent";

// Sample activity log data
const activityLogs: ActivityLogItem[] = [
    {
        id: "INV001",
        date: "2023-01-15",
        user: "Daew",
        action: "Credit Card",
    },
    {
        id: "INV002",
        date: "2023-01-15",
        user: "Weng",
        action: "PayPal",
    },
    {
        id: "INV003",
        date: "2023-01-15",
        user: "P Aof",
        action: "Bank Transfer",
    },
    {
        id: "INV004",
        date: "2023-01-15",
        user: "P Oat",
        action: "Credit Card",
    },
];

export default function ActivityLog() {
    return (
        <ActivityLogComponent
            initialActivities={activityLogs}
            title="Activity Log"
            searchPlaceholder="Search activity log..."
        />
    );
}
