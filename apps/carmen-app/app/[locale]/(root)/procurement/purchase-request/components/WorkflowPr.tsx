import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { mockWorkflowPrData } from "@/mock-data/procurement";

export default function WorkflowPr() {
    return (
        <Table>
            <TableHeader>
                <TableRow>
                    <TableHead>Stage</TableHead>
                    <TableHead>Approver</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Date Approved</TableHead>
                    <TableHead>Comments</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {mockWorkflowPrData.map((workflow) => (
                    <TableRow key={workflow.id}>
                        <TableCell>{workflow.stage}</TableCell>
                        <TableCell>{workflow.approver}</TableCell>
                        <TableCell>{workflow.status}</TableCell>
                        <TableCell>{workflow.date_approved ? workflow.date_approved : '-'}</TableCell>
                        <TableCell>{workflow.comments}</TableCell>
                    </TableRow>
                ))}
            </TableBody>
        </Table>
    )
}

