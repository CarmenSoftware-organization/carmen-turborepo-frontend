"use client";

import DataDisplayTemplate from "@/components/templates/DataDisplayTemplate";
import SearchInput from "@/components/ui-custom/SearchInput";
import SortComponent from "@/components/ui-custom/SortComponent";
import StatusSearchDropdown from "@/components/ui-custom/StatusSearchDropdown";
import { Button } from "@/components/ui/button";
import { FileDown, Plus, Printer } from "lucide-react";
import { useTranslations } from "next-intl";
import { useMemo, useState, useCallback, useEffect } from "react";
import DeliveryPointList from "./DeliveryPointList";
import DeliveryPointDialog from "./DeliveryPointDialog";
import { DeliveryPointDto } from "@/dtos/config.dto";
import { formType } from "@/dtos/form.dto";
import SignInDialog from "@/components/SignInDialog";
import { UnauthorizedMessage } from "@/components/UnauthorizedMessage";
import { useDeliveryPointQuery } from "@/hooks/useDeliveryPointQuery";
import { SortConfig, SortDirection } from "@/utils/table-sort";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { boolFilterOptions } from "@/constants/options";
import { toastError, toastSuccess } from "@/components/ui-custom/Toast";
import { useAuth } from "@/context/AuthContext";

export function DeliveryPointComponent() {
    const tCommon = useTranslations('Common');
    const tHeader = useTranslations('TableHeader');
    const tDeliveryPoint = useTranslations('DeliveryPoint');
    const { token } = useAuth();

    // State management
    const [isUnauthorized, setIsUnauthorized] = useState(false);
    const [dialogOpen, setDialogOpen] = useState(false);
    const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
    const [selectedDeliveryPoint, setSelectedDeliveryPoint] = useState<DeliveryPointDto | undefined>();
    const [statusOpen, setStatusOpen] = useState(false);
    const [loginDialogOpen, setLoginDialogOpen] = useState(false);

    // URL params state
    const [search, setSearch] = useState('');
    const [sort, setSort] = useState('');
    const [page, setPage] = useState('1');
    const [filter, setFilter] = useState('');

    // Get the query functions from our hook
    const {
        useGetDeliveryPoints,
        createDeliveryPointMutation,
        updateDeliveryPointMutation,
        toggleDeliveryPointStatusMutation
    } = useDeliveryPointQuery();

    // Fetch data with the query hook
    const {
        data,
        isPending,
        refetch: fetchDeliveryPoints
    } = useGetDeliveryPoints({
        search,
        page,
        perPage: '10',
        sort,
        filter
    });

    const deliveryPoints = data?.data ?? [];
    const totalPages = data?.paginate?.pages ?? 1;
    const currentPage = parseInt(page ?? '1');

    // Check for unauthorized responses
    useEffect(() => {
        if (data?.statusCode === 401) {
            setIsUnauthorized(true);
            setLoginDialogOpen(true);
        }
    }, [data]);

    // Reset pagination when search changes
    useEffect(() => {
        if (search) {
            setPage('1');
        }
    }, [search]);

    const handleAdd = useCallback(() => {
        setSelectedDeliveryPoint(undefined);
        setDialogOpen(true);
    }, []);

    const handleEdit = useCallback((deliveryPoint: DeliveryPointDto) => {
        setSelectedDeliveryPoint(deliveryPoint);
        setDialogOpen(true);
    }, []);

    const handleToggleStatus = useCallback((deliveryPoint: DeliveryPointDto) => {
        if (!deliveryPoint.id) {
            toastError({ message: 'Invalid delivery point ID' });
            return;
        }

        if (deliveryPoint.is_active) {
            setSelectedDeliveryPoint(deliveryPoint);
            setConfirmDialogOpen(true);
        } else {
            toggleDeliveryPointStatusMutation.mutate(deliveryPoint, {
                onSuccess: () => {
                    toastSuccess({ message: 'Delivery point activated successfully' });
                },
                onError: () => {
                    toastError({ message: 'Error toggling delivery point status' });
                }
            });
        }
    }, [toggleDeliveryPointStatusMutation]);

    const handleConfirmToggle = useCallback(() => {
        if (selectedDeliveryPoint) {
            toggleDeliveryPointStatusMutation.mutate(selectedDeliveryPoint, {
                onSuccess: () => {
                    toastSuccess({ message: 'Delivery point deactivated successfully' });
                    setConfirmDialogOpen(false);
                    setSelectedDeliveryPoint(undefined);
                },
                onError: () => {
                    toastError({ message: 'Error toggling delivery point status' });
                }
            });
        }
    }, [selectedDeliveryPoint, toggleDeliveryPointStatusMutation]);

    const handleSubmit = useCallback((data: DeliveryPointDto, mode: formType, selectedDP?: DeliveryPointDto) => {
        if (!token) return;

        if (mode === formType.ADD) {
            createDeliveryPointMutation.mutate(data, {
                onSuccess: () => {
                    toastSuccess({ message: 'Delivery point created successfully' });
                    setDialogOpen(false);
                },
                onError: () => {
                    toastError({ message: 'Error creating delivery point' });
                }
            });
        } else {
            const updatedDeliveryPoint: DeliveryPointDto = {
                ...data,
                id: selectedDP?.id
            };

            updateDeliveryPointMutation.mutate(updatedDeliveryPoint, {
                onSuccess: () => {
                    toastSuccess({ message: 'Delivery point updated successfully' });
                    setDialogOpen(false);
                    setSelectedDeliveryPoint(undefined);
                },
                onError: () => {
                    toastError({ message: 'Error updating delivery point' });
                }
            });
        }
    }, [token, createDeliveryPointMutation, updateDeliveryPointMutation]);

    const handlePageChange = useCallback((newPage: number) => {
        setPage(newPage.toString());
    }, []);

    const sortFields = useMemo(() => [
        { key: 'name', label: tHeader('name') },
        { key: 'is_active', label: tHeader('status') }
    ], [tHeader]);

    const title = useMemo(() => tDeliveryPoint('title'), [tDeliveryPoint]);

    const actionButtons = useMemo(() => (
        <div className="action-btn-container" data-id="delivery-point-list-action-buttons">
            <Button
                size="sm"
                onClick={handleAdd}
            >
                <Plus className="h-4 w-4" />
                {tCommon('add')}
            </Button>
            <Button
                variant="outline"
                className="group"
                size="sm"
                data-id="delivery-point-export-button"
            >
                <FileDown className="h-4 w-4" />
                {tCommon('export')}
            </Button>
            <Button
                variant="outline"
                size="sm"
                data-id="delivery-point-print-button"
            >
                <Printer className="h-4 w-4" />
                {tCommon('print')}
            </Button>
        </div>
    ), [tCommon, handleAdd]);

    const filters = useMemo(() => (
        <div className="filter-container" data-id="delivery-point-list-filters">
            <SearchInput
                defaultValue={search}
                onSearch={setSearch}
                placeholder={tCommon('search')}
                data-id="delivery-point-list-search-input"
            />
            <div className="flex items-center gap-2">
                <StatusSearchDropdown
                    options={boolFilterOptions}
                    value={filter}
                    onChange={setFilter}
                    open={statusOpen}
                    onOpenChange={setStatusOpen}
                    data-id="delivery-point-status-search-dropdown"
                />
                <SortComponent
                    fieldConfigs={sortFields}
                    sort={sort}
                    setSort={setSort}
                    data-id="delivery-point-sort-dropdown"
                />
            </div>
        </div>
    ), [search, setSearch, tCommon, filter, setFilter, statusOpen, setStatusOpen, sortFields, sort, setSort]);

    // Parse the sort string into field and direction
    const parsedSort = useMemo((): SortConfig | undefined => {
        if (!sort) return undefined;

        const parts = sort.split(':');
        if (parts.length !== 2) return undefined;

        return {
            field: parts[0],
            direction: parts[1] as SortDirection
        };
    }, [sort]);

    const content = useMemo(() => (
        <>
            {isUnauthorized ? (
                <UnauthorizedMessage
                    onRetry={fetchDeliveryPoints}
                    onLogin={() => setLoginDialogOpen(true)}
                />
            ) : (
                <DeliveryPointList
                    deliveryPoints={deliveryPoints}
                    onEdit={handleEdit}
                    onToggleStatus={handleToggleStatus}
                    isLoading={isPending}
                    currentPage={currentPage}
                    totalPages={totalPages}
                    onPageChange={handlePageChange}
                    sort={parsedSort}
                    onSort={(field) => {
                        const direction = parsedSort?.field === field && parsedSort.direction === 'asc' ? 'desc' : 'asc';
                        setSort(`${field}:${direction}`);
                    }}
                />
            )}
        </>
    ), [deliveryPoints, handleEdit, handleToggleStatus, isPending, isUnauthorized, fetchDeliveryPoints, setLoginDialogOpen, currentPage, totalPages, handlePageChange, parsedSort, setSort]);

    const handleDialogSubmit = (data: DeliveryPointDto) => {
        handleSubmit(data, selectedDeliveryPoint ? formType.EDIT : formType.ADD, selectedDeliveryPoint);
    };

    return (
        <>
            <DataDisplayTemplate
                title={title}
                actionButtons={actionButtons}
                filters={filters}
                content={content}
            />
            <DeliveryPointDialog
                open={dialogOpen}
                onOpenChange={setDialogOpen}
                mode={selectedDeliveryPoint ? formType.EDIT : formType.ADD}
                deliveryPoint={selectedDeliveryPoint}
                onSubmit={handleDialogSubmit}
            />
            <SignInDialog
                open={loginDialogOpen}
                onOpenChange={setLoginDialogOpen}
            />
            <AlertDialog open={confirmDialogOpen} onOpenChange={setConfirmDialogOpen}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>
                            {tCommon('confirmAction')}
                        </AlertDialogTitle>
                        <AlertDialogDescription>
                            {selectedDeliveryPoint?.is_active
                                ? tDeliveryPoint('confirmDeactivate')
                                : tDeliveryPoint('confirmActivate')}
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel onClick={() => setConfirmDialogOpen(false)}>{tCommon('cancel')}</AlertDialogCancel>
                        <AlertDialogAction onClick={handleConfirmToggle}>
                            {tCommon('confirm')}
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </>
    );
} 