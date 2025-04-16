"use client";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { FileDown, Plus, Printer } from "lucide-react";
import SearchInput from "@/components/ui-custom/SearchInput";
import StatusSearchDropdown from "@/components/ui-custom/StatusSearchDropdown";
import { boolFilterOptions } from "@/constants/options";
import SortComponent from "@/components/ui-custom/SortComponent";
import DataDisplayTemplate from "@/components/templates/DataDisplayTemplate";
import { formType } from "@/dtos/form.dto";
import DepartmentList from "./DepartmentList";
import DepartmentDialog from "./DepartmentDialog";
import SignInDialog from "@/components/SignInDialog";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useDepartment } from "@/hooks/useDepartment";

export default function DepartmentComponent() {
    const tDepartment = useTranslations('Department');
    const tCommon = useTranslations('Common');

    const {
        // State
        search,
        setSearch,
        filter,
        setFilter,
        statusOpen,
        setStatusOpen,
        sort,
        setSort,
        departments,
        isLoading,
        dialogOpen,
        setDialogOpen,
        statusDialogOpen,
        setStatusDialogOpen,
        loginDialogOpen,
        setLoginDialogOpen,
        selectedDepartment,
        page,
        totalPages,

        // Functions
        handlePageChange,
        sortFields,
        handleAdd,
        handleEdit,
        handleStatusChange,
        handleConfirmStatusChange,
        handleSubmit
    } = useDepartment();

    const title = tDepartment('title');

    const actionButtons = (
        <div className="action-btn-container" data-id="department-list-action-buttons">
            <Button size={'sm'} onClick={handleAdd}>
                <Plus className="h-4 w-4" />
                {tCommon('add')}
            </Button>
            <Button
                variant="outline"
                size={'sm'}
                data-id="department-export-button"
            >
                <FileDown className="h-4 w-4" />
                {tCommon('export')}
            </Button>
            <Button
                variant="outline"
                size={'sm'}
                data-id="department-print-button"
            >
                <Printer className="h-4 w-4" />
                {tCommon('print')}
            </Button>
        </div>
    );

    const filters = (
        <div className="filter-container" data-id="department-list-filters">
            <SearchInput
                defaultValue={search}
                onSearch={setSearch}
                placeholder={tCommon('search')}
                data-id="department-list-search-input"
            />
            <div className="flex items-center gap-2">
                <StatusSearchDropdown
                    options={boolFilterOptions}
                    value={filter}
                    onChange={setFilter}
                    open={statusOpen}
                    onOpenChange={setStatusOpen}
                    data-id="department-list-status-search-dropdown"
                />
                <SortComponent
                    fieldConfigs={sortFields}
                    sort={sort}
                    setSort={setSort}
                    data-id="department-list-sort-dropdown"
                />
            </div>
        </div>
    )

    const content = (
        <DepartmentList
            isLoading={isLoading}
            departments={departments}
            onEdit={handleEdit}
            onToggleStatus={handleStatusChange}
            currentPage={parseInt(page || '1')}
            totalPages={totalPages}
            onPageChange={handlePageChange}
        />
    )

    return (
        <div>
            <DataDisplayTemplate
                content={content}
                title={title}
                actionButtons={actionButtons}
                filters={filters}
            />
            <DepartmentDialog
                open={dialogOpen}
                onOpenChange={setDialogOpen}
                mode={selectedDepartment ? formType.EDIT : formType.ADD}
                department={selectedDepartment}
                onSubmit={handleSubmit}
            />
            <Dialog open={statusDialogOpen} onOpenChange={setStatusDialogOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>{selectedDepartment?.is_active ? 'Deactivate' : 'Activate'} Department</DialogTitle>
                        <DialogDescription>
                            Are you sure you want to {selectedDepartment?.is_active ? 'deactivate' : 'activate'} this department?
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
            <SignInDialog
                open={loginDialogOpen}
                onOpenChange={setLoginDialogOpen}
            />
        </div>
    )
};
