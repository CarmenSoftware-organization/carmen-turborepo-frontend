"use client";

import { formType } from "@/dtos/form.dto";
import { CreateGRNDto } from "@/dtos/grn.dto";
import { GrnDetailItem } from "@/types/grn-api.types";
import { Control } from "react-hook-form";
import { Button } from "@/components/ui/button";
import {
  Edit,
  Trash2,
  Plus,
  Filter,
  CheckCircle,
  XCircle,
  FileText,
  Split,
  Package,
  MapPin,
  ShoppingCart,
  DollarSign,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import SearchInput from "@/components/ui-custom/SearchInput";
import { useTranslations } from "next-intl";
import { ColumnDef, getCoreRowModel, useReactTable, SortingState } from "@tanstack/react-table";
import { DataGrid, DataGridContainer } from "@/components/ui/data-grid";
import {
  DataGridTable,
  DataGridTableRowSelect,
  DataGridTableRowSelectAll,
} from "@/components/ui/data-grid-table";
import { DataGridColumnHeader } from "@/components/ui/data-grid-column-header";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";

interface ItemGrnProps {
  readonly control: Control<CreateGRNDto>;
  readonly mode: formType;
  readonly grnItems: GrnDetailItem[];
}

export default function ItemGrn({ mode, grnItems }: ItemGrnProps) {
  const tCommon = useTranslations("Common");
  const t = useTranslations("TableHeader");
  const [bulkAction, setBulkAction] = useState(false);
  const [search, setSearch] = useState("");
  const [sorting, setSorting] = useState<SortingState>([]);

  const isDisabled = mode === formType.VIEW;

  const table = useReactTable({
    data: grnItems,
    columns: [],
    getCoreRowModel: getCoreRowModel(),
  });

  const selectedRows = table.getFilteredSelectedRowModel().rows;

  useEffect(() => {
    setBulkAction(selectedRows.length > 0);
  }, [selectedRows.length]);

  // Action header component
  const ActionHeader = () => <div className="text-right">{t("action")}</div>;

  // Define columns
  const columns = useMemo<ColumnDef<GrnDetailItem>[]>(
    () => [
      {
        id: "select",
        header: () => (!isDisabled ? <DataGridTableRowSelectAll /> : null),
        cell: ({ row }) => (!isDisabled ? <DataGridTableRowSelect row={row} /> : null),
        enableSorting: false,
        enableHiding: false,
        size: 30,
      },
      {
        id: "no",
        header: () => <div className="text-center">#</div>,
        cell: ({ row }) => <div className="text-center">{row.index + 1}</div>,
        enableSorting: false,
        size: 30,
        meta: {
          cellClassName: "text-center",
          headerClassName: "text-center",
        },
      },
      {
        accessorKey: "location_name",
        header: ({ column }) => (
          <DataGridColumnHeader
            column={column}
            title="Location"
            icon={<MapPin className="h-4 w-4" />}
          />
        ),
        cell: ({ row }) => (
          <div className="truncate max-w-[150px]">{row.original.location_name}</div>
        ),
        enableSorting: true,
        size: 150,
        meta: {
          headerTitle: "Location",
        },
      },
      {
        accessorKey: "product_name",
        header: ({ column }) => (
          <DataGridColumnHeader
            column={column}
            title="Product"
            icon={<Package className="h-4 w-4" />}
          />
        ),
        cell: ({ row }) => (
          <div className="truncate max-w-[200px]">
            <div className="font-medium">{row.original.product_name}</div>
            {row.original.product_local_name && (
              <div className="text-xs text-muted-foreground truncate">
                {row.original.product_local_name}
              </div>
            )}
          </div>
        ),
        enableSorting: true,
        size: 200,
        meta: {
          headerTitle: "Product",
        },
      },
      {
        accessorKey: "order_qty",
        header: ({ column }) => (
          <div className="flex justify-end">
            <DataGridColumnHeader
              column={column}
              title="Ordered"
              icon={<ShoppingCart className="h-4 w-4" />}
            />
          </div>
        ),
        cell: ({ row }) => (
          <div className="text-right">
            <div className="font-mono text-sm">
              {row.original.order_qty} {row.original.order_unit_name}
            </div>
          </div>
        ),
        enableSorting: true,
        size: 120,
        meta: {
          headerTitle: "Ordered",
          cellClassName: "text-right",
          headerClassName: "text-right",
        },
      },
      {
        accessorKey: "received_qty",
        header: ({ column }) => (
          <div className="flex justify-end">
            <DataGridColumnHeader
              column={column}
              title="Received"
              icon={<Package className="h-4 w-4" />}
            />
          </div>
        ),
        cell: ({ row }) => (
          <div className="text-right">
            <div className="font-mono text-sm font-medium">
              {row.original.received_qty} {row.original.received_unit_name}
            </div>
            <div className="text-xs text-muted-foreground">Base: {row.original.base_qty}</div>
          </div>
        ),
        enableSorting: true,
        size: 120,
        meta: {
          headerTitle: "Received",
          cellClassName: "text-right",
          headerClassName: "text-right",
        },
      },
      {
        accessorKey: "foc_qty",
        header: ({ column }) => (
          <div className="flex justify-end">
            <DataGridColumnHeader column={column} title="FOC" />
          </div>
        ),
        cell: ({ row }) => (
          <div className="text-right font-mono text-sm">
            {row.original.foc_qty} {row.original.foc_unit_name}
          </div>
        ),
        enableSorting: true,
        size: 100,
        meta: {
          headerTitle: "FOC",
          cellClassName: "text-right",
          headerClassName: "text-right",
        },
      },
      {
        accessorKey: "price",
        header: ({ column }) => (
          <div className="flex justify-end">
            <DataGridColumnHeader
              column={column}
              title="Price"
              icon={<DollarSign className="h-4 w-4" />}
            />
          </div>
        ),
        cell: ({ row }) => (
          <div className="text-right font-mono text-sm">
            {parseFloat(row.original.price).toLocaleString("en-US", {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            })}
          </div>
        ),
        enableSorting: true,
        size: 100,
        meta: {
          headerTitle: "Price",
          cellClassName: "text-right",
          headerClassName: "text-right",
        },
      },
      {
        accessorKey: "discount_amount",
        header: ({ column }) => (
          <div className="flex justify-end">
            <DataGridColumnHeader column={column} title="Discount" />
          </div>
        ),
        cell: ({ row }) => (
          <div className="text-right font-mono text-sm">
            {row.original.discount_amount
              ? parseFloat(row.original.discount_amount).toLocaleString("en-US", {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })
              : "0.00"}
          </div>
        ),
        enableSorting: true,
        size: 100,
        meta: {
          headerTitle: "Discount",
          cellClassName: "text-right",
          headerClassName: "text-right",
        },
      },
      {
        accessorKey: "tax_amount",
        header: ({ column }) => (
          <div className="flex justify-end">
            <DataGridColumnHeader column={column} title="Tax" />
          </div>
        ),
        cell: ({ row }) => (
          <div className="text-right">
            <div className="font-mono text-sm">
              {parseFloat(row.original.tax_amount).toLocaleString("en-US", {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })}
            </div>
            {row.original.tax_profile_name && (
              <div className="text-xs text-muted-foreground">{row.original.tax_profile_name}</div>
            )}
          </div>
        ),
        enableSorting: true,
        size: 120,
        meta: {
          headerTitle: "Tax Amount",
          cellClassName: "text-right",
          headerClassName: "text-right",
        },
      },
      {
        accessorKey: "total_amount",
        header: ({ column }) => (
          <div className="flex justify-end">
            <DataGridColumnHeader
              column={column}
              title="Total"
              icon={<DollarSign className="h-4 w-4" />}
            />
          </div>
        ),
        cell: ({ row }) => (
          <div className="text-right font-mono text-sm font-medium">
            {parseFloat(row.original.total_amount).toLocaleString("en-US", {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            })}
          </div>
        ),
        enableSorting: true,
        size: 120,
        meta: {
          headerTitle: "Total Amount",
          cellClassName: "text-right",
          headerClassName: "text-right",
        },
      },
      {
        id: "action",
        header: ActionHeader,
        cell: ({ row }) => {
          if (isDisabled) return null;

          return (
            <div className="flex justify-end gap-1">
              <Button
                variant="ghost"
                size="icon"
                className="h-7 w-7"
                type="button"
                onClick={() => {
                  // TODO: Handle edit
                  console.log("Edit item:", row.original);
                }}
              >
                <Edit className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="h-7 w-7 text-destructive hover:text-destructive"
                type="button"
                onClick={() => {
                  // TODO: Handle delete
                  console.log("Delete item:", row.original);
                }}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          );
        },
        enableSorting: false,
        size: 80,
        meta: {
          cellClassName: "text-right",
          headerClassName: "text-right",
        },
      },
    ],
    [t, tCommon, isDisabled]
  );

  // Re-initialize table with columns
  const dataTable = useReactTable({
    data: grnItems,
    columns,
    getRowId: (row) => row.id,
    state: {
      sorting,
    },
    enableRowSelection: !isDisabled,
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <div className="space-y-4">
      {/* Header with actions */}
      <div className="flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <div className="flex flex-col gap-2">
            <p className="text-base font-medium">Items Details</p>
            {bulkAction && !isDisabled && (
              <div className="flex items-center gap-2">
                <Button size="sm" type="button">
                  <CheckCircle className="h-3 w-3" />
                  Approve
                </Button>
                <Button variant="outline" size="sm" type="button">
                  <XCircle className="h-3 w-3" />
                  Reject
                </Button>
                <Button variant="outline" size="sm" type="button">
                  <FileText className="h-3 w-3" />
                  Review
                </Button>
                <Button variant="outline" size="sm" type="button">
                  <Split className="h-3 w-3" />
                  Split
                </Button>
              </div>
            )}
          </div>
          <div className="flex items-center gap-2">
            <SearchInput
              defaultValue={search}
              onSearch={setSearch}
              placeholder={tCommon("search")}
              data-id="grn-item-search-input"
            />
            <Button size="sm" type="button">
              <Filter className="h-3 w-3" />
            </Button>
            {!isDisabled && (
              <Button size="sm" type="button">
                <Plus className="h-3 w-3" />
                Add Item
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* DataGrid */}
      <DataGrid
        table={dataTable}
        recordCount={grnItems.length}
        isLoading={false}
        loadingMode="skeleton"
        emptyMessage={tCommon("no_data")}
        tableLayout={{
          headerSticky: true,
          dense: false,
          rowBorder: true,
          headerBackground: true,
          headerBorder: true,
          width: "fixed",
        }}
      >
        <div className="w-full space-y-2.5">
          <DataGridContainer>
            <ScrollArea className="max-h-[calc(100vh-400px)]">
              <DataGridTable />
              <ScrollBar orientation="horizontal" />
            </ScrollArea>
          </DataGridContainer>
        </div>
      </DataGrid>
    </div>
  );
}
