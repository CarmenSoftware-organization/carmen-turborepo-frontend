"use client";

import { ReportTemplateDto } from "@/dto/cluster.dto";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Layers } from "lucide-react";

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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-4">
            {reportTemplates.map((template) => (
                <Card
                    key={template.id}
                    className="border border-border hover:border-primary/20 transition-all duration-200 shadow-sm hover:shadow backdrop-blur-sm bg-transparent"
                >
                    <CardHeader className="pb-2">
                        <div className="flex justify-between items-start">
                            <CardTitle className="text-lg font-semibold truncate">{template.title}</CardTitle>
                            <Badge variant="outline" className="border-primary/30 text-primary bg-primary/5">
                                {template.department}
                            </Badge>
                        </div>
                        <CardDescription className="line-clamp-2 mt-1">
                            {template.description}
                        </CardDescription>
                    </CardHeader>

                    <CardContent className="pb-2">
                        <div className="flex flex-col space-y-3 text-sm">
                            <div className="flex items-center justify-between text-muted-foreground">
                                <div className="flex items-center gap-2">
                                    <Layers className="h-4 w-4 text-primary/70" />
                                    <span>Assigned Clusters</span>
                                </div>
                                <span className="font-medium text-foreground">{template.assigned_cluster}</span>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            ))}
        </div>
    );
}
