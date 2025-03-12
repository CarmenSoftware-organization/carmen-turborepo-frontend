"use client";

import React, { useEffect, useState } from 'react'
import { requisitions, RequisitionType } from '../data';
import { useURL } from '@/hooks/useURL';
import { useAuth } from '@/app/context/AuthContext';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { ArrowUpDown, Building2, Calendar, DollarSign, FileDown, FileText, Hash, Plus, Printer, Store, Tags } from 'lucide-react';
import * as m from '@/paraglide/messages.js';
import SearchForm from '@/components/ui-custom/SearchForm';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { statusOptions } from '@/lib/statusOptions';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command';
import DataDisplayTemplate from '@/components/templates/DataDisplayTemplate';
import StoreRequisitionsTable from './StoreRequisitionsTable';
import StoreRequisitionsCard from './StoreRequisitionsCard';
import { DropdownMenu, DropdownMenuContent, DropdownMenuRadioGroup, DropdownMenuRadioItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';

const StoreRequisitionsList = () => {
    const { accessToken, tenantId } = useAuth();
		const token = accessToken || '';
    const [storeRequisition, setStoreRequisition] = useState<RequisitionType[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [statusOpen, setStatusOpen] = useState(false);
    const [search, setSearch] = useURL('search');
    const [status, setStatus] = useURL('status');
    const [sortBy, setSortBy] = useState('date')
    const fetchData = async () => {
        try {
            setIsLoading(true);
            const data = { data: requisitions };
            setStoreRequisition(data.data);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'An error occurred');
        } finally {
            setIsLoading(false);
        }
    }

    useEffect(() => {
        fetchData();
    }, [token, tenantId, search, status]);


    if (error) {
        return (
            <Card className="border-destructive">
                <CardContent className="pt-6">
                    <p className="text-destructive">
                        Error loading store requisitions: {error}
                    </p>
                </CardContent>
            </Card>
        );
    }
    const handleSearch = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setSearch(event.currentTarget.search.value);
    };

    const handleSort = (column: string) => {
        setSortBy(column)
        // Here you would implement the sorting logic
        console.log(`Sorting by ${column}`)
    }

    const title = `${m.store_requisitions()}`;

    const actionButtons = (
        <div className="action-btn-container">
            <Button asChild variant={'outline'} size={'sm'}>
                <Link href="/store-operations/store-requisitions/new">
                    <Plus className="h-4 w-4" />
                    {m.create_store_requistion()}
                </Link>
            </Button>
            <Button variant="outline" className="group" size={'sm'}>
                <FileDown className="h-4 w-4" />
                {m.export_text()}
            </Button>
            <Button variant="outline" size={'sm'}>
                <Printer className="h-4 w-4" />
                {m.print_text()}
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
            <div className="all-center gap-2">
                <Popover open={statusOpen} onOpenChange={setStatusOpen}>
                    <PopoverTrigger asChild>
                        <Button
                            variant="outline"
                            role="combobox"
                            aria-expanded={statusOpen}
                            className="btn-combobox"
                            size={'sm'}
                        >
                            {status
                                ? statusOptions.find((option) => option.value === status)?.label
                                : `${m.select_status()}`}
                        </Button>
                    </PopoverTrigger>
                    <PopoverContent className="pop-content">
                        <Command>
                            <CommandInput placeholder={`${m.Search()} ${m.status_text()}`} className="h-9" />
                            <CommandList>
                                <CommandEmpty>No status found.</CommandEmpty>
                                <CommandGroup>
                                    {statusOptions.map((option) => (
                                        <CommandItem
                                            key={option.value}
                                            value={option.value}
                                            onSelect={() => {
                                                setStatus(option.value);
                                                setStatusOpen(false);
                                            }}
                                        >
                                            {option.label}
                                        </CommandItem>
                                    ))}
                                </CommandGroup>
                            </CommandList>
                        </Command>
                    </PopoverContent>
                </Popover>

                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="outline" className="h-8 text-xs">
                            <ArrowUpDown className="w-3 h-3" />
                            {m.sort_by()}: {m.date()}
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="w-[150px]">
                        <DropdownMenuRadioGroup value={sortBy} onValueChange={handleSort}>
                            <DropdownMenuRadioItem value="date" className="flex items-center text-xs">
                                <Calendar className="mr-2 h-3 w-3" />
                                {m.date()}
                            </DropdownMenuRadioItem>
                            <DropdownMenuRadioItem value="refNo" className="flex items-center text-xs">
                                <Hash className="mr-2 h-3 w-3" />
                                {m.ref()} #
                            </DropdownMenuRadioItem>
                            <DropdownMenuRadioItem value="requestTo" className="flex items-center text-xs">
                                <Building2 className="mr-2 h-3 w-3" />
                                {m.request_to()}
                            </DropdownMenuRadioItem>
                            <DropdownMenuRadioItem value="storeName" className="flex items-center text-xs">
                                <Store className="mr-2 h-3 w-3" />
                                {m.store_name()}
                            </DropdownMenuRadioItem>
                            <DropdownMenuRadioItem value="description" className="flex items-center text-xs">
                                <FileText className="mr-2 h-3 w-3" />
                                {m.description()}
                            </DropdownMenuRadioItem>
                            <DropdownMenuRadioItem value="status" className="flex items-center text-xs">
                                <Tags className="mr-2 h-3 w-3" />
                                {m.total_amout()}
                            </DropdownMenuRadioItem>
                            <DropdownMenuRadioItem value="totalAmount" className="flex items-center text-xs">
                                <DollarSign className="mr-2 h-3 w-3" />
                                {m.action_text()}
                            </DropdownMenuRadioItem>
                        </DropdownMenuRadioGroup>
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>
        </div>
    )

    const content = (
        <>
            <div className="block md:hidden">
                <StoreRequisitionsCard
                    isLoading={isLoading}
                    storeRequisition={storeRequisition}
                />
            </div>
            <div className="hidden md:block">
                <StoreRequisitionsTable
                    isLoading={isLoading}
                    storeRequisition={storeRequisition}
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

export default StoreRequisitionsList