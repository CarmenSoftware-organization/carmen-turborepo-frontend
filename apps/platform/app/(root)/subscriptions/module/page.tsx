import { Suspense } from "react";
import ModuleComponent from "./components/ModuleComponent";

export default function ModulesPage() {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <ModuleComponent />
        </Suspense>
    );
}

