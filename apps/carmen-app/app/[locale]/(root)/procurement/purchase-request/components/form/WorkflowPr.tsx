import { WorkflowHistoryDto } from "@/dtos/pr.dto";
import { Table, TableCell, TableBody, TableHead, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";

interface WorkflowPrProps {
    readonly workflowData?: WorkflowHistoryDto[];
}

export default function WorkflowPr({ workflowData }: WorkflowPrProps) {
    return (
        <div>
            <Table>
                <TableRow>
                    <TableHead>Stage</TableHead>
                    <TableHead>User</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Timestamp</TableHead>
                </TableRow>
                <TableBody>
                    {workflowData?.map((item) => (
                        <TableRow key={item.status}>
                            <TableCell>{item.stage}</TableCell>
                            <TableCell>{item.user_name}</TableCell>
                            <TableCell>
                                <Badge>
                                    {item.status}
                                </Badge>
                            </TableCell>
                            <TableCell>{item.timestamp}</TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </div>
    )
}
