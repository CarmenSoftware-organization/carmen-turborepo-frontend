import React from 'react';
import { Loader2 } from 'lucide-react';
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { LocationCreateModel, LocationData } from '@/dtos/location.dto';
import LocationDisplay from './LocationDisplay';
interface Props {
    location: LocationData;
    locationsList: LocationCreateModel[];
    loading: boolean;
    error: string | null;
    onSelect: (value: string) => void;
    handleSelectOpen: (open: boolean) => Promise<void>;
    placeholder?: string;
    disabled?: boolean;
}
const LocationSelect: React.FC<Props> = ({
    location,
    locationsList,
    loading,
    error,
    onSelect,
    handleSelectOpen,
    placeholder = "Select location",
    disabled = false,
}) => {
    return (
        <Select
            disabled={disabled || loading}
            defaultValue={location.location_id}
            onValueChange={onSelect}
            onOpenChange={handleSelectOpen}
        >
            <SelectTrigger className="w-full h-9">
                <SelectValue placeholder={placeholder}>
                    <LocationDisplay location={location} type="selected" />
                </SelectValue>
            </SelectTrigger>
            <SelectContent>
                <SelectGroup>
                    {loading ? (
                        <SelectItem value="loading" disabled>
                            <div className="flex items-center space-x-2">
                                <Loader2 className="h-4 w-4 animate-spin" />
                                <span>Loading locations...</span>
                            </div>
                        </SelectItem>
                    ) : error ? (
                        <SelectItem value="error" disabled>
                            {error}
                        </SelectItem>
                    ) : (
                        locationsList.map((loc) => (
                            <SelectItem
                                key={loc.id}
                                value={loc.id || 'default'}
                                className="py-2 hover:bg-secondary focus:bg-secondary"
                            >
                                <div className="flex flex-col">
                                    <span className="font-medium">{loc.name || 'Unnamed Location'}</span>
                                    <span className="text-xs text-muted-foreground">
                                        {loc.location_type?.toUpperCase() || 'N/A'}
                                    </span>
                                </div>
                            </SelectItem>
                        ))
                    )}
                </SelectGroup>
            </SelectContent>
        </Select>
    )
}

export default LocationSelect;