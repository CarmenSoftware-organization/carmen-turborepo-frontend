import { PhysicalCountDto } from "@/dtos/inventory-management.dto";
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
import { calculateProgress } from "@/utils/format/number";

interface PcmGridProps {
  readonly physicalCountData: PhysicalCountDto[];
}

export default function PcmGrid({ physicalCountData }: PcmGridProps) {
  return (
    <ScrollArea className="h-[600px]">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {physicalCountData.map((pcm) => {
          const progress = calculateProgress(pcm.checked_items, pcm.count_items);
          return (
            <Card key={pcm.id} className="flex flex-col">
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>{pcm.department}</span>
                  <Badge>{pcm.status}</Badge>
                </CardTitle>
                <CardDescription>Requested by: {pcm.requested_by}</CardDescription>
              </CardHeader>
              <CardContent className="flex-grow">
                <div className="space-y-4">
                  <div className="text-sm text-muted-foreground">Date: {pcm.date}</div>
                  <div className="text-sm text-muted-foreground">Location: {pcm.location}</div>
                  <div className="space-y-1">
                    <ProgressCustom value={progress} />
                    <div className="text-xs">
                      <strong>Progress {progress}%</strong>
                      <span className="ml-2">
                        {pcm.checked_items} of {pcm.count_items} items checked
                      </span>
                    </div>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex justify-end gap-2">
                <Button variant="ghost" size={"sm"} asChild>
                  <Link href={`/inventory-management/physical-count-management/${pcm.id}`}>
                    <Eye className="h-4 w-4" />
                  </Link>
                </Button>
                <Button variant="ghost" size={"sm"}>
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
