"use client";

import {
  ColumnDef,
  getSortedRowModel,
  getPaginationRowModel,
  PaginationState,
  SortingState,
  useReactTable,
  getCoreRowModel,
  getFilteredRowModel,
} from "@tanstack/react-table";
import { useMemo, useState } from "react";
import { IUnitData, mockUnits } from "./dataUnit";
import { DataGridColumnHeader } from "@/components/ui/data-grid-column-header";
import { DataGrid, DataGridContainer } from "@/components/ui/data-grid";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { DataGridPagination } from "@/components/ui/data-grid-pagination";
import { DataGridTable } from "@/components/ui/data-grid-table";

export default function UnitPage() {
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  });

  const [sorting, setSorting] = useState<SortingState>([{ id: "name", desc: true }]);

  const columns = useMemo<ColumnDef<IUnitData>[]>(
    () => [
      {
        accessorKey: "name",
        id: "name",
        header: ({ column }) => <DataGridColumnHeader title="Unit" column={column} />,
        cell: ({ row }) => {
          return <p>{row.original.name}</p>;
        },
        size: 200,
        enableSorting: true,
        enableHiding: false,
      },
      {
        accessorKey: "is_decimal",
        header: ({ column }) => <DataGridColumnHeader title="Is Decimal" column={column} />,
        cell: ({ row }) => {
          return <span>{row.original.is_decimal ? "Yes" : "No"}</span>;
        },
        size: 150,
        enableSorting: true,
        enableHiding: false,
      },
      {
        accessorKey: "is_active",
        header: ({ column }) => <DataGridColumnHeader title="Is Active" column={column} />,
        cell: ({ row }) => {
          return <span>{row.original.is_active ? "Active" : "Inactive"}</span>;
        },
        size: 125,
        enableSorting: true,
        enableHiding: false,
      },
    ],
    []
  );

  const table = useReactTable({
    columns,
    data: mockUnits,
    pageCount: Math.ceil((mockUnits?.length || 0) / pagination.pageSize),
    getRowId: (row: IUnitData) => row.id,
    state: {
      pagination,
      sorting,
    },
    columnResizeMode: "onChange",
    onPaginationChange: setPagination,
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
  });

  return (
    <DataGrid table={table} recordCount={mockUnits?.length || 0}>
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
  );
}
