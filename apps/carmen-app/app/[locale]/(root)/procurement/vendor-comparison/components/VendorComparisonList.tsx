import { VendorComparisonDto } from "@/dtos/procurement.dto"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Eye, Trash, Star } from "lucide-react";
import { Badge } from "@/components/ui/badge";
interface VendorComparisonListProps {
    readonly vendorComparisons: VendorComparisonDto[]
}
export default function VendorComparisonList({ vendorComparisons }: VendorComparisonListProps) {
    return (
        <div className="space-y-4">
            <div className="hidden md:block">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Vendor</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead>Rating</TableHead>
                            <TableHead>Delivery Time (days)</TableHead>
                            <TableHead>Quality Score</TableHead>
                            <TableHead>Response Time (hrs)</TableHead>
                            <TableHead className="text-right">Action</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {vendorComparisons.map((vendorComparison) => (
                            <TableRow key={vendorComparison.id}>
                                <TableCell>{vendorComparison.vendor_name}</TableCell>
                                <TableCell>
                                    <Badge variant={vendorComparison.status ? 'default' : 'destructive'}>
                                        {vendorComparison.status ? 'Active' : 'Inactive'}
                                    </Badge>
                                </TableCell>
                                <TableCell>
                                    <div className="flex items-center gap-1">
                                        {vendorComparison.rating}
                                        <Star className="h-4 w-4 text-yellow-500" />
                                    </div>
                                </TableCell>
                                <TableCell>{vendorComparison.delivery_time}</TableCell>
                                <TableCell>{vendorComparison.score}%</TableCell>
                                <TableCell>{vendorComparison.res_time}</TableCell>
                                <TableCell className="text-right">
                                    <Button size={'sm'} variant={'ghost'}>
                                        <Eye className="h-4 w-4" />
                                    </Button>
                                    <Button size={'sm'} variant={'ghost'}>
                                        <Trash className="h-4 w-4 text-destructive" />
                                    </Button>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>

            <div className="grid gap-4 md:hidden">
                {vendorComparisons.map((vendorComparison) => (
                    <Card key={vendorComparison.id} className="transition-all duration-200 hover:shadow-lg hover:border-primary/50">
                        <CardHeader className="p-4">
                            <div className="flex justify-between items-start">
                                <CardTitle className="text-base">{vendorComparison.vendor_name}</CardTitle>
                                <div className="flex items-center gap-1">
                                    <Button variant="ghost" size={'sm'}>
                                        <Eye className="h-4 w-4" />
                                    </Button>
                                    <Button variant="ghost" size={'sm'}>
                                        <Trash className="h-4 w-4 text-destructive" />
                                    </Button>
                                </div>
                            </div>
                        </CardHeader>
                        <CardContent className="p-4 pt-0">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-1">
                                    <p className="text-sm text-muted-foreground">Status</p>
                                    <p className="text-sm font-medium">{vendorComparison.status ? 'Active' : 'Inactive'}</p>
                                </div>
                                <div className="space-y-1">
                                    <p className="text-sm text-muted-foreground">Rating</p>
                                    <div className="flex items-center gap-1">
                                        <p className="text-sm font-medium">{vendorComparison.rating}</p>
                                        <Star className="h-4 w-4 text-yellow-500" />
                                    </div>
                                </div>
                                <div className="space-y-1">
                                    <p className="text-sm text-muted-foreground">Delivery Time</p>
                                    <p className="text-sm font-medium">{vendorComparison.delivery_time} days</p>
                                </div>
                                <div className="space-y-1">
                                    <p className="text-sm text-muted-foreground">Quality Score</p>
                                    <p className="text-sm font-medium">{vendorComparison.score}%</p>
                                </div>
                                <div className="space-y-1">
                                    <p className="text-sm text-muted-foreground">Response Time</p>
                                    <p className="text-sm font-medium">{vendorComparison.res_time} hrs</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>
    )
}
