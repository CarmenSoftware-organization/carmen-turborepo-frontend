import { CreditNoteDto } from "@/dtos/procurement.dto";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Eye, Pencil, Trash } from "lucide-react";

interface CreditNoteListProps {
    readonly creditNotes: CreditNoteDto[];
}

export default function CreditNoteList({ creditNotes }: CreditNoteListProps) {
    return (
        <div className="space-y-4">
            {/* Desktop Table View */}
            <div className="hidden md:block">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead className="w-10 text-center">#</TableHead>
                            <TableHead>Credit Note No.</TableHead>
                            <TableHead>Title</TableHead>
                            <TableHead>Date Created</TableHead>
                            <TableHead>Vendor</TableHead>
                            <TableHead>Document No.</TableHead>
                            <TableHead>Document Date</TableHead>
                            <TableHead>Net Amount</TableHead>
                            <TableHead>Tax Amount</TableHead>
                            <TableHead>Amount</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead className="w-[100px] text-right">Action</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {creditNotes.map((cn, index) => (
                            <TableRow key={cn.id}>
                                <TableCell className="text-center w-10">{index + 1}</TableCell>
                                <TableCell className="font-medium">{cn.cdn_number}</TableCell>
                                <TableCell>{cn.title}</TableCell>
                                <TableCell>{cn.date_created}</TableCell>
                                <TableCell>{cn.vendor}</TableCell>
                                <TableCell>{cn.doc_no}</TableCell>
                                <TableCell>{cn.doc_date}</TableCell>
                                <TableCell>{cn.net_amount}</TableCell>
                                <TableCell>{cn.tax_amount}</TableCell>
                                <TableCell>{cn.amount}</TableCell>
                                <TableCell>
                                    <Badge variant="outline" className="bg-secondary text-secondary-foreground">
                                        {cn.status}
                                    </Badge>
                                </TableCell>
                                <TableCell>
                                    <div className="flex items-center justify-end gap-1">
                                        <Button variant="ghost" size="icon" className="h-8 w-8 hover:bg-accent">
                                            <Eye className="h-4 w-4" />
                                        </Button>
                                        <Button variant="ghost" size="icon" className="h-8 w-8 hover:bg-accent">
                                            <Pencil className="h-4 w-4" />
                                        </Button>
                                        <Button variant="ghost" size="icon" className="h-8 w-8 hover:bg-destructive/10 hover:text-destructive">
                                            <Trash className="h-4 w-4" />
                                        </Button>
                                    </div>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>

            {/* Mobile Card View */}
            <div className="grid gap-4 md:hidden">
                {creditNotes.map((cn) => (
                    <Card key={cn.id} className="transition-all duration-200 hover:shadow-lg hover:border-primary/50">
                        <CardHeader className="p-4">
                            <div className="flex justify-between items-start">
                                <div className="space-y-1">
                                    <Badge variant="outline" className="bg-secondary text-secondary-foreground">
                                        {cn.status}
                                    </Badge>
                                    <CardTitle className="text-base">{cn.cdn_number}</CardTitle>
                                </div>
                                <div className="flex items-center gap-1">
                                    <Button variant="ghost" size="icon" className="h-8 w-8 hover:bg-accent">
                                        <Eye className="h-4 w-4" />
                                    </Button>
                                    <Button variant="ghost" size="icon" className="h-8 w-8 hover:bg-accent">
                                        <Pencil className="h-4 w-4" />
                                    </Button>
                                    <Button variant="ghost" size="icon" className="h-8 w-8 hover:bg-destructive/10 hover:text-destructive">
                                        <Trash className="h-4 w-4" />
                                    </Button>
                                </div>
                            </div>
                        </CardHeader>
                        <CardContent className="p-4 pt-0">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-1">
                                    <p className="text-sm text-muted-foreground">Title</p>
                                    <p className="text-sm font-medium">{cn.title}</p>
                                </div>
                                <div className="space-y-1">
                                    <p className="text-sm text-muted-foreground">Date Created</p>
                                    <p className="text-sm font-medium">{cn.date_created}</p>
                                </div>
                                <div className="space-y-1">
                                    <p className="text-sm text-muted-foreground">Vendor</p>
                                    <p className="text-sm font-medium">{cn.vendor}</p>
                                </div>
                                <div className="space-y-1">
                                    <p className="text-sm text-muted-foreground">Document No.</p>
                                    <p className="text-sm font-medium">{cn.doc_no}</p>
                                </div>
                                <div className="space-y-1">
                                    <p className="text-sm text-muted-foreground">Document Date</p>
                                    <p className="text-sm font-medium">{cn.doc_date}</p>
                                </div>
                                <div className="space-y-1">
                                    <p className="text-sm text-muted-foreground">Net Amount</p>
                                    <p className="text-sm font-medium">{cn.net_amount}</p>
                                </div>
                                <div className="space-y-1">
                                    <p className="text-sm text-muted-foreground">Tax Amount</p>
                                    <p className="text-sm font-medium">{cn.tax_amount}</p>
                                </div>
                                <div className="space-y-1">
                                    <p className="text-sm text-muted-foreground">Amount</p>
                                    <p className="text-sm font-medium">{cn.amount}</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>
    )
} 