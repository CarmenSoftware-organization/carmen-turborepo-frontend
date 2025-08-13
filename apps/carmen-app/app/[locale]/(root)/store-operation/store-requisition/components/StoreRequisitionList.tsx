import { StoreRequisitionDto } from "@/dtos/store-operation.dto"
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
import { Eye, Trash } from "lucide-react";
import { Link } from "@/lib/navigation";
interface Props {
    readonly storeRequisitions: StoreRequisitionDto[]
}
export default function StoreRequisitionList({ storeRequisitions }: Props) {
    return (
        <div className="space-y-4">
            <div className="hidden md:block">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead className="w-10 text-center">#</TableHead>
                            <TableHead>Date</TableHead>
                            <TableHead>Ref #</TableHead>
                            <TableHead>Request To</TableHead>
                            <TableHead>Store Name</TableHead>
                            <TableHead>Description</TableHead>
                            <TableHead>Total Amount</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead className="w-[100px] text-right">Action</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {storeRequisitions.map((prt, index) => (
                            <TableRow key={prt.id}>
                                <TableCell className="text-center w-10">{index + 1}</TableCell>
                                <TableCell className="font-medium">{prt.date_created}</TableCell>
                                <TableCell>{prt.ref_no}</TableCell>
                                <TableCell>{prt.request_to}</TableCell>
                                <TableCell>{prt.store_name}</TableCell>
                                <TableCell>{prt.description}</TableCell>
                                <TableCell>{prt.total_amount}</TableCell>
                                <TableCell>
                                    <Badge variant="outline" className="bg-secondary text-secondary-foreground">
                                        {prt.status}
                                    </Badge>
                                </TableCell>
                                <TableCell>
                                    <div className="fxr-c justify-end">
                                        <Button variant="ghost" size="sm" className="h-7 w-7" asChild>
                                            <Link href={`/store-operation/store-requisition/${prt.id}`}>
                                                <Eye className="h-4 w-4" />
                                            </Link>
                                        </Button>
                                        <Button variant="ghost" size="sm" className="h-7 w-7 text-destructive hover:text-destructive/80">
                                            <Trash className="h-4 w-4" />
                                        </Button>
                                    </div>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>
            <div className="grid gap-4 md:hidden">
                {storeRequisitions.map((prt) => (
                    <Card key={prt.id} className="transition-all duration-200 hover:shadow-lg hover:border-primary/50">
                        <CardHeader className="p-4">
                            <div className="flex justify-between items-start">
                                <div className="space-y-1">
                                    <Badge variant="outline" className="bg-secondary text-secondary-foreground">
                                        {prt.status}
                                    </Badge>
                                    <CardTitle className="text-base">{prt.ref_no}</CardTitle>
                                </div>
                                <div className="fxr-c gap-1">
                                    <Button variant="ghost" size="sm" className="h-7 w-7" asChild>
                                        <Link href={`/store-operation/store-requisition/${prt.id}`}>
                                            <Eye className="h-4 w-4" />
                                        </Link>
                                    </Button>
                                    <Button variant="ghost" size="sm" className="h-7 w-7 text-destructive hover:text-destructive/80">
                                        <Trash className="h-4 w-4" />
                                    </Button>
                                </div>
                            </div>
                        </CardHeader>
                        <CardContent className="p-4 pt-0">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-1">
                                    <p className="text-sm text-muted-foreground">Store Name</p>
                                    <p className="text-sm font-medium">{prt.store_name}</p>
                                </div>
                                <div className="space-y-1">
                                    <p className="text-sm text-muted-foreground">Date Created</p>
                                    <p className="text-sm font-medium">{prt.date_created}</p>
                                </div>
                                <div className="space-y-1">
                                    <p className="text-sm text-muted-foreground">Description</p>
                                    <p className="text-sm font-medium">{prt.description}</p>
                                </div>
                                <div className="space-y-1">
                                    <p className="text-sm text-muted-foreground">Request To</p>
                                    <p className="text-sm font-medium">{prt.request_to}</p>
                                </div>
                                <div className="space-y-1">
                                    <p className="text-sm text-muted-foreground">Total Amount</p>
                                    <p className="text-sm font-medium">{prt.total_amount}</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>
    )
}


