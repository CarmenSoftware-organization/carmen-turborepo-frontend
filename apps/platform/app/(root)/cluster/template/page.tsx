import { Suspense } from "react";
import ReportTemplateComponent from "../components/ReportTemplateComponent";

export default function ClusterTemplatePage() {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <ReportTemplateComponent />
        </Suspense>
    );
}
