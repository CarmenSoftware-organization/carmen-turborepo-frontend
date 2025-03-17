import { Button } from "@/components/ui/button";
import { mockReportTemplates } from "@/mock-data/cluster";
import ReportTemplateList from "./ReportTemplateList";
import { Card } from "@/components/ui/card";

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

            <div className="flex justify-between gap-4">
                <Card className="w-1/2 p-4">
                    <p className="text-lg font-bold">Available Templates</p>
                    <ReportTemplateList reportTemplates={reportTemplates} />
                </Card>
                <Card className="w-1/2 p-4">
                    <p className="text-lg font-bold">Hotel Assignment</p>
                </Card>
            </div>
        </div>
    )
}
