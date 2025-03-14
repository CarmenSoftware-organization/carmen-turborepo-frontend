import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Card, CardContent } from '@/components/ui/card';
import { BusinessUnitTableDto } from '@/dto/bu.dto';
import { Trash, Pencil } from 'lucide-react';
import React from 'react'

interface BuListProps {
    businessUnits: BusinessUnitTableDto[];
}
const BuList = ({ businessUnits }: BuListProps) => {
    return (
        <>
            {/* Desktop view - visible on md screens and above */}
            <div className="hidden md:block overflow-x-auto">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Name</TableHead>
                            <TableHead>Cluster</TableHead>
                            <TableHead>Brand</TableHead>
                            <TableHead>Location</TableHead>
                            <TableHead>Rooms</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead>Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {businessUnits.map((businessUnit) => (
                            <TableRow key={businessUnit.id}>
                                <TableCell>{businessUnit.name}</TableCell>
                                <TableCell>{businessUnit.cluster}</TableCell>
                                <TableCell>{businessUnit.brand}</TableCell>
                                <TableCell>{businessUnit.location}</TableCell>
                                <TableCell>{businessUnit.rooms}</TableCell>
                                <TableCell>{businessUnit.status}</TableCell>
                                <TableCell className='flex gap-2'>
                                    <Button variant='outline' size="sm">
                                        <Pencil className="h-4 w-4" />
                                    </Button>
                                    <Button variant='destructive' size="sm">
                                        <Trash className="h-4 w-4" />
                                    </Button>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>

            {/* Mobile view - visible only on small screens (below md breakpoint) */}
            <div className="grid grid-cols-1 gap-4 md:hidden">
                {businessUnits.map((businessUnit) => (
                    <Card key={businessUnit.id} className="overflow-hidden">
                        <CardContent className="p-4">
                            <div className="space-y-3">
                                <div className="font-medium text-lg">{businessUnit.name}</div>

                                <div className="grid grid-cols-2 gap-2 text-sm">
                                    <div className="text-muted-foreground">Cluster</div>
                                    <div>{businessUnit.cluster}</div>

                                    <div className="text-muted-foreground">Brand</div>
                                    <div>{businessUnit.brand}</div>

                                    <div className="text-muted-foreground">Location</div>
                                    <div>{businessUnit.location}</div>

                                    <div className="text-muted-foreground">Rooms</div>
                                    <div>{businessUnit.rooms}</div>

                                    <div className="text-muted-foreground">Status</div>
                                    <div>{businessUnit.status}</div>
                                </div>

                                <div className="flex gap-2 pt-2">
                                    <Button variant='outline' size="sm" className="flex-1">
                                        <Pencil className="h-4 w-4 mr-2" />
                                        Edit
                                    </Button>
                                    <Button variant='destructive' size="sm" className="flex-1">
                                        <Trash className="h-4 w-4 mr-2" />
                                        Delete
                                    </Button>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </>
    )
}

export default BuList