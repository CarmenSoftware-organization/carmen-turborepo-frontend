"use client";

import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { FileDown, Plus, Printer } from "lucide-react";
import SearchInput from "@/components/ui-custom/SearchInput";
import StatusSearchDropdown from "@/components/ui-custom/StatusSearchDropdown";
import { boolFilterOptions } from "@/constants/options";
import SortComponent from "@/components/ui-custom/SortComponent";
import DataDisplayTemplate from "@/components/templates/DataDisplayTemplate";
import VendorList from "./VendorList";
import VendorFormDialog from "./VendorFormDialog";
import { useAuth } from "@/context/AuthContext";
import SignInDialog from "@/components/SignInDialog";
import DeleteConfirmDialog from "@/components/ui-custom/DeleteConfirmDialog";
import { UnauthorizedMessage } from "@/components/UnauthorizedMessage";
import { useVendor } from "@/hooks/useVendor";
import { Link } from "@/lib/navigation";

export default function VendorComponent() {
    const { token, tenantId } = useAuth();
    const tCommon = useTranslations('Common');
    const {
        search,
        setSearch,
        filter,
        setFilter,
        statusOpen,
        setStatusOpen,
        sort,
        setSort,
        page,
        vendors,
        openAddDialog,
        setOpenAddDialog,
        loginDialogOpen,
        setLoginDialogOpen,
        selectedVendor,
        currentMode,
        deleteDialogOpen,
        setDeleteDialogOpen,
        vendorToDelete,
        isDeleting,
        isLoading,
        isUnauthorized,
        totalPages,
        sortFields,
        handlePageChange,
        handleDeleteClick,
        handleConfirmDelete,
        handleFormSuccess
    } = useVendor(token, tenantId);

    const title = "Vendor";

    const actionButtons = (
        <div className="action-btn-container" data-id="vendor-action-buttons">
            <Button size={'sm'} asChild>
                <Link href={'/vendor-management/vendor/new'}>
                    <Plus className="h-4 w-4" />
                    {tCommon('add')}
                </Link>
            </Button>
            <Button
                variant="outline"
                className="group"
                size={'sm'}
                data-id="vendor-list-export-button"
            >
                <FileDown className="h-4 w-4" />
                {tCommon('export')}
            </Button>
            <Button
                variant="outline"
                size={'sm'}
                data-id="vendor-list-print-button"
            >
                <Printer className="h-4 w-4" />
                {tCommon('print')}
            </Button>
        </div>
    );

    const filters = (
        <div className="filter-container" data-id="vendor-list-filters">
            <SearchInput
                defaultValue={search}
                onSearch={setSearch}
                placeholder={tCommon('search')}
                data-id="vendor-list-search-input"
            />
            <div className="flex items-center gap-2">
                <StatusSearchDropdown
                    options={boolFilterOptions}
                    value={filter}
                    onChange={setFilter}
                    open={statusOpen}
                    onOpenChange={setStatusOpen}
                    data-id="vendor-list-status-search-dropdown"
                />
                <SortComponent
                    fieldConfigs={sortFields}
                    sort={sort}
                    setSort={setSort}
                    data-id="vendor-list-sort-dropdown"
                />
                <Button size={'sm'}>
                    Add Filter
                </Button>
            </div>
        </div>
    );

    const content = (
        <>
            {isUnauthorized ? (
                <UnauthorizedMessage
                    onRetry={handleFormSuccess}
                    onLogin={() => setLoginDialogOpen(true)}
                />
            ) : (
                <VendorList
                    vendors={vendors}
                    onDeleteClick={handleDeleteClick}
                    isLoading={isLoading}
                    currentPage={parseInt(page || '1')}
                    totalPages={totalPages}
                    onPageChange={handlePageChange}
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

            <VendorFormDialog
                open={openAddDialog}
                onOpenChange={setOpenAddDialog}
                onSuccess={handleFormSuccess}
                mode={currentMode}
                initialData={selectedVendor}
            />
            <SignInDialog
                open={loginDialogOpen}
                onOpenChange={setLoginDialogOpen}
            />
            <DeleteConfirmDialog
                open={deleteDialogOpen}
                onOpenChange={setDeleteDialogOpen}
                onConfirm={handleConfirmDelete}
                title="Delete Vendor"
                description={`Are you sure you want to delete vendor ${vendorToDelete?.name}?`}
                isLoading={isDeleting}
            />
        </>
    )
} 