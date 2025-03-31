import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { mockBudgetPrData } from "@/mock-data/procurement";

export default function BudgetPr() {
    return <div>
        <Table>
            <TableHeader>
                <TableRow>
                    <TableHead>Location</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>Total Budget</TableHead>
                    <TableHead>Dept Head Approval</TableHead>
                    <TableHead>PO Approval</TableHead>
                    <TableHead>Actual GL</TableHead>
                    <TableHead>Available Budget</TableHead>
                    <TableHead>Current Budget</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {mockBudgetPrData.map((budget) => (
                    <TableRow key={budget.id}>
                        <TableCell>{budget.location}</TableCell>
                        <TableCell>{budget.category}</TableCell>
                        <TableCell>{budget.total_budget}</TableCell>
                        <TableCell>{budget.dept_head_approval}</TableCell>
                        <TableCell>{budget.po_approval}</TableCell>
                        <TableCell>{budget.actual_gl}</TableCell>
                        <TableCell>{budget.available_budget}</TableCell>
                        <TableCell>{budget.current_budget}</TableCell>
                    </TableRow>
                ))}
            </TableBody>
        </Table>
    </div>;
}

