"use client";
import { useURL } from "@/hooks/useURL";
import { useState, useEffect } from "react";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { FileDown, Printer } from "lucide-react";
import SearchInput from "@/components/ui-custom/SearchInput";
import StatusSearchDropdown from "@/components/ui-custom/StatusSearchDropdown";
import { statusOptions } from "@/constants/options";
import SortComponent from "@/components/ui-custom/SortComponent";
import DataDisplayTemplate from "@/components/templates/DataDisplayTemplate";
import { DeliveryPointDto } from "@/dtos/config.dto";
import { useAuth } from "@/context/AuthContext";
import { createDeliveryPoint, deleteDeliveryPoint, getAllDeliveryPoints, updateDeliveryPoint } from "@/services/dp.service";
import { z } from "zod";
import DeliveryPointList from "./DeliveryPointList";
import DeliveryPointDialog from "./DeliveryPointDialog";
import DeleteConfirmDialog from "@/components/ui-custom/DeleteConfirmDialog";
import { formType } from "@/dtos/form.dto";

export default function DpComponent() {
    const { token } = useAuth();
    const tDeliveryPoint = useTranslations('DeliveryPoint');
    const tCommon = useTranslations('Common');
    const [search, setSearch] = useURL('search');
    const [status, setStatus] = useURL('status');
    const [statusOpen, setStatusOpen] = useState(false);
    const [sort, setSort] = useURL('sort');
    const [deliveryPoints, setDeliveryPoints] = useState<DeliveryPointDto[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [dialogOpen, setDialogOpen] = useState(false);
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [selectedDeliveryPoint, setSelectedDeliveryPoint] = useState<DeliveryPointDto | undefined>();

    useEffect(() => {
        const fetchDeliveryPoints = async () => {
            if (!token) return;
            try {
                setIsLoading(true);
                const data = await getAllDeliveryPoints(token);
                setDeliveryPoints(data);
            } catch (error) {
                console.error('Error fetching delivery points:', error);
            } finally {
                setIsLoading(false);
            }
        };
        fetchDeliveryPoints();

    }, [token]);

    const sortFields = [
        { key: 'name', label: tDeliveryPoint('delivery_point_name') },
        { key: 'is_active', label: tDeliveryPoint('delivery_point_status') },
    ];

    const handleAdd = () => {
        setSelectedDeliveryPoint(undefined);
        setDialogOpen(true);
    };

    const handleEdit = (deliveryPoint: DeliveryPointDto) => {
        setSelectedDeliveryPoint(deliveryPoint);
        setDialogOpen(true);
    };

    const handleDelete = async (deliveryPoint: DeliveryPointDto) => {
        try {
            setIsLoading(true);
            const result = await deleteDeliveryPoint(token, deliveryPoint);
            if (result) {
                setDeliveryPoints(prevDeliveryPoints =>
                    prevDeliveryPoints.filter(dp => dp.id !== deliveryPoint.id)
                );
            } else {
                console.error('Error deleting delivery point:', result);
            }
        } catch (error) {
            console.error('Error deleting delivery point:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleSubmit = async (data: DeliveryPointDto) => {
        try {
            if (selectedDeliveryPoint) {
                const updatedDeliveryPoint = { ...data, id: selectedDeliveryPoint.id };
                const result = await updateDeliveryPoint(token, updatedDeliveryPoint);
                if (result) {
                    setDeliveryPoints(prevDeliveryPoints =>
                        prevDeliveryPoints.map(dp =>
                            dp.id === selectedDeliveryPoint.id
                                ? updatedDeliveryPoint
                                : dp
                        )
                    );
                } else {
                    console.error('Error updating delivery point:', result);
                }
            } else {
                const result = await createDeliveryPoint(token, data);
                const newDeliveryPoint: DeliveryPointDto = {
                    ...data,
                    id: result.id,
                };
                setDeliveryPoints(prevDeliveryPoints => [...prevDeliveryPoints, newDeliveryPoint]);
            }
            setDialogOpen(false);
            setSelectedDeliveryPoint(undefined);
        } catch (error) {
            console.error('Error handling delivery point submission:', error);
            if (error instanceof z.ZodError) {
                console.error('Zod Validation Errors:', error.errors);
            }
        }
    };

    const handleConfirmDelete = async () => {
        if (!selectedDeliveryPoint) return;
        try {
            const result = await deleteDeliveryPoint(token, selectedDeliveryPoint);
            if (result) {
                setDeliveryPoints(prevDeliveryPoints =>
                    prevDeliveryPoints.filter(dp => dp.id !== selectedDeliveryPoint.id)
                );
            } else {
                console.error('Error deleting delivery point:', result);
            }
        } catch (error) {
            console.error('Error deleting delivery point:', error);
        }
    };

    const title = tDeliveryPoint('title');

    const actionButtons = (
        <div className="action-btn-container" data-id="delivery-point-list-action-buttons">
            <Button size={'sm'} onClick={handleAdd}>
                {tCommon('add')}
            </Button>
            <Button
                variant="outline"
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
                    data-id="delivery-point-list-status-search-dropdown"
                />
                <SortComponent
                    fieldConfigs={sortFields}
                    sort={sort}
                    setSort={setSort}
                    data-id="delivery-point-list-sort-dropdown"
                />
            </div>

        </div>
    )

    const content = <DeliveryPointList
        isLoading={isLoading}
        deliveryPoints={deliveryPoints}
        onEdit={handleEdit}
        onDelete={handleDelete}
    />
    return (
        <div>
            <DataDisplayTemplate
                content={content}
                title={title}
                actionButtons={actionButtons}
                filters={filters}
            />
            <DeliveryPointDialog
                open={dialogOpen}
                onOpenChange={setDialogOpen}
                mode={selectedDeliveryPoint ? formType.EDIT : formType.ADD}
                deliveryPoint={selectedDeliveryPoint}
                onSubmit={handleSubmit}
            />
            <DeleteConfirmDialog
                open={deleteDialogOpen}
                onOpenChange={setDeleteDialogOpen}
                onConfirm={handleConfirmDelete}
            />
        </div>
    )
};