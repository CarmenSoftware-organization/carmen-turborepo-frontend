import { WorkflowHistoryDto } from "@/dtos/pr.dto";
import {
  Table,
  TableCell,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";

interface WorkflowPrProps {
  readonly workflowData?: WorkflowHistoryDto[];
}
export default function WorkflowPr({ workflowData }: WorkflowPrProps) {
  const renderContent = () => {
    if (workflowData?.length === 0 || !workflowData) {
      return (
        <TableBody>
          <TableRow>
            <TableCell colSpan={4} className="text-center">
              No workflow history available.
            </TableCell>
          </TableRow>
        </TableBody>
      );
    }
    return (
      <TableBody>
        {workflowData?.map((item, index) => (
          <TableRow key={`${item.status}-${index}`}>
            <TableCell>{item.stage}</TableCell>
            <TableCell>{item.user_name}</TableCell>
            <TableCell>
              <Badge>{item.status}</Badge>
            </TableCell>
            <TableCell>{item.timestamp}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    );
  };

  return (
    <div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Stage</TableHead>
            <TableHead>User</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Timestamp</TableHead>
          </TableRow>
        </TableHeader>
        {renderContent()}
      </Table>
    </div>
  );
}
