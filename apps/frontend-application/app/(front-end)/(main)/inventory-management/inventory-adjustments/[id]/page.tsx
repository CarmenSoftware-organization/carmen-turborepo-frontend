"use client";
import React, { useState } from 'react'
import { useParams } from 'next/navigation'
import { mockAdjustment, mockJournalEntries } from '../mock_data';
import { Card, CardHeader } from '@/components/ui/card';
import HeaderActions from './components/HeaderActions';
import HeaderInformation from './components/HeaderInformation';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Calculator, Edit, FileText, Package, Plus, Trash } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import StockMovementTable from './components/StockMovementTable';
import JournalHeader from './components/JournalHeader';
import JournalTable from './components/JournalTable';

// interface CustomLocation {
//     type: string;
//     code: string;
//     name: string;
// }

// interface StockMovementItem {
//     id: string;
//     productName: string;
//     sku: string;
//     location: CustomLocation;
//     lots: {
//         lotNo: string;
//         quantity: number;
//         uom: string;
//     }[];
//     uom: string;
//     unitCost: number;
//     totalCost: number;
// }

const InventoryAdjustmentsDetailPage = () => {
    const { id } = useParams() as { id: string }
    const [isEditMode, setIsEditMode] = useState(false)

    const handleHeaderUpdate = (field: string, value: string) => {
        console.log('Updating header field:', field, value, id)
    }

    return (
        <div className="flex flex-col gap-6">
            <Card>
                <CardHeader className="flex flex-col gap-6">
                    <HeaderActions
                        status={mockAdjustment.status}
                        isEditMode={isEditMode}
                        setIsEditMode={setIsEditMode}
                    />

                    <HeaderInformation
                        data={mockAdjustment}
                        isEditMode={isEditMode}
                        onUpdate={handleHeaderUpdate}
                    />

                    <Tabs defaultValue="stock" className="w-full">
                        <TabsList>
                            <TabsTrigger value="items" className="flex items-center gap-2">
                                <FileText className="h-4 w-4 mr-2" />
                                Items
                            </TabsTrigger>
                            <TabsTrigger value="stock" className="flex items-center gap-2">
                                <Package className="h-4 w-4" />
                                Stock Movement
                            </TabsTrigger>
                            <TabsTrigger value="journal" className="flex items-center gap-2">
                                <Calculator className="h-4 w-4" />
                                Journal Entries
                            </TabsTrigger>

                        </TabsList>

                        <TabsContent value="stock" className="mt-4">
                            <StockMovementTable
                                items={mockAdjustment.items.map(item => ({
                                    id: item.id,
                                    productName: item.productName,
                                    sku: item.sku,
                                    location: {
                                        type: "INV",
                                        code: item.locationCode,
                                        name: item.location
                                    },
                                    lots: item.lots.map(lot => ({
                                        lotNo: lot.lotNumber,
                                        quantity: lot.quantity,
                                        uom: lot.uom
                                    })),
                                    uom: item.uom,
                                    unitCost: item.unitCost,
                                    totalCost: item.totalCost
                                }))}
                            />
                        </TabsContent>

                        <TabsContent value="journal" className="mt-4">
                            <JournalHeader header={mockJournalEntries.header} />
                            <JournalTable entries={mockJournalEntries.entries} />
                        </TabsContent>

                        <TabsContent value="items" className="mt-4">
                            <div className="flex justify-between items-center mb-4">
                                <h3 className="text-lg font-medium">Items Details</h3>
                                <Button className="flex items-center gap-2">
                                    <Plus className="h-4 w-4" />
                                    Add Item
                                </Button>
                            </div>
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead className="w-[40px]">
                                            <Checkbox />
                                        </TableHead>
                                        <TableHead>Location</TableHead>
                                        <TableHead>Product</TableHead>
                                        <TableHead className="w-[80px]">Unit</TableHead>
                                        <TableHead className="text-right">On Hand</TableHead>
                                        <TableHead className="text-right">Adjustment</TableHead>
                                        <TableHead className="text-right">Closing</TableHead>
                                        <TableHead className="text-right">Total Price</TableHead>
                                        <TableHead className="text-center">Status</TableHead>
                                        <TableHead className="w-[100px]">Actions</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {mockAdjustment.items.map((item) => (
                                        <>
                                            <TableRow key={item.id} className="group">
                                                <TableCell>
                                                    <Checkbox />
                                                </TableCell>
                                                <TableCell>
                                                    <div className="font-medium">{item.location}</div>
                                                    <div className="text-sm text-muted-foreground">{item.locationCode}</div>
                                                </TableCell>
                                                <TableCell>
                                                    <div className="font-medium">
                                                        {item.productName}
                                                        <span className="ml-2 text-sm text-muted-foreground">
                                                            [{item.sku}]
                                                        </span>
                                                    </div>
                                                    <div className="text-sm text-muted-foreground">
                                                        {item.description || 'No description available'}
                                                    </div>
                                                </TableCell>
                                                <TableCell>{item.uom}</TableCell>
                                                <TableCell className="text-right">{item.onHand}</TableCell>
                                                <TableCell className="text-right">{item.approvedQuantity}</TableCell>
                                                <TableCell className="text-right">{item.issuedQuantity}</TableCell>
                                                <TableCell className="text-right">
                                                    {(item.price * item.requiredQuantity).toFixed(2)}
                                                </TableCell>
                                                <TableCell className="text-center">
                                                    <Badge>{item.status}</Badge>
                                                </TableCell>
                                                <TableCell>
                                                    <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                                        <Button variant="ghost" size="icon">
                                                            <Edit className="h-4 w-4" />
                                                        </Button>
                                                        <Button variant="ghost" size="icon">
                                                            <Trash className="h-4 w-4 text-red-500" />
                                                        </Button>
                                                    </div>
                                                </TableCell>
                                            </TableRow>
                                            <TableRow className="bg-muted/30">
                                                <TableCell colSpan={10} className="py-2">
                                                    <div className="flex gap-6 text-sm text-muted-foreground">
                                                        <span>On Order: {item.onOrder} {item.uom}</span>
                                                        <span>Last Price: {item.lastPrice?.toFixed(2)}</span>
                                                        <span>Last Vendor: {item.lastVendor || 'N/A'}</span>
                                                    </div>
                                                </TableCell>
                                            </TableRow>
                                        </>
                                    ))}
                                </TableBody>
                            </Table>
                        </TabsContent>
                    </Tabs>
                </CardHeader>
            </Card>
        </div>
    )
}

export default InventoryAdjustmentsDetailPage