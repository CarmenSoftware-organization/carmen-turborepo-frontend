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
import { getAllCurrencies } from "@/services/currency.service";
import CurrencyList from "./CurrencyList";

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
        // Implementation for adding a currency will be added later
        alert('Add currency functionality will be implemented later');
    };

    const handleEdit = (currency: CurrencyDto) => {
        console.log(currency);
    };

    const handleDelete = (currency: CurrencyDto) => {
        console.log(currency);
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
        </div>
    );
}

