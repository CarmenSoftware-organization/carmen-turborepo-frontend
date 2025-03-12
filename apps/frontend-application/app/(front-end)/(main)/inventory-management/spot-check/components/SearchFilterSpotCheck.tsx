import React from 'react';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Building, Grid, List, X } from 'lucide-react';
import { departments, storeLocations } from '../../physical-count-management/types_data';

interface Props {
    statusFilter: string;
    setStatusFilter: (value: string) => void;
    locationFilter: string;
    setLocationFilter: (value: string) => void;
    departmentFilter: string;
    setDepartmentFilter: (value: string) => void;
    showLocationFilter: boolean;
    setShowLocationFilter: (value: boolean) => void;
    view: 'list' | 'grid';
    setView: (value: 'list' | 'grid') => void;
}

const SearchFilterSpotCheck: React.FC<Props> = ({
    statusFilter,
    setStatusFilter,
    locationFilter,
    setLocationFilter,
    departmentFilter,
    setDepartmentFilter,
    showLocationFilter,
    setShowLocationFilter,
    view,
    setView,
}) => {
    return (
        <div className="mb-8">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-[1fr,auto,auto,auto] gap-4 items-center p-4">
                <div className="relative w-full sm:w-64">
                    <Input className="pl-3" placeholder="Search spot checks..." />
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
                        {departments.map((dept) => (
                            <SelectItem key={dept.id} value={dept.name}>
                                {dept.name}
                            </SelectItem>
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
                            {storeLocations.map((location) => (
                                <SelectItem key={location.id} value={location.name}>
                                    {location.name}
                                </SelectItem>
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
        </div>
    );
};

export default SearchFilterSpotCheck;
