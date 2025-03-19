import { Suspense } from "react";
import SubscriptionComponent from "./components/SubscriptionComponent";

export default function SubscriptionPage() {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <SubscriptionComponent />
        </Suspense>
    )
}
