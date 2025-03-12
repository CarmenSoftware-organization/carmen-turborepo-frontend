import React from 'react';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { DeliveryPointCreateModel } from '@/dtos/delivery-point.dto';

interface DeliveryPointSelectProps {
    value: string;
    onValueChange: (value: string) => void;
    items: DeliveryPointCreateModel[];
    placeholder?: string;
    className?: string;
    disabled?: boolean;
    error?: string;
}

const DeliveryPointSelect: React.FC<DeliveryPointSelectProps> = ({
    value,
    onValueChange,
    items,
    placeholder = "Select delivery point",
    className = '',
    disabled = false,
    error,
}) => {
    const handleChange = (newValue: string) => {
        onValueChange(newValue);
    };

    return (
        <div className="w-full">
            <Select
                onValueChange={handleChange}
                value={value || undefined}
                disabled={disabled}
                data-testid="delivery-point-select"
            >
                <SelectTrigger
                    className={`h-8 w-full ${className} ${error ? 'border-red-500' : ''}`}
                    data-testid="delivery-point-select-trigger"
                    aria-label="Select delivery point"
                >
                    <SelectValue placeholder={placeholder} />
                </SelectTrigger>
                <SelectContent
                    data-testid="delivery-point-select-content"
                    className="max-h-[300px]"
                >
                    {items.length === 0 ? (
                        <SelectItem
                            value="empty"
                            disabled
                            className="text-xs text-muted-foreground"
                            data-testid="delivery-point-select-empty"
                        >
                            No delivery points available
                        </SelectItem>
                    ) : (
                        items.map((point) => (
                            <SelectItem
                                key={point.id}
                                value={point.id || ''}
                                data-testid={`delivery-point-select-item-${point.id}`}
                                className="cursor-pointer hover:bg-muted text-xs"
                            >
                                {point.name}
                            </SelectItem>
                        ))
                    )}
                </SelectContent>
            </Select>
            {error && (
                <p className="mt-1 text-xs text-red-500" data-testid="delivery-point-select-error">
                    {error}
                </p>
            )}
        </div>
    );
};

export default DeliveryPointSelect;