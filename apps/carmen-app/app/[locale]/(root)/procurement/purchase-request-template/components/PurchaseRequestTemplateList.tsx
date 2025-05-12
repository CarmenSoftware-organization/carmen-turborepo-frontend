import { PurchaseRequestTemplateDto } from "@/dtos/procurement.dto";
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
import { FileText, SquarePen, Trash2 } from "lucide-react";

interface PurchaseRequestTemplateListProps {
    readonly purchaseRequestTemplates: PurchaseRequestTemplateDto[];
}

export default function PurchaseRequestTemplateList({ purchaseRequestTemplates }: PurchaseRequestTemplateListProps) {
    return (
        <div className="space-y-4">
            <div className="hidden md:block">
                <Table className="border">
                    <TableHeader>
                        <TableRow className="bg-muted">
                            <TableHead className="w-10 text-center">#</TableHead>
                            <TableHead>PRT No.</TableHead>
                            <TableHead>Title</TableHead>
                            <TableHead>Date Created</TableHead>
                            <TableHead>Type</TableHead>
                            <TableHead>Requestor</TableHead>
                            <TableHead>Amount</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead className="w-[100px] text-right">Action</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {purchaseRequestTemplates.map((prt, index) => (
                            <TableRow key={prt.id}>
                                <TableCell className="text-center w-10">{index + 1}</TableCell>
                                <TableCell className="font-medium">{prt.prt_number}</TableCell>
                                <TableCell>{prt.title}</TableCell>
                                <TableCell>{prt.date_created}</TableCell>
                                <TableCell>{prt.type}</TableCell>
                                <TableCell>{prt.requestor}</TableCell>
                                <TableCell>{prt.amount}</TableCell>
                                <TableCell>
                                    <Badge variant="outline" className="bg-secondary text-secondary-foreground">
                                        {prt.status}
                                    </Badge>
                                </TableCell>
                                <TableCell>
                                    <div className="flex items-center justify-end gap-1">
                                        <Button variant="ghost" size="icon" className="h-7 w-7 ">
                                            <FileText className="h-4 w-4" />
                                        </Button>
                                        <Button variant="ghost" size="icon" className="h-7 w-7">
                                            <SquarePen className="h-4 w-4" />
                                        </Button>
                                        <Button variant="ghost" size="icon" className="h-7 w-7">
                                            <Trash2 className="h-4 w-4" />
                                        </Button>
                                    </div>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>
            <div className="grid gap-4 md:hidden">
                {purchaseRequestTemplates.map((prt) => (
                    <Card key={prt.id} className="transition-all duration-200 hover:shadow-lg hover:border-primary/50">
                        <CardHeader className="p-4">
                            <div className="flex justify-between items-start">
                                <div className="space-y-1">
                                    <Badge variant="outline" className="bg-secondary text-secondary-foreground">
                                        {prt.status}
                                    </Badge>
                                    <CardTitle className="text-base">{prt.prt_number}</CardTitle>
                                </div>
                                <div className="flex items-center gap-1">
                                    <Button variant="ghost" size="icon" className="h-7 w-7">
                                        <FileText className="h-4 w-4" />
                                    </Button>
                                    <Button variant="ghost" size="icon" className="h-7 w-7">
                                        <SquarePen className="h-4 w-4" />
                                    </Button>
                                    <Button variant="ghost" size="icon" className="h-7 w-7">
                                        <Trash2 className="h-4 w-4" />
                                    </Button>
                                </div>
                            </div>
                        </CardHeader>
                        <CardContent className="p-4 pt-0">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-1">
                                    <p className="text-sm text-muted-foreground">Title</p>
                                    <p className="text-sm font-medium">{prt.title}</p>
                                </div>
                                <div className="space-y-1">
                                    <p className="text-sm text-muted-foreground">Date Created</p>
                                    <p className="text-sm font-medium">{prt.date_created}</p>
                                </div>
                                <div className="space-y-1">
                                    <p className="text-sm text-muted-foreground">Type</p>
                                    <p className="text-sm font-medium">{prt.type}</p>
                                </div>
                                <div className="space-y-1">
                                    <p className="text-sm text-muted-foreground">Requestor</p>
                                    <p className="text-sm font-medium">{prt.requestor}</p>
                                </div>
                                <div className="space-y-1">
                                    <p className="text-sm text-muted-foreground">Amount</p>
                                    <p className="text-sm font-medium">{prt.amount}</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>
    )
} 