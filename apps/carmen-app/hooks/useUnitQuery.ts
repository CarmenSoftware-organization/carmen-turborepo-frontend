import { useURL } from "@/hooks/useURL";
import { useCallback, useEffect, useState, useMemo } from "react";
import { UnitDto } from "@/dtos/unit.dto";
import { createUnit, deleteUnit, getAllUnits, updateUnit } from "@/services/unit.service";
import { useAuth } from "@/context/AuthContext";
import { z } from "zod";
import { toastError, toastSuccess } from "@/components/ui-custom/Toast";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

// Types
type UnitsQueryData = {
    data: UnitDto[];
    paginate: { pages: number };
};



// Query Keys
const UNIT_QUERY_KEYS = {
    all: ['units'] as const,
    lists: () => [...UNIT_QUERY_KEYS.all, 'list'] as const,
    list: (params: {
        search?: string;
        page?: string;
        sort?: string;
        filter?: string;
        tenantId?: string;
    }) => [...UNIT_QUERY_KEYS.lists(), params] as const,
};

export const useUnitQuery = () => {
    const queryClient = useQueryClient();
    const { token, tenantId } = useAuth();
    const [page, setPage] = useURL('page');
    const [search, setSearch] = useURL('search');
    const [filter, setFilter] = useURL('filter');
    const [statusOpen, setStatusOpen] = useState(false);
    const [sort, setSort] = useURL('sort');
    const [dialogOpen, setDialogOpen] = useState(false);
    const [selectedUnit, setSelectedUnit] = useState<UnitDto | undefined>();
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

    useEffect(() => {
        if (search) {
            setPage('');
            setSort('');
        }
    }, [search, setPage, setSort]);

    // Query for fetching units
    const {
        data: unitsData,
        isLoading,
        error,
        isError
    } = useQuery({
        queryKey: UNIT_QUERY_KEYS.list({
            search: search || undefined,
            page: page || undefined,
            sort: sort || undefined,
            filter: filter || undefined,
            tenantId: tenantId || undefined
        }),
        queryFn: async () => {
            if (!token || !tenantId) {
                throw new Error('No authentication token or tenant ID');
            }

            const safeParams = {
                search: search || undefined,
                page: page || undefined,
                sort: sort || undefined,
                filter: filter || undefined
            };

            const data = await getAllUnits(token, tenantId, safeParams);

            if (data.status === 401) {
                throw new Error('Unauthorized');
            }

            if (!data.data || !data.paginate) {
                throw new Error('Unexpected data format from API');
            }

            return data;
        },
        enabled: !!token && !!tenantId,
        staleTime: 1000 * 60 * 5, // 5 minutes
        gcTime: 1000 * 60 * 10, // 10 minutes
    });

    const units = useMemo(() => unitsData?.data ?? [], [unitsData?.data]);
    const totalPages = unitsData?.paginate?.pages ?? 1;
    const isUnauthorized = isError && error?.message === 'Unauthorized';

    // Create Unit Mutation
    const createUnitMutation = useMutation({
        mutationFn: async (data: UnitDto) => {
            if (!token || !tenantId) {
                throw new Error('No authentication token or tenant ID');
            }
            return await createUnit(token, tenantId, data);
        },
        onSuccess: (result, variables) => {
            if (result && typeof result === 'object' && 'id' in result) {
                // Optimistically update the cache
                queryClient.setQueryData(
                    UNIT_QUERY_KEYS.list({
                        search: search || undefined,
                        page: page || undefined,
                        sort: sort || undefined,
                        filter: filter || undefined,
                        tenantId: tenantId || undefined
                    }),
                    (oldData: UnitsQueryData | undefined) => {
                        if (!oldData) return oldData;
                        const newUnit: UnitDto = {
                            ...variables,
                            id: result.id as string,
                        };
                        return {
                            ...oldData,
                            data: [...oldData.data, newUnit]
                        };
                    }
                );
                toastSuccess({ message: 'Unit created successfully' });
            } else {
                throw new Error('No ID returned from create unit');
            }
        },
        onError: (error) => {
            console.error('Error creating unit:', error);
            toastError({ message: 'Error creating unit' });
            if (error instanceof z.ZodError) {
                console.error('Zod Validation Errors:', error.errors);
            }
        },
    });

    // Update Unit Mutation
    const updateUnitMutation = useMutation({
        mutationFn: async (data: UnitDto & { id: string }) => {
            if (!token || !tenantId) {
                throw new Error('No authentication token or tenant ID');
            }
            return await updateUnit(token, tenantId, data);
        },
        onSuccess: (result, variables) => {
            // Optimistically update the cache
            queryClient.setQueryData(
                UNIT_QUERY_KEYS.list({
                    search: search || undefined,
                    page: page || undefined,
                    sort: sort || undefined,
                    filter: filter || undefined,
                    tenantId: tenantId || undefined
                }),
                (oldData: UnitsQueryData | undefined) => {
                    if (!oldData) return oldData;
                    return {
                        ...oldData,
                        data: oldData.data.map((unit: UnitDto) =>
                            unit.id === variables.id
                                ? { ...variables }
                                : unit
                        )
                    };
                }
            );
            toastSuccess({ message: 'Unit updated successfully' });
        },
        onError: (error) => {
            console.error('Error updating unit:', error);
            toastError({ message: 'Error updating unit' });
        },
    });

    // Delete Unit Mutation
    const deleteUnitMutation = useMutation({
        mutationFn: async (unit: UnitDto) => {
            if (!token || !tenantId) {
                throw new Error('No authentication token or tenant ID');
            }
            return await deleteUnit(token, tenantId, unit);
        },
        onSuccess: (result, variables) => {
            // Optimistically update the cache
            queryClient.setQueryData(
                UNIT_QUERY_KEYS.list({
                    search: search || undefined,
                    page: page || undefined,
                    sort: sort || undefined,
                    filter: filter || undefined,
                    tenantId: tenantId || undefined
                }),
                (oldData: UnitsQueryData | undefined) => {
                    if (!oldData) return oldData;
                    return {
                        ...oldData,
                        data: oldData.data.filter((unit: UnitDto) => unit.id !== variables.id)
                    };
                }
            );
            toastSuccess({ message: 'Unit deleted successfully' });
        },
        onError: (error) => {
            console.error('Error deleting unit:', error);
            toastError({ message: 'Error deleting unit' });
        },
    });

    const handleAdd = () => {
        setSelectedUnit(undefined);
        setDialogOpen(true);
    };

    const handleEdit = (unit: UnitDto) => {
        setSelectedUnit(unit);
        setDialogOpen(true);
    };

    const handleSubmit = async (data: UnitDto) => {
        try {
            if (selectedUnit?.id) {
                const updatedUnit = { ...data, id: selectedUnit.id };
                await updateUnitMutation.mutateAsync(updatedUnit);
            } else {
                await createUnitMutation.mutateAsync(data);
            }
            setDialogOpen(false);
            setSelectedUnit(undefined);
        } catch {
            // Error handling is done in the mutation's onError
        }
    };

    const handleDelete = (unit: UnitDto) => {
        setSelectedUnit(unit);
        setDeleteDialogOpen(true);
    };

    const handleConfirmDelete = async () => {
        if (!selectedUnit) return;
        try {
            await deleteUnitMutation.mutateAsync(selectedUnit);
            setDeleteDialogOpen(false);
            setSelectedUnit(undefined);
        } catch {
            // Error handling is done in the mutation's onError
        }
    };

    const handleCancelDelete = () => {
        setDeleteDialogOpen(false);
        setSelectedUnit(undefined);
    };

    const getUnitName = useCallback((unitId: string) => {
        console.log('unitId', unitId);
        const unit = units.find((unit: UnitDto) => unit.id === unitId);
        return unit?.name ?? '';
    }, [units]);

    return {
        // Data
        units,
        isLoading: isLoading || createUnitMutation.isPending || updateUnitMutation.isPending || deleteUnitMutation.isPending,
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
        handleCancelDelete,
        getUnitName,
        // Query states
        isError,
        error,
        // Mutation states
        isCreating: createUnitMutation.isPending,
        isUpdating: updateUnitMutation.isPending,
        isDeleting: deleteUnitMutation.isPending,
    };
};
