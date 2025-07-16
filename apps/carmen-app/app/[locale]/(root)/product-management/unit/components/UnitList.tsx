"use client";

import { UnitDto } from "@/dtos/unit.dto";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { SquarePen, Trash2 } from "lucide-react";
import PaginationComponent from "@/components/PaginationComponent";
import { Skeleton } from "@/components/ui/skeleton";

interface UnitListProps {
  readonly units: UnitDto[];
  readonly onEdit: (unit: UnitDto) => void;
  readonly onDelete: (unit: UnitDto) => void;
  readonly isLoading: boolean;
  readonly currentPage: number;
  readonly totalPages: number;
  readonly onPageChange: (page: number) => void;
}

const UnitItemSkeleton = () => (
  <li className="p-2">
    <div className="flex items-center gap-4">
      <div className="w-80">
        <div className="flex items-center gap-2">
          <Skeleton className="h-4 w-32" />
          <Skeleton className="h-6 w-16 rounded-full" />
        </div>
        <Skeleton className="h-3 w-48 mt-1" />
      </div>
      <div className="flex gap-1">
        <Skeleton className="h-8 w-8" />
        <Skeleton className="h-8 w-8" />
      </div>
    </div>
  </li>
);

export default function UnitList({
  units,
  onEdit,
  onDelete,
  isLoading = false,
  currentPage,
  totalPages,
  onPageChange,
}: UnitListProps) {
  const handleEdit = (unit: UnitDto) => {
    onEdit(unit);
  };

  const handleDelete = (unit: UnitDto) => {
    onDelete(unit);
  };

  const renderUnitList = () => {
    if (isLoading) {
      return <UnitItemSkeleton />;
    }

    if (units && units.length > 0) {
      return units.map((unit) => (
        <li key={`unit-item-${unit.id}`} className="p-2">
          <div className="flex items-center gap-4">
            <div className="w-80">
              <div className="flex items-center gap-2">
                <p className="text-sm font-semibold">{unit.name}</p>
                <Badge variant={unit.is_active ? "active" : "inactive"}>
                  {unit.is_active ? "Active" : "Inactive"}
                </Badge>
              </div>
              <p className="text-xs text-muted-foreground">
                {unit.description ? unit.description : "No description"}
              </p>
            </div>
            <div className="flex gap-1">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleEdit(unit)}
                disabled={!unit.is_active}
                className="h-8 w-8"
              >
                <SquarePen className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="h-8 w-8"
                onClick={() => handleDelete(unit)}
                disabled={!unit.is_active}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </li>
      ));
    }

    return (
      <div className="text-center py-8 text-muted-foreground">
        <p>No units found</p>
      </div>
    );
  };

  return (
    <div className="space-y-4">
      <ul className="list-decimal list-outside pl-6">
        {renderUnitList()}
      </ul>

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
