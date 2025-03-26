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
import { Pencil, Trash } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { TableBodySkeleton } from "@/components/loading/TableBodySkeleton";
import DeleteConfirmDialog from "@/components/ui-custom/DeleteConfirmDialog";
import { useState } from "react";

interface DeliveryPointListProps {
    readonly isLoading: boolean;
    readonly deliveryPoints: DeliveryPointDto[];
    readonly onEdit: (deliveryPoint: DeliveryPointDto) => void;
    readonly onDelete: (deliveryPoint: DeliveryPointDto) => void;
}

export default function DeliveryPointList({ isLoading, deliveryPoints, onEdit, onDelete }: DeliveryPointListProps) {
    const t = useTranslations('TableHeader');
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [selectedDeliveryPoint, setSelectedDeliveryPoint] = useState<DeliveryPointDto | undefined>();

    const handleEdit = (deliveryPoint: DeliveryPointDto) => {
        onEdit(deliveryPoint);
    };

    const handleDelete = (deliveryPoint: DeliveryPointDto) => {
        setSelectedDeliveryPoint(deliveryPoint);
        setDeleteDialogOpen(true);
    };

    const handleConfirmDelete = () => {
        if (selectedDeliveryPoint) {
            onDelete(selectedDeliveryPoint);
            setDeleteDialogOpen(false);
            setSelectedDeliveryPoint(undefined);
        }
    };

    const handleCancelDelete = () => {
        setDeleteDialogOpen(false);
        setSelectedDeliveryPoint(undefined);
    };

    return (
        <div className="space-y-4">
            <ScrollArea className="h-[calc(100vh-300px)]">
                <Table>
                    <TableHeader className="sticky top-0">
                        <TableRow>
                            <TableHead className="w-10 hidden md:table-cell">#</TableHead>
                            <TableHead className="w-10 md:w-24 hidden md:table-cell">{t('name')}</TableHead>
                            <TableHead className="w-10 md:w-24 md:text-center">{t('status')}</TableHead>
                            <TableHead className="text-right">{t('action')}</TableHead>
                        </TableRow>
                    </TableHeader>
                    {isLoading ? (
                        <TableBodySkeleton columns={4} />
                    ) : (
                        <TableBody>
                            {deliveryPoints.map((deliveryPoint: DeliveryPointDto, index: number) => (
                                <TableRow key={deliveryPoint.id}>
                                    <TableCell className="w-10 hidden md:table-cell">{index + 1}</TableCell>
                                    <TableCell className="w-10 md:w-24 hidden md:table-cell">{deliveryPoint.name}</TableCell>
                                    <TableCell className="w-10 md:w-24 md:text-center">
                                        <Badge variant={deliveryPoint.is_active ? "default" : "destructive"}>
                                            {deliveryPoint.is_active ? 'Active' : 'Inactive'}
                                        </Badge>
                                    </TableCell>
                                    <TableCell className="text-right p-0 pr-2">
                                        <div className="flex items-center justify-end gap-2">
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                onClick={() => handleEdit(deliveryPoint)}
                                                aria-label="Edit delivery point"
                                            >
                                                <Pencil className="h-4 w-4" />
                                            </Button>
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                className="hover:text-destructive"
                                                onClick={() => handleDelete(deliveryPoint)}
                                                aria-label="Delete delivery point"
                                            >
                                                <Trash className="h-4 w-4" />
                                            </Button>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    )}
                </Table>
            </ScrollArea>
            <DeleteConfirmDialog
                open={deleteDialogOpen}
                onOpenChange={handleCancelDelete}
                onConfirm={handleConfirmDelete}
            />
        </div>
    );
}
