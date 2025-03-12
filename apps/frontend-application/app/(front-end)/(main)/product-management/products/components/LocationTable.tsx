import React from 'react';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import { LocationCreateModel, LocationData } from '@/dtos/location.dto';
import LocationRow from './LocationRow';

interface Props {
    locations: LocationData[];
    isEdit: boolean;
    loading: boolean;
    error: string | null;
    locationsList: LocationCreateModel[];
    handleSelectOpen: (open: boolean) => Promise<void>;
    onDelete: (id: string) => void;
    onEdit: (oldId: string, newLocation: LocationData) => void;
    addedLocations: { location_id: string }[];
    isAddingNew: boolean;
    newLocationProps?: {
        newLocationId: string;
        onConfirm: (selectedId: string) => void;
        onCancel: () => void;
    };
}
const LocationTable: React.FC<Props> = ({
    locations,
    isEdit,
    loading,
    error,
    locationsList,
    handleSelectOpen,
    onDelete,
    onEdit,
    addedLocations,
    isAddingNew,
    newLocationProps
}) => {
    return (
        <Table>
            <TableHeader>
                <TableRow>
                    <TableHead className="w-[10rem]">Location Name</TableHead>
                    <TableHead>Location Type</TableHead>
                    {isEdit && <TableHead className="w-[4rem]">Actions</TableHead>}
                </TableRow>
            </TableHeader>
            <TableBody>
                {locations.length === 0 && !isAddingNew ? (
                    <TableRow>
                        <TableCell
                            colSpan={isEdit ? 3 : 2}
                            className="text-center text-muted-foreground py-6"
                        >
                            No locations available
                        </TableCell>
                    </TableRow>
                ) : (
                    <>
                        {locations.map((location) => (
                            <LocationRow
                                key={location.location_id}
                                location={location}
                                isEdit={isEdit}
                                onDelete={onDelete}
                                onEdit={(newLocation) => onEdit(location.location_id, newLocation)}
                                locationsList={locationsList}
                                loading={loading}
                                error={error}
                                handleSelectOpen={handleSelectOpen}
                                isNewlyAdded={addedLocations.some(
                                    (loc) => loc.location_id === location.location_id
                                )}
                            />
                        ))}
                        {isAddingNew && newLocationProps && (
                            <LocationRow
                                location={{
                                    location_id: '',
                                    location_name: '',
                                    location_type: ''
                                }}
                                isEdit={true}
                                isNewlyAdded={true}
                                locationsList={locationsList}
                                loading={loading}
                                error={error}
                                handleSelectOpen={handleSelectOpen}
                                onDelete={newLocationProps.onCancel}
                                onEdit={(newLocation) =>
                                    newLocationProps.onConfirm(newLocation.location_id)
                                }
                            />
                        )}
                    </>
                )}
            </TableBody>
        </Table>
    )
}

export default LocationTable