"use client";

import React from 'react';
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from '@/components/ui/popover';
import { Button } from '@/components/ui/button';
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
} from '@/components/ui/command';
import { ChevronDown } from 'lucide-react';
import { useTranslations } from 'next-intl';

interface Props {
    readonly value: string;
    readonly onChange: (value: string) => void;
    readonly open: boolean;
    readonly onOpenChange: (open: boolean) => void;
}

export default function StatusSearchDropdown({
    value,
    onChange,
    open,
    onOpenChange,
}: Props) {
    const t = useTranslations('Common');

    const options = [
        { label: t("all"), value: '' },
        { label: t("active"), value: 'is_active|bool:true' },
        { label: t("inactive"), value: 'is_active|bool:false' },
    ];

    return (
        <Popover open={open} onOpenChange={onOpenChange}>
            <PopoverTrigger asChild>
                <Button
                    variant="outlinePrimary"
                    aria-expanded={open}
                    size={'sm'}
                >
                    {value
                        ? options.find((option) => option.value === value)?.label
                        : `${t('selectStatus')}`}
                    <ChevronDown className="h-4 w-4" />
                </Button>
            </PopoverTrigger>
            <PopoverContent className="p-1">
                <Command>
                    <CommandInput
                        placeholder={`${t('search')} ${t('status')}`}
                        className="h-9 text-xs"
                    />
                    <CommandList>
                        <CommandEmpty>No result found.</CommandEmpty>
                        <CommandGroup>
                            {options.map((option) => (
                                <CommandItem
                                    key={option.value}
                                    value={option.value}
                                    onSelect={() => {
                                        onChange(option.value);
                                        onOpenChange(false);
                                    }}
                                    className="text-xs cursor-pointer"
                                >
                                    {option.label}
                                </CommandItem>
                            ))}
                        </CommandGroup>
                    </CommandList>
                </Command>
            </PopoverContent>
        </Popover>
    )
}
