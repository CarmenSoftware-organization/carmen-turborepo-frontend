import { Suspense } from "react";

export default function UsagePage() {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <div>Usage</div>
        </Suspense>
    );
}


