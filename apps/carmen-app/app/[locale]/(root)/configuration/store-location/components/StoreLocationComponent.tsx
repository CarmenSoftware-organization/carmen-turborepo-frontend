"use client";

import { FileDown, Plus, Printer } from "lucide-react";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import SearchInput from "@/components/ui-custom/SearchInput";
import StatusSearchDropdown from "@/components/ui-custom/StatusSearchDropdown";
import SortComponent from "@/components/ui-custom/SortComponent";
import { statusOptions } from "@/constants/options";
import DataDisplayTemplate from "@/components/templates/DataDisplayTemplate";
import SignInDialog from "@/components/SignInDialog";
import StoreLocationList from "./StoreLocationList";
import { UnauthorizedMessage } from "@/components/UnauthorizedMessage";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import StoreLocationDialog from "./StoreLocationDialog";
import { useStoreLocation } from "@/hooks/useStoreLocation";

export default function StoreLocationComponent() {
    const tCommon = useTranslations('Common');
    const tStoreLocation = useTranslations('StoreLocation');

    const {
        // State
        search,
        setSearch,
        status,
        setStatus,
        statusOpen,
        setStatusOpen,
        sort,
        setSort,
        page,
        storeLocations,
        isPending,
        dialogOpen,
        setDialogOpen,
        selectedStoreLocation,
        dialogMode,
        loginDialogOpen,
        setLoginDialogOpen,
        statusDialogOpen,
        setStatusDialogOpen,
        isUnauthorized,
        totalPages,

        // Functions
        handleSubmit,
        handlePageChange,
        sortFields,
        handleOpenAddDialog,
        handleEdit,
        handleStatusChange,
        handleConfirmStatusChange,
        fetchStoreLocations
    } = useStoreLocation();

    const actionButtons = (
        <div className="action-btn-container" data-id="store-location-list-action-buttons">
            <Button size="sm" onClick={handleOpenAddDialog}>
                <Plus className="h-4 w-4" />
                {tCommon('add')}
            </Button>
            <Button
                variant="outline"
                className="group"
                size="sm"
                data-id="store-location-export-button"
            >
                <FileDown className="h-4 w-4" />
                {tCommon('export')}
            </Button>
            <Button
                variant="outline"
                size="sm"
                data-id="store-location-print-button"
            >
                <Printer className="h-4 w-4" />
                {tCommon('print')}
            </Button>
        </div>
    );

    const filters = (
        <div className="filter-container" data-id="store-location-list-filters">
            <SearchInput
                defaultValue={search}
                onSearch={setSearch}
                placeholder={tCommon('search')}
                data-id="store-location-list-search-input"
            />
            <div className="flex items-center gap-2">
                <StatusSearchDropdown
                    options={statusOptions}
                    value={status}
                    onChange={setStatus}
                    open={statusOpen}
                    onOpenChange={setStatusOpen}
                    data-id="store-location-list-status-search-dropdown"
                />
                <SortComponent
                    fieldConfigs={sortFields}
                    sort={sort}
                    setSort={setSort}
                    data-id="store-location-list-sort-dropdown"
                />
            </div>
        </div>
    );

    const content = (
        <>
            {isUnauthorized ? (
                <UnauthorizedMessage
                    onRetry={fetchStoreLocations}
                    onLogin={() => setLoginDialogOpen(true)}
                />
            ) : (
                <StoreLocationList
                    storeLocations={storeLocations}
                    onEdit={handleEdit}
                    onStatusChange={handleStatusChange}
                    isLoading={isPending}
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
                title={tStoreLocation('title')}
                actionButtons={actionButtons}
                filters={filters}
                content={content}
                data-id="store-location-list-template"
            />
            <StoreLocationDialog
                open={dialogOpen}
                onOpenChange={setDialogOpen}
                mode={dialogMode}
                storeLocation={selectedStoreLocation}
                onSubmit={handleSubmit}
                isLoading={isPending}
            />
            <SignInDialog
                open={loginDialogOpen}
                onOpenChange={setLoginDialogOpen}
            />
            <Dialog open={statusDialogOpen} onOpenChange={setStatusDialogOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>{selectedStoreLocation?.is_active ? 'Deactivate' : 'Activate'} Store Location</DialogTitle>
                        <DialogDescription>
                            Are you sure you want to {selectedStoreLocation?.is_active ? 'deactivate' : 'activate'} this store location?
                        </DialogDescription>
                    </DialogHeader>
                    <div className="flex justify-end gap-2">
                        <Button variant="outline" onClick={() => setStatusDialogOpen(false)}>
                            Cancel
                        </Button>
                        <Button onClick={handleConfirmStatusChange}>
                            Confirm
                        </Button>
                    </div>
                </DialogContent>
            </Dialog>
        </>
    );
}
