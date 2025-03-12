import { LocationData } from '@/dtos/location.dto';
import React from 'react';

interface Props {
    location: LocationData;
    type?: 'default' | 'selected';
}
const LocationDisplay: React.FC<Props> = ({
    location,
    type = 'default'
}) => {
    return (
        <div className="flex items-center justify-between w-full">
            <div className="flex flex-col">
                <span className={`font-medium ${type === 'selected' ? 'text-primary' : ''}`}>
                    {location.location_name || 'Unnamed Location'}
                </span>
                <span className="text-xs text-muted-foreground">
                    {location.location_type.toUpperCase()}
                </span>
            </div>
        </div>
    )
}

export default LocationDisplay