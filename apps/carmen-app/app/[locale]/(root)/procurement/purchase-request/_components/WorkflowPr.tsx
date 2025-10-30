import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { mockWorkflowPrData } from "@/mock-data/procurement";

const prStatusColor = (status: string) => {
  if (status === "Approved") {
    return "bg-green-100 text-green-800";
  } else if (status === "Pending") {
    return "bg-yellow-100 text-yellow-800";
  } else if (status === "Rejected") {
    return "bg-red-100 text-red-800";
  }
};

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
            <TableCell>
              <Badge
                variant="outline"
                className={`rounded-full ${prStatusColor(workflow.status ?? "")}`}
              >
                {workflow.status}
              </Badge>
            </TableCell>
            <TableCell>{workflow.date_approved ? workflow.date_approved : "-"}</TableCell>
            <TableCell>{workflow.comments}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
