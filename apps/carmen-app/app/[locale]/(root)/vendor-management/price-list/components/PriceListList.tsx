import { PriceListDto } from "@/dtos/vendor-management";
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

interface PriceListListProps {
    readonly priceLists: PriceListDto[];
}

export default function PriceListList({ priceLists }: PriceListListProps) {
    return (
        <div className="space-y-4">
            <div className="hidden md:block">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead className="w-10 text-center">#</TableHead>
                            <TableHead>Name</TableHead>
                            <TableHead>Start Date</TableHead>
                            <TableHead>End Date</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead className="text-right">Action</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {priceLists.map((priceList, index) => (
                            <TableRow key={priceList.id}>
                                <TableCell className="text-center w-10">{index + 1}</TableCell>
                                <TableCell>
                                    <div className="flex items-center gap-2">
                                        <p className="text-sm font-medium">{priceList.name}</p>
                                        <Badge >
                                            {priceList.code}
                                        </Badge>
                                    </div>
                                    <p className="text-sm text-muted-foreground">{priceList.description}</p>
                                </TableCell>
                                <TableCell>{priceList.start_date}</TableCell>
                                <TableCell>{priceList.end_date}</TableCell>
                                <TableCell>
                                    <Badge variant={priceList.status ? "default" : "destructive"}>
                                        {priceList.status ? "Active" : "Inactive"}
                                    </Badge>
                                </TableCell>
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
                {priceLists.map((priceList) => (
                    <Card key={priceList.id}>
                        <CardHeader>
                            <div className="flex justify-between items-start">
                                <div className="flex items-center gap-2">
                                    <p className="text-sm font-medium">{priceList.code}</p>
                                    <Badge variant={priceList.status ? "default" : "destructive"}>
                                        {priceList.status ? "Active" : "Inactive"}
                                    </Badge>
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
                                    <p className="text-sm text-muted-foreground">Name</p>
                                    <p className="text-sm font-medium">{priceList.name}</p>
                                </div>
                                <div className="space-y-1">
                                    <p className="text-sm text-muted-foreground">Description</p>
                                    <p className="text-sm font-medium">{priceList.description}</p>
                                </div>
                                <div className="space-y-1">
                                    <p className="text-sm text-muted-foreground">Start Date</p>
                                    <p className="text-sm font-medium">{priceList.start_date}</p>
                                </div>
                                <div className="space-y-1">
                                    <p className="text-sm text-muted-foreground">End Date</p>
                                    <p className="text-sm font-medium">{priceList.end_date}</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>
    )
} 