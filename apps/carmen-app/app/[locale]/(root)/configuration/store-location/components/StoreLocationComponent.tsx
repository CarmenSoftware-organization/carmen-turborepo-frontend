"use client";

import { useAuth } from "@/context/AuthContext";
import { useURL } from "@/hooks/useURL";
import { FileDown, Plus, Printer } from "lucide-react";
import { useTranslations } from "next-intl";
import { useCallback, useEffect, useState, useTransition } from "react";
import { Button } from "@/components/ui/button";
import SearchInput from "@/components/ui-custom/SearchInput";
import StatusSearchDropdown from "@/components/ui-custom/StatusSearchDropdown";
import SortComponent from "@/components/ui-custom/SortComponent";
import { statusOptions } from "@/constants/options";
import DataDisplayTemplate from "@/components/templates/DataDisplayTemplate";
import { CreateStoreLocationDto, StoreLocationDto } from "@/dtos/config.dto";
import { deleteStoreLocation, getAllStoreLocations, createStoreLocation, updateStoreLocation } from "@/services/store-location.service";
import SignInDialog from "@/components/SignInDialog";
import StoreLocationList from "./StoreLocationList";
import DeleteConfirmDialog from "@/components/ui-custom/DeleteConfirmDialog";
import StoreLocationDialog from "./StoreLocationDialog";
import { formType } from "@/dtos/form.dto";
import { toastError, toastSuccess } from "@/components/ui-custom/Toast";
import { UnauthorizedMessage } from "@/components/UnauthorizedMessage";

const handleAddStoreLocation = async (token: string, tenantId: string, data: CreateStoreLocationDto) => {
    const result = await createStoreLocation(token, tenantId, data);
    if (!result?.id || typeof result.id !== 'string') {
        throw new Error('Invalid response: missing or invalid id');
    }

    const newStoreLocation: StoreLocationDto = {
        id: result.id,
        name: data.name,
        location_type: data.location_type,
        description: data.description,
        is_active: data.is_active,
        info: data.info,
        delivery_point: {
            id: data.delivery_point_id,
            name: result.delivery_point?.name || '',
            is_active: result.delivery_point?.is_active ?? true
        }
    };
    return newStoreLocation;
};

const handleUpdateStoreLocation = async (token: string, tenantId: string, data: CreateStoreLocationDto, selectedId: string) => {
    const updateData = {
        ...data,
        id: selectedId
    };

    const result = await updateStoreLocation(token, tenantId, updateData);
    if (!result?.delivery_point) {
        throw new Error('Invalid response: missing delivery point data');
    }

    const updatedStoreLocation: StoreLocationDto = {
        id: selectedId,
        name: data.name,
        location_type: data.location_type,
        description: data.description,
        is_active: data.is_active,
        info: data.info,
        delivery_point: {
            id: data.delivery_point_id,
            name: result.delivery_point.name || '',
            is_active: result.delivery_point.is_active ?? true
        }
    };
    return updatedStoreLocation;
};

export default function StoreLocationComponent() {
    const { token, tenantId } = useAuth();
    const tCommon = useTranslations('Common');
    const tHeader = useTranslations('TableHeader');
    const tStoreLocation = useTranslations('StoreLocation');
    const [search, setSearch] = useURL('search');
    const [status, setStatus] = useURL('status');
    const [statusOpen, setStatusOpen] = useState(false);
    const [sort, setSort] = useURL('sort');
    const [storeLocations, setStoreLocations] = useState<StoreLocationDto[]>([]);
    const [isPending, startTransition] = useTransition();
    const [dialogOpen, setDialogOpen] = useState(false);
    const [selectedStoreLocation, setSelectedStoreLocation] = useState<StoreLocationDto>();
    const [dialogMode, setDialogMode] = useState<formType>(formType.ADD);
    const [loginDialogOpen, setLoginDialogOpen] = useState(false);
    const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
    const [isUnauthorized, setIsUnauthorized] = useState(false);

    const handleSubmitAdd = useCallback(async (token: string, tenantId: string, data: CreateStoreLocationDto) => {
        const newStoreLocation = await handleAddStoreLocation(token, tenantId, data);
        setStoreLocations(prev => [...prev, newStoreLocation]);
        toastSuccess({ message: 'Store location created successfully' });
        setDialogOpen(false);
    }, []);

    const handleSubmitEdit = useCallback(async (token: string, tenantId: string, data: CreateStoreLocationDto, selectedId: string) => {
        const newStoreLocation = await handleUpdateStoreLocation(token, tenantId, data, selectedId);
        setStoreLocations(prev => prev.map(loc =>
            loc.id === newStoreLocation.id ? newStoreLocation : loc
        ));
        toastSuccess({ message: 'Store location updated successfully' });
        setDialogOpen(false);
    }, []);

    const handleSubmit = useCallback((data: CreateStoreLocationDto) => {
        if (!token || !tenantId) return;

        const submitData = async () => {
            try {
                if (dialogMode === formType.ADD) {
                    await handleSubmitAdd(token, tenantId, data);
                } else if (selectedStoreLocation?.id) {
                    await handleSubmitEdit(token, tenantId, data, selectedStoreLocation.id);
                }
            } catch (error) {
                console.error('Error saving store location:', error);
                toastError({ message: 'Error saving store location' });
            }
        };

        startTransition(submitData);
    }, [token, tenantId, dialogMode, selectedStoreLocation, handleSubmitAdd, handleSubmitEdit]);

    const fetchStoreLocations = useCallback(() => {
        if (!token || !tenantId) return;

        const fetchData = async () => {
            try {
                setIsUnauthorized(false);
                const data = await getAllStoreLocations(token, tenantId);
                if (data.statusCode === 401) {
                    setIsUnauthorized(true);
                    setLoginDialogOpen(true);
                    return;
                }
                setStoreLocations(data);
            } catch (error) {
                console.error('Error fetching store locations:', error);
                toastError({ message: 'Error fetching store locations' });
            }
        };

        startTransition(fetchData);
    }, [token, tenantId]);

    useEffect(() => {
        fetchStoreLocations();
    }, [fetchStoreLocations]);

    const sortFields = [
        { key: 'name', label: tHeader('name') },
        { key: 'status', label: tHeader('status') },
    ];

    const handleOpenAddDialog = useCallback(() => {
        setDialogMode(formType.ADD);
        setSelectedStoreLocation(undefined);
        setDialogOpen(true);
    }, []);

    const handleEdit = useCallback((storeLocation: StoreLocationDto) => {
        setDialogMode(formType.EDIT);
        setSelectedStoreLocation(storeLocation);
        setDialogOpen(true);
    }, []);

    const handleDelete = useCallback((storeLocation: StoreLocationDto) => {
        setSelectedStoreLocation(storeLocation);
        setConfirmDialogOpen(true);
    }, []);

    const handleConfirmDelete = useCallback(async () => {
        if (!selectedStoreLocation?.id || !token || !tenantId) return;

        try {
            await deleteStoreLocation(token, tenantId, selectedStoreLocation.id);
            setStoreLocations(prev => prev.filter(loc => loc.id !== selectedStoreLocation.id));
            toastSuccess({ message: 'Store location deleted successfully' });
            setConfirmDialogOpen(false);
        } catch (error) {
            console.error('Error deleting store location:', error);
            toastError({ message: 'Error deleting store location' });
        }
    }, [selectedStoreLocation, token, tenantId]);

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
            {isPending && (
                <div className="flex justify-center items-center min-h-[200px]">
                    <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
                </div>
            )}
            {!isPending && isUnauthorized && (
                <UnauthorizedMessage
                    onRetry={fetchStoreLocations}
                    onLogin={() => setLoginDialogOpen(true)}
                />
            )}
            {!isPending && !isUnauthorized && (
                <StoreLocationList
                    storeLocations={storeLocations}
                    onEdit={handleEdit}
                    onDelete={handleDelete}
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
            <DeleteConfirmDialog
                open={confirmDialogOpen}
                onOpenChange={setConfirmDialogOpen}
                onConfirm={handleConfirmDelete}
                title="Delete Store Location"
                description="Are you sure you want to delete this store location?"
            />
        </>
    );
}
