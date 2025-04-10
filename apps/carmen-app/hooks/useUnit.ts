import { useURL } from "@/hooks/useURL";
import { useEffect, useState } from "react";
import { UnitDto } from "@/dtos/unit.dto";
import { createUnit, deleteUnit, getAllUnits, updateUnit } from "@/services/unit.service";
import { useAuth } from "@/context/AuthContext";
import { z } from "zod";
import { toastError, toastSuccess } from "@/components/ui-custom/Toast";

export const useUnit = () => {
    const { token, tenantId } = useAuth();
    const [units, setUnits] = useState<UnitDto[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isUnauthorized, setIsUnauthorized] = useState(false);
    const [totalPages, setTotalPages] = useState(1);
    const [page, setPage] = useURL('page');
    const [search, setSearch] = useURL('search');
    const [status, setStatus] = useURL('status');
    const [statusOpen, setStatusOpen] = useState(false);
    const [sort, setSort] = useURL('sort');
    const [dialogOpen, setDialogOpen] = useState(false);
    const [selectedUnit, setSelectedUnit] = useState<UnitDto | undefined>();
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

    useEffect(() => {
        if (search) {
            setPage('');
        }
    }, [search, setPage]);

    useEffect(() => {
        const fetchUnits = async () => {
            if (!token) return;
            try {
                setIsLoading(true);
                const data = await getAllUnits(token, tenantId, {
                    search,
                    page,
                    sort
                });
                if (data.statusCode === 401) {
                    setIsUnauthorized(true);
                    return;
                }
                setUnits(data.data);
                setTotalPages(data.paginate.pages);
            } catch (error) {
                console.error('Error fetching units:', error);
                toastError({ message: 'Error fetching units' });
            } finally {
                setIsLoading(false);
            }
        };

        fetchUnits();
    }, [token, tenantId, page, search, sort]);

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
            if (selectedUnit) {
                const updatedUnit = { ...data, id: selectedUnit.id };
                const result = await updateUnit(token, tenantId, updatedUnit);
                if (result) {
                    setUnits(units.map(unit =>
                        unit.id === selectedUnit.id
                            ? { ...data, id: unit.id }
                            : unit
                    ));
                    toastSuccess({ message: 'Unit updated successfully' });
                } else {
                    console.error('Error updating unit:', result);
                    toastError({ message: 'Error updating unit' });
                }
            } else {
                const result = await createUnit(token, tenantId, data);
                if (result) {
                    const newUnit: UnitDto = {
                        ...data,
                        id: result.id,
                    };
                    setUnits([...units, newUnit]);
                    toastSuccess({ message: 'Unit created successfully' });
                } else {
                    console.error('Error creating unit: No ID returned');
                    toastError({ message: 'Error creating unit' });
                }
            }
            setDialogOpen(false);
            setSelectedUnit(undefined);
        } catch (error) {
            console.error('Error submitting unit:', error);
            toastError({ message: 'Error submitting unit' });
            if (error instanceof z.ZodError) {
                console.error('Zod Validation Errors:', error.errors);
            }
        }
    };

    const handleDelete = (unit: UnitDto) => {
        setSelectedUnit(unit);
        setDeleteDialogOpen(true);
    };

    const handleConfirmDelete = async () => {
        if (!selectedUnit) return;
        try {
            setIsLoading(true);
            const result = await deleteUnit(token, tenantId, selectedUnit);
            if (result) {
                setUnits(prevUnits => prevUnits.filter(unit => unit.id !== selectedUnit.id));
                toastSuccess({ message: 'Unit deleted successfully' });
            } else {
                console.error('Error deleting unit:', result);
                toastError({ message: 'Error deleting unit' });
            }
        } catch (error) {
            console.error('Error deleting unit:', error);
            toastError({ message: 'Error deleting unit' });
        } finally {
            setIsLoading(false);
            setDeleteDialogOpen(false);
            setSelectedUnit(undefined);
        }
    };

    const handleCancelDelete = () => {
        setDeleteDialogOpen(false);
        setSelectedUnit(undefined);
    };

    return {
        // Data
        units,
        setUnits,
        isLoading,
        setIsLoading,
        isUnauthorized,
        totalPages,
        page,
        setPage,
        search,
        setSearch,
        status,
        setStatus,
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
    };
};
