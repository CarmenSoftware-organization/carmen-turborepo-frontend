import { PeriodEndDto } from "@/dtos/inventory-management.dto";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Eye, Pencil, Trash } from "lucide-react";
interface PeriodEndListProps {
    readonly periodEnds: PeriodEndDto[];
}

export default function PeriodEndList({ periodEnds }: PeriodEndListProps) {
    return (
        <div className="space-y-4">
            <div className="hidden md:block">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead className="w-10 text-center">#</TableHead>
                            <TableHead>PE No.</TableHead>
                            <TableHead>PE Date</TableHead>
                            <TableHead>Start Date</TableHead>
                            <TableHead>End Date</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead>Created By</TableHead>
                            <TableHead>Completed At</TableHead>
                            <TableHead>Note</TableHead>
                            <TableHead className="text-right">Action</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {periodEnds.map((periodEnd, index) => (
                            <TableRow key={periodEnd.id}>
                                <TableCell className="text-center w-10">{index + 1}</TableCell>
                                <TableCell className="font-medium">{periodEnd.pe_no}</TableCell>
                                <TableCell>{periodEnd.pe_date}</TableCell>
                                <TableCell>{periodEnd.start_date}</TableCell>
                                <TableCell>{periodEnd.end_date}</TableCell>
                                <TableCell>
                                    <Badge variant="outline" className="bg-secondary text-secondary-foreground">
                                        {periodEnd.status}
                                    </Badge>
                                </TableCell>
                                <TableCell>{periodEnd.created_by}</TableCell>
                                <TableCell>{periodEnd.completed_at}</TableCell>
                                <TableCell>{periodEnd.note}</TableCell>
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
                        ))}
                    </TableBody>
                </Table>
            </div>

            <div className="grid gap-4 md:hidden">
                {periodEnds.map((periodEnd) => (
                    <Card key={periodEnd.id}>
                        <CardHeader>
                            <div className="flex justify-between items-start">
                                <div className="fxr-c gap-2">
                                    <p className="text-sm font-medium">{periodEnd.pe_no}</p>
                                    <Badge variant="outline" className="bg-secondary text-secondary-foreground">
                                        {periodEnd.status}
                                    </Badge>
                                </div>
                                <div className="fxr-c gap-1">
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
                                    <p className="text-sm text-muted-foreground">PE Date</p>
                                    <p className="text-sm font-medium">{periodEnd.pe_date}</p>
                                </div>
                                <div className="space-y-1">
                                    <p className="text-sm text-muted-foreground">Start Date</p>
                                    <p className="text-sm font-medium">{periodEnd.start_date}</p>
                                </div>
                                <div className="space-y-1">
                                    <p className="text-sm text-muted-foreground">End Date</p>
                                    <p className="text-sm font-medium">{periodEnd.end_date}</p>
                                </div>
                                <div className="space-y-1">
                                    <p className="text-sm text-muted-foreground">Created By</p>
                                    <p className="text-sm font-medium">{periodEnd.created_by}</p>
                                </div>
                                <div className="space-y-1">
                                    <p className="text-sm text-muted-foreground">Completed At</p>
                                    <p className="text-sm font-medium">{periodEnd.completed_at}</p>
                                </div>
                                <div className="space-y-1">
                                    <p className="text-sm text-muted-foreground">Note</p>
                                    <p className="text-sm font-medium">{periodEnd.note}</p>
                                </div>
                                <div className="space-y-1">
                                    <p className="text-sm text-muted-foreground">Note</p>
                                    <p className="text-sm font-medium">{periodEnd.note}</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>
    )
}
