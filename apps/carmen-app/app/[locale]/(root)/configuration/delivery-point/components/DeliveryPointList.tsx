"use client";

import { DeliveryPointDto } from "@/dtos/config.dto";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useTranslations } from "next-intl";
import { SquarePen, Trash } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { TableBodySkeleton } from "@/components/loading/TableBodySkeleton";
import PaginationComponent from "@/components/PaginationComponent";
import { SortConfig, getSortableColumnProps, renderSortIcon } from "@/utils/table-sort";

interface DeliveryPointListProps {
    readonly deliveryPoints: DeliveryPointDto[];
    readonly onEdit: (deliveryPoint: DeliveryPointDto) => void;
    readonly onToggleStatus: (deliveryPoint: DeliveryPointDto) => void;
    readonly isLoading: boolean;
    readonly currentPage: number;
    readonly totalPages: number;
    readonly onPageChange: (page: number) => void;
    readonly sort?: SortConfig;
    readonly onSort?: (field: string) => void;
}

export default function DeliveryPointList({
    deliveryPoints,
    onEdit,
    onToggleStatus,
    isLoading,
    currentPage,
    totalPages,
    onPageChange,
    sort,
    onSort
}: DeliveryPointListProps) {
    const t = useTranslations('TableHeader');

    const renderTableContent = () => {
        if (isLoading) return <TableBodySkeleton columns={4} />;

        if (deliveryPoints.length === 0) {
            return (
                <TableBody>
                    <TableRow>
                        <TableCell colSpan={4} className="h-24 text-center">
                            <div className="flex flex-col items-center justify-center gap-2">
                                <p className="text-sm text-muted-foreground">No delivery points found</p>
                            </div>
                        </TableCell>
                    </TableRow>
                </TableBody>
            );
        }

        return (
            <TableBody>
                {deliveryPoints.map((deliveryPoint, index) => (
                    <TableRow
                        key={deliveryPoint.id}
                    >
                        <TableCell className="w-10">{index + 1}</TableCell>
                        <TableCell className="md:w-56">{deliveryPoint.name}</TableCell>
                        <TableCell>
                            <Badge variant={deliveryPoint.is_active ? "active" : "inactive"}>
                                {deliveryPoint.is_active ? "Active" : "Inactive"}
                            </Badge>
                        </TableCell>
                        <TableCell className="w-20">
                            <div className="flex items-center justify-end">
                                <Button
                                    variant="ghost"
                                    size={'sm'}
                                    onClick={() => onEdit(deliveryPoint)}
                                    aria-label="Edit delivery point"
                                    className="h-7 w-7"
                                >
                                    <SquarePen className="h-4 w-4" />
                                </Button>
                                <Button
                                    variant="ghost"
                                    size={'sm'}
                                    onClick={() => onToggleStatus(deliveryPoint)}
                                    disabled={!deliveryPoint.is_active}
                                    aria-label={deliveryPoint.is_active ? "Deactivate delivery point" : "Activate delivery point"}
                                    className="h-7 w-7 text-destructive hover:text-destructive/80"
                                >
                                    <Trash className="h-4 w-4" />
                                </Button>
                            </div>
                        </TableCell>
                    </TableRow>
                ))}
            </TableBody>
        );
    };

    return (
        <div className="space-y-4">
            <div className="relative">
                <Table className="border">
                    <TableHeader className="sticky top-0 bg-muted">
                        <TableRow>
                            <TableHead className="w-10">#</TableHead>
                            <TableHead
                                {...getSortableColumnProps('name', sort, onSort, 'md:w-56')}
                            >
                                <div className="flex items-center">
                                    {t('name')}
                                    {renderSortIcon('name', sort)}
                                </div>
                            </TableHead>
                            <TableHead
                                {...getSortableColumnProps('is_active', sort, onSort)}
                            >
                                <div className="flex items-center">
                                    {t('status')}
                                    {renderSortIcon('is_active', sort)}
                                </div>
                            </TableHead>
                            <TableHead className="w-20 text-right">{t('action')}</TableHead>
                        </TableRow>
                    </TableHeader>
                </Table>
                <ScrollArea className="h-[calc(102vh-300px)] w-full">
                    <Table>
                        {renderTableContent()}
                    </Table>
                </ScrollArea>
            </div>
            <PaginationComponent
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={onPageChange}
            />
        </div>
    )
}
