import { SpotCheckDto } from "@/dtos/inventory-management.dto";
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Eye, Trash } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { ProgressCustom } from "@/components/ui-custom/progress-custom";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Link } from "@/lib/navigation";

interface SpotCheckGridProps {
    readonly spotCheckData: SpotCheckDto[];
}

export default function SpotCheckGrid({ spotCheckData }: SpotCheckGridProps) {
    const calculateProgress = (checked: number, total: number) => {
        return total > 0 ? Math.round((checked / total) * 100) : 0;
    };

    return (

        <ScrollArea className="h-[600px]">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {spotCheckData.map((spotCheck) => {
                    const progress = calculateProgress(spotCheck.checked_items, spotCheck.count_items);
                    return (
                        <Card key={spotCheck.id} className="flex flex-col">
                            <CardHeader>
                                <CardTitle className="flex items-center justify-between">
                                    <span>{spotCheck.department}</span>
                                    <Badge>{spotCheck.status}</Badge>
                                </CardTitle>
                                <CardDescription>
                                    Requested by: {spotCheck.requested_by}
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="flex-grow">
                                <div className="space-y-4">
                                    <div className="text-sm text-muted-foreground">
                                        Date: {spotCheck.date}
                                    </div>
                                    <div className="text-sm text-muted-foreground">
                                        Location: {spotCheck.location}
                                    </div>
                                    <div className="space-y-1">
                                        <ProgressCustom value={progress} />
                                        <div className="text-xs">
                                            <strong>Progress {progress}%</strong>
                                            <span className="ml-2">
                                                {spotCheck.checked_items} of {spotCheck.count_items} items checked
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                            <CardFooter className="flex justify-end gap-2">
                                <Button variant="ghost" size={'sm'} asChild>
                                    <Link href={`/inventory-management/spot-check/${spotCheck.id}`}>
                                        <Eye className="h-4 w-4" />
                                    </Link>
                                </Button>
                                <Button variant="ghost" size={'sm'}>
                                    <Trash className="h-4 w-4" />
                                </Button>
                            </CardFooter>
                        </Card>
                    );
                })}
            </div>
        </ScrollArea>

    );
}
