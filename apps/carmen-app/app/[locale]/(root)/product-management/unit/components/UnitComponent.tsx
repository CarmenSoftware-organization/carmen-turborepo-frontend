"use client";
import { useURL } from "@/hooks/useURL";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { FileDown, Printer } from "lucide-react";
import { useTranslations } from "next-intl";
import SortComponent from "@/components/ui-custom/SortComponent";
import StatusSearchDropdown from "@/components/ui-custom/StatusSearchDropdown";
import SearchInput from "@/components/ui-custom/SearchInput";
import { statusOptions } from "@/constants/options";
import DataDisplayTemplate from "@/components/templates/DataDisplayTemplate";
import { mockUnits } from "@/mock-data/unit";
import UnitList from "./UnitList";
import UnitDialog from "./UnitDialog";
import DeleteConfirmDialog from "./DeleteConfirmDialog";
import { UnitDto } from "@/dtos/unit.dto";
import { generateNanoid } from "@/utils/nano-id";
import { formType } from "@/dtos/form.dto";
export default function UnitComponent() {
    const tCommon = useTranslations('Common');
    const tUnit = useTranslations('Unit');
    const [search, setSearch] = useURL('se  arch');
    const [status, setStatus] = useURL('status');
    const [statusOpen, setStatusOpen] = useState(false);
    const [sort, setSort] = useURL('sort');
    const [dialogOpen, setDialogOpen] = useState(false);
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [selectedUnit, setSelectedUnit] = useState<UnitDto | undefined>();
    const [units, setUnits] = useState<UnitDto[]>(mockUnits);

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

    const handleSubmit = (data: UnitDto) => {
        if (selectedUnit) {
            // Edit mode
            setUnits(units.map(unit =>
                unit.id === selectedUnit.id
                    ? { ...data, id: unit.id }
                    : unit
            ));
        } else {
            // Add mode
            const newUnit: UnitDto = {
                ...data,
                id: generateNanoid(),
            };
            setUnits([...units, newUnit]);
        }
    };

    const handleConfirmDelete = () => {
        if (selectedUnit) {
            setUnits(units.filter(unit => unit.id !== selectedUnit.id));
            setDeleteDialogOpen(false);
            setSelectedUnit(undefined);
        }
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
                onOpenChange={setDeleteDialogOpen}
                onConfirm={handleConfirmDelete}
            />
        </>
    );
}
