"use client";

import React from 'react';

import * as m from '@/paraglide/messages';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';

interface Option {
    value: string;
    label: string;
}

interface StatusSelectProps {
    options: Option[];
    value?: string;
    onValueChange: (value: string) => void;
    placeholder?: string;
    className?: string;
}

const StatusSelect: React.FC<StatusSelectProps> = ({
    options,
    value,
    onValueChange,
    placeholder = m.select_status(),
    className = "w-[180px]"
}) => {
    return (
        <Select
            value={value || ""}
            onValueChange={onValueChange}
        >
            <SelectTrigger className={className}>
                <SelectValue placeholder={placeholder} />
            </SelectTrigger>
            <SelectContent>
                {options.map((option) => (
                    <SelectItem
                        key={option.value}
                        value={option.value}
                    >
                        {option.label}
                    </SelectItem>
                ))}
            </SelectContent>
        </Select>
    );
};

export default StatusSelect;