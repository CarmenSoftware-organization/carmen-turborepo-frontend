"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { ColumnDef, getCoreRowModel, useReactTable } from "@tanstack/react-table";
import { Check, Pencil, Plus, Trash2 } from "lucide-react";
import { DataGrid, DataGridContainer } from "@/components/ui/data-grid";
import { DataGridColumnHeader } from "@/components/ui/data-grid-column-header";
import { DataGridTable } from "@/components/ui/data-grid-table";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { MoqTierDto } from "./pl-external.dto";
import { formatNumberWithLocale } from "@/utils/format/number";
import NumberInput from "@/components/form-custom/NumberInput";
import DeleteConfirmDialog from "@/components/ui-custom/DeleteConfirmDialog";

interface MoqTiersSubTableProps {
  tiers: MoqTierDto[];
  onTiersUpdate?: (tiers: MoqTierDto[]) => void;
}

export default function MoqTiersSubTable({
  tiers,
  onTiersUpdate,
}: MoqTiersSubTableProps) {
  const [editingTierIds, setEditingTierIds] = useState<Set<string>>(new Set());
  const [localTiers, setLocalTiers] = useState<MoqTierDto[]>(tiers);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [tierToDelete, setTierToDelete] = useState<string | null>(null);

  // Track if local changes have been made
  const hasLocalChanges = useRef(false);

  // Sync with parent when tiers prop changes (only if no local changes)
  useEffect(() => {
    if (!hasLocalChanges.current) {
      setLocalTiers(tiers);
    }
  }, [tiers]);

  const handleToggleEdit = (tierId: string) => {
    setEditingTierIds((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(tierId)) {
        newSet.delete(tierId);
      } else {
        newSet.add(tierId);
      }
      return newSet;
    });
  };

  const handleAddNew = () => {
    const newId = `tier-new-${Date.now()}`;
    const newTier: MoqTierDto = {
      id: newId,
      minimum_quantity: 0,
      price: 0,
      lead_time_days: 0,
    };

    const updatedTiers = [...localTiers, newTier];
    hasLocalChanges.current = true;
    setLocalTiers(updatedTiers);
    onTiersUpdate?.(updatedTiers);
    setEditingTierIds((prev) => new Set(prev).add(newId));
  };

  const handleDeleteClick = (tierId: string) => {
    setTierToDelete(tierId);
    setDeleteDialogOpen(true);
  };

  const handleConfirmDelete = () => {
    if (!tierToDelete) return;

    const updatedTiers = localTiers.filter((tier) => tier.id !== tierToDelete);
    hasLocalChanges.current = true;
    setLocalTiers(updatedTiers);
    onTiersUpdate?.(updatedTiers);
    setDeleteDialogOpen(false);
    setTierToDelete(null);
  };

  const handleFieldChange = (tierId: string, field: keyof MoqTierDto, value: number) => {
    const updatedTiers = localTiers.map((tier) =>
      tier.id === tierId ? { ...tier, [field]: value } : tier
    );

    hasLocalChanges.current = true;
    setLocalTiers(updatedTiers);
    onTiersUpdate?.(updatedTiers);
  };

  const columns = useMemo<ColumnDef<MoqTierDto>[]>(
    () => [
      {
        accessorKey: "minimum_quantity",
        header: ({ column }) => <DataGridColumnHeader title="Minimum Qty" column={column} />,
        cell: (info) => {
          const isEditing = editingTierIds.has(info.row.original.id);
          const value = info.getValue() as number;

          if (isEditing) {
            return (
              <NumberInput
                value={value}
                onChange={(val) => handleFieldChange(info.row.original.id, "minimum_quantity", val)}
                classNames="h-7 text-xs"
                min={0}
              />
            );
          }

          return (
            <div className="font-medium text-xs">
              {formatNumberWithLocale(value, "en-US", 0)} units
            </div>
          );
        },
        size: 140,
      },
      {
        accessorKey: "price",
        header: ({ column }) => <DataGridColumnHeader title="Price" column={column} />,
        cell: (info) => {
          const isEditing = editingTierIds.has(info.row.original.id);
          const value = info.getValue() as number;

          if (isEditing) {
            return (
              <NumberInput
                value={value}
                onChange={(val) => handleFieldChange(info.row.original.id, "price", val)}
                classNames="h-7 text-xs"
                min={0}
              />
            );
          }

          return (
            <div className="font-medium text-primary text-xs">{formatNumberWithLocale(value)}</div>
          );
        },
        size: 120,
      },
      {
        accessorKey: "lead_time_days",
        header: ({ column }) => <DataGridColumnHeader title="Lead Time" column={column} />,
        cell: (info) => {
          const isEditing = editingTierIds.has(info.row.original.id);
          const value = info.getValue() as number | undefined;

          if (isEditing) {
            return (
              <NumberInput
                value={value ?? 0}
                onChange={(val) => handleFieldChange(info.row.original.id, "lead_time_days", val)}
                classNames="h-7 text-xs"
                min={0}
                placeholder="Days"
              />
            );
          }

          return (
            <div className="text-xs">
              {value ? `${value} ${value === 1 ? "day" : "days"}` : "-"}
            </div>
          );
        },
        size: 120,
      },
      {
        id: "actions",
        header: () => (
          <div className="flex justify-end">
            <Button onClick={handleAddNew} size="sm" variant="ghost" className="h-7 px-2">
              <Plus className="h-3 w-3" />
            </Button>
          </div>
        ),
        cell: (info) => {
          const isEditing = editingTierIds.has(info.row.original.id);

          return (
            <div className="flex justify-end gap-1">
              <Button
                onClick={() => handleToggleEdit(info.row.original.id)}
                size="sm"
                variant="ghost"
                className="h-7 px-2"
              >
                {isEditing ? (
                  <Check className="h-3 w-3 text-green-500" />
                ) : (
                  <Pencil className="h-3 w-3" />
                )}
              </Button>
              <Button
                onClick={() => handleDeleteClick(info.row.original.id)}
                size="sm"
                variant="ghost"
                className="h-7 px-2"
              >
                <Trash2 className="h-3 w-3 text-red-600" />
              </Button>
            </div>
          );
        },
        size: 80,
      },
    ],
    [editingTierIds, localTiers]
  );

  const table = useReactTable({
    data: localTiers,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getRowId: (row: MoqTierDto) => row.id,
  });

  if (localTiers.length === 0) {
    return (
      <div className="p-4 bg-muted/30">
        <div className="flex flex-col items-center justify-center py-6 text-center">
          <p className="text-sm text-muted-foreground mb-2">No MOQ tiers configured</p>
          <Button onClick={handleAddNew} size="sm" variant="outline">
            <Plus className="h-3 w-3 mr-1" />
            Add MOQ Tier
          </Button>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="p-4 bg-muted/30">
        <DataGrid
          table={table}
          recordCount={localTiers.length}
          tableLayout={{
            cellBorder: true,
            rowBorder: true,
            headerBackground: true,
            headerBorder: true,
            dense: true,
          }}
        >
          <DataGridContainer>
            <ScrollArea>
              <DataGridTable />
              <ScrollBar orientation="horizontal" />
            </ScrollArea>
          </DataGridContainer>
        </DataGrid>
      </div>

      <DeleteConfirmDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        onConfirm={handleConfirmDelete}
        title="Confirm Delete"
        description="Are you sure you want to delete this MOQ tier? This action cannot be undone."
      />
    </>
  );
}
