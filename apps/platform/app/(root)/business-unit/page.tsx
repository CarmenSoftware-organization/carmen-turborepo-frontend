import { Suspense } from "react";
import BusinessUnitComponent from "./components/BusinessUnitComponent";
export default function BusinessUnitPage() {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <BusinessUnitComponent />
        </Suspense>
    );
}
