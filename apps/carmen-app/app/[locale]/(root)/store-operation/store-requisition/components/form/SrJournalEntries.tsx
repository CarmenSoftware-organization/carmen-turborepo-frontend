import { formType } from "@/dtos/form.dto";
import { JournalEntriesDto } from "@/dtos/store-operation.dto";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Calculator } from "lucide-react";
import { Card } from "@/components/ui/card";

interface SrJournalEntriesProps {
    readonly mode: formType;
    readonly jeItems: JournalEntriesDto;
}

export default function SrJournalEntries({ mode, jeItems }: SrJournalEntriesProps) {
    return (
        <Card className="p-2 space-y-2">
            <div className="flex justify-between items-center p-2">
                <p className="text-base font-medium">Journal Entry</p>
                <div className="flex items-center gap-2">
                    <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        disabled={mode === formType.VIEW}
                    >
                        <Calculator className="h-4 w-4" />
                        Recalculate
                    </Button>
                </div>
            </div>
            <div className="bg-muted-foreground/10 p-4 rounded-md">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                    <div className="flex flex-col">
                        <p className="text-xs text-muted-foreground">Document Type</p>
                        <p className="text-base font-medium">{jeItems.doc_type}</p>
                    </div>
                    <div className="flex flex-col">
                        <p className="text-xs text-muted-foreground">Transaction Date</p>
                        <p className="text-base font-medium">{jeItems.transaction_date}</p>
                    </div>
                    <div className="flex flex-col">
                        <p className="text-xs text-muted-foreground">Status</p>
                        <p className="text-base font-medium">{jeItems.status}</p>
                    </div>
                    <div className="flex flex-col">
                        <p className="text-xs text-muted-foreground">Reference No.</p>
                        <p className="text-base font-medium">{jeItems.je_ref_no}</p>
                    </div>
                    <div className="flex flex-col">
                        <p className="text-xs text-muted-foreground">Source</p>
                        <p className="text-base font-medium">{jeItems.source}</p>
                    </div>
                    <div className="flex flex-col">
                        <p className="text-xs text-muted-foreground">Description</p>
                        <p className="text-base font-medium">{jeItems.description}</p>
                    </div>
                </div>
            </div>
            <Table className="mt-2 border">
                <TableHeader className="bg-muted">
                    <TableRow>
                        <TableHead>Account</TableHead>
                        <TableHead>Department</TableHead>
                        <TableHead>Description</TableHead>
                        <TableHead>Debit</TableHead>
                        <TableHead>Credit</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {jeItems.ie_items.map((item) => (
                        <TableRow key={item.id}>
                            <TableCell>{item.account_name}</TableCell>
                            <TableCell>{item.dp_name}</TableCell>
                            <TableCell>{item.description}</TableCell>
                            <TableCell>{item.debit}</TableCell>
                            <TableCell>{item.credit}</TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>

            <div className="border rounded-md">
                <div className="flex justify-between items-center p-2">
                    <p className="text-base text-muted-foreground">Total</p>
                    <div className="flex items-center gap-4">
                        <p className="text-base font-medium">8,615.00</p>
                        <p className="text-base font-medium">8,615.00</p>
                    </div>

                </div>

                <div className="bg-muted">
                    <div className="flex justify-end p-2 items-center gap-6">
                        <p className="text-xs text-muted-foreground">Difference: 0.00</p>
                        <p className="text-base text-green-600 font-medium">Balance</p>
                    </div>
                </div>
            </div>
        </Card>
    )
}
