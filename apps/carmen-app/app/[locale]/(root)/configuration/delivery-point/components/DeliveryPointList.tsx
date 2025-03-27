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
import { Pencil, Power } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";

interface DeliveryPointListProps {
    readonly deliveryPoints: DeliveryPointDto[];
    readonly onEdit: (deliveryPoint: DeliveryPointDto) => void;
    readonly onToggleStatus: (deliveryPoint: DeliveryPointDto) => void;
}

export default function DeliveryPointList({
    deliveryPoints,
    onEdit,
    onToggleStatus
}: DeliveryPointListProps) {
    const t = useTranslations('TableHeader');
    return (
        <div className="space-y-4">
            <div className="relative">
                <Table>
                    <TableHeader className="sticky top-0 bg-background">
                        <TableRow>
                            <TableHead className="w-10">#</TableHead>
                            <TableHead className="md:w-56">{t('name')}</TableHead>
                            <TableHead>{t('status')}</TableHead>
                            <TableHead className="w-20 text-right">{t('action')}</TableHead>
                        </TableRow>
                    </TableHeader>
                </Table>
                <ScrollArea className="h-[calc(102vh-300px)] w-full">
                    <Table>
                        <TableBody>
                            {deliveryPoints.map((deliveryPoint, index) => (
                                <TableRow key={deliveryPoint.id}>
                                    <TableCell className="w-10">{index + 1}</TableCell>
                                    <TableCell className="md:w-56">{deliveryPoint.name}</TableCell>
                                    <TableCell>
                                        <Badge variant={deliveryPoint.is_active ? "default" : "destructive"}>
                                            {deliveryPoint.is_active ? "Active" : "Inactive"}
                                        </Badge>
                                    </TableCell>
                                    <TableCell className="w-20">
                                        <div className="flex items-center justify-end gap-2">
                                            <Button
                                                variant="ghost"
                                                size={'sm'}
                                                onClick={() => onEdit(deliveryPoint)}
                                            >
                                                <Pencil className="h-4 w-4" />
                                            </Button>
                                            <Button
                                                variant="ghost"
                                                size={'sm'}
                                                onClick={() => onToggleStatus(deliveryPoint)}
                                                className={deliveryPoint.is_active ? "hover:text-red-500" : "hover:text-green-500"}
                                            >
                                                <Power className="h-4 w-4" />
                                            </Button>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </ScrollArea>
            </div>
        </div>
    )
}
