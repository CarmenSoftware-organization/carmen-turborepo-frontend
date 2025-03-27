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
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useTranslations } from "next-intl";
import { Pencil, Power } from "lucide-react";

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
            <div className="hidden md:block">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead className="w-10">#</TableHead>
                            <TableHead>{t('name')}</TableHead>
                            <TableHead>{t('status')}</TableHead>
                            <TableHead className="w-20 text-right">{t('action')}</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {deliveryPoints.map((deliveryPoint, index) => (
                            <TableRow key={deliveryPoint.id}>
                                <TableCell>{index + 1}</TableCell>
                                <TableCell>
                                    <div className="flex flex-col gap-1">
                                        <span className="font-medium">
                                            {deliveryPoint.name}
                                        </span>
                                    </div>
                                </TableCell>
                                <TableCell>
                                    <Badge variant={deliveryPoint.is_active ? "default" : "destructive"}>
                                        {deliveryPoint.is_active ? "Active" : "Inactive"}
                                    </Badge>
                                </TableCell>
                                <TableCell>
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
            </div>

            <div className="grid gap-4 md:hidden">
                {deliveryPoints.map((deliveryPoint) => (
                    <Card key={deliveryPoint.id}>
                        <CardHeader>
                            <CardTitle className="flex items-center justify-between">
                                <span>{deliveryPoint.name}</span>
                                <Badge variant={deliveryPoint.is_active ? "default" : "destructive"}>
                                    {deliveryPoint.is_active ? "Active" : "Inactive"}
                                </Badge>
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
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
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>
    )
}
