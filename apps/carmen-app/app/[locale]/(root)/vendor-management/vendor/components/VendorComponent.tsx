"use client";

import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { FileDown, Plus, Printer } from "lucide-react";
import SearchInput from "@/components/ui-custom/SearchInput";
import StatusSearchDropdown from "@/components/ui-custom/StatusSearchDropdown";
import { boolFilterOptions } from "@/constants/options";
import SortComponent from "@/components/ui-custom/SortComponent";
import { useURL } from "@/hooks/useURL";
import { useEffect, useState, useCallback } from "react";
import DataDisplayTemplate from "@/components/templates/DataDisplayTemplate";
import VendorList from "./VendorList";
import VendorFormDialog from "./VendorFormDialog";
import { VendorDto } from "@/dtos/vendor-management";
import { getAllVendorService, deleteVendorService } from "@/services/vendor.service";
import { useAuth } from "@/context/AuthContext";
import SignInDialog from "@/components/SignInDialog";
import { formType } from "@/dtos/form.dto";
import DeleteConfirmDialog from "@/components/ui-custom/DeleteConfirmDialog";
import { toastError, toastSuccess } from "@/components/ui-custom/Toast";
import { UnauthorizedMessage } from "@/components/UnauthorizedMessage";


export default function VendorComponent() {
    const { token, tenantId } = useAuth();
    const tCommon = useTranslations('Common');
    const [search, setSearch] = useURL('search');
    const [filter, setFilter] = useURL('filter');
    const [statusOpen, setStatusOpen] = useState(false);
    const [sort, setSort] = useURL('sort');
    const [page, setPage] = useURL('page');
    const [vendors, setVendors] = useState<VendorDto[]>([]);
    const [openAddDialog, setOpenAddDialog] = useState(false);
    const [loginDialogOpen, setLoginDialogOpen] = useState(false);
    const [selectedVendor, setSelectedVendor] = useState<VendorDto | undefined>(undefined);
    const [currentMode, setCurrentMode] = useState<formType>(formType.ADD);
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [vendorToDelete, setVendorToDelete] = useState<VendorDto | undefined>(undefined);
    const [isDeleting, setIsDeleting] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [isUnauthorized, setIsUnauthorized] = useState(false);
    const [totalPages, setTotalPages] = useState(1);

    useEffect(() => {
        if (search) {
            setPage('');
            setFilter('');
        }
    }, [search, setPage, setFilter]);

    const fetchVendors = useCallback(async () => {
        setIsLoading(true);
        try {
            const data = await getAllVendorService(token, tenantId, {
                search,
                sort,
                page,
                filter
            });
            if (data.statusCode === 401) {
                setLoginDialogOpen(true);
                setIsUnauthorized(true);
                return;
            }
            setVendors(data.data);
            setTotalPages(data.paginate.pages);
        } catch (error) {
            console.error("Error fetching vendors:", error);
            toastError({ message: "Failed to fetch vendors" });
        } finally {
            setIsLoading(false);
        }
    }, [token, tenantId, search, sort, page, filter]);

    useEffect(() => {
        fetchVendors();
    }, [fetchVendors]);

    const handlePageChange = useCallback((newPage: number) => {
        setPage(newPage.toString());
    }, [setPage]);

    const sortFields = [
        { key: 'code', label: 'Code' },
        { key: 'name', label: 'Name' },
        { key: 'is_active', label: 'Status' },
    ];

    const title = "Vendor"

    const handleAddClick = () => {
        setCurrentMode(formType.ADD);
        setSelectedVendor(undefined);
        setOpenAddDialog(true);
    };

    const handleEditClick = (vendor: VendorDto) => {
        setCurrentMode(formType.EDIT);
        setSelectedVendor(vendor);
        setOpenAddDialog(true);
    };

    const handleDeleteClick = (vendor: VendorDto) => {
        setVendorToDelete(vendor);
        setDeleteDialogOpen(true);
    };

    const handleConfirmDelete = async () => {
        if (!vendorToDelete) return;

        try {
            setIsDeleting(true);
            const response = await deleteVendorService(token, tenantId, vendorToDelete);
            if (response) {
                toastSuccess({ message: "Vendor deleted successfully" });
                fetchVendors();
            } else {
                toastError({ message: "Failed to delete vendor" });
            }
        } catch (error) {
            console.error("Error deleting vendor:", error);
            toastError({ message: `Failed to delete vendor: ${error instanceof Error ? error.message : 'Unknown error'}` });
        } finally {
            setIsDeleting(false);
            setDeleteDialogOpen(false);
            setVendorToDelete(undefined);
        }
    };

    const handleFormSuccess = () => {
        fetchVendors();
    };

    const actionButtons = (
        <div className="action-btn-container" data-id="vendor-action-buttons">
            <Button size={'sm'} onClick={handleAddClick}>
                <Plus className="h-4 w-4" />
                {tCommon('add')}
            </Button>
            <Button
                variant="outline"
                className="group"
                size={'sm'}
                data-id="vendor-list-export-button"
            >
                <FileDown className="h-4 w-4" />
                {tCommon('export')}
            </Button>
            <Button
                variant="outline"
                size={'sm'}
                data-id="vendor-list-print-button"
            >
                <Printer className="h-4 w-4" />
                {tCommon('print')}
            </Button>
        </div>
    );

    const filters = (
        <div className="filter-container" data-id="vendor-list-filters">
            <SearchInput
                defaultValue={search}
                onSearch={setSearch}
                placeholder={tCommon('search')}
                data-id="vendor-list-search-input"
            />
            <div className="flex items-center gap-2">
                <StatusSearchDropdown
                    options={boolFilterOptions}
                    value={filter}
                    onChange={setFilter}
                    open={statusOpen}
                    onOpenChange={setStatusOpen}
                    data-id="vendor-list-status-search-dropdown"
                />
                <SortComponent
                    fieldConfigs={sortFields}
                    sort={sort}
                    setSort={setSort}
                    data-id="vendor-list-sort-dropdown"
                />
                <Button size={'sm'}>
                    Add Filter
                </Button>
            </div>
        </div>
    );

    const content = (
        <>
            {isUnauthorized ? (
                <UnauthorizedMessage
                    onRetry={fetchVendors}
                    onLogin={() => setLoginDialogOpen(true)}
                />
            ) : (
                <VendorList
                    vendors={vendors}
                    onEditClick={handleEditClick}
                    onDeleteClick={handleDeleteClick}
                    isLoading={isLoading}
                    currentPage={parseInt(page || '1')}
                    totalPages={totalPages}
                    onPageChange={handlePageChange}
                />
            )}
        </>
    );

    return (
        <>
            <DataDisplayTemplate
                title={title}
                actionButtons={actionButtons}
                filters={filters}
                content={content}
            />

            <VendorFormDialog
                open={openAddDialog}
                onOpenChange={setOpenAddDialog}
                onSuccess={handleFormSuccess}
                mode={currentMode}
                initialData={selectedVendor}
            />
            <SignInDialog
                open={loginDialogOpen}
                onOpenChange={setLoginDialogOpen}
            />
            <DeleteConfirmDialog
                open={deleteDialogOpen}
                onOpenChange={setDeleteDialogOpen}
                onConfirm={handleConfirmDelete}
                title="Delete Vendor"
                description={`Are you sure you want to delete vendor ${vendorToDelete?.name}?`}
                isLoading={isDeleting}
            />
        </>
    )
} 