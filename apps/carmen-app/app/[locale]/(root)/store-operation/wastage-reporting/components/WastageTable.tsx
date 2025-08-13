import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Download, Filter, Plus, Search } from 'lucide-react'
import React from 'react'
import { mockWastageRecords } from '@/mock-data/store-operation'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from '@/components/ui/badge'

export default function WastageTable() {
    return (
        <Card>
            <CardHeader>
                <div className="flex-between space-y-4">
                    <CardTitle>Wastage Records</CardTitle>
                    <div className="flex gap-2">
                        <div className="relative">
                            <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-500" />
                            <Input className="pl-8" placeholder="Search records..." />
                        </div>
                        <Button variant="outline" className="flex items-center gap-2">
                            <Filter className="h-4 w-4" />
                            Filters
                        </Button>
                        <Button variant="outline" className="flex items-center gap-2">
                            <Download className="h-4 w-4" />
                            Export
                        </Button>
                        <Button className="flex items-center gap-2">
                            <Plus className="h-4 w-4" />
                            New Record
                        </Button>
                    </div>
                </div>
            </CardHeader>
            <CardContent>
                <div className="overflow-x-auto">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Date</TableHead>
                                <TableHead>Item Code</TableHead>
                                <TableHead>Item Name</TableHead>
                                <TableHead>Quantity</TableHead>
                                <TableHead>Unit Cost</TableHead>
                                <TableHead>Total Loss</TableHead>
                                <TableHead>Reason</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead>Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {mockWastageRecords.map((record) => (
                                <TableRow key={record.id}>
                                    <TableCell>{record.date}</TableCell>
                                    <TableCell className="font-medium">{record.itemCode}</TableCell>
                                    <TableCell>{record.itemName}</TableCell>
                                    <TableCell>{record.quantity}</TableCell>
                                    <TableCell>${record.unitCost.toFixed(2)}</TableCell>
                                    <TableCell>${record.totalLoss.toFixed(2)}</TableCell>
                                    <TableCell>{record.reason}</TableCell>
                                    <TableCell>
                                        <Badge
                                            className="text-xs px-2 py-1"
                                        >
                                            {record.status}
                                        </Badge>
                                    </TableCell>
                                    <TableCell>
                                        <Button variant="outline" size="sm">
                                            View Details
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>

                </div>
            </CardContent>
        </Card>
    )
}
