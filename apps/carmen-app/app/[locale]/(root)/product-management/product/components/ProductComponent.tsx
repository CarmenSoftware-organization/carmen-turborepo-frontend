"use client";
import DataDisplayTemplate from "@/components/templates/DataDisplayTemplate";
import SearchInput from "@/components/ui-custom/SearchInput";
import SortComponent from "@/components/ui-custom/SortComponent";
import StatusSearchDropdown from "@/components/ui-custom/StatusSearchDropdown";
import { Button } from "@/components/ui/button";
import { statusOptions } from "@/constants/options";
import { useURL } from "@/hooks/useURL";
import { mockProducts } from "@/mock-data/product";
import { FileDown, Plus, Printer } from "lucide-react";
import { useTranslations } from "next-intl";
import { useState } from "react";
import ProductList from "./ProductList";
import { Link } from "@/lib/navigation";


export function ProductComponent() {
    const tCommon = useTranslations('Common');
    const tHeader = useTranslations('TableHeader');
    const tProduct = useTranslations('Product');
    const [search, setSearch] = useURL('search');
    const [status, setStatus] = useURL('status');
    const [statusOpen, setStatusOpen] = useState(false);
    const [sort, setSort] = useURL('sort');

    const sortFields = [
        { key: 'name', label: tHeader('name') },
        { key: 'category', label: tHeader('category') },
        { key: 'sub_category', label: tHeader('sub_category') },
        { key: 'item_group', label: tHeader('item_group') },
    ];

    const title = tProduct('title');

    const actionButtons = (
        <div className="action-btn-container" data-id="product-list-action-buttons">
            <Button size={'sm'} asChild>
                <Link href="/product-management/product/new">
                    <Plus />
                    {tCommon('add')}
                </Link>
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
        <div className="filter-container" data-id="product-list-filters">
            <SearchInput
                defaultValue={search}
                onSearch={setSearch}
                placeholder={tCommon('search')}
                data-id="product-list-search-input"
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

    const content = (
        <ProductList products={mockProducts} data-id="product-list-template" />
    )

    return (
        <DataDisplayTemplate
            title={title}
            actionButtons={actionButtons}
            filters={filters}
            content={content}
            data-id="product-list-template"
        />
    )
}