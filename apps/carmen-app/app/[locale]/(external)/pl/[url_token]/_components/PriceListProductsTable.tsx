"use client";

import { useMemo, useState } from "react";
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
import { SquareMinus, SquarePlus } from "lucide-react";
import { DataGrid, DataGridContainer } from "@/components/ui/data-grid";
import { DataGridColumnHeader } from "@/components/ui/data-grid-column-header";
import { DataGridTable } from "@/components/ui/data-grid-table";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MoqTierDto, PricelistExternalDetailDto } from "./pl-external.dto";
import MoqTiersSubTable from "./MoqTiersSubTable";
import { DataGridPagination } from "@/components/ui/data-grid-pagination";

interface PriceListProductsTableProps {
  items: PricelistExternalDetailDto[];
  onTiersUpdate?: (productId: string, tiers: MoqTierDto[]) => void;
}

export default function PriceListProductsTable({
  items,
  onTiersUpdate,
}: PriceListProductsTableProps) {
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  });
  const [sorting, setSorting] = useState<SortingState>([]);
  const [expandedRows, setExpandedRows] = useState<ExpandedState>({});

  const columns = useMemo<ColumnDef<PricelistExternalDetailDto>[]>(
    () => [
      {
        id: "no",
        header: "#",
        cell: ({ row }) => <span className="text-xs">{row.original.sequence_no}</span>,
        size: 50,
        enableSorting: false,
      },
      {
        accessorKey: "product_name",
        id: "product_name",
        header: ({ column }) => (
          <DataGridColumnHeader title="Product" visibility={true} column={column} />
        ),
        cell: ({ row }) => (
          <div className="font-semibold text-primary text-xs">{row.original.product_name}</div>
        ),
        size: 300,
        enableSorting: true,
        enableHiding: true,
        enableResizing: true,
      },
      {
        accessorKey: "unit_name",
        id: "unit_name",
        header: ({ column }) => (
          <DataGridColumnHeader title="Unit" visibility={true} column={column} />
        ),
        cell: ({ row }) => (
          <Badge variant="secondary" className="text-xs">
            {row.original.unit_name || "-"}
          </Badge>
        ),
        size: 80,
        enableSorting: true,
        enableHiding: true,
        enableResizing: true,
      },
      {
        accessorKey: "price",
        id: "price",
        header: ({ column }) => (
          <DataGridColumnHeader title="Price" visibility={true} column={column} />
        ),
        cell: ({ row }) => (
          <div className="font-semibold text-primary text-xs">{row.original.price}</div>
        ),
        size: 100,
        enableSorting: true,
        enableHiding: true,
        enableResizing: true,
        meta: { cellClassName: "text-right" },
      },
      {
        accessorKey: "moq_qty",
        id: "moq_qty",
        header: ({ column }) => (
          <DataGridColumnHeader title="MOQ" visibility={true} column={column} />
        ),
        cell: ({ row }) => <span className="text-xs">{row.original.moq_qty}</span>,
        size: 80,
        enableSorting: true,
        enableHiding: true,
        enableResizing: true,
        meta: { cellClassName: "text-right" },
      },
      {
        accessorKey: "price_without_tax",
        id: "price_without_tax",
        header: ({ column }) => (
          <DataGridColumnHeader title="PWT" visibility={true} column={column} />
        ),
        cell: ({ row }) => <span className="text-xs">{row.original.price_without_tax}</span>,
        size: 100,
        enableSorting: true,
        enableHiding: true,
        enableResizing: true,
        meta: { cellClassName: "text-right" },
      },
      {
        accessorKey: "tax_amt",
        id: "tax_amt",
        header: ({ column }) => (
          <DataGridColumnHeader title="Tax" visibility={true} column={column} />
        ),
        cell: ({ row }) => <span className="text-xs">{row.original.tax_amt}</span>,
        size: 80,
        enableSorting: true,
        enableHiding: true,
        enableResizing: true,
        meta: { cellClassName: "text-right" },
      },

      {
        accessorKey: "tax_profile_name",
        id: "tax_profile_name",
        header: ({ column }) => (
          <DataGridColumnHeader title="Tax Profile" visibility={true} column={column} />
        ),
        cell: ({ row }) => <span className="text-xs">{row.original.tax_profile_name || "-"}</span>,
        size: 120,
        enableSorting: true,
        enableHiding: true,
        enableResizing: true,
      },
      {
        id: "expand",
        header: () => null,
        cell: ({ row }) => {
          return row.getCanExpand() ? (
            <Button onClick={row.getToggleExpandedHandler()} size="sm" variant="ghost">
              {row.getIsExpanded() ? (
                <SquareMinus className="h-4 w-4" />
              ) : (
                <SquarePlus className="h-4 w-4" />
              )}
            </Button>
          ) : null;
        },
        size: 50,
        enableResizing: false,
        meta: {
          expandedContent: (row: PricelistExternalDetailDto) => (
            <MoqTiersSubTable
              tiers={row.moq_tiers || []}
              productId={row.id}
              onTiersUpdate={onTiersUpdate}
            />
          ),
        },
      },
    ],
    []
  );

  const table = useReactTable({
    data: items || [],
    columns,
    pageCount: Math.ceil((items?.length || 0) / pagination.pageSize),
    getRowId: (row: PricelistExternalDetailDto) => row.id,
    getRowCanExpand: () => true,
    state: {
      pagination,
      sorting,
      expanded: expandedRows,
    },
    columnResizeMode: "onChange",
    onPaginationChange: setPagination,
    onSortingChange: setSorting,
    onExpandedChange: setExpandedRows,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
  });

  return (
    <DataGrid
      table={table}
      recordCount={items?.length || 0}
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
        <div className="flex gap-2 justify-end">
          <Button variant="outline" size="sm">
            Save
          </Button>
          <Button size="sm">Submit</Button>
        </div>
      </div>
    </DataGrid>
  );
}
