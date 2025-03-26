"use client";

import { DepartmentDto } from "@/dtos/config.dto";
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

interface DepartmentListProps {
    readonly isLoading: boolean;
    readonly departments: DepartmentDto[];
    readonly onEdit: (department: DepartmentDto) => void;
    readonly onDelete: (department: DepartmentDto) => void;
}

export default function DepartmentList({ isLoading, departments, onEdit, onDelete }: DepartmentListProps) {
    const t = useTranslations('TableHeader');
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [selectedDepartment, setSelectedDepartment] = useState<DepartmentDto | undefined>();

    const handleEdit = (department: DepartmentDto) => {
        onEdit(department);
    };

    const handleDelete = (department: DepartmentDto) => {
        setSelectedDepartment(department);
        setDeleteDialogOpen(true);
    };

    const handleConfirmDelete = () => {
        if (selectedDepartment) {
            onDelete(selectedDepartment);
            setDeleteDialogOpen(false);
            setSelectedDepartment(undefined);
        }
    };

    const handleCancelDelete = () => {
        setDeleteDialogOpen(false);
        setSelectedDepartment(undefined);
    };

    return (
        <div className="space-y-4">
            <ScrollArea className="h-[calc(100vh-300px)]">
                <Table>
                    <TableHeader className="sticky top-0">
                        <TableRow>
                            <TableHead className="w-10 hidden md:table-cell">#</TableHead>
                            <TableHead className="w-10 md:w-24 hidden md:table-cell">{t('name')}</TableHead>
                            <TableHead className="w-10 md:w-24 hidden md:table-cell">{t('description')}</TableHead>
                            <TableHead className="w-10 md:w-24 md:text-center">{t('status')}</TableHead>
                            <TableHead className="text-right">{t('action')}</TableHead>
                        </TableRow>
                    </TableHeader>
                    {isLoading ? (
                        <TableBodySkeleton columns={4} />
                    ) : (
                        <TableBody>
                            {departments.map((department: DepartmentDto, index: number) => (
                                <TableRow key={department.id}>
                                    <TableCell className="w-10 hidden md:table-cell">{index + 1}</TableCell>
                                    <TableCell className="w-10 md:w-24 hidden md:table-cell">{department.name}</TableCell>
                                    <TableCell className="w-10 md:w-24 hidden md:table-cell">{department.description}</TableCell>
                                    <TableCell className="w-10 md:w-24 md:text-center">
                                        <Badge variant={department.is_active ? "default" : "destructive"}>
                                            {department.is_active ? 'Active' : 'Inactive'}
                                        </Badge>
                                    </TableCell>
                                    <TableCell className="text-right p-0 pr-2">
                                        <div className="flex items-center justify-end gap-2">
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                onClick={() => handleEdit(department)}
                                                aria-label="Edit department"
                                            >
                                                <Pencil className="h-4 w-4" />
                                            </Button>
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                className="hover:text-destructive"
                                                onClick={() => handleDelete(department)}
                                                aria-label="Delete department"
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