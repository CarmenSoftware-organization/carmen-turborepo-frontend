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
import { SquarePen, Trash } from "lucide-react";
import { TableBodySkeleton } from "@/components/loading/TableBodySkeleton";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import PaginationComponent from "@/components/PaginationComponent";

interface UnitListProps {
    readonly units: UnitDto[];
    readonly onEdit: (unit: UnitDto) => void;
    readonly onDelete: (unit: UnitDto) => void;
    readonly isLoading: boolean;
    readonly currentPage: number;
    readonly totalPages: number;
    readonly onPageChange: (page: number) => void;
}

export default function UnitList({
    units,
    onEdit,
    onDelete,
    isLoading = false,
    currentPage,
    totalPages,
    onPageChange
}: UnitListProps) {
    const t = useTranslations('TableHeader');

    const handleEdit = (unit: UnitDto) => {
        onEdit(unit);
    };

    const handleDelete = (unit: UnitDto) => {
        onDelete(unit);
    };

    const renderTableContent = () => {
        if (isLoading) return <TableBodySkeleton columns={5} />;

        if (units.length === 0) {
            return (
                <TableBody>
                    <TableRow>
                        <TableCell colSpan={5} className="h-12 text-center">
                            <div className="flex flex-col items-center justify-center gap-1">
                                <p className="text-sm text-muted-foreground">No units found</p>
                            </div>
                        </TableCell>
                    </TableRow>
                </TableBody>
            );
        }

        return (
            <TableBody>
                {units.map((unit, index) => (
                    <TableRow
                        key={`unit-row-${unit.id}`}
                        className={cn(
                            "h-12",
                            !unit.is_active && "line-through opacity-70"
                        )}
                    >
                        <TableCell className="w-10 text-center py-2">{index + 1}</TableCell>
                        <TableCell className="w-32 md:w-40 text-left py-2 truncate">{unit.name}</TableCell>
                        <TableCell className="text-left py-2 max-w-md truncate hidden md:table-cell">{unit.description}</TableCell>
                        <TableCell className="w-24 text-left py-2">
                            <Badge variant={unit.is_active ? "active" : "inactive"}>
                                {unit.is_active ? 'Active' : 'Inactive'}
                            </Badge>
                        </TableCell>
                        <TableCell className="w-16 text-right py-2">
                            <div className="flex items-center justify-end space-x-1">
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => handleEdit(unit)}
                                    disabled={!unit.is_active}
                                    className="h-6 w-6"
                                >
                                    <SquarePen className="h-3.5 w-3.5" />
                                </Button>
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    className="text-destructive hover:text-destructive/80 h-6 w-6"
                                    onClick={() => handleDelete(unit)}
                                    disabled={!unit.is_active}
                                >
                                    <Trash className="h-3.5 w-3.5" />
                                </Button>
                            </div>
                        </TableCell>
                    </TableRow>
                ))}
            </TableBody>
        );
    };

    return (
        <div className="space-y-3">
            <div className="relative">
                <Table className="border">
                    <TableHeader className="sticky top-0 bg-muted">
                        <TableRow className="h-10">
                            <TableHead className="w-10 text-center py-2">#</TableHead>
                            <TableHead className="w-32 md:w-40 text-left py-2">{t('name')}</TableHead>
                            <TableHead className="text-left py-2 hidden md:table-cell">{t('description')}</TableHead>
                            <TableHead className="w-24 text-left py-2">{t('status')}</TableHead>
                            <TableHead className="w-16 text-right py-2">{t('action')}</TableHead>
                        </TableRow>
                    </TableHeader>
                </Table>
                <ScrollArea className="h-[calc(100vh-280px)] w-full">
                    <Table className="border-collapse">
                        {renderTableContent()}
                    </Table>
                </ScrollArea>
            </div>

            {totalPages > 1 && (
                <PaginationComponent
                    currentPage={currentPage}
                    totalPages={totalPages}
                    onPageChange={onPageChange}
                />
            )}
        </div>
    );
}