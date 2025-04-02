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

export function DeliveryPointComponent() {
    const tCommon = useTranslations('Common');
    const tHeader = useTranslations('TableHeader');
    const tDeliveryPoint = useTranslations('DeliveryPoint');
    const [search, setSearch] = useURL('search');
    const [status, setStatus] = useURL('status');
    const [statusOpen, setStatusOpen] = useState(false);
    const [sort, setSort] = useURL('sort');
    const [dialogOpen, setDialogOpen] = useState(false);
    const [selectedDeliveryPoint, setSelectedDeliveryPoint] = useState<DeliveryPointDto | undefined>();
    const [dialogMode, setDialogMode] = useState<formType>(formType.ADD);
    const [loginDialogOpen, setLoginDialogOpen] = useState(false);

    const {
        deliveryPoints,
        isPending,
        isUnauthorized,
        fetchDeliveryPoints,
        handleToggleStatus,
        handleSubmit
    } = useDeliveryPoint();

    const sortFields = useMemo(() => [
        { key: 'name', label: tHeader('name') },
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
            {isPending && (
                <div className="flex justify-center items-center min-h-[200px]">
                    <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
                </div>
            )}
            {!isPending && isUnauthorized && (
                <UnauthorizedMessage
                    onRetry={fetchDeliveryPoints}
                    onLogin={handleOpenLoginDialog}
                />
            )}
            {!isPending && !isUnauthorized && (
                <DeliveryPointList
                    deliveryPoints={deliveryPoints}
                    onEdit={handleEdit}
                    onToggleStatus={handleToggleStatus}
                />
            )}
        </>
    ), [deliveryPoints, handleEdit, handleToggleStatus, isPending, isUnauthorized, fetchDeliveryPoints, handleOpenLoginDialog]);

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
        </>
    );
} 