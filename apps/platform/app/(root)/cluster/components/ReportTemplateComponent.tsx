import { Button } from "@/components/ui/button";
import { mockReportTemplates } from "@/mock-data/cluster";
import ReportTemplateList from "./ReportTemplateList";

export default function ReportTemplateComponent() {
    const reportTemplates = mockReportTemplates;
    return (
        <div className="space-y-4">
            <div className="flex justify-between items-center">
                <div className="">
                    <h2 className="text-2xl font-bold tracking-tight">Report Template</h2>
                    <p className="text-muted-foreground">
                        Manage and assign report templates across clusters
                    </p>
                </div>
                <Button>Add Report Template</Button >
            </div>
            <ReportTemplateList reportTemplates={reportTemplates} />
        </div>
    )
}
