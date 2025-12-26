"use client";

import { useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { DataGrid, DataGridContainer } from "@/components/ui/data-grid";
import { DataGridColumnHeader } from "@/components/ui/data-grid-column-header";
import { DataGridPagination } from "@/components/ui/data-grid-pagination";
import { DataGridTable } from "@/components/ui/data-grid-table";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import {
  ColumnDef,
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  PaginationState,
  SortingState,
  useReactTable,
} from "@tanstack/react-table";
import { Check, Pencil, Plus, Trash2 } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import type { MoqTierDto } from "../_dto/vendor-entry.dto";
import { formatNumberWithLocale } from "@/utils/format/number";
import { toastSuccess } from "@/components/ui-custom/Toast";

interface MoqTiersSubTableProps {
  tiers: MoqTierDto[];
  vendorItemId: string;
  onTiersUpdate: (updatedTiers: MoqTierDto[]) => void;
}

export default function MoqTiersSubTable({
  tiers,
  vendorItemId,
  onTiersUpdate,
}: MoqTiersSubTableProps) {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 5,
  });
  const [editingTierIds, setEditingTierIds] = useState<Set<string>>(new Set());
  const [localTiers, setLocalTiers] = useState<MoqTierDto[]>(tiers);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [tierToDelete, setTierToDelete] = useState<string | null>(null);

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
      minimumQuantity: 0,
      price: 0,
      leadTimeInDays: 0,
    };

    const updatedTiers = [...localTiers, newTier];
    setLocalTiers(updatedTiers);
    onTiersUpdate(updatedTiers);
    setEditingTierIds((prev) => new Set(prev).add(newId));
  };

  const handleDeleteClick = (tierId: string) => {
    setTierToDelete(tierId);
    setDeleteDialogOpen(true);
  };

  const handleConfirmDelete = () => {
    if (!tierToDelete) return;

    const updatedTiers = localTiers.filter((tier) => tier.id !== tierToDelete);
    setLocalTiers(updatedTiers);
    onTiersUpdate(updatedTiers);
    toastSuccess({ message: "MOQ tier deleted successfully" });
    setDeleteDialogOpen(false);
    setTierToDelete(null);
  };

  const handleCancelDelete = () => {
    setDeleteDialogOpen(false);
    setTierToDelete(null);
  };

  const handleFieldChange = (tierId: string, field: keyof MoqTierDto, value: string) => {
    const numValue =
      field === "minimumQuantity" || field === "price" || field === "leadTimeInDays"
        ? parseFloat(value) || 0
        : value;

    const updatedTiers = localTiers.map((tier) =>
      tier.id === tierId ? { ...tier, [field]: numValue } : tier
    );

    setLocalTiers(updatedTiers);
    onTiersUpdate(updatedTiers);
  };

  const columns = useMemo<ColumnDef<MoqTierDto>[]>(
    () => [
      {
        accessorKey: "minimumQuantity",
        header: ({ column }) => <DataGridColumnHeader title="Minimum Quantity" column={column} />,
        cell: (info) => {
          const isEditing = editingTierIds.has(info.row.original.id);
          const value = info.getValue() as number;

          if (isEditing) {
            return (
              <Input
                type="number"
                value={value}
                onChange={(e) =>
                  handleFieldChange(info.row.original.id, "minimumQuantity", e.target.value)
                }
                className="h-8"
                min="0"
              />
            );
          }

          return (
            <div className="font-medium">{formatNumberWithLocale(value, "en-US", 0)} units</div>
          );
        },
        enableSorting: true,
        size: 180,
      },
      {
        accessorKey: "price",
        header: ({ column }) => <DataGridColumnHeader title="Price" column={column} />,
        cell: (info) => {
          const isEditing = editingTierIds.has(info.row.original.id);
          const value = info.getValue() as number;

          if (isEditing) {
            return (
              <Input
                type="number"
                value={value}
                onChange={(e) => handleFieldChange(info.row.original.id, "price", e.target.value)}
                className="h-8"
                min="0"
                step="0.01"
              />
            );
          }

          return <div className="font-medium text-primary">฿{formatNumberWithLocale(value)}</div>;
        },
        enableSorting: true,
        size: 140,
      },
      {
        accessorKey: "leadTimeInDays",
        header: ({ column }) => <DataGridColumnHeader title="Lead Time" column={column} />,
        cell: (info) => {
          const isEditing = editingTierIds.has(info.row.original.id);
          const value = info.getValue() as number | undefined;

          if (isEditing) {
            return (
              <Input
                type="number"
                value={value ?? ""}
                onChange={(e) =>
                  handleFieldChange(info.row.original.id, "leadTimeInDays", e.target.value)
                }
                className="h-8"
                min="0"
                placeholder="Days"
              />
            );
          }

          return (
            <div className="text-sm">
              {value ? `${value} ${value === 1 ? "day" : "days"}` : "-"}
            </div>
          );
        },
        enableSorting: true,
        size: 140,
      },
      {
        id: "actions",
        header: () => (
          <div className="flex justify-end">
            <Button onClick={handleAddNew} size="sm" variant="ghost" className="h-8 px-2">
              <Plus className="h-4 w-4" />
            </Button>
          </div>
        ),
        cell: (info) => {
          const isEditing = editingTierIds.has(info.row.original.id);

          return (
            <div className="flex justify-end">
              <Button
                onClick={() => handleToggleEdit(info.row.original.id)}
                size="sm"
                variant="ghost"
                className="h-8 px-2"
              >
                {isEditing ? (
                  <Check className="h-4 w-4 text-green-500" />
                ) : (
                  <Pencil className="h-4 w-4" />
                )}
                {/* <Pencil className={`h-4 w-4 ${isEditing ? "text-primary" : ""}`} /> */}
              </Button>
              <Button
                onClick={() => handleDeleteClick(info.row.original.id)}
                size="sm"
                variant="ghost"
                className="h-8 px-2"
              >
                <Trash2 className="h-4 w-4 text-red-600" />
              </Button>
            </div>
          );
        },
        enableSorting: false,
        size: 120,
      },
    ],
    [editingTierIds, localTiers]
  );

  const table = useReactTable({
    data: localTiers,
    columns,
    pageCount: Math.ceil(localTiers.length / pagination.pageSize),
    state: {
      sorting,
      pagination,
    },
    onSortingChange: setSorting,
    onPaginationChange: setPagination,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getRowId: (row: MoqTierDto) => row.id,
  });

  return (
    <>
      <div className="p-4">
        <DataGrid
          table={table}
          recordCount={localTiers.length}
          tableLayout={{
            cellBorder: true,
            rowBorder: true,
            headerBackground: true,
            headerBorder: true,
          }}
        >
          <div className="w-full space-y-2.5">
            <DataGridContainer>
              <ScrollArea>
                <DataGridTable />
                <ScrollBar orientation="horizontal" />
              </ScrollArea>
            </DataGridContainer>
            <DataGridPagination className="pb-1.5" />
          </div>
        </DataGrid>
      </div>

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirm Delete</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this MOQ tier? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={handleCancelDelete}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleConfirmDelete}
              className="bg-red-600 hover:bg-red-700"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
