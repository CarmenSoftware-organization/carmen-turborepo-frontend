import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { mockSubscriptionUsage } from "@/mock-data/subscription";
import { Progress } from "@/components/ui/progress";
import { calculatePercentage } from "@/้helpers/calculate";

export default function UsageTab() {
    const usage = mockSubscriptionUsage;

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {usage.map((item) => (
                <Card key={item.id} className="hover:shadow-lg transition-shadow duration-300">
                    <CardHeader>
                        <CardTitle className="text-lg font-semibold">{item.hotel_name}</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="space-y-2">
                            <div className="flex justify-between text-sm">
                                <span className="text-muted-foreground">User License</span>
                                <div className="flex items-center gap-2">
                                    <span className="font-medium">{item.used_user_license}/{item.user_license}</span>
                                    <span className="text-xs text-muted-foreground">
                                        ({calculatePercentage(item.used_user_license, item.user_license)}%)
                                    </span>
                                </div>
                            </div>
                            <Progress value={(item.used_user_license / item.user_license) * 100} />
                        </div>

                        <div className="space-y-2">
                            <div className="flex justify-between text-sm">
                                <span className="text-muted-foreground">Module License</span>
                                <div className="flex items-center gap-2">
                                    <span className="font-medium">{item.used_module_license}/{item.module_license}</span>
                                    <span className="text-xs text-muted-foreground">
                                        ({calculatePercentage(item.used_module_license, item.module_license)}%)
                                    </span>
                                </div>
                            </div>
                            <Progress value={(item.used_module_license / item.module_license) * 100} />
                        </div>

                        <div className="space-y-2">
                            <div className="flex justify-between text-sm">
                                <span className="text-muted-foreground">Storage License</span>
                                <div className="flex items-center gap-2">
                                    <span className="font-medium">{item.used_storage_license}/{item.storage_license} GB</span>
                                    <span className="text-xs text-muted-foreground">
                                        ({calculatePercentage(item.used_storage_license, item.storage_license)}%)
                                    </span>
                                </div>
                            </div>
                            <Progress value={(item.used_storage_license / item.storage_license) * 100} />
                        </div>
                    </CardContent>
                </Card>
            ))}
        </div>
    );
}
