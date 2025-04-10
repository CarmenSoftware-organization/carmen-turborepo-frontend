"use client";

import DataDisplayTemplate from "@/components/templates/DataDisplayTemplate";
import SearchInput from "@/components/ui-custom/SearchInput";
import SortComponent from "@/components/ui-custom/SortComponent";
import StatusSearchDropdown from "@/components/ui-custom/StatusSearchDropdown";
import { Button } from "@/components/ui/button";
import { statusOptions } from "@/constants/options";
import { useURL } from "@/hooks/useURL";
import { FileDown, Plus, Printer } from "lucide-react";
import { useTranslations } from "next-intl";
import { useState, useMemo, useCallback } from "react";
import DeliveryPointList from "./DeliveryPointList";
import DeliveryPointDialog from "./DeliveryPointDialog";
import { DeliveryPointDto } from "@/dtos/config.dto";
import { formType } from "@/dtos/form.dto";
import SignInDialog from "@/components/SignInDialog";
import { UnauthorizedMessage } from "@/components/UnauthorizedMessage";
import { useDeliveryPoint } from "@/hooks/useDeliveryPoint";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog";

export function DeliveryPointComponent() {
    const tCommon = useTranslations('Common');
    const tHeader = useTranslations('TableHeader');
    const tDeliveryPoint = useTranslations('DeliveryPoint');
    const [statusOpen, setStatusOpen] = useState(false);
    const [dialogOpen, setDialogOpen] = useState(false);
    const [selectedDeliveryPoint, setSelectedDeliveryPoint] = useState<DeliveryPointDto | undefined>();
    const [dialogMode, setDialogMode] = useState<formType>(formType.ADD);
    const [loginDialogOpen, setLoginDialogOpen] = useState(false);
    const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
    const [deliveryPointToToggle, setDeliveryPointToToggle] = useState<DeliveryPointDto | undefined>();
    const [status, setStatus] = useURL('status');

    const {
        deliveryPoints,
        isPending,
        isUnauthorized,
        totalPages,
        currentPage,
        search,
        setSearch,
        sort,
        setSort,
        fetchDeliveryPoints,
        handleToggleStatus,
        handleSubmit,
        handlePageChange
    } = useDeliveryPoint();

    const sortFields = useMemo(() => [
        { key: 'name', label: tHeader('name') },
        { key: 'code', label: tHeader('code') },
        { key: 'is_active', label: tHeader('status') }
    ], [tHeader]);

    const title = useMemo(() => tDeliveryPoint('title'), [tDeliveryPoint]);

    const handleOpenAddDialog = useCallback(() => {
        setDialogMode(formType.ADD);
        setSelectedDeliveryPoint(undefined);
        setDialogOpen(true);
    }, []);

    const handleEdit = useCallback((deliveryPoint: DeliveryPointDto) => {
        setDialogMode(formType.EDIT);
        setSelectedDeliveryPoint(deliveryPoint);
        setDialogOpen(true);
    }, []);

    const handleOpenLoginDialog = useCallback(() => {
        setLoginDialogOpen(true);
    }, []);

    const handleDialogSubmit = useCallback((data: DeliveryPointDto) => {
        handleSubmit(data, dialogMode, selectedDeliveryPoint);
        setDialogOpen(false);
    }, [handleSubmit, dialogMode, selectedDeliveryPoint]);

    const handleConfirmToggleStatus = useCallback((deliveryPoint: DeliveryPointDto) => {
        setDeliveryPointToToggle(deliveryPoint);
        setConfirmDialogOpen(true);
    }, []);

    const handleCancelDialog = useCallback(() => {
        setConfirmDialogOpen(false);
        setDeliveryPointToToggle(undefined);
    }, []);

    const handleConfirmedToggle = useCallback(() => {
        if (deliveryPointToToggle) {
            handleToggleStatus(deliveryPointToToggle);
            setDeliveryPointToToggle(undefined);
            setConfirmDialogOpen(false);
        }
    }, [deliveryPointToToggle, handleToggleStatus]);

    const actionButtons = useMemo(() => (
        <div className="action-btn-container" data-id="delivery-point-list-action-buttons">
            <Button
                size="sm"
                onClick={handleOpenAddDialog}
            >
                <Plus className="h-4 w-4" />
                {tCommon('add')}
            </Button>
            <Button
                variant="outline"
                className="group"
                size="sm"
                data-id="delivery-point-export-button"
            >
                <FileDown className="h-4 w-4" />
                {tCommon('export')}
            </Button>
            <Button
                variant="outline"
                size="sm"
                data-id="delivery-point-print-button"
            >
                <Printer className="h-4 w-4" />
                {tCommon('print')}
            </Button>
        </div>
    ), [tCommon, handleOpenAddDialog]);

    const filters = useMemo(() => (
        <div className="filter-container" data-id="delivery-point-list-filters">
            <SearchInput
                defaultValue={search}
                onSearch={setSearch}
                placeholder={tCommon('search')}
                data-id="delivery-point-list-search-input"
            />
            <div className="flex items-center gap-2">
                <StatusSearchDropdown
                    options={statusOptions}
                    value={status}
                    onChange={setStatus}
                    open={statusOpen}
                    onOpenChange={setStatusOpen}
                    data-id="delivery-point-status-search-dropdown"
                />
                <SortComponent
                    fieldConfigs={sortFields}
                    sort={sort}
                    setSort={setSort}
                    data-id="delivery-point-sort-dropdown"
                />
            </div>
        </div>
    ), [search, setSearch, tCommon, status, setStatus, statusOpen, setStatusOpen, sortFields, sort, setSort]);

    const content = useMemo(() => (
        <>
            {isUnauthorized ? (
                <UnauthorizedMessage
                    onRetry={fetchDeliveryPoints}
                    onLogin={handleOpenLoginDialog}
                />
            ) : (
                <DeliveryPointList
                    deliveryPoints={deliveryPoints}
                    onEdit={handleEdit}
                    onToggleStatus={handleConfirmToggleStatus}
                    isLoading={isPending}
                    currentPage={currentPage}
                    totalPages={totalPages}
                    onPageChange={handlePageChange}
                />
            )}
        </>
    ), [deliveryPoints, handleEdit, handleConfirmToggleStatus, isPending, isUnauthorized, fetchDeliveryPoints, handleOpenLoginDialog, currentPage, totalPages, handlePageChange]);

    return (
        <>
            <DataDisplayTemplate
                title={title}
                actionButtons={actionButtons}
                filters={filters}
                content={content}
            />
            <DeliveryPointDialog
                open={dialogOpen}
                onOpenChange={setDialogOpen}
                mode={dialogMode}
                deliveryPoint={selectedDeliveryPoint}
                onSubmit={handleDialogSubmit}
            />
            <SignInDialog
                open={loginDialogOpen}
                onOpenChange={setLoginDialogOpen}
            />
            <AlertDialog open={confirmDialogOpen} onOpenChange={handleCancelDialog}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>
                            {tCommon('confirmAction')}
                        </AlertDialogTitle>
                        <AlertDialogDescription>
                            {deliveryPointToToggle?.is_active
                                ? tDeliveryPoint('confirmDeactivate')
                                : tDeliveryPoint('confirmActivate')}
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel onClick={handleCancelDialog}>{tCommon('cancel')}</AlertDialogCancel>
                        <AlertDialogAction onClick={handleConfirmedToggle}>
                            {tCommon('confirm')}
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </>
    );
} 