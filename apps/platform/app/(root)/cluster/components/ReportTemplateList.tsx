"use client";

import { ReportTemplateDto } from "@/dto/cluster.dto";
import {
    Card
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface Props {
    readonly reportTemplates: ReportTemplateDto[];
}

export default function ReportTemplateList({ reportTemplates }: Props) {
    if (!reportTemplates || reportTemplates.length === 0) {
        return (
            <div className="flex justify-center items-center h-48 text-muted-foreground">
                No report templates available.
            </div>
        );
    }

    return (
        <div className="grid grid-cols-1 gap-6 p-4">
            {reportTemplates.map((template) => (
                <Card
                    key={template.id}
                    className="p-4 space-y-1"
                >
                    <div className="flex justify-between items-center">
                        <h1 className="text-lg font-semibold truncate">{template.title}</h1>
                        <Badge variant="outline" className="border-primary/30 text-primary bg-primary/5">
                            {template.department}
                        </Badge>
                    </div>

                    <p className="text-sm text-foreground"> {template.description}</p>
                    <p className="text-sm text-foreground">Assigned to {template.assigned_cluster} hotels in this group</p>
                </Card>
            ))}
        </div>
    );
}
