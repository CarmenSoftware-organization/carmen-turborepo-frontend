import ActivityLogComponent, { ActivityLogItem } from "@/components/ui-custom/ActivityLogComponent";

// Sample store requisition activity log data
const storeRequisitionLogs: ActivityLogItem[] = [
    {
        id: "SR001",
        date: "2023-02-10",
        user: "Nattapong S.",
        action: "Created store requisition SR-2023-001",
    },
    {
        id: "SR002",
        date: "2023-02-11",
        user: "Hiroshi T.",
        action: "Approved store requisition",
    },
    {
        id: "SR003",
        date: "2023-02-12",
        user: "Samantha L.",
        action: "Added items to requisition",
    },
    {
        id: "SR004",
        date: "2023-02-13",
        user: "Mohammed A.",
        action: "Processed store requisition",
    },
    {
        id: "SR005",
        date: "2023-02-14",
        user: "Nattapong S.",
        action: "Completed store requisition",
    },
];

export default function ActivityLogStoreRequisition() {
    return (
        <ActivityLogComponent
            initialActivities={storeRequisitionLogs}
            title="Store Requisition Activity"
            searchPlaceholder="Search store requisition activities..."
        />
    );
} 