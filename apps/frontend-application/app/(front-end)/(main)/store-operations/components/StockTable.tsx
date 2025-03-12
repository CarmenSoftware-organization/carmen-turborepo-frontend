"use client";

import React, { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Filter, Search } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Checkbox } from '@/components/ui/checkbox';
import { Item, stockData } from '../mock_data/stockData';

const StockTable = () => {
    const [items, setItems] = useState<Item[]>(stockData)

    return (
        <Card>
            <CardHeader>
                <div className="flex flex-col gap-4">
                    {/* First Row - Title and Create Button */}
                    <div className="flex-between">
                        <CardTitle>Inventory Status</CardTitle>
                        <Button>Create Requisition</Button>
                    </div>
                    {/* Second Row - Search and Filters with justify-between */}
                    <div className="flex-between">
                        <div className="relative w-1/2">
                            <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-500" />
                            <Input className="pl-8 w-full" placeholder="Search items..." />
                        </div>
                        <div className="flex gap-2">
                            <Button variant="outline" className="flex items-center gap-2">
                                <Filter className="h-4 w-4" />
                                Filters
                            </Button>
                        </div>
                    </div>
                </div>
            </CardHeader>
            <CardContent>
                <div className="overflow-x-auto">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>
                                    <Checkbox
                                        onCheckedChange={(checked) => {
                                            setItems(
                                                items.map(item => ({
                                                    ...item,
                                                    selected: !!checked,
                                                }))
                                            );
                                        }}
                                    />
                                </TableHead>
                                <TableHead>Location</TableHead>
                                <TableHead>Product</TableHead>
                                <TableHead className="text-right">Current Stock</TableHead>
                                <TableHead className="text-right">PAR Level</TableHead>
                                <TableHead className="text-right">Reorder Point</TableHead>
                                <TableHead className="text-right">On Order</TableHead>
                                <TableHead className="text-right">Order Amount</TableHead>
                                <TableHead>Order Unit</TableHead>
                                <TableHead>Status</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {items.map(item => {
                                const suggestedOrder = Math.max(0, item.parLevel - (item.currentStock + item.onOrder));

                                return (
                                    <TableRow key={item.id}>
                                        <TableCell>
                                            <Checkbox
                                                checked={item.selected}
                                                onCheckedChange={(checked) => {
                                                    setItems(
                                                        items.map((i) =>
                                                            i.id === item.id
                                                                ? { ...i, selected: checked === true }
                                                                : i
                                                        )
                                                    );
                                                }}
                                            />

                                        </TableCell>
                                        <TableCell>
                                            <div className="space-y-1">
                                                <div className="font-medium text-gray-900">{item.location}</div>
                                                <div className="text-sm text-gray-500">{item.locationCode}</div>
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <div className="space-y-1">
                                                <div className="flex items-center gap-2">
                                                    <div className="font-medium text-gray-900">{item.name}</div>
                                                    <div className="text-sm text-gray-500">({item.sku})</div>
                                                </div>
                                                <div className="text-sm text-gray-500">{item.description}</div>
                                            </div>
                                        </TableCell>
                                        <TableCell className="text-right">
                                            <span
                                                className={`${item.currentStock < item.reorderPoint
                                                    ? "text-red-500 font-medium"
                                                    : ""
                                                    }`}
                                            >
                                                {item.currentStock}
                                            </span>
                                        </TableCell>
                                        <TableCell className="text-right">{item.parLevel}</TableCell>
                                        <TableCell className="text-right">{item.reorderPoint}</TableCell>
                                        <TableCell className="text-right">
                                            <span className="text-gray-500">{item.onOrder}</span>
                                        </TableCell>
                                        <TableCell className="text-right">
                                            <Input
                                                type="number"
                                                value={item.orderAmount || suggestedOrder}
                                                className="w-20 text-right"
                                                onChange={(e) => {
                                                    const value = parseInt(e.target.value, 10);
                                                    setItems(
                                                        items.map(i =>
                                                            i.id === item.id ? { ...i, orderAmount: value } : i
                                                        )
                                                    );
                                                }}
                                            />
                                        </TableCell>
                                        <TableCell>
                                            <Select
                                                defaultValue={item.unit}
                                                onValueChange={(value) => {
                                                    setItems(
                                                        items.map(i =>
                                                            i.id === item.id ? { ...i, unit: value } : i
                                                        )
                                                    );
                                                }}
                                            >
                                                <SelectTrigger className="w-[100px]">
                                                    <SelectValue placeholder="Select unit" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="Box">Box</SelectItem>
                                                    <SelectItem value="Bag">Bag</SelectItem>
                                                    <SelectItem value="Pack">Pack</SelectItem>
                                                    <SelectItem value="Piece">Piece</SelectItem>
                                                    <SelectItem value="Kg">Kg</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </TableCell>
                                        <TableCell>
                                            <span
                                                className={`px-2 py-1 text-xs rounded-full ${item.status === "low"
                                                    ? "bg-red-100 text-red-700"
                                                    : "bg-green-100 text-green-700"
                                                    }`}
                                            >
                                                {item.status.toUpperCase()}
                                            </span>
                                        </TableCell>
                                    </TableRow>
                                );
                            })}
                        </TableBody>
                    </Table>
                </div>
            </CardContent>
        </Card>
    )
}

export default StockTable