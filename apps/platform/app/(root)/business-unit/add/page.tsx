import { Suspense } from "react";
import BuForm from "../components/BuForm";
export default function BusinessUnitAddPage() {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <BuForm />
        </Suspense>
    );
}
