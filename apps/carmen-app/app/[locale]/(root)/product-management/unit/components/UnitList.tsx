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
import { SquarePen, Trash2 } from "lucide-react";
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
  onPageChange,
}: UnitListProps) {
  const t = useTranslations("TableHeader");

  const handleEdit = (unit: UnitDto) => {
    onEdit(unit);
  };

  const handleDelete = (unit: UnitDto) => {
    onDelete(unit);
  };

  const renderTableContent = () => {
    if (isLoading) return <TableBodySkeleton rows={5} />;

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
            className={cn("h-12", !unit.is_active && "line-through opacity-70")}
          >
            <TableCell className="text-center w-10">{index + 1}</TableCell>
            <TableCell className="text-left w-[300px]">
              <p className="text-xs font-semibold">{unit.name}</p>
              <p className="text-xs text-muted-foreground">
                {unit.description}
              </p>
            </TableCell>
            <TableCell className="text-center w-[100px]">
              <Badge variant={unit.is_active ? "active" : "inactive"}>
                {unit.is_active ? "Active" : "Inactive"}
              </Badge>
            </TableCell>
            <TableCell className="text-center w-[100px] ">
              <div className="flex items-center justify-center space-x-1">
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
                  className="h-6 w-6"
                  onClick={() => handleDelete(unit)}
                  disabled={!unit.is_active}
                >
                  <Trash2 className="h-3.5 w-3.5" />
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
        <ScrollArea className="h-[calc(100vh-280px)] w-full">
          <Table className="border">
            <TableHeader className="sticky top-0 bg-muted">
              <TableRow className="h-10">
                <TableHead className="w-10 text-center">#</TableHead>
                <TableHead className="w-[300px] text-left">
                  {t("name")}
                </TableHead>
                <TableHead className="w-[100px] text-center">
                  {t("status")}
                </TableHead>
                <TableHead className="w-[100px] text-center">
                  {t("action")}
                </TableHead>
              </TableRow>
            </TableHeader>
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
