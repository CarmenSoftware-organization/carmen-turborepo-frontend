import React from 'react';
import { Plus } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { LocationCreateModel, LocationData } from '@/dtos/location.dto';
import LocationTable from './LocationTable';

export const enum PRODUCT_ACTION {
    ADD,
    EDIT,
    DELETE,
}

export type LocationAction = {
    type: 'ADD' | 'EDIT' | 'DELETE';
    payload: { location_id: string };
}

interface LocationState {
    addedLocations: { location_id: string }[];
    editedLocations: { location_id: string }[];
    deletedLocations: { location_id: string }[];
}

interface LocationProps {
    isEdit: boolean;
    originalLocations: LocationData[];
    setOriginalLocations: React.Dispatch<React.SetStateAction<LocationData[]>>;
    loading: boolean;
    locationsList: LocationCreateModel[];
    isAddingNew: boolean;
    setIsAddingNew: React.Dispatch<React.SetStateAction<boolean>>;
    newLocationId: string;
    setNewLocationId: React.Dispatch<React.SetStateAction<string>>;
    locationError: string | null;
    setLocationError: React.Dispatch<React.SetStateAction<string | null>>;
    handleFetchLocationList: () => Promise<void>;
    locationState: LocationState;
    onLocationStateChange: (action: { type: PRODUCT_ACTION; payload: { location_id: string } }) => void;
}

const LocationList: React.FC<LocationProps> = ({
    isEdit,
    originalLocations,
    setOriginalLocations,
    loading,
    locationsList,
    isAddingNew,
    setIsAddingNew,
    newLocationId,
    setNewLocationId,
    locationError: error,
    setLocationError: setError,
    handleFetchLocationList,
    locationState,
    onLocationStateChange,
}) => {

    const handleSelectOpen = async (open: boolean) => {
        if (open) {
            try {
                await handleFetchLocationList();
            } catch (err) {
                console.error('Error loading locations:', err);
            }
        }
    };

    const handleAddRow = () => {
        setIsAddingNew(true);
        handleFetchLocationList();
    };

    const handleConfirmAdd = (selectedId: string) => {
        const selectedLocation = locationsList.find((loc) => loc.id === selectedId);
        if (!selectedLocation) {
            setError('Selected location not found');
            return;
        }

        const newLocation: LocationData = {
            location_id: selectedLocation.id ?? '',
            location_name: selectedLocation.name ?? '',
            location_type: selectedLocation.location_type ?? '',
        };

        setOriginalLocations((prev) => [...prev, newLocation]);
        onLocationStateChange({
            type: PRODUCT_ACTION.ADD,
            payload: { location_id: newLocation.location_id },
        });
        setIsAddingNew(false);
        setNewLocationId('');
        setError(null);
    };

    const handleDeleteRow = (locationId: string) => {
        setOriginalLocations((prev) =>
            prev.filter((loc) => loc.location_id !== locationId)
        );
        onLocationStateChange({
            type: PRODUCT_ACTION.DELETE,
            payload: { location_id: locationId },
        });
    };

    const handleEditLocation = (oldId: string, newLocation: LocationData) => {
        setOriginalLocations((prev) =>
            prev.map((loc) => (loc.location_id === oldId ? newLocation : loc))
        );
        onLocationStateChange({
            type: PRODUCT_ACTION.EDIT,
            payload: { location_id: newLocation.location_id },
        });
    };

    if (error) {
        return (
            <Alert variant="destructive">
                <AlertDescription className="flex items-center justify-between">
                    <span>{error}</span>
                    <Button
                        onClick={() => {
                            setError(null);
                            handleFetchLocationList();
                        }}
                        variant="outline"
                        size="sm"
                        className="ml-4"
                    >
                        Retry
                    </Button>
                </AlertDescription>
            </Alert>
        );
    }

    return (
        <Card>
            <CardHeader className="flex flex-row items-center justify-between py-4">
                <CardTitle className="text-base font-semibold">Locations</CardTitle>
                {isEdit && (
                    <Button
                        onClick={handleAddRow}
                        size="sm"
                        variant="outline"
                        className="space-x-2"
                        disabled={loading}
                    >
                        <Plus className="h-4 w-4" />
                        <span>Add Location</span>
                    </Button>
                )}
            </CardHeader>
            <CardContent className="p-4">
                <LocationTable
                    locations={originalLocations}
                    isEdit={isEdit}
                    loading={loading}
                    error={error}
                    locationsList={locationsList}
                    handleSelectOpen={handleSelectOpen}
                    onDelete={handleDeleteRow}
                    onEdit={handleEditLocation}
                    addedLocations={locationState.addedLocations}
                    isAddingNew={isAddingNew}
                    newLocationProps={
                        isAddingNew
                            ? {
                                newLocationId,
                                onConfirm: handleConfirmAdd,
                                onCancel: () => setIsAddingNew(false),
                            }
                            : undefined
                    }
                />
            </CardContent>
        </Card>
    );
};

export default LocationList;