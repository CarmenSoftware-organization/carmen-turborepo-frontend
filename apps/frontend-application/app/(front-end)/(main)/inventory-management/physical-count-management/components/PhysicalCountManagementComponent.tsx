'use client';

import { Button } from '@/components/ui/button'
import { Building, Grid, List, Plus, X } from 'lucide-react'
import React, { useState } from 'react'
import NewCountForm from './NewCountForm';
import { countData, CountData, departments, NewCountData, storeLocations } from '../types_data';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import CountListItem from './CountListItem';
import CountDetailCard from './CountDetailCard';
import CountDetailForm from './CountDetailForm';

const PhysicalCountManagementComponent = () => {
    const [view, setView] = useState<'list' | 'grid'>('list')
    const [statusFilter, setStatusFilter] = useState('all')
    const [locationFilter, setLocationFilter] = useState('all')
    const [departmentFilter, setDepartmentFilter] = useState('all')
    const [showLocationFilter, setShowLocationFilter] = useState(false)
    const [showNewCountForm, setShowNewCountForm] = useState(false)
    const [showCountDetailForm, setShowCountDetailForm] = useState(false)
    const [counts, setCounts] = useState(countData)

    const handleNewCount = (data: NewCountData) => {
        const newCount: CountData = {
            storeName: data.storeName,
            department: data.department,
            userName: data.counter,
            date: data.date,
            status: 'pending' as const,
            itemCount: 0,
            lastCountDate: '-',
            variance: 0,
            notes: data.notes || '',
            completedCount: 0
        }
        setCounts([newCount, ...counts])
        setShowNewCountForm(false)
    }

    const filteredData = counts.filter(item =>
        (statusFilter === 'all' || item.status === statusFilter) &&
        (locationFilter === 'all' || item.storeName === locationFilter) &&
        (departmentFilter === 'all' || item.department === departmentFilter)
    )

    const handleDeleteCount = (index: number) => {
        setCounts(prevCounts => prevCounts.filter((_, i) => i !== index))
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const handleCountDetailSubmit = (data: any) => {
        console.log('Count details submitted:', data)
        setShowCountDetailForm(false)
    }

    return (
        <div className='p-6'>
            <div className="container mx-auto max-w-7xl p-4 sm:p-6">
                <div className="mb-6 sm:mb-8">
                    <h1 className="text-2xl sm:text-3xl font-bold mb-2">Physical Count Management</h1>
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                        <p className="text-muted-foreground mb-4 sm:mb-0">Manage and track inventory counts across locations</p>
                        <Button onClick={() => setShowNewCountForm(true)}>
                            <Plus className="mr-2 h-4 w-4" />
                            New Count
                        </Button>
                    </div>
                </div>
                {showNewCountForm && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 all-center z-50">
                        <NewCountForm
                            onClose={() => setShowNewCountForm(false)}
                            onSubmit={handleNewCount}
                        />
                    </div>
                )}

                {showCountDetailForm && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 all-center z-50">
                        <CountDetailForm
                            onClose={() => setShowCountDetailForm(false)}
                            onSubmit={handleCountDetailSubmit}
                        />
                    </div>
                )}

                <Card className="mb-8">
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-[1fr,auto,auto,auto] gap-4 items-center p-4">
                        <div className="relative w-full sm:w-64">
                            <Input className="pl-3" placeholder="Search counts..." />
                        </div>
                        <Select value={statusFilter} onValueChange={setStatusFilter}>
                            <SelectTrigger className="w-full">
                                <SelectValue placeholder="All Statuses" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">All Statuses</SelectItem>
                                <SelectItem value="pending">Pending</SelectItem>
                                <SelectItem value="in-progress">In Progress</SelectItem>
                                <SelectItem value="completed">Completed</SelectItem>
                            </SelectContent>
                        </Select>
                        <Select value={departmentFilter} onValueChange={setDepartmentFilter}>
                            <SelectTrigger className="w-full">
                                <SelectValue placeholder="All Departments" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">All Departments</SelectItem>
                                {departments.map(dept => (
                                    <SelectItem key={dept.id} value={dept.name}>{dept.name}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                        <div className="flex space-x-2 justify-end sm:justify-start">
                            <Button
                                variant={showLocationFilter ? 'default' : 'outline'}
                                size="icon"
                                onClick={() => setShowLocationFilter(!showLocationFilter)}
                            >
                                <Building className="h-4 w-4" />
                            </Button>
                            <Button
                                variant={view === 'list' ? 'default' : 'outline'}
                                size="icon"
                                onClick={() => setView('list')}
                            >
                                <List className="h-4 w-4" />
                            </Button>
                            <Button
                                variant={view === 'grid' ? 'default' : 'outline'}
                                size="icon"
                                onClick={() => setView('grid')}
                            >
                                <Grid className="h-4 w-4" />
                            </Button>
                        </div>
                    </div>
                    {showLocationFilter && (
                        <div className="border-t p-4">
                            <Select value={locationFilter} onValueChange={setLocationFilter}>
                                <SelectTrigger className="w-full">
                                    <SelectValue placeholder="All Locations" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">All Locations</SelectItem>
                                    {storeLocations.map(location => (
                                        <SelectItem key={location.id} value={location.name}>{location.name}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            {locationFilter !== 'all' && (
                                <div className="mt-2 flex items-center">
                                    <span className="text-sm font-medium mr-2">Filtered by:</span>
                                    <Button
                                        variant="secondary"
                                        size="sm"
                                        onClick={() => setLocationFilter('all')}
                                    >
                                        {locationFilter}
                                        <X className="ml-2 h-4 w-4" />
                                    </Button>
                                </div>
                            )}
                        </div>
                    )}
                </Card>
                {view === 'list' ? (
                    <div className="space-y-4">
                        {filteredData.map((item, index) => (
                            <CountListItem
                                key={index}
                                {...item}
                                onStartCount={() => setShowCountDetailForm(true)}
                                onDelete={() => handleDeleteCount(index)}
                            />
                        ))}
                    </div>
                ) : (
                    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                        {filteredData.map((item, index) => (
                            <CountDetailCard
                                key={index}
                                {...item}
                                onStartCount={() => setShowCountDetailForm(true)}
                                onDelete={() => handleDeleteCount(index)}
                            />
                        ))}
                    </div>
                )}

            </div>
        </div>
    )
}

export default PhysicalCountManagementComponent