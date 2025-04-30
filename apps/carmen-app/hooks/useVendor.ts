import { useState, useCallback, useEffect } from "react";
import { useURL } from "@/hooks/useURL";
import { getAllVendorService, deleteVendorService } from "@/services/vendor.service";
import { VendorGetDto } from "@/dtos/vendor-management";
import { toastError, toastSuccess } from "@/components/ui-custom/Toast";

export const useVendor = (token: string, tenantId: string) => {
    const [search, setSearch] = useURL('search');
    const [filter, setFilter] = useURL('filter');
    const [statusOpen, setStatusOpen] = useState(false);
    const [sort, setSort] = useURL('sort');
    const [page, setPage] = useURL('page');
    const [vendors, setVendors] = useState<VendorGetDto[]>([]);
    const [loginDialogOpen, setLoginDialogOpen] = useState(false);
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [vendorToDelete, setVendorToDelete] = useState<VendorGetDto | undefined>(undefined);
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

            if (!data) {
                setVendors([]);
                setTotalPages(1);
                return;
            }

            if (data.statusCode === 401) {
                setLoginDialogOpen(true);
                setIsUnauthorized(true);
                return;
            }

            // Safely handle data and pagination
            setVendors(Array.isArray(data.data) ? data.data : []);
            setTotalPages(data.paginate && typeof data.paginate.pages === 'number' ? data.paginate.pages : 1);
        } catch (error) {
            console.error("Error fetching vendors:", error);
            toastError({ message: "Failed to fetch vendors" });
            setVendors([]);
            setTotalPages(1);
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

    const handleDeleteClick = useCallback((vendor: VendorGetDto) => {
        setVendorToDelete(vendor);
        setDeleteDialogOpen(true);
    }, []);

    const handleConfirmDelete = useCallback(async () => {
        if (!vendorToDelete) return;

        try {
            setIsDeleting(true);
            // Pass only the id to deleteVendorService
            const response = await deleteVendorService(token, tenantId, vendorToDelete.id);

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
    }, [fetchVendors, token, tenantId, vendorToDelete]);

    const handleFormSuccess = useCallback(() => {
        fetchVendors();
    }, [fetchVendors]);

    const sortFields = [
        { key: 'code', label: 'Code' },
        { key: 'name', label: 'Name' },
        { key: 'is_active', label: 'Status' },
    ];

    return {
        // State
        search,
        filter,
        statusOpen,
        sort,
        page,
        vendors,
        loginDialogOpen,
        deleteDialogOpen,
        vendorToDelete,
        isDeleting,
        isLoading,
        isUnauthorized,
        totalPages,
        sortFields,

        // Actions
        setSearch,
        setFilter,
        setStatusOpen,
        setSort,
        setPage,
        setLoginDialogOpen,
        setDeleteDialogOpen,
        fetchVendors,
        handlePageChange,
        handleDeleteClick,
        handleConfirmDelete,
        handleFormSuccess
    };
}; 