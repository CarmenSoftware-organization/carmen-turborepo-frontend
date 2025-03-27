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
import { useState, useEffect } from "react";
import DeliveryPointList from "./DeliveryPointList";
import DeliveryPointDialog from "./DeliveryPointDialog";
import { DeliveryPointDto } from "@/dtos/config.dto";
import { formType } from "@/dtos/form.dto";
import { createDeliveryPoint, getAllDeliveryPoints, updateDeliveryPoint } from "@/services/dp.service";
import { useAuth } from "@/context/AuthContext";
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
    const [isLoading, setIsLoading] = useState(false);
    const [dialogOpen, setDialogOpen] = useState(false);
    const [selectedDeliveryPoint, setSelectedDeliveryPoint] = useState<DeliveryPointDto | undefined>();
    const [dialogMode, setDialogMode] = useState<formType>(formType.ADD);

    useEffect(() => {
        const fetchDeliveryPoints = async () => {
            try {
                setIsLoading(true);
                const data = await getAllDeliveryPoints(token || '');
                setDeliveryPoints(data);
            } catch (error) {
                console.error('Error fetching delivery points:', error);
            } finally {
                setIsLoading(false);
            }
        };

        if (token) {
            fetchDeliveryPoints();
        }
    }, [token]);

    const sortFields = [
        { key: 'name', label: tHeader('name') },
    ];

    const title = tDeliveryPoint('title');

    const actionButtons = (
        <div className="action-btn-container" data-id="delivery-point-list-action-buttons">
            <Button
                size={'sm'}
                onClick={() => {
                    setDialogMode(formType.ADD);
                    setSelectedDeliveryPoint(undefined);
                    setDialogOpen(true);
                }}
            >
                <Plus />
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
    );

    const handleEdit = (deliveryPoint: DeliveryPointDto) => {
        setDialogMode(formType.EDIT);
        setSelectedDeliveryPoint(deliveryPoint);
        setDialogOpen(true);
    };

    const handleToggleStatus = async (deliveryPoint: DeliveryPointDto) => {
        try {
            setIsLoading(true);
            const updatedDeliveryPoint = {
                ...deliveryPoint,
                is_active: !deliveryPoint.is_active
            };
            await updateDeliveryPoint(token || '', updatedDeliveryPoint);
            setDeliveryPoints(prev =>
                prev.map(dp =>
                    dp.id === deliveryPoint.id ? updatedDeliveryPoint : dp
                )
            );
        } catch (error) {
            console.error('Error toggling delivery point status:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleSubmit = async (data: DeliveryPointDto) => {
        try {
            setIsLoading(true);
            if (dialogMode === formType.ADD) {
                const result = await createDeliveryPoint(token, data);
                const newDeliveryPoint: DeliveryPointDto = {
                    ...data,
                    id: result.id,
                };
                setDeliveryPoints(prev => [...prev, newDeliveryPoint]);
            } else {
                const updatedDeliveryPoint = {
                    ...data,
                    id: selectedDeliveryPoint?.id
                };
                await updateDeliveryPoint(token, updatedDeliveryPoint);
                setDeliveryPoints(prev =>
                    prev.map(dp =>
                        dp.id === data.id ? data : dp
                    )
                );
            }
            setDialogOpen(false);
        } catch (error) {
            console.error('Error submitting delivery point:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const content = (
        <DeliveryPointList
            deliveryPoints={deliveryPoints}
            onEdit={handleEdit}
            onToggleStatus={handleToggleStatus}
        />
    );

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
                isLoading={isLoading}
            />
        </>
    );
} 