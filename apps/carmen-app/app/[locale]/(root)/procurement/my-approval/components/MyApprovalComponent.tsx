import ProcurementRequestQueue from "./ProcurementRequestQueue";
import RecentApproval from "./RecentApproval";
import NotificationComponent from "./NotificationComponent";

export default function MyApprovalComponent() {
    return (
        <div className="space-y-4">
            <h1>Department Approval</h1>
            <div className="grid grid-cols-12 gap-4">
                <ProcurementRequestQueue />
                <div className="col-span-4 space-y-4">
                    <RecentApproval />
                    <NotificationComponent />
                </div>
            </div>
        </div>
    );
}
