"use client";
import { Button } from "@/components/ui/button";
import { FileDown, Plus, Printer } from "lucide-react";
import { useTranslations } from "next-intl";
import SortComponent from "@/components/ui-custom/SortComponent";
import StatusSearchDropdown from "@/components/ui-custom/StatusSearchDropdown";
import SearchInput from "@/components/ui-custom/SearchInput";
import { boolFilterOptions } from "@/constants/options";
import DataDisplayTemplate from "@/components/templates/DataDisplayTemplate";
import UnitList from "./UnitList";
import DeleteConfirmDialog from "./DeleteConfirmDialog";
import UnitDialog from "@/components/shared/UnitDialog";
import { formType } from "@/dtos/form.dto";
import { useUnit } from "@/hooks/useUnit";
import SignInDialog from "@/components/SignInDialog";
import { useEffect, useState } from "react";
import { UnauthorizedMessage } from "@/components/UnauthorizedMessage";

export default function UnitComponent() {
    const tCommon = useTranslations('Common');
    const tUnit = useTranslations('Unit');
    const [signInOpen, setSignInOpen] = useState(false);
    const {
        // Data
        units,
        isLoading,
        isUnauthorized,
        totalPages,
        page,
        setPage,
        search,
        setSearch,
        filter,
        setFilter,
        statusOpen,
        setStatusOpen,
        sort,
        setSort,
        // Form
        dialogOpen,
        setDialogOpen,
        selectedUnit,
        handleAdd,
        handleEdit,
        handleSubmit,
        // Delete
        deleteDialogOpen,
        handleDelete,
        handleConfirmDelete,
        handleCancelDelete
    } = useUnit();

    useEffect(() => {
        if (isUnauthorized) {
            setSignInOpen(true);
        }
    }, [isUnauthorized]);

    const sortFields = [
        { key: 'name', label: 'Name' },
        { key: 'status', label: 'Status' },
    ];

    const title = tUnit('title');

    const actionButtons = (
        <div className="action-btn-container" data-id="unit-list-action-buttons">
            <Button size={'sm'} onClick={handleAdd}>
                <Plus className="h-4 w-4" />
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
                    options={boolFilterOptions}
                    value={filter}
                    onChange={setFilter}
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
        <>
            {isUnauthorized ? (
                <UnauthorizedMessage
                    onRetry={() => window.location.reload()}
                    onLogin={() => setSignInOpen(true)}
                />
            ) : (
                <UnitList
                    units={units}
                    onEdit={handleEdit}
                    onDelete={handleDelete}
                    isLoading={isLoading}
                    currentPage={parseInt(page || '1')}
                    totalPages={totalPages}
                    onPageChange={(newPage) => setPage(newPage.toString())}
                    data-id="unit-list-template"
                />
            )}
        </>
    );

    return (
        <>
            <DataDisplayTemplate
                title={title}
                actionButtons={actionButtons}
                filters={filters}
                content={content}
            />
            <UnitDialog
                open={dialogOpen}
                onOpenChange={setDialogOpen}
                mode={selectedUnit ? formType.EDIT : formType.ADD}
                unit={selectedUnit}
                onSubmit={handleSubmit}
            />
            <DeleteConfirmDialog
                open={deleteDialogOpen}
                onOpenChange={handleCancelDelete}
                onConfirm={handleConfirmDelete}
            />
            {isUnauthorized && <SignInDialog open={signInOpen} onOpenChange={setSignInOpen} />}
        </>
    );
}
