"use client";
import { useURL } from "@/hooks/useURL";
import { useState, useEffect } from "react";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { FileDown, Plus, Printer } from "lucide-react";
import SearchInput from "@/components/ui-custom/SearchInput";
import StatusSearchDropdown from "@/components/ui-custom/StatusSearchDropdown";
import { statusOptions } from "@/constants/options";
import SortComponent from "@/components/ui-custom/SortComponent";
import DataDisplayTemplate from "@/components/templates/DataDisplayTemplate";
import { DepartmentDto } from "@/dtos/config.dto";
import { useAuth } from "@/context/AuthContext";
import { z } from "zod";
import { formType } from "@/dtos/form.dto";
import DepartmentList from "./DepartmentList";
import DepartmentDialog from "./DepartmentDialog";
import { createDepartment, getAllDepartments, updateDepartment } from "@/services/department.service";
import { toastError, toastSuccess } from "@/components/ui-custom/Toast";
import SignInDialog from "@/components/SignInDialog";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";

export default function DepartmentComponent() {
    const { token, tenantId } = useAuth();
    const tDepartment = useTranslations('Department');
    const tCommon = useTranslations('Common');
    const [search, setSearch] = useURL('search');
    const [status, setStatus] = useURL('status');
    const [statusOpen, setStatusOpen] = useState(false);
    const [sort, setSort] = useURL('sort');
    const [departments, setDepartments] = useState<DepartmentDto[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [dialogOpen, setDialogOpen] = useState(false);
    const [statusDialogOpen, setStatusDialogOpen] = useState(false);
    const [loginDialogOpen, setLoginDialogOpen] = useState(false);
    const [selectedDepartment, setSelectedDepartment] = useState<DepartmentDto | undefined>();

    useEffect(() => {
        const fetchDepartments = async () => {
            if (!token) return;
            try {
                setIsLoading(true);
                const data = await getAllDepartments(token, tenantId);
                if (data.statusCode === 401) {
                    setLoginDialogOpen(true);
                    return;
                }
                setDepartments(data);
            } catch (error) {
                console.error('Error fetching departments:', error);
                toastError({ message: 'Error fetching departments' });
            } finally {
                setIsLoading(false);
            }
        };
        fetchDepartments();
    }, [tenantId, token]);

    const sortFields = [
        { key: 'name', label: tDepartment('department_name') },
        { key: 'is_active', label: tDepartment('department_status') },
    ];

    const handleAdd = () => {
        setSelectedDepartment(undefined);
        setDialogOpen(true);
    };

    const handleEdit = (department: DepartmentDto) => {
        setSelectedDepartment(department);
        setDialogOpen(true);
    };

    const handleStatusChange = (department: DepartmentDto) => {
        setSelectedDepartment(department);
        setStatusDialogOpen(true);
    };

    const handleConfirmStatusChange = async () => {
        if (!selectedDepartment?.id || !token || !tenantId) return;

        try {
            const updatedDepartment = {
                ...selectedDepartment,
                is_active: !selectedDepartment.is_active
            };
            const result = await updateDepartment(token, tenantId, updatedDepartment);
            if (result) {
                setDepartments(prevDepartments =>
                    prevDepartments.map(dp =>
                        dp.id === selectedDepartment.id
                            ? { ...dp, is_active: !dp.is_active }
                            : dp
                    )
                );
                toastSuccess({ message: `Department ${!selectedDepartment.is_active ? 'activated' : 'deactivated'} successfully` });
                setStatusDialogOpen(false);
            }
        } catch (error) {
            console.error('Error updating department status:', error);
            toastError({ message: 'Error updating department status' });
        }
    };

    const handleSubmit = async (data: DepartmentDto) => {
        try {
            if (selectedDepartment) {
                const updatedDepartment = { ...data, id: selectedDepartment.id };
                const result = await updateDepartment(token, tenantId, updatedDepartment);
                if (result) {
                    setDepartments(prevDepartments =>
                        prevDepartments.map(dp =>
                            dp.id === selectedDepartment.id
                                ? updatedDepartment
                                : dp
                        )
                    )
                    toastSuccess({ message: 'Department updated successfully' });
                }
            } else {
                const result = await createDepartment(token, tenantId, data);
                const newDepartment: DepartmentDto = {
                    ...data,
                    id: result.id,
                };
                setDepartments(prevDepartments => [...prevDepartments, newDepartment]);
                toastSuccess({ message: 'Department created successfully' });
            }
            setDialogOpen(false);
            setSelectedDepartment(undefined);
        } catch (error) {
            console.error('Error handling department submission:', error);
            toastError({ message: 'Error handling department submission' });
            if (error instanceof z.ZodError) {
                console.error('Zod Validation Errors:', error.errors);
            }
        }
    };

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
                    options={statusOptions}
                    value={status}
                    onChange={setStatus}
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
