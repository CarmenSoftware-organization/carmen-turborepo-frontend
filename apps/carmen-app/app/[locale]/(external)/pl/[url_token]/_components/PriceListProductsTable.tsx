"use client";

import { useMemo } from "react";
import { ColumnDef, getCoreRowModel, useReactTable } from "@tanstack/react-table";
import { DataGrid, DataGridContainer } from "@/components/ui/data-grid";
import { DataGridTable } from "@/components/ui/data-grid-table";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { PricelistExternalDetailDto } from "./pl-external.dto";

interface PriceListProductsTableProps {
  items: PricelistExternalDetailDto[];
}

export default function PriceListProductsTable({ items }: PriceListProductsTableProps) {
  const columns = useMemo<ColumnDef<PricelistExternalDetailDto>[]>(
    () => [
      {
        id: "no",
        header: "#",
        cell: ({ row }) => <span className="text-xs">{row.original.sequence_no}</span>,
        size: 50,
      },
      {
        accessorKey: "product_name",
        header: "Product",
        cell: ({ row }) => <span className="text-xs">{row.original.product_name}</span>,
        size: 250,
      },
      {
        accessorKey: "unit_name",
        header: "Unit",
        cell: ({ row }) => <span className="text-xs">{row.original.unit_name}</span>,
        size: 80,
      },
      {
        accessorKey: "moq_qty",
        header: () => <span className="text-right w-full block">MOQ</span>,
        cell: ({ row }) => <span className="text-xs">{row.original.moq_qty}</span>,
        size: 80,
        meta: { cellClassName: "text-right" },
      },
      {
        accessorKey: "price_without_tax",
        header: () => <span className="text-right w-full block">Price (excl.)</span>,
        cell: ({ row }) => <span className="text-xs">{row.original.price_without_tax}</span>,
        size: 100,
        meta: { cellClassName: "text-right" },
      },
      {
        accessorKey: "tax_amt",
        header: () => <span className="text-right w-full block">Tax Amt</span>,
        cell: ({ row }) => <span className="text-xs">{row.original.tax_amt}</span>,
        size: 80,
        meta: { cellClassName: "text-right" },
      },
      {
        accessorKey: "price",
        header: () => <span className="text-right w-full block">Price</span>,
        cell: ({ row }) => <span className="text-xs">{row.original.price}</span>,
        size: 100,
        meta: { cellClassName: "text-right" },
      },
      {
        accessorKey: "tax_rate",
        header: () => <span className="text-right w-full block">Tax Rate</span>,
        cell: ({ row }) => <span className="text-xs">{row.original.tax_rate}%</span>,
        size: 80,
        meta: { cellClassName: "text-right" },
      },
      {
        accessorKey: "lead_time_days",
        header: () => <span className="text-right w-full block">Lead Time</span>,
        cell: ({ row }) => <span className="text-xs">{row.original.lead_time_days}</span>,
        size: 80,
        meta: { cellClassName: "text-right" },
      },
      {
        accessorKey: "is_active",
        header: () => <span className="text-center w-full block">Active</span>,
        cell: ({ row }) => (
          <span className="text-xs">{row.original.is_active ? "Yes" : "No"}</span>
        ),
        size: 70,
        meta: { cellClassName: "text-center" },
      },
      {
        accessorKey: "note",
        header: "Note",
        cell: ({ row }) => <span className="text-xs">{row.original.note}</span>,
        size: 150,
      },
    ],
    []
  );

  const table = useReactTable({
    data: items || [],
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <DataGrid
      table={table}
      recordCount={items?.length || 0}
      isLoading={false}
      tableLayout={{
        headerSticky: true,
        rowBorder: true,
        headerBackground: true,
        headerBorder: true,
        width: "fixed",
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
  );
}
