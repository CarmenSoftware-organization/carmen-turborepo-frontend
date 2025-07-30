import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Trash2, SquarePen } from "lucide-react";
import { UnitDto } from "@/dtos/unit.dto";
import PaginationComponent from "@/components/PaginationComponent";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { TableBodySkeleton } from "@/components/loading/TableBodySkeleton";
import { Checkbox } from "@/components/ui/checkbox";

interface ListUnitProps {
    readonly units: UnitDto[];
    readonly isLoading: boolean;
    readonly currentPage: number;
    readonly totalPages: number;
    readonly onPageChange: (page: number) => void;
    readonly onEdit: (unit: UnitDto) => void;
    readonly onDelete: (unit: UnitDto) => void;
}

export default function ListUnit({ units, isLoading, currentPage, totalPages, onPageChange, onEdit, onDelete }: ListUnitProps) {
    return (
        <div className="space-y-4">
            <Table>
                <TableHeader className="bg-muted">
                    <TableRow>
                        <TableHead className="w-[20px] text-center">
                            <Checkbox />
                        </TableHead>
                        <TableHead className="w-[20px] text-center">#</TableHead>
                        <TableHead className="w-[220px]">Name</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead className="w-[100px] text-right">Actions</TableHead>
                    </TableRow>
                </TableHeader>
                {isLoading ? (
                    <TableBodySkeleton rows={5} />
                ) : (
                    <TableBody>
                        {units && units.length > 0 ? (
                            units.map((unit, index) => (
                                <UnitTableRow key={`unit-row-${unit.id}`} unit={unit} index={index} onEdit={onEdit} onDelete={onDelete} />
                            ))
                        ) : (
                            <TableRow>
                                <TableCell colSpan={3} className="text-center text-muted-foreground">
                                    No units found
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                )}

            </Table>
            <PaginationComponent
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={onPageChange}
            />
        </div>
    )
};

const UnitTableRow = ({ unit, index, onEdit, onDelete }: { unit: UnitDto, index: number, onEdit: (unit: UnitDto) => void, onDelete: (unit: UnitDto) => void }) => (
    <TableRow>
        <TableCell className="text-center">
            <Checkbox />
        </TableCell>
        <TableCell className="text-center">{index + 1}</TableCell>
        <TableCell className="">
            <div className="flex flex-col gap-1">
                <p className="font-semibold">{unit.name}</p>
                <p className="text-muted-foreground">
                    {unit.description || "No description"}
                </p>
            </div>
        </TableCell>
        <TableCell>
            <Badge variant={unit.is_active ? "active" : "inactive"}>
                {unit.is_active ? "Active" : "Inactive"}
            </Badge>
        </TableCell>
        <TableCell className="text-right">
            <Button
                variant="ghost"
                size="sm"
                onClick={() => onEdit(unit)}
                disabled={!unit.is_active}
                className="hover:text-muted-foreground hover:bg-transparent"
            >
                <SquarePen className="h-4 w-4" />
            </Button>
            <Button
                variant="ghost"
                size="sm"
                onClick={() => onDelete(unit)}
                disabled={!unit.is_active}
                className="hover:text-destructive hover:bg-transparent"
            >
                <Trash2 className="h-4 w-4" />
            </Button>
        </TableCell>
    </TableRow>
);
