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
import PaginationComponent from "@/components/PaginationComponent";

interface DepartmentListProps {
    readonly departments: DepartmentDto[];
    readonly onEdit: (department: DepartmentDto) => void;
    readonly onToggleStatus: (department: DepartmentDto) => void;
    readonly isLoading: boolean;
    readonly currentPage: number;
    readonly totalPages: number;
    readonly onPageChange: (page: number) => void;
}

export default function DepartmentList({
    departments,
    onEdit,
    onToggleStatus,
    isLoading,
    currentPage,
    totalPages,
    onPageChange
}: DepartmentListProps) {
    const t = useTranslations('TableHeader');

    const renderTableContent = () => {
        if (isLoading) return <TableBodySkeleton columns={4} />;

        if (departments.length === 0) {
            return (
                <TableBody>
                    <TableRow>
                        <TableCell colSpan={4} className="h-24 text-center">
                            <div className="flex flex-col items-center justify-center gap-2">
                                <p className="text-sm text-muted-foreground">No departments found</p>
                            </div>
                        </TableCell>
                    </TableRow>
                </TableBody>
            );
        }

        return (
            <TableBody>
                {departments.map((department, index) => (
                    <TableRow
                        key={department.id}
                    >
                        <TableCell>{index + 1}</TableCell>
                        <TableCell>
                            {department.name}
                        </TableCell>
                        <TableCell>
                            <Badge variant={department.is_active ? "default" : "destructive"}>
                                {department.is_active ? "Active" : "Inactive"}
                            </Badge>
                        </TableCell>
                        <TableCell className="w-20">
                            <div className="flex items-center justify-end gap-2">
                                <Button
                                    variant="ghost"
                                    size={'sm'}
                                    onClick={() => onEdit(department)}
                                    aria-label="Edit department"
                                >
                                    <Pencil className="h-4 w-4" />
                                </Button>
                                <Button
                                    variant="ghost"
                                    size={'sm'}
                                    onClick={() => onToggleStatus(department)}
                                    aria-label={`${department.is_active ? 'Deactivate' : 'Activate'} department`}
                                    disabled={!department.is_active}
                                >
                                    <Trash className="h-4 w-4 text-destructive" />
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
            <ScrollArea className="h-[calc(102vh-250px)] w-full">
                <Table>
                    <TableHeader className="sticky top-0">
                        <TableRow>
                            <TableHead>#</TableHead>
                            <TableHead>{t('name')}</TableHead>
                            <TableHead>{t('status')}</TableHead>
                            <TableHead className="w-20 text-right">{t('action')}</TableHead>
                        </TableRow>
                    </TableHeader>
                    {renderTableContent()}
                </Table>
            </ScrollArea>
            <PaginationComponent
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={onPageChange}
            />
        </div>
    );
} 