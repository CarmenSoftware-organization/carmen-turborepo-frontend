"use client";
import { useURL } from "@/hooks/useURL";
import { useState, useEffect } from "react";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { FileDown, Printer } from "lucide-react";
import SearchInput from "@/components/ui-custom/SearchInput";
import StatusSearchDropdown from "@/components/ui-custom/StatusSearchDropdown";
import { statusOptions } from "@/constants/options";
import SortComponent from "@/components/ui-custom/SortComponent";
import DataDisplayTemplate from "@/components/templates/DataDisplayTemplate";
import { CurrencyDto } from "@/dtos/currency.dto";
import { useAuth } from "@/context/AuthContext";
import { createCurrency, getAllCurrencies, updateCurrency } from "@/services/currency.service";
import CurrencyList from "./CurrencyList";
import { formType } from "@/dtos/form.dto";
import CurrencyDialog from "./CurrencyDialog";
import DeleteConfirmDialog from "@/components/ui-custom/DeleteConfirmDialog";
import { z } from "zod";

export default function CurrencyComponent() {
    const { token } = useAuth();
    const tCurrency = useTranslations('Currency');
    const tCommon = useTranslations('Common');
    const [search, setSearch] = useURL('search');
    const [status, setStatus] = useURL('status');
    const [statusOpen, setStatusOpen] = useState(false);
    const [sort, setSort] = useURL('sort');
    const [currencies, setCurrencies] = useState<CurrencyDto[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [dialogOpen, setDialogOpen] = useState(false);
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [selectedCurrency, setSelectedCurrency] = useState<CurrencyDto | undefined>();

    useEffect(() => {
        const fetchCurrencies = async () => {
            if (!token) return;
            try {
                setIsLoading(true);
                const data = await getAllCurrencies(token);
                setCurrencies(data);
            } catch (error) {
                console.error('Error fetching currencies:', error);
            } finally {
                setIsLoading(false);
            }
        };
        fetchCurrencies();
    }, [token]);

    const sortFields = [
        { key: 'code', label: 'Code' },
        { key: 'name', label: 'Name' },
        { key: 'symbol', label: 'Symbol' },
        { key: 'is_active', label: 'Status' },
        { key: 'exchange_rate', label: 'Exchange Rate' },
    ];

    const handleAdd = () => {
        setSelectedCurrency(undefined);
        setDialogOpen(true);
    };

    const handleEdit = (currency: CurrencyDto) => {
        setSelectedCurrency(currency);
        setDialogOpen(true);
    };

    const handleDelete = (currency: CurrencyDto) => {
        setSelectedCurrency(currency);
        setDeleteDialogOpen(true);
    };

    const handleSubmit = async (data: CurrencyDto) => {
        try {
            setIsSubmitting(true);
            console.log('Submitting data:', data);

            if (selectedCurrency) {
                // Edit mode
                const updatedCurrency = { ...data, id: selectedCurrency.id };
                const result = await updateCurrency(token, updatedCurrency);
                if (result) {
                    setCurrencies(prevCurrencies =>
                        prevCurrencies.map(currency =>
                            currency.id === selectedCurrency.id
                                ? updatedCurrency
                                : currency
                        )
                    );
                } else {
                    console.error('Error updating currency:', result);
                }
            } else {
                // Add mode
                const result = await createCurrency(token, data);
                const newCurrency: CurrencyDto = {
                    ...data,
                    id: result.id,
                };
                setCurrencies(prevCurrencies => [...prevCurrencies, newCurrency]);
            }
            setDialogOpen(false);
            setSelectedCurrency(undefined);
        } catch (error) {
            console.error('Error handling currency submission:', error);
            if (error instanceof z.ZodError) {
                console.error('Zod Validation Errors:', error.errors);
            }
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleConfirmDelete = async () => {
        if (selectedCurrency) {
            try {
                setIsSubmitting(true);
                setCurrencies(prevCurrencies =>
                    prevCurrencies.filter(currency => currency.id !== selectedCurrency.id)
                );
            } catch (error) {
                console.error('Error deleting currency:', error);
            } finally {
                setIsSubmitting(false);
                setDeleteDialogOpen(false);
                setSelectedCurrency(undefined);
            }
        }
    };

    const title = tCurrency('title');

    const actionButtons = (
        <div className="action-btn-container" data-id="currency-list-action-buttons">
            <Button size={'sm'} onClick={handleAdd}>
                {tCommon('add')}
            </Button>
            <Button
                variant="outline"
                className="group"
                size={'sm'}
                data-id="delivery-point-export-button"
            >
                <FileDown className="h-4 w-4" />
                {tCommon('export')}
            </Button>
            <Button
                variant="outline"
                size={'sm'}
                data-id="delivery-point-print-button"
            >
                <Printer className="h-4 w-4" />
                {tCommon('print')}
            </Button>
        </div>
    );

    const filters = (
        <div className="filter-container" data-id="unit-list-filters">
            <SearchInput
                defaultValue={search}
                onSearch={setSearch}
                placeholder={tCommon('search')}
                data-id="unit-list-search-input"
            />
            <div className="flex items-center gap-2">
                <StatusSearchDropdown
                    options={statusOptions}
                    value={status}
                    onChange={setStatus}
                    open={statusOpen}
                    onOpenChange={setStatusOpen}
                    data-id="product-list-status-search-dropdown"
                />
                <SortComponent
                    fieldConfigs={sortFields}
                    sort={sort}
                    setSort={setSort}
                    data-id="product-list-sort-dropdown"
                />
            </div>
        </div>
    );

    const content = <CurrencyList
        isLoading={isLoading}
        currencies={currencies}
        onEdit={handleEdit}
        onDelete={handleDelete}
    />

    return (
        <div>
            <DataDisplayTemplate
                title={title}
                actionButtons={actionButtons}
                filters={filters}
                content={content}
            />
            <CurrencyDialog
                open={dialogOpen}
                onOpenChange={setDialogOpen}
                mode={selectedCurrency ? formType.EDIT : formType.ADD}
                currency={selectedCurrency}
                onSubmit={handleSubmit}
                isLoading={isSubmitting}
            />
            <DeleteConfirmDialog
                open={deleteDialogOpen}
                onOpenChange={setDeleteDialogOpen}
                onConfirm={handleConfirmDelete}
            />
        </div>
    );
}

