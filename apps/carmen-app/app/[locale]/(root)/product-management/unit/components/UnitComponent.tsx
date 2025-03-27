"use client";
import { useURL } from "@/hooks/useURL";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { FileDown, Printer } from "lucide-react";
import { useTranslations } from "next-intl";
import SortComponent from "@/components/ui-custom/SortComponent";
import StatusSearchDropdown from "@/components/ui-custom/StatusSearchDropdown";
import SearchInput from "@/components/ui-custom/SearchInput";
import { statusOptions } from "@/constants/options";
import DataDisplayTemplate from "@/components/templates/DataDisplayTemplate";
import UnitList from "./UnitList";
import UnitDialog from "./UnitDialog";
import DeleteConfirmDialog from "./DeleteConfirmDialog";
import { UnitDto } from "@/dtos/unit.dto";
import { formType } from "@/dtos/form.dto";
import { createUnit, deleteUnit, getAllUnits, updateUnit } from "@/services/unit.service";
import { useAuth } from "@/context/AuthContext";
import { z } from "zod";
import { toastError, toastSuccess } from "@/components/ui-custom/Toast";

export default function UnitComponent() {
    const { token } = useAuth();
    const tCommon = useTranslations('Common');
    const tUnit = useTranslations('Unit');
    const [search, setSearch] = useURL('se  arch');
    const [status, setStatus] = useURL('status');
    const [statusOpen, setStatusOpen] = useState(false);
    const [sort, setSort] = useURL('sort');
    const [dialogOpen, setDialogOpen] = useState(false);
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [selectedUnit, setSelectedUnit] = useState<UnitDto | undefined>();
    const [units, setUnits] = useState<UnitDto[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchUnits = async () => {
            if (!token) return;
            try {
                setIsLoading(true);
                const data = await getAllUnits(token);
                setUnits(data);
            } catch (error) {
                console.error('Error fetching units:', error);
                toastError({ message: 'Error fetching units' });
            } finally {
                setIsLoading(false);
            }
        };
        fetchUnits();
    }, [token]);


    const sortFields = [
        { key: 'name', label: 'Name' },
        { key: 'code', label: 'Code' },
        { key: 'status', label: 'Status' },
    ];

    const title = tUnit('title');

    const handleAdd = () => {
        setSelectedUnit(undefined);
        setDialogOpen(true);
    };

    const handleEdit = (unit: UnitDto) => {
        setSelectedUnit(unit);
        setDialogOpen(true);
    };

    const handleDelete = (unit: UnitDto) => {
        setSelectedUnit(unit);
        setDeleteDialogOpen(true);
    };

    const handleSubmit = async (data: UnitDto) => {
        try {
            if (selectedUnit) {
                const updatedUnit = { ...data, id: selectedUnit.id };
                const result = await updateUnit(token, updatedUnit);
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
                const result = await createUnit(token, data);
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

    const handleConfirmDelete = async () => {
        if (!selectedUnit) return;
        try {
            setIsLoading(true);
            const result = await deleteUnit(token, selectedUnit);
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

    const actionButtons = (
        <div className="action-btn-container" data-id="unit-list-action-buttons">
            <Button size={'sm'} onClick={handleAdd}>
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
        <UnitList
            units={units}
            onEdit={handleEdit}
            onDelete={handleDelete}
            isLoading={isLoading}
            data-id="unit-list-template"
        />
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
        </>
    );
}
