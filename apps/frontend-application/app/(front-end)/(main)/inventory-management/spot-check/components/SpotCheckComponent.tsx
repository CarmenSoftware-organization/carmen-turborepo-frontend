'use client';

import React, { useState } from 'react';
import { useRouter } from '@/lib/i18n';
import SearchFilterSpotCheck from './SearchFilterSpotCheck';
import CountDetailForm from './CountDetailForm';
import { spotCheckData, SpotCheckDetails } from '../types_data';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import CountListItem from './CountListItem';
import CountDetailCard from './CountDetailCard';

const SpotCheckComponent = () => {
    const router = useRouter();
    const [view, setView] = useState<'list' | 'grid'>('list');
    const [statusFilter, setStatusFilter] = useState('all');
    const [locationFilter, setLocationFilter] = useState('all');
    const [departmentFilter, setDepartmentFilter] = useState('all');
    const [showLocationFilter, setShowLocationFilter] = useState(false);
    const [showCountDetailForm, setShowCountDetailForm] = useState(false);
    const [counts, setCounts] = useState(spotCheckData);
    const [currentDetails, setCurrentDetails] = useState<SpotCheckDetails | null>(null);

    const filteredData = counts.filter(
        (item) =>
            (statusFilter === 'all' || item.status === statusFilter) &&
            (locationFilter === 'all' || item.storeName === locationFilter) &&
            (departmentFilter === 'all' || item.department === departmentFilter)
    );

    const handleNewSpotCheck = () => {
        router.push('/inventory-management/spot-check/new');
    };

    const handleCountDetailSubmit = () => {
        if (currentDetails) {
            console.log('Count details submitted:', currentDetails);
        }
        setShowCountDetailForm(false);
    };

    const handleDeleteCount = (index: number) => {
        setCounts(prevCounts => prevCounts.filter((_, i) => i !== index))
    }


    return (
        <div className="min-h-screen">
            <div className="container mx-auto max-w-7xl p-4 sm:p-6">
                <div className="mb-6 sm:mb-8">
                    <div className="flex items-center justify-between mb-2">
                        <h1 className="text-2xl sm:text-3xl font-bold">Spot Check</h1>
                        <Button onClick={handleNewSpotCheck} className="gap-2">
                            <Plus className="h-4 w-4" />
                            New Spot Check
                        </Button>
                    </div>
                    <p className="text-muted-foreground">Random inventory spot checks for accuracy verification</p>
                </div>
                {showCountDetailForm && currentDetails && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 all-center z-50">
                        <CountDetailForm
                            items={[]}
                            locationName={currentDetails.store}
                            userName={currentDetails.counter}
                            date={currentDetails.date}
                            reference={currentDetails.countId}
                            onClose={() => setShowCountDetailForm(false)}
                            onSubmit={handleCountDetailSubmit}
                        />
                    </div>
                )}
                <SearchFilterSpotCheck
                    statusFilter={statusFilter}
                    setStatusFilter={setStatusFilter}
                    locationFilter={locationFilter}
                    setLocationFilter={setLocationFilter}
                    departmentFilter={departmentFilter}
                    setDepartmentFilter={setDepartmentFilter}
                    showLocationFilter={showLocationFilter}
                    setShowLocationFilter={setShowLocationFilter}
                    view={view}
                    setView={setView}
                />
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
                        {filteredData.map((item, index) => {
                            const details: SpotCheckDetails = {
                                countId: `SC-${index}`,
                                counter: item.userName,
                                department: item.department,
                                store: item.storeName,
                                date: item.date,
                                selectedItems: []
                            }
                            return (
                                <CountDetailCard
                                    key={index}
                                    countDetails={details}
                                    onStartCount={() => {
                                        setCurrentDetails(details)
                                        setShowCountDetailForm(true)
                                    }}
                                    onDelete={() => handleDeleteCount(index)}
                                />
                            )
                        })}
                    </div>
                )}
            </div>
        </div>
    );
};

export default SpotCheckComponent;
