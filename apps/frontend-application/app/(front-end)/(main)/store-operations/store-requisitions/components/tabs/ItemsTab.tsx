import { Button } from '@/components/ui/button'
import { AlertCircle, Check, Edit2, Plus, Split, Trash2, XCircle } from 'lucide-react'
import React, { useState } from 'react'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import ApprovalLogDialog from '../ApprovalLogDialog';
import { mockApprovalLogs } from '../../data';
import { Badge } from '@/components/ui/badge';

interface ItemsTabProps {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    items: any[]
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    setItems: React.Dispatch<React.SetStateAction<any[]>>
    isEditMode: boolean
}

const ItemsTab: React.FC<ItemsTabProps> = ({
    items,
    setItems,
    isEditMode
}) => {

    const [selectedItems, setSelectedItems] = useState<number[]>([])

    const handleBulkAction = (action: 'Accept' | 'Reject' | 'Review' | 'Delete' | 'Split') => {
        if (!selectedItems.length) return

        switch (action) {
            case 'Accept':
            case 'Reject':
            case 'Review':
                setItems(items.map(item =>
                    selectedItems.includes(item.id)
                        ? { ...item, approvalStatus: action }
                        : item
                ))
                break
            case 'Delete':
                setItems(items.filter(item => !selectedItems.includes(item.id)))
                break
            case 'Split':
                console.log('Splitting items:', selectedItems)
                break
        }
        setSelectedItems([]) // Clear selection after action
    }

    const handleSelectAll = (checked: boolean) => {
        if (checked) {
            setSelectedItems(items.map(item => item.id))
        } else {
            setSelectedItems([])
        }
    }

    const handleQuantityUpdate = (itemId: number, field: 'qtyRequired' | 'qtyApproved' | 'qtyIssued', value: number) => {
        setItems(items.map(item =>
            item.id === itemId
                ? { ...item, [field]: value }
                : item
        ))
    }

    const handleSelectItem = (itemId: number, checked: boolean) => {
        if (checked) {
            setSelectedItems([...selectedItems, itemId])
        } else {
            setSelectedItems(selectedItems.filter(id => id !== itemId))
        }
    }


    return (
        <div className="space-y-4">
            <div className="flex justify-between items-center">
                <h3 className="font-semibold">Items Details</h3>
                <Button
                    className="flex items-center"
                    size={'sm'}
                    variant={'outline'}
                    onClick={() => console.log('Add new item')}
                >
                    <Plus className="h-4 w-4" />
                    Add Item
                </Button>
            </div>

            {selectedItems.length > 0 && (
                <div className="flex gap-2">
                    <Button
                        className="bg-green-100 text-green-700 hover:bg-green-200 flex items-center gap-2"
                        onClick={() => handleBulkAction('Accept')}
                        size={'sm'}
                    >
                        <Check className="h-4 w-4" />
                        Accept Selected ({selectedItems.length})
                    </Button>
                    <Button
                        className="bg-red-100 text-red-700 hover:bg-red-200 flex items-center gap-2"
                        onClick={() => handleBulkAction('Reject')}
                        size={'sm'}
                    >
                        <XCircle className="h-4 w-4" />
                        Reject Selected ({selectedItems.length})
                    </Button>
                    <Button
                        className="bg-yellow-100 text-yellow-700 hover:bg-yellow-200 flex items-center gap-2"
                        onClick={() => handleBulkAction('Review')}
                        size={'sm'}
                    >
                        <AlertCircle className="h-4 w-4" />
                        Review Selected ({selectedItems.length})
                    </Button>
                    <Button
                        className="bg-blue-100 text-blue-700 hover:bg-blue-200 flex items-center gap-2"
                        onClick={() => handleBulkAction('Split')}
                        size={'sm'}
                    >
                        <Split className="h-4 w-4" />
                        Split Selected ({selectedItems.length})
                    </Button>
                </div>
            )}
            <Table className="w-full">
                <TableHeader>
                    <TableRow className="border-b bg-gray-50">
                        <TableHead className="text-left p-4 text-xs font-medium text-gray-500">
                            <Checkbox
                                id="select-all"
                                checked={selectedItems.length === items.length}
                                onCheckedChange={handleSelectAll}
                            />
                        </TableHead>
                        <TableHead className="text-left p-4 text-xs font-medium text-gray-500">
                            Location
                        </TableHead>
                        <TableHead className="text-left p-4 text-xs font-medium text-gray-500">
                            Product
                        </TableHead>
                        <TableHead className="text-left p-4 text-xs font-medium text-gray-500">
                            Unit
                        </TableHead>
                        <TableHead className="text-right p-4 text-xs font-medium text-gray-500">
                            Required
                        </TableHead>
                        <TableHead className="text-right p-4 text-xs font-medium text-gray-500">
                            Approved
                        </TableHead>
                        <TableHead className="text-right p-4 text-xs font-medium text-gray-500">
                            Issued
                        </TableHead>
                        <TableHead className="text-right p-4 text-xs font-medium text-gray-500">
                            Total
                        </TableHead>
                        <TableHead className="text-center p-4 text-xs font-medium text-gray-500">
                            Status
                        </TableHead>
                        <TableHead className="text-right p-4 text-xs font-medium text-gray-500 w-[100px]">
                            Actions
                        </TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {items.map((item) => (
                        <>
                            <TableRow
                                key={item.id}
                                className="group hover:bg-gray-50"
                            >
                                <TableCell className="p-4">
                                    <Checkbox
                                        id={`select-${item.id}`}
                                        checked={selectedItems.includes(item.id)}
                                        onCheckedChange={(checked) => handleSelectItem(item.id, Boolean(checked))}
                                    />
                                </TableCell>
                                <TableCell className="p-4">
                                    <div className="space-y-1">
                                        <p className="font-medium text-xs">
                                            {item.itemInfo.location}
                                        </p>
                                        <div className="flex flex-col gap-0.5">
                                            <p className="text-xs text-gray-500">
                                                {item.itemInfo.locationCode} •{" "}
                                                {item.itemInfo.locationType === "inventory"
                                                    ? "Inventory"
                                                    : "Direct"}
                                            </p>
                                        </div>
                                    </div>
                                </TableCell>
                                <TableCell className="p-4">
                                    <div className="space-y-1">
                                        <p className="font-medium text-gray-600">
                                            {item.itemInfo.itemName}
                                        </p>
                                        <p className="text-xs text-gray-500">{item.description}</p>
                                    </div>
                                </TableCell>
                                <TableCell className="p-4">
                                    <p className="text-xs">{item.unit}</p>
                                </TableCell>
                                <TableCell className="p-4 text-right text-xs">
                                    {isEditMode ? (
                                        <Input
                                            type="number"
                                            value={item.qtyRequired}
                                            onChange={(e) =>
                                                handleQuantityUpdate(
                                                    item.id,
                                                    "qtyRequired",
                                                    parseInt(e.target.value)
                                                )
                                            }
                                            className="w-20 h-8 text-right"
                                        />
                                    ) : (
                                        <p>{item.qtyRequired}</p>
                                    )}
                                </TableCell>
                                <TableCell className="p-4 text-right text-xs">
                                    {isEditMode ? (
                                        <Input
                                            type="number"
                                            value={item.qtyApproved}
                                            onChange={(e) =>
                                                handleQuantityUpdate(
                                                    item.id,
                                                    "qtyApproved",
                                                    parseInt(e.target.value)
                                                )
                                            }
                                            className="w-20 h-8 text-right"
                                        />
                                    ) : (
                                        <p>{item.qtyApproved}</p>
                                    )}
                                </TableCell>
                                <TableCell className="p-4 text-right text-xs">
                                    {isEditMode ? (
                                        <Input
                                            type="number"
                                            value={item.qtyIssued || 0}
                                            onChange={(e) =>
                                                handleQuantityUpdate(
                                                    item.id,
                                                    "qtyIssued",
                                                    parseInt(e.target.value)
                                                )
                                            }
                                            className="w-20 h-8 text-right"
                                        />
                                    ) : (
                                        <p>{item.qtyIssued || 0}</p>
                                    )}
                                </TableCell>
                                <TableCell className="p-4 text-right font-mono text-xs">
                                    {new Intl.NumberFormat('en-US', {
                                        minimumFractionDigits: 2,
                                        maximumFractionDigits: 2
                                    }).format(item.total)}
                                </TableCell>
                                <TableCell className="p-4 text-center">
                                    <ApprovalLogDialog
                                        itemId={item.id}
                                        itemName={item.itemInfo.itemName}
                                        logs={mockApprovalLogs[item.id] || []}
                                    >
                                        <div className="cursor-pointer">
                                            <Badge>{item.approvalStatus}</Badge>
                                        </div>
                                    </ApprovalLogDialog>
                                </TableCell>
                                <TableCell className="p-4">
                                    <div className="flex justify-end">
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            onClick={() => console.log("Edit item", item.id)}
                                        >
                                            <Edit2 />
                                        </Button>
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            onClick={() => {
                                                setItems(items.filter((i) => i.id !== item.id));
                                            }}
                                        >
                                            <Trash2 />
                                        </Button>
                                    </div>
                                </TableCell>
                            </TableRow>
                            {/* Secondary Information Row */}
                            <TableRow className="bg-gray-50 border-b">
                                <TableCell colSpan={9} className="px-4 py-2">
                                    <div className="flex items-center gap-6 text-xs">
                                        <div className="flex items-center gap-1">
                                            <span className="text-gray-400">On Hand:</span>
                                            <span className="text-gray-600">
                                                {item.inventory.onHand}
                                            </span>
                                        </div>
                                        <div className="flex items-center gap-1">
                                            <span className="text-gray-400">On Order:</span>
                                            <span className="text-gray-600">
                                                {item.inventory.onOrder}
                                            </span>
                                        </div>
                                        <div className="flex items-center gap-1">
                                            <span className="text-gray-400">Last Price:</span>
                                            <span className="text-gray-600">
                                                {item.inventory.lastPrice.toFixed(2)}
                                            </span>
                                        </div>
                                        <div className="flex items-center gap-1">
                                            <span className="text-gray-400">Last Vendor:</span>
                                            <span className="text-gray-600 truncate max-w-[300px]">
                                                {item.inventory.lastVendor}
                                            </span>
                                        </div>
                                    </div>
                                </TableCell>
                            </TableRow>
                        </>
                    ))}
                </TableBody>
            </Table>
        </div>
    )
}

export default ItemsTab