"use client";

import DataDisplayTemplate from "@/components/templates/DataDisplayTemplate";
import SearchInput from "@/components/ui-custom/SearchInput";
import SortComponent from "@/components/ui-custom/SortComponent";
import StatusSearchDropdown from "@/components/ui-custom/StatusSearchDropdown";
import { Button } from "@/components/ui/button";
import { statusOptions } from "@/constants/options";
import { useURL } from "@/hooks/useURL";
import { FileDown, Plus, Printer } from "lucide-react";
import { useTranslations } from "next-intl";
import { useState, useEffect, useTransition, useCallback, useMemo } from "react";
import DeliveryPointList from "./DeliveryPointList";
import DeliveryPointDialog from "./DeliveryPointDialog";
import { DeliveryPointDto } from "@/dtos/config.dto";
import { formType } from "@/dtos/form.dto";
import { createDeliveryPoint, getAllDeliveryPoints, updateDeliveryPoint } from "@/services/dp.service";
import { useAuth } from "@/context/AuthContext";
import { toastError, toastSuccess } from "@/components/ui-custom/Toast";
import SignInDialog from "@/components/SignInDialog";
import { UnauthorizedMessage } from "@/components/UnauthorizedMessage";


export function DeliveryPointComponent() {
    const tCommon = useTranslations('Common');
    const tHeader = useTranslations('TableHeader');
    const tDeliveryPoint = useTranslations('DeliveryPoint');
    const { token } = useAuth();
    const [search, setSearch] = useURL('search');
    const [status, setStatus] = useURL('status');
    const [statusOpen, setStatusOpen] = useState(false);
    const [sort, setSort] = useURL('sort');
    const [deliveryPoints, setDeliveryPoints] = useState<DeliveryPointDto[]>([]);
    const [isPending, startTransition] = useTransition();
    const [dialogOpen, setDialogOpen] = useState(false);
    const [selectedDeliveryPoint, setSelectedDeliveryPoint] = useState<DeliveryPointDto | undefined>();
    const [dialogMode, setDialogMode] = useState<formType>(formType.ADD);
    const [loginDialogOpen, setLoginDialogOpen] = useState(false);
    const [isUnauthorized, setIsUnauthorized] = useState(false);

    const fetchDeliveryPoints = useCallback(() => {
        if (!token) return;

        const fetchData = async () => {
            try {
                setIsUnauthorized(false);
                const data = await getAllDeliveryPoints(token);
                if (data.statusCode === 401) {
                    setIsUnauthorized(true);
                    setLoginDialogOpen(true);
                    return;
                }
                setDeliveryPoints(data);
            } catch (error) {
                console.error('Error fetching delivery points:', error);
                toastError({ message: 'Error fetching delivery points' });
            }
        };

        startTransition(fetchData);
    }, [token]);

    useEffect(() => {
        fetchDeliveryPoints();
    }, [fetchDeliveryPoints]);

    const sortFields = useMemo(() => [
        { key: 'name', label: tHeader('name') },
    ], [tHeader]);

    const title = useMemo(() => tDeliveryPoint('title'), [tDeliveryPoint]);

    const handleOpenAddDialog = useCallback(() => {
        setDialogMode(formType.ADD);
        setSelectedDeliveryPoint(undefined);
        setDialogOpen(true);
    }, []);

    const handleEdit = useCallback((deliveryPoint: DeliveryPointDto) => {
        setDialogMode(formType.EDIT);
        setSelectedDeliveryPoint(deliveryPoint);
        setDialogOpen(true);
    }, []);

    const handleToggleStatus = useCallback((deliveryPoint: DeliveryPointDto) => {
        if (!token) return;

        const updateStatus = async () => {
            try {
                const updatedDeliveryPoint = {
                    ...deliveryPoint,
                    is_active: !deliveryPoint.is_active
                };
                await updateDeliveryPoint(token, updatedDeliveryPoint);

                const id = deliveryPoint.id;
                const updatedPoints = deliveryPoints.map(dp =>
                    dp.id === id ? updatedDeliveryPoint : dp
                );

                setDeliveryPoints(updatedPoints);
                toastSuccess({ message: 'Delivery point status updated successfully' });
            } catch (error) {
                console.error('Error toggling delivery point status:', error);
                toastError({ message: 'Error toggling delivery point status' });
            }
        };

        startTransition(updateStatus);
    }, [token, deliveryPoints]);

    const handleOpenLoginDialog = useCallback(() => {
        setLoginDialogOpen(true);
    }, []);

    const handleSubmit = useCallback((data: DeliveryPointDto) => {
        if (!token) return;

        const submitAdd = async () => {
            try {
                const result = await createDeliveryPoint(token, data);
                const newDeliveryPoint: DeliveryPointDto = {
                    ...data,
                    id: result.id,
                };

                const updatedPoints = [...deliveryPoints, newDeliveryPoint];
                setDeliveryPoints(updatedPoints);

                toastSuccess({ message: 'Delivery point created successfully' });
                setDialogOpen(false);
            } catch (error) {
                console.error('Error creating delivery point:', error);
                toastError({ message: 'Error creating delivery point' });
            }
        };

        const submitEdit = async () => {
            try {
                const updatedDeliveryPoint: DeliveryPointDto = {
                    ...data,
                    id: selectedDeliveryPoint?.id
                };
                await updateDeliveryPoint(token, updatedDeliveryPoint);

                const id = updatedDeliveryPoint.id;
                const updatedPoints = deliveryPoints.map(dp =>
                    dp.id === id ? updatedDeliveryPoint : dp
                );

                setDeliveryPoints(updatedPoints);
                toastSuccess({ message: 'Delivery point updated successfully' });
                setDialogOpen(false);
            } catch (error) {
                console.error('Error updating delivery point:', error);
                toastError({ message: 'Error updating delivery point' });
            }
        };

        if (dialogMode === formType.ADD) {
            startTransition(submitAdd);
        } else {
            startTransition(submitEdit);
        }
    }, [token, dialogMode, selectedDeliveryPoint, deliveryPoints]);

    const actionButtons = useMemo(() => (
        <div className="action-btn-container" data-id="delivery-point-list-action-buttons">
            <Button
                size="sm"
                onClick={handleOpenAddDialog}
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
    ), [tCommon, handleOpenAddDialog]);

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
                    options={statusOptions}
                    value={status}
                    onChange={setStatus}
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
    ), [search, setSearch, tCommon, status, setStatus, statusOpen, setStatusOpen, sortFields, sort, setSort]);

    const content = useMemo(() => (
        <>
            {isPending && (
                <div className="flex justify-center items-center min-h-[200px]">
                    <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
                </div>
            )}
            {!isPending && isUnauthorized && (
                <UnauthorizedMessage
                    onRetry={fetchDeliveryPoints}
                    onLogin={handleOpenLoginDialog}
                />
            )}
            {!isPending && !isUnauthorized && (
                <DeliveryPointList
                    deliveryPoints={deliveryPoints}
                    onEdit={handleEdit}
                    onToggleStatus={handleToggleStatus}
                />
            )}
        </>
    ), [deliveryPoints, handleEdit, handleToggleStatus, isPending, isUnauthorized, fetchDeliveryPoints, handleOpenLoginDialog]);

    return (
        <>
            <DataDisplayTemplate
                title={title}
                actionButtons={actionButtons}
                filters={filters}
                content={content}
                data-id="delivery-point-list-template"
            />
            <DeliveryPointDialog
                open={dialogOpen}
                onOpenChange={setDialogOpen}
                mode={dialogMode}
                deliveryPoint={selectedDeliveryPoint}
                onSubmit={handleSubmit}
                isLoading={isPending}
            />
            <SignInDialog
                open={loginDialogOpen}
                onOpenChange={setLoginDialogOpen}
            />
        </>
    );
} 