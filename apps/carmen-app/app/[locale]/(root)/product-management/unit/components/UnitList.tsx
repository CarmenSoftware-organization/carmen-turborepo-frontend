"use client";

import { UnitDto } from "@/dtos/unit.dto";
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
import { TableBodySkeleton } from "@/components/loading/TableBodySkeleton";

interface UnitListProps {
    readonly units: UnitDto[];
    readonly onEdit: (unit: UnitDto) => void;
    readonly onDelete: (unit: UnitDto) => void;
    readonly isLoading: boolean;
}

export default function UnitList({ units, onEdit, onDelete, isLoading }: UnitListProps) {
    const t = useTranslations('TableHeader');

    const handleEdit = (unit: UnitDto) => {
        onEdit(unit);
    };

    const handleDelete = (unit: UnitDto) => {
        onDelete(unit);
    };

    return (
        <div className="space-y-4">
            <Table>
                <TableHeader className="sticky top-0">
                    <TableRow>
                        <TableHead className="w-10 hidden md:table-cell">#</TableHead>
                        <TableHead className="w-10 md:w-24">{t('name')}</TableHead>
                        <TableHead className="w-10 md:w-24">{t('description')}</TableHead>
                        <TableHead className="w-10 md:w-24">{t('status')}</TableHead>
                        <TableHead className="flex justify-end items-center">{t('action')}</TableHead>
                    </TableRow>
                </TableHeader>
                {isLoading ? (
                    <TableBodySkeleton columns={4} />
                ) : (
                    <TableBody>
                        {units.map((unit, index) => (
                            <TableRow key={`unit-row-${unit.id}`}>
                                <TableCell key={`unit-index-${unit.id}`} className="w-10 hidden md:table-cell">{index + 1}</TableCell>
                                <TableCell key={`unit-name-${unit.id}`} className="w-10 md:w-24">{unit.name}</TableCell>
                                <TableCell key={`unit-description-${unit.id}`} className="w-10 md:w-24">{unit.description}</TableCell>
                                <TableCell key={`unit-status-${unit.id}`} className="w-10 md:w-24">
                                    <Badge variant={unit.is_active ? "default" : "destructive"}>
                                        {unit.is_active ? 'Active' : 'Inactive'}
                                    </Badge>
                                </TableCell>
                                <TableCell key={`unit-actions-${unit.id}`} className="flex justify-end">
                                    <div className="flex items-center gap-2">
                                        <Button
                                            key={`unit-edit-${unit.id}`}
                                            variant="ghost"
                                            size="icon"
                                            onClick={() => handleEdit(unit)}
                                        >
                                            <Pencil className="h-4 w-4" />
                                        </Button>
                                        <Button
                                            key={`unit-delete-${unit.id}`}
                                            variant="ghost"
                                            size="icon"
                                            className="hover:text-destructive"
                                            onClick={() => handleDelete(unit)}
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
        </div>
    );
}
