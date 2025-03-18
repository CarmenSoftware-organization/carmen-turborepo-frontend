import { ModuleDto } from "@/dto/module.dto";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface ModuleListProps {
    readonly modules: ModuleDto[];
}

export default function ModuleList({ modules }: ModuleListProps) {

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {modules.map((module) => (
                <Card key={module.id} className="overflow-hidden transition-all hover:shadow-lg">
                    <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                        <CardTitle className="text-lg truncate">{module.name}</CardTitle>
                        <Badge variant={module.status ? "default" : "destructive"}>
                            {module.status ? 'Active' : 'Inactive'}
                        </Badge>
                    </CardHeader>

                    <CardContent>
                        <CardDescription className="line-clamp-2 mb-4">
                            {module.description}
                        </CardDescription>

                        <div className="mb-4">
                            <h4 className="text-sm font-medium mb-2">Available Plans:</h4>
                            <div className="flex flex-wrap gap-2">
                                {module.available_plans.map((plan) => (
                                    <Badge key={plan.id} variant="outline" className="bg-primary-light text-primary">
                                        {plan.name}
                                    </Badge>
                                ))}
                                {module.available_plans.length === 0 && (
                                    <span className="text-xs text-muted">No plans available</span>
                                )}
                            </div>
                        </div>
                    </CardContent>
                </Card>
            ))}

            {modules.length === 0 && (
                <Card className="col-span-full">
                    <CardContent className="flex items-center justify-center py-6">
                        <p className="text-muted">No modules available</p>
                    </CardContent>
                </Card>
            )}
        </div>
    );
}
