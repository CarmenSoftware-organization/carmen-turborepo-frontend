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
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";

interface UnitListProps {
    readonly units: UnitDto[];
    readonly onEdit: (unit: UnitDto) => void;
    readonly onDelete: (unit: UnitDto) => void;
    readonly isLoading: boolean;
}

export default function UnitList({ units, onEdit, onDelete, isLoading = false }: UnitListProps) {
    const t = useTranslations('TableHeader');

    const handleEdit = (unit: UnitDto) => {
        onEdit(unit);
    };

    const handleDelete = (unit: UnitDto) => {
        onDelete(unit);
    };

    return (
        <div className="space-y-4">
            <div className="relative">
                <Table>
                    <TableHeader className="sticky top-0 bg-background">
                        <TableRow>
                            <TableHead className="w-10">#</TableHead>
                            <TableHead className="md:w-56">{t('name')}</TableHead>
                            <TableHead>{t('description')}</TableHead>
                            <TableHead>{t('status')}</TableHead>
                            <TableHead className="text-right">{t('action')}</TableHead>
                        </TableRow>
                    </TableHeader>
                </Table>
                <ScrollArea className="h-[calc(102vh-300px)] w-full">
                    <Table>
                        {isLoading ? (
                            <TableBodySkeleton columns={5} />
                        ) : (
                            <TableBody>
                                {units.map((unit, index) => (
                                    <TableRow
                                        key={`unit-row-${unit.id}`}
                                        className={cn(
                                            !unit.is_active && "line-through opacity-70"
                                        )}
                                    >
                                        <TableCell className="w-10">{index + 1}</TableCell>
                                        <TableCell className="md:w-56">{unit.name}</TableCell>
                                        <TableCell>{unit.description}</TableCell>
                                        <TableCell>
                                            <Badge variant={unit.is_active ? "default" : "destructive"}>
                                                {unit.is_active ? 'Active' : 'Inactive'}
                                            </Badge>
                                        </TableCell>
                                        <TableCell className="text-right">
                                            <div className="flex items-center justify-end">
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    onClick={() => handleEdit(unit)}
                                                    disabled={!unit.is_active}
                                                >
                                                    <Pencil className="h-4 w-4" />
                                                </Button>
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    className="hover:text-destructive"
                                                    onClick={() => handleDelete(unit)}
                                                    disabled={!unit.is_active}
                                                >
                                                    <Trash className="h-4 w-4 text-destructive" />
                                                </Button>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        )}
                    </Table>
                </ScrollArea>
            </div>
        </div>
    );
}
