"use client";

import React, { useMemo, useState } from 'react'
import * as m from '@/paraglide/messages.js';
import { Button } from '@/components/ui/button';
import { EyeIcon, FileDown, PenIcon, PlusIcon, Printer, SearchIcon, TrashIcon } from 'lucide-react';
import { mockAdjustments } from '../mock_data';
import { Input } from '@/components/ui/input';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { Badge } from '@/components/ui/badge';
import { Link } from '@/lib/i18n';
import FilterSortOptions from './FilterSortOptions';
import DataDisplayTemplate from '@/components/templates/DataDisplayTemplate';

// enum InventoryAdjustmentFields {
//     Adjustment = 'adjustment',
//     Date = 'date',
//     Type = 'type',
//     Location = 'location',
//     Reason = 'reason',
//     Items = 'items',
//     TotalValue = 'totalValue',
//     Status = 'status'
// }

const InventoryAdjustmentsList = () => {
    const [searchQuery, setSearchQuery] = useState("")
    const [activeFilters, setActiveFilters] = useState<string[]>([])
    const [sortConfig, setSortConfig] = useState({ field: "date", order: "desc" })


    const filteredAndSortedData = useMemo(() => {
        let filtered = mockAdjustments

        // Apply search
        if (searchQuery) {
            filtered = filtered.filter(item =>
                Object.values(item).some(value =>
                    value.toString().toLowerCase().includes(searchQuery.toLowerCase())
                )
            )
        }

        // Apply filters
        if (activeFilters.length > 0) {
            filtered = filtered.filter(item =>
                activeFilters.some(filter =>
                    item.status === filter ||
                    item.type === filter ||
                    item.location === filter
                )
            )
        }

        // Apply sorting
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        return [...filtered].sort((a: any, b: any) => {
            const aValue = a[sortConfig.field]
            const bValue = b[sortConfig.field]

            if (typeof aValue === 'string') {
                return sortConfig.order === 'asc'
                    ? aValue.localeCompare(bValue)
                    : bValue.localeCompare(aValue)
            }

            return sortConfig.order === 'asc'
                ? aValue - bValue
                : bValue - aValue
        })
    }, [mockAdjustments, searchQuery, activeFilters, sortConfig])

    const title = 'Inventory Adjustments';

    const actionButtons = (
        <div className="action-btn-container">
            <Button variant="outline" size="sm" aria-label={m.add_text()}>
                <PlusIcon />
                {m.add_text()}
            </Button>
            <Button variant="outline" size="sm" aria-label={m.export_text()}>
                <FileDown className="h-4 w-4" />
                {m.export_text()}
            </Button>
            <Button variant="outline" size="sm" aria-label={m.print_text()}>
                <Printer className="h-4 w-4" />
                {m.print_text()}
            </Button>
        </div>
    );

    const filter = (
        <div className="filter-container">
            <div className="relative flex-1">
                <SearchIcon className="absolute left-2 top-2.5 h-3 w-4 text-muted-foreground" />
                <Input
                    placeholder="Search adjustments..."
                    className="pl-8 h-8"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                />
            </div>
            <div className="all-center gap-2">
                <FilterSortOptions
                    onFilterChange={setActiveFilters}
                    onSortChange={setSortConfig}
                />
                {/* <SortDropDown
                    fieldConfigs={sortFields}
                    items={departments}
                    onSort={setDepartments}
                /> */}
            </div>
        </div>
    );

    const content = (
        <Table>
            <TableHeader>
                <TableRow>
                    <TableHead>Adjustment #</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead className='text-center'>Type</TableHead>
                    <TableHead>Location</TableHead>
                    <TableHead>Reason</TableHead>
                    <TableHead>Items</TableHead>
                    <TableHead className="text-right">Total Value</TableHead>
                    <TableHead className='text-center'>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody className='text-xs'>
                {filteredAndSortedData.map((adjustment) => (
                    <TableRow key={adjustment.id}>
                        <TableCell className="font-medium">
                            {adjustment.id}
                        </TableCell>
                        <TableCell>{adjustment.date}</TableCell>
                        <TableCell className='text-center'>
                            <Badge>{adjustment.type}</Badge>
                        </TableCell>
                        <TableCell>{adjustment.location}</TableCell>
                        <TableCell>{adjustment.reason}</TableCell>
                        <TableCell>{adjustment.items}</TableCell>
                        <TableCell className="text-right">
                            {adjustment.totalValue.toLocaleString('en-US', {
                                style: 'currency',
                                currency: 'USD'
                            })}
                        </TableCell>
                        <TableCell className='text-center'>
                            <Badge>{adjustment.status}</Badge>
                        </TableCell>
                        <TableCell className='flex justify-end'>
                            <Button variant={'ghost'} size={'sm'} asChild>
                                <Link href={`/inventory-management/inventory-adjustments/${adjustment.id}`}>
                                    <EyeIcon />
                                </Link>
                            </Button>
                            <Button variant={'ghost'} size={'sm'}>
                                <PenIcon />
                            </Button>
                            <Button variant={'ghost'} size={'sm'}>
                                <TrashIcon />
                            </Button>
                        </TableCell>
                    </TableRow>
                ))}
            </TableBody>
        </Table>
    )

    return (
        <DataDisplayTemplate
            title={title}
            actionButtons={actionButtons}
            filters={filter}
            content={content}
        />
    )
}

export default InventoryAdjustmentsList