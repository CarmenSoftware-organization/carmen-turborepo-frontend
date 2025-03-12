"use client";

import React, { useEffect, useState } from 'react';
import { mockPeriodEndRecords, PeriodEndRecord } from '../data';
import { useURL } from '@/hooks/useURL';
import { useAuth } from '@/app/context/AuthContext';
import { Button } from '@/components/ui/button';
import { CalendarIcon, Plus } from 'lucide-react';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import { Calendar } from '@/components/ui/calendar';
import DataDisplayTemplate from '@/components/templates/DataDisplayTemplate';
import * as m from '@/paraglide/messages.js';
import SearchForm from '@/components/ui-custom/SearchForm';
import PeriodEndTable from './PeriodEndTable';
import PeriodEndCard from './PeriodEndCard';


const PeriodEndList = () => {
	const { accessToken, tenantId } = useAuth();
	const token = accessToken || '';
	const [date, setDate] = useState<Date>();
	const [periodEnd, setPeriodEnd] = useState<PeriodEndRecord[]>([]);
	const [search, setSearch] = useURL('search');

    const fetchPeriodEnd = async () => {
        setPeriodEnd(mockPeriodEndRecords);
    }

    useEffect(() => {
        fetchPeriodEnd();
    }, [token, tenantId]);

    const handleSearch = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setSearch(event.currentTarget.search.value);
    };

    const title = 'Period End';

    const actionButtons = (
        <div className="action-btn-container">
            <Popover>
                <PopoverTrigger asChild>
                    <Button
                        variant={"outline"}
                        className={cn(
                            "justify-start text-left font-normal h-8",
                            !date && "text-muted-foreground"
                        )}
                    >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {date ? format(date, "PPP") : <span>Pick a date</span>}
                    </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                        mode="single"
                        selected={date}
                        onSelect={setDate}
                        initialFocus
                    />
                </PopoverContent>
            </Popover>
            <Button variant={'outline'} size={'sm'}>
                <Plus />
                Period End
            </Button>
        </div>
    );


    const filter = (
        <div className="filter-container">
            <SearchForm
                onSearch={setSearch}
                defaultValue={search}
                placeholder={`${m.Search()} ${m.store_requisitions()}...`}
            />
        </div>
    )


    const content = (
        <>
            <div className="block md:hidden">
                <PeriodEndCard
                    periodEnds={periodEnd}
                    isLoading={false}
                />
            </div>
            <div className="hidden md:block">
                <PeriodEndTable
                    periodEnds={periodEnd}
                    isLoading={false}
                />
            </div>
        </>
    );

    return (
        <DataDisplayTemplate
            title={title}
            actionButtons={actionButtons}
            filters={filter}
            content={content}
        />
    )
}

export default PeriodEndList 