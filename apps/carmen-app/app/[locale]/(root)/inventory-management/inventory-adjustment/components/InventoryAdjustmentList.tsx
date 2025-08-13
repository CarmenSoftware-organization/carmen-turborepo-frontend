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
import { InventoryAdjustmentDTO } from "@/dtos/inventory-management.dto";
interface InventoryAdjustmentListProps {
    readonly inventoryAdjustments: InventoryAdjustmentDTO[];
}

export default function InventoryAdjustmentList({ inventoryAdjustments }: InventoryAdjustmentListProps) {
    return (
        <div className="space-y-4">
            <div className="hidden md:block">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead className="w-10 text-center">#</TableHead>
                            <TableHead>Adj No.</TableHead>
                            <TableHead>Date</TableHead>
                            <TableHead>Type</TableHead>
                            <TableHead>Location</TableHead>
                            <TableHead>Reason</TableHead>
                            <TableHead>Item Count</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead>Total Value</TableHead>
                            <TableHead className="text-right">Action</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {inventoryAdjustments.map((inventoryAdjustment, index) => (
                            <TableRow key={inventoryAdjustment.id}>
                                <TableCell className="text-center w-10">{index + 1}</TableCell>
                                <TableCell className="font-medium">{inventoryAdjustment.adj_no}</TableCell>
                                <TableCell>{inventoryAdjustment.adj_date}</TableCell>
                                <TableCell>
                                    <Badge variant="outline" className="bg-secondary text-secondary-foreground">
                                        {inventoryAdjustment.type}
                                    </Badge>
                                </TableCell>
                                <TableCell>{inventoryAdjustment.location}</TableCell>
                                <TableCell>{inventoryAdjustment.reason}</TableCell>
                                <TableCell>{inventoryAdjustment.item_count}</TableCell>
                                <TableCell>
                                    <Badge variant="outline" className="bg-secondary text-secondary-foreground">
                                        {inventoryAdjustment.status}
                                    </Badge>
                                </TableCell>
                                <TableCell>{inventoryAdjustment.total_value}</TableCell>
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
                {inventoryAdjustments.map((inventoryAdjustment) => (
                    <Card key={inventoryAdjustment.id}>
                        <CardHeader>
                            <div className="flex justify-between items-start">
                                <div className="space-y-1">
                                    <Badge variant="outline" className="bg-secondary text-secondary-foreground">
                                        {inventoryAdjustment.status}
                                    </Badge>
                                    <CardTitle className="text-base">{inventoryAdjustment.adj_no}</CardTitle>
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
                                    <p className="text-sm text-muted-foreground">Date</p>
                                    <p className="text-sm font-medium">{inventoryAdjustment.adj_date}</p>
                                </div>
                                <div className="space-y-1">
                                    <p className="text-sm text-muted-foreground">Type</p>
                                    <Badge variant="outline" className="bg-secondary text-secondary-foreground">
                                        {inventoryAdjustment.type}
                                    </Badge>
                                </div>
                                <div className="space-y-1">
                                    <p className="text-sm text-muted-foreground">Location</p>
                                    <p className="text-sm font-medium">{inventoryAdjustment.location}</p>
                                </div>
                                <div className="space-y-1">
                                    <p className="text-sm text-muted-foreground">Reason</p>
                                    <p className="text-sm font-medium">{inventoryAdjustment.reason}</p>
                                </div>
                                <div className="space-y-1">
                                    <p className="text-sm text-muted-foreground">Item Count</p>
                                    <p className="text-sm font-medium">{inventoryAdjustment.item_count}</p>
                                </div>
                                <div className="space-y-1">
                                    <p className="text-sm text-muted-foreground">Total Value</p>
                                    <p className="text-sm font-medium">{inventoryAdjustment.total_value}</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>
    )
}

