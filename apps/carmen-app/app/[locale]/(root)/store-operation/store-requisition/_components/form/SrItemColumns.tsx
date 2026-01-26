"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";
import { SrDetailItemCreate } from "@/dtos/sr.dto";
import { formType } from "@/dtos/form.dto";
import { DataGridColumnHeader } from "@/components/ui/data-grid-column-header";
import LookupProduct from "@/components/lookup/LookupProduct";
import NumberInput from "@/components/form-custom/NumberInput";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";

// Combined type for both original and new items
export type SrItemRow = {
  id: string;
  isNewItem: boolean;
  originalIndex?: number;
  newItemIndex?: number;
  product_id: string;
  product_name?: string;
  description: string;
  requested_qty: number;
  current_stage_status: string | null;
};

interface ColumnConfig {
  currentMode: formType;
  token: string;
  buCode: string;
  onItemUpdate: (index: number, fieldName: keyof SrDetailItemCreate, value: unknown) => void;
  onRemoveNewItem: (index: number) => void;
  onRemoveOriginalItem: (id: string) => void;
  tHeader?: (key: string) => string;
  usedProductIds?: string[];
}

export const createSrItemColumns = (config: ColumnConfig): ColumnDef<SrItemRow>[] => {
  const {
    currentMode,
    token,
    buCode,
    onItemUpdate,
    onRemoveNewItem,
    onRemoveOriginalItem,
    tHeader,
    usedProductIds = [],
  } = config;

  const isViewMode = currentMode === formType.VIEW;

  const baseColumns: ColumnDef<SrItemRow>[] = [
    {
      id: "no",
      header: () => <span className="text-center text-muted-foreground">#</span>,
      cell: ({ row }) => <span className="text-center text-xs">{row.index + 1}</span>,
      enableSorting: false,
      size: 40,
      meta: {
        cellClassName: "text-center",
        headerClassName: "text-center",
      },
    },
    {
      accessorKey: "product_name",
      header: ({ column }) => (
        <DataGridColumnHeader column={column} title={tHeader?.("product") ?? "Product"} />
      ),
      cell: ({ row }) => {
        const item = row.original;

        if (isViewMode || !item.isNewItem) {
          return (
            <span className="font-semibold text-muted-foreground text-xs break-words">
              {item.product_name || item.product_id || "-"}
            </span>
          );
        }

        return (
          <div className="min-w-[200px] pr-4">
            <LookupProduct
              value={item.product_id}
              onValueChange={(value) => {
                onItemUpdate(item.newItemIndex!, "product_id", value);
              }}
              token={token}
              buCode={buCode}
              classNames="text-xs h-7 w-full"
              excludeIds={usedProductIds}
            />
          </div>
        );
      },
      enableSorting: false,
      size: isViewMode ? 150 : 220,
      meta: {
        headerTitle: tHeader?.("product") ?? "Product",
      },
    },
    {
      accessorKey: "description",
      header: ({ column }) => (
        <DataGridColumnHeader column={column} title={tHeader?.("description") ?? "Description"} />
      ),
      cell: ({ row }) => {
        const item = row.original;

        if (isViewMode || !item.isNewItem) {
          return (
            <span className="text-muted-foreground text-xs break-words">
              {item.description || "-"}
            </span>
          );
        }

        return (
          <Input
            value={item.description}
            onChange={(e) => {
              if (item.newItemIndex === undefined) return;
              onItemUpdate(item.newItemIndex, "description", e.target.value);
            }}
            placeholder="Description"
            className="text-xs h-7"
          />
        );
      },
      enableSorting: false,
      size: isViewMode ? 150 : 200,
      meta: {
        headerTitle: tHeader?.("description") ?? "Description",
      },
    },
    {
      accessorKey: "requested_qty",
      header: ({ column }) => (
        <DataGridColumnHeader
          column={column}
          title={tHeader?.("requestedQty") ?? "Requested Qty"}
        />
      ),
      cell: ({ row }) => {
        const item = row.original;

        if (isViewMode || !item.isNewItem) {
          return <span className="text-xs">{item.requested_qty}</span>;
        }

        return (
          <NumberInput
            value={item.requested_qty}
            onChange={(value) => {
              onItemUpdate(item.newItemIndex!, "requested_qty", value);
            }}
            classNames="h-7 text-xs bg-background w-20"
          />
        );
      },
      enableSorting: false,
      size: 100,
      meta: {
        headerTitle: tHeader?.("requestedQty") ?? "Requested Qty",
        cellClassName: "text-right",
        headerClassName: "text-right",
      },
    },
    {
      accessorKey: "current_stage_status",
      header: ({ column }) => (
        <DataGridColumnHeader column={column} title={tHeader?.("status") ?? "Status"} />
      ),
      cell: ({ row }) => {
        const item = row.original;
        const status = item.current_stage_status;

        if (!status || status === "submit") {
          return <span className="text-xs text-muted-foreground">-</span>;
        }

        return <Badge variant="outline">{status}</Badge>;
      },
      enableSorting: false,
      size: 100,
      meta: {
        headerTitle: tHeader?.("status") ?? "Status",
        cellClassName: "text-center",
        headerClassName: "text-center",
      },
    },
    {
      id: "action",
      cell: ({ row }) => {
        if (isViewMode) return null;
        const item = row.original;

        if (item.isNewItem && item.newItemIndex !== undefined) {
          // Remove new item directly
          return (
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="h-7 w-7 text-muted-foreground hover:text-destructive hover:bg-variant"
              onClick={(e) => {
                e.stopPropagation();
                e.preventDefault();
                onRemoveNewItem(item.newItemIndex!);
              }}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          );
        }

        // Remove original item with confirmation
        return (
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="h-7 w-7 text-muted-foreground hover:text-destructive hover:bg-variant"
            onClick={(e) => {
              e.stopPropagation();
              e.preventDefault();
              onRemoveOriginalItem(item.id);
            }}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        );
      },
      enableSorting: false,
      size: 50,
      meta: {
        headerTitle: "Action",
        cellClassName: "text-center",
        headerClassName: "text-center",
      },
    },
  ];

  // Filter out action column in view mode
  if (isViewMode) {
    return baseColumns.filter((col) => col.id !== "action");
  }

  return baseColumns;
};
