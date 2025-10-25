import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { StockLocationDto } from "@/dtos/product.dto";

interface StockInventLocationProps {
    readonly locations: StockLocationDto[];
}

export default function StockInventLocation({ locations }: StockInventLocationProps) {
    return (
        <div className="space-y-4">
            {/* Mobile Card View */}
            <div className="grid gap-4 md:hidden">
                {locations.map((location) => (
                    <Card key={location.code} className="w-full">
                        <CardHeader>
                            <CardTitle className="text-lg">{location.name}</CardTitle>
                            <p className="text-sm text-muted-foreground">Code: {location.code}</p>
                        </CardHeader>
                        <CardContent className="grid grid-cols-2 gap-4">
                            <div>
                                <p className="text-sm text-muted-foreground">Type</p>
                                <p className="font-medium">{location.type}</p>
                            </div>
                            <div>
                                <p className="text-sm text-muted-foreground">On Hand</p>
                                <p className="font-medium">{location.onHand.toLocaleString()}</p>
                            </div>
                            <div>
                                <p className="text-sm text-muted-foreground">On Order</p>
                                <p className="font-medium">{location.onOrder.toLocaleString()}</p>
                            </div>
                            <div>
                                <p className="text-sm text-muted-foreground">Minimum</p>
                                <p className="font-medium">{location.minimum.toLocaleString()}</p>
                            </div>
                            <div>
                                <p className="text-sm text-muted-foreground">Maximum</p>
                                <p className="font-medium">{location.maximum.toLocaleString()}</p>
                            </div>
                            <div>
                                <p className="text-sm text-muted-foreground">Reorder Point</p>
                                <p className="font-medium">{location.reorderPoint.toLocaleString()}</p>
                            </div>
                            <div>
                                <p className="text-sm text-muted-foreground">Par Level</p>
                                <p className="font-medium">{location.parLevel.toLocaleString()}</p>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>

            {/* Desktop Table View */}
            <Card className="hidden md:block p-4">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Code</TableHead>
                            <TableHead>Name</TableHead>
                            <TableHead>Type</TableHead>
                            <TableHead>On Hand</TableHead>
                            <TableHead>On Order</TableHead>
                            <TableHead>Minimum</TableHead>
                            <TableHead>Maximum</TableHead>
                            <TableHead>Reorder Point</TableHead>
                            <TableHead>Par Level</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {locations.map((location) => (
                            <TableRow key={location.code}>
                                <TableCell>{location.code}</TableCell>
                                <TableCell>{location.name}</TableCell>
                                <TableCell>{location.type}</TableCell>
                                <TableCell>{location.onHand.toLocaleString()}</TableCell>
                                <TableCell>{location.onOrder.toLocaleString()}</TableCell>
                                <TableCell>{location.minimum.toLocaleString()}</TableCell>
                                <TableCell>{location.maximum.toLocaleString()}</TableCell>
                                <TableCell>{location.reorderPoint.toLocaleString()}</TableCell>
                                <TableCell>{location.parLevel.toLocaleString()}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </Card>
        </div>
    );
}
