import { Suspense } from "react";

export default function InvoicePage() {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <div>Invoice</div>
        </Suspense>
    )
}



