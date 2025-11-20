"use client";

import { useMemo, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { DataGrid, DataGridContainer } from "@/components/ui/data-grid";
import { DataGridColumnHeader } from "@/components/ui/data-grid-column-header";
import { DataGridPagination } from "@/components/ui/data-grid-pagination";
import { DataGridTable } from "@/components/ui/data-grid-table";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import {
  ColumnDef,
  ExpandedState,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  PaginationState,
  SortingState,
  useReactTable,
} from "@tanstack/react-table";
import { Save, Send, SquareMinus, SquarePlus } from "lucide-react";
import { useVendorPortal, useSubmitVendorPortal } from "../_hooks/use-vendor-portal";
import type { VendorItemDto, MoqTierDto } from "../_dto/vendor-portal.dto";
import { formatNumberWithLocale } from "@/utils/format/number";
import { toastSuccess, toastError } from "@/components/ui-custom/Toast";
import MoqTiersSubTable from "./MoqTiersSubTable";
import { mockVendorPortal } from "../_mock/vp.data";
import { useQueryClient } from "@tanstack/react-query";

export default function VendorPortal() {
  const { token, buCode } = useAuth();
  const { data: vendorPortal, isLoading } = useVendorPortal(token, buCode);
  const submitMutation = useSubmitVendorPortal(token, buCode);
  const queryClient = useQueryClient();

  const vendorItems = vendorPortal?.items || [];

  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  });
  const [sorting, setSorting] = useState<SortingState>([]);
  const [expandedRows, setExpandedRows] = useState<ExpandedState>({});
  const [columnOrder, setColumnOrder] = useState<string[]>([
    "expand",
    "code",
    "description",
    "unit",
    "price",
    "leadTimeInDays",
    "moqTiers",
  ]);
  const [pendingUpdates, setPendingUpdates] = useState<Record<string, MoqTierDto[]>>({});

  const handleTiersUpdate = (vendorItemId: string, updatedTiers: MoqTierDto[]) => {
    // Store pending updates
    setPendingUpdates((prev) => ({
      ...prev,
      [vendorItemId]: updatedTiers,
    }));
  };

  const handleSaveAllChanges = async () => {
    const itemsToUpdate = Object.entries(pendingUpdates);

    if (itemsToUpdate.length === 0) {
      toastError({ message: "No changes to save" });
      return;
    }

    try {
      // Simulate API delay
      // remove when use real api
      await new Promise((resolve) => setTimeout(resolve, 500));

      // Update mock data directly
      // remove when use real api
      for (const [vendorItemId, updatedTiers] of itemsToUpdate) {
        const itemIndex = mockVendorPortal.items.findIndex((item) => item.id === vendorItemId);
        if (itemIndex !== -1) {
          mockVendorPortal.items[itemIndex].moqTiers = updatedTiers;
        }
      }

      // Invalidate queries to refetch data
      queryClient.invalidateQueries({ queryKey: ["vendor-portal", buCode] });

      toastSuccess({ message: "All changes saved successfully" });
      setPendingUpdates({});
    } catch (error) {
      toastError({
        message: error instanceof Error ? error.message : "Failed to save changes",
      });
    }
  };

  const handleSubmit = () => {
    if (Object.keys(pendingUpdates).length > 0) {
      toastError({ message: "Please save all changes before submitting" });
      return;
    }

    submitMutation.mutate(undefined, {
      onSuccess: () => {
        toastSuccess({ message: "Vendor portal submitted successfully" });
      },
      onError: (error) => {
        toastError({
          message: error instanceof Error ? error.message : "Failed to submit vendor portal",
        });
      },
    });
  };

  const hasPendingChanges = Object.keys(pendingUpdates).length > 0;
  const isSubmitted = vendorPortal?.status === "submitted";

  const columns = useMemo<ColumnDef<VendorItemDto>[]>(
    () => [
      {
        id: "expand",
        header: () => null,
        cell: ({ row }) => {
          return row.getCanExpand() ? (
            <Button onClick={row.getToggleExpandedHandler()} size="sm" variant="ghost">
              {row.getIsExpanded() ? <SquareMinus /> : <SquarePlus />}
            </Button>
          ) : null;
        },
        size: 50,
        enableResizing: false,
        meta: {
          expandedContent: (row) => (
            <MoqTiersSubTable
              tiers={row.moqTiers}
              vendorItemId={row.id}
              onTiersUpdate={(updatedTiers) => handleTiersUpdate(row.id, updatedTiers)}
            />
          ),
        },
      },
      {
        accessorKey: "code",
        id: "code",
        header: ({ column }) => (
          <DataGridColumnHeader title="Product Code" visibility={true} column={column} />
        ),
        cell: ({ row }) => <div className="font-semibold text-primary">{row.original.code}</div>,
        enableSorting: true,
        enableHiding: true,
        enableResizing: true,
        size: 150,
      },
      {
        accessorKey: "description",
        id: "description",
        header: ({ column }) => (
          <DataGridColumnHeader title="Description" visibility={true} column={column} />
        ),
        cell: (info) => {
          const description = info.getValue() as string | undefined;
          return <div className="text-sm text-foreground">{description || "-"}</div>;
        },
        enableSorting: true,
        enableHiding: true,
        enableResizing: true,
        size: 300,
      },
      {
        accessorKey: "unit",
        id: "unit",
        header: ({ column }) => (
          <DataGridColumnHeader title="Unit" visibility={true} column={column} />
        ),
        cell: ({ row }) => <Badge variant="secondary">{row.original.unit.name}</Badge>,
        enableSorting: true,
        enableHiding: true,
        enableResizing: true,
        size: 100,
      },
      {
        accessorKey: "price",
        id: "price",
        header: ({ column }) => (
          <DataGridColumnHeader title="Base Price" visibility={true} column={column} />
        ),
        cell: (info) => {
          const price = info.getValue() as number;
          return <div className="font-semibold text-primary">฿{formatNumberWithLocale(price)}</div>;
        },
        enableSorting: true,
        enableHiding: true,
        enableResizing: true,
        size: 130,
      },
      {
        accessorKey: "leadTimeInDays",
        id: "leadTimeInDays",
        header: ({ column }) => (
          <DataGridColumnHeader title="Lead Time" visibility={true} column={column} />
        ),
        cell: (info) => {
          const days = info.getValue() as number | undefined;
          return (
            <div className="text-sm">{days ? `${days} ${days === 1 ? "day" : "days"}` : "-"}</div>
          );
        },
        enableSorting: true,
        enableHiding: true,
        enableResizing: true,
        size: 120,
      },
      {
        accessorKey: "moqTiers",
        id: "moqTiers",
        header: ({ column }) => (
          <DataGridColumnHeader title="MOQ Tiers" visibility={true} column={column} />
        ),
        cell: (info) => {
          const tiers = info.getValue() as MoqTierDto[];
          const tierCount = tiers.length;
          return (
            <div
              className="text-sm font-medium text-foreground hover:text-primary cursor-pointer"
              onClick={() => info.row.getToggleExpandedHandler()()}
            >
              {tierCount} {tierCount === 1 ? "tier" : "tiers"}
            </div>
          );
        },
        enableSorting: false,
        enableHiding: true,
        enableResizing: true,
        size: 120,
      },
    ],
    [handleTiersUpdate]
  );

  const table = useReactTable({
    columns,
    data: vendorItems,
    pageCount: Math.ceil(vendorItems.length / pagination.pageSize),
    getRowId: (row: VendorItemDto) => row.id,
    getRowCanExpand: (row) => Boolean(row.original.moqTiers && row.original.moqTiers.length > 0),
    state: {
      pagination,
      sorting,
      expanded: expandedRows,
      columnOrder,
    },
    columnResizeMode: "onChange",
    onPaginationChange: setPagination,
    onSortingChange: setSorting,
    onExpandedChange: setExpandedRows,
    onColumnOrderChange: setColumnOrder,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-muted-foreground">Loading vendor portal items...</p>
      </div>
    );
  }

  return (
    <div className="w-full space-y-4">
      <div className="rounded-lg border border-border bg-card p-6 space-y-4">
        <div className="flex items-start justify-between">
          <h1 className="text-2xl font-bold text-foreground">{vendorPortal?.vendorName}</h1>
          <Badge className="text-sm px-3 py-1">{vendorPortal?.status}</Badge>
        </div>

        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">Currency:</span>
            <Badge variant="outline" className="font-mono">
              {vendorPortal?.currency.code}
            </Badge>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">Total Items:</span>
            <span className="text-sm font-semibold">{vendorItems.length}</span>
          </div>
        </div>
      </div>

      <DataGrid
        table={table}
        recordCount={vendorItems.length}
        tableLayout={{
          columnsPinnable: true,
          columnsResizable: true,
          columnsMovable: true,
          columnsVisibility: true,
        }}
      >
        <div className="w-full space-y-2.5">
          <DataGridContainer>
            <ScrollArea>
              <DataGridTable />
              <ScrollBar orientation="horizontal" />
            </ScrollArea>
          </DataGridContainer>
          <DataGridPagination />
        </div>
      </DataGrid>
      <div className="flex justify-end gap-2">
        <Button
          onClick={handleSaveAllChanges}
          variant="outline"
          disabled={isSubmitted || !hasPendingChanges}
        >
          <Save className="h-4 w-4" />
          Save
        </Button>
        <Button
          onClick={handleSubmit}
          variant="default"
          disabled={isSubmitted || hasPendingChanges || submitMutation.isPending}
        >
          <Send className="h-4 w-4" />
          {submitMutation.isPending ? "Submitting..." : "Submit"}
        </Button>
      </div>
    </div>
  );
}
