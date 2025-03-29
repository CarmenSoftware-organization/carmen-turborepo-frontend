import { PhysicalCountDto } from "@/dtos/inventory-management.dto";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Eye, Trash } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { ProgressCustom } from "@/components/ui-custom/progress-custom";
import { Link } from "@/lib/navigation";
import { calculateProgress } from "@/utils/calculate";
interface PcmListProps {
    readonly physicalCountData: PhysicalCountDto[];
}

export default function PcmList({ physicalCountData }: PcmListProps) {
    return (
        <div className="space-y-4">
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>#</TableHead>
                        <TableHead>Department</TableHead>
                        <TableHead>Store Name</TableHead>
                        <TableHead>Requested By</TableHead>
                        <TableHead>Date</TableHead>
                        <TableHead>Progress</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead className="text-right">Action</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {physicalCountData.map((pcm, index) => {
                        const progress = calculateProgress(pcm.checked_items, pcm.count_items)
                        return (
                            <TableRow key={pcm.id}>
                                <TableCell>{index + 1}</TableCell>
                                <TableCell>{pcm.department}</TableCell>
                                <TableCell>{pcm.location}</TableCell>
                                <TableCell>{pcm.requested_by}</TableCell>
                                <TableCell>{pcm.date}</TableCell>
                                <TableCell>
                                    <div className="flex flex-col gap-1">
                                        <ProgressCustom
                                            value={progress}
                                        />
                                        <div className="text-xs">
                                            <strong>Progress {progress}%</strong>
                                            <span className="ml-2">
                                                {pcm.checked_items} of {pcm.count_items} items checked
                                            </span>
                                        </div>
                                    </div>
                                </TableCell>
                                <TableCell>
                                    <Badge>
                                        {pcm.status}
                                    </Badge>
                                </TableCell>
                                <TableCell className="text-right">
                                    <Button variant="ghost" size={'sm'} asChild>
                                        <Link href={`/inventory-management/physical-count-management/${pcm.id}`}>
                                            <Eye className="h-4 w-4" />
                                        </Link>
                                    </Button>
                                    <Button variant="ghost" size={'sm'}>
                                        <Trash className="h-4 w-4" />
                                    </Button>
                                </TableCell>
                            </TableRow>
                        )
                    })}
                </TableBody>
            </Table>
        </div>
    )
}

