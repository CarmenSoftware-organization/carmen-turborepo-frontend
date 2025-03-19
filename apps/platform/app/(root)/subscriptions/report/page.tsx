import { Suspense } from "react";

export default function ReportPage() {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <div>Report</div>
        </Suspense>
    );
}




