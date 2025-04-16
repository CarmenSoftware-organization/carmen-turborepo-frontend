import { useAuth } from "@/context/AuthContext";
import { useURL } from "@/hooks/useURL";
import { useTranslations } from "next-intl";
import { useCallback, useEffect, useState } from "react";
import { CreateStoreLocationDto, StoreLocationDto } from "@/dtos/config.dto";
import { getAllStoreLocations, createStoreLocation, updateStoreLocation } from "@/services/store-location.service";
import { formType } from "@/dtos/form.dto";
import { toastError, toastSuccess } from "@/components/ui-custom/Toast";

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
    if (!result) {
        throw new Error('Failed to update store location');
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
            name: result?.delivery_point?.name ?? '',
            is_active: result?.delivery_point?.is_active ?? true
        }
    };
    return updatedStoreLocation;
};

const handleUpdateStoreLocationStatus = async (token: string, tenantId: string, storeLocation: StoreLocationDto) => {
    if (!storeLocation.id) return;

    const updateData = {
        name: storeLocation.name,
        location_type: storeLocation.location_type,
        description: storeLocation.description,
        is_active: !storeLocation.is_active,
        info: storeLocation.info,
        delivery_point_id: storeLocation.delivery_point?.id ?? '',
        id: storeLocation.id
    };

    const result = await updateStoreLocation(token, tenantId, updateData);
    if (!result) {
        throw new Error('Failed to update store location status');
    }

    return {
        ...storeLocation,
        is_active: !storeLocation.is_active
    };
};

export const useStoreLocation = () => {
    const { token, tenantId } = useAuth();
    const tHeader = useTranslations('TableHeader');
    const [search, setSearch] = useURL('search');
    const [filter, setFilter] = useURL('filter');
    const [statusOpen, setStatusOpen] = useState(false);
    const [sort, setSort] = useURL('sort');
    const [page, setPage] = useURL('page');
    const [storeLocations, setStoreLocations] = useState<StoreLocationDto[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [dialogOpen, setDialogOpen] = useState(false);
    const [selectedStoreLocation, setSelectedStoreLocation] = useState<StoreLocationDto>();
    const [dialogMode, setDialogMode] = useState<formType>(formType.ADD);
    const [loginDialogOpen, setLoginDialogOpen] = useState(false);
    const [statusDialogOpen, setStatusDialogOpen] = useState(false);
    const [isUnauthorized, setIsUnauthorized] = useState(false);
    const [totalPages, setTotalPages] = useState(1);

    const fetchStoreLocations = useCallback(async () => {
        if (!token || !tenantId) return;

        try {
            setIsLoading(true);
            setIsUnauthorized(false);
            const data = await getAllStoreLocations(token, tenantId, {
                search,
                sort,
                page,
                filter
            });
            if (data.statusCode === 401) {
                setIsUnauthorized(true);
                setLoginDialogOpen(true);
                return;
            }
            setStoreLocations(data.data);
            setTotalPages(data.paginate.pages);
        } catch (error) {
            console.error('Error fetching store locations:', error);
            toastError({ message: 'Error fetching store locations' });
        } finally {
            setIsLoading(false);
        }
    }, [token, tenantId, search, sort, page, filter]);

    useEffect(() => {
        if (search) {
            setPage('');
        }
    }, [search, setPage]);

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
        fetchStoreLocations();
        setDialogOpen(false);
    }, [fetchStoreLocations]);

    const handleSubmit = useCallback(async (data: CreateStoreLocationDto) => {
        if (!token || !tenantId) return;

        try {
            setIsSubmitting(true);
            if (dialogMode === formType.ADD) {
                await handleSubmitAdd(token, tenantId, data);
            } else if (selectedStoreLocation?.id) {
                await handleSubmitEdit(token, tenantId, data, selectedStoreLocation.id);
            }
        } catch (error) {
            console.error('Error saving store location:', error);
            toastError({ message: error instanceof Error ? error.message : 'Error saving store location' });
        } finally {
            setIsSubmitting(false);
        }
    }, [token, tenantId, dialogMode, selectedStoreLocation, handleSubmitAdd, handleSubmitEdit]);

    useEffect(() => {
        fetchStoreLocations();
    }, [fetchStoreLocations]);

    const handlePageChange = useCallback((newPage: number) => {
        setPage(newPage.toString());
    }, [setPage]);

    const sortFields = [
        { key: 'name', label: tHeader('name') },
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

    const handleStatusChange = useCallback((storeLocation: StoreLocationDto) => {
        setSelectedStoreLocation(storeLocation);
        setStatusDialogOpen(true);
    }, []);

    const handleConfirmStatusChange = useCallback(async () => {
        if (!selectedStoreLocation?.id || !token || !tenantId) return;

        try {
            setIsSubmitting(true);
            const updatedStoreLocation = await handleUpdateStoreLocationStatus(token, tenantId, selectedStoreLocation);
            if (!updatedStoreLocation) return;

            setStoreLocations(prev => prev.map(loc =>
                loc.id === selectedStoreLocation.id ? updatedStoreLocation : loc
            ));
            toastSuccess({ message: `Store location ${updatedStoreLocation.is_active ? 'activated' : 'deactivated'} successfully` });
        } catch (error) {
            console.error('Error updating store location status:', error);
            toastError({ message: error instanceof Error ? error.message : 'Error updating store location status' });
        } finally {
            setIsSubmitting(false);
            setStatusDialogOpen(false);
        }
    }, [selectedStoreLocation, token, tenantId]);

    return {
        // State
        search,
        setSearch,
        filter,
        setFilter,
        statusOpen,
        setStatusOpen,
        sort,
        setSort,
        page,
        setPage,
        storeLocations,
        isLoading,
        isSubmitting,
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
    };
}; 