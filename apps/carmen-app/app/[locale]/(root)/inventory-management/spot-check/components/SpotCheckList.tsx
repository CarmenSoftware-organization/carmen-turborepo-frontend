import { SpotCheckDto } from "@/dtos/inventory-management.dto";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Eye, Pencil, Trash } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { ProgressCustom } from "@/components/ui-custom/progress-custom";
interface SpotCheckListProps {
    readonly spotCheckData: SpotCheckDto[];
}

export default function SpotCheckList({ spotCheckData }: SpotCheckListProps) {
    const calculateProgress = (checked: number, total: number) => {
        return total > 0 ? Math.round((checked / total) * 100) : 0
    }

    return (
        <div className="space-y-4">
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Store Name</TableHead>
                        <TableHead>Requested By</TableHead>
                        <TableHead>Date</TableHead>
                        <TableHead>Progress</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead className="text-right">Action</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {spotCheckData.map((spotCheck) => {
                        const progress = calculateProgress(spotCheck.checked_items, spotCheck.count_items)
                        return (
                            <TableRow key={spotCheck.id}>
                                <TableCell>{spotCheck.department}</TableCell>
                                <TableCell>{spotCheck.requested_by}</TableCell>
                                <TableCell>{spotCheck.date}</TableCell>
                                <TableCell>
                                    <div className="flex flex-col gap-1">
                                        <ProgressCustom
                                            value={progress}
                                        />
                                        <div className="text-xs">
                                            <strong>Progress {progress}%</strong>
                                            <span className="ml-2">
                                                {spotCheck.checked_items} of {spotCheck.count_items} items checked
                                            </span>
                                        </div>
                                    </div>
                                </TableCell>
                                <TableCell>
                                    <Badge>
                                        {spotCheck.status}
                                    </Badge>
                                </TableCell>
                                <TableCell className="text-right">
                                    <Button variant="ghost" size="icon">
                                        <Eye className="h-4 w-4" />
                                    </Button>
                                    <Button variant="ghost" size="icon">
                                        <Pencil className="h-4 w-4" />
                                    </Button>
                                    <Button variant="ghost" size="icon">
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
