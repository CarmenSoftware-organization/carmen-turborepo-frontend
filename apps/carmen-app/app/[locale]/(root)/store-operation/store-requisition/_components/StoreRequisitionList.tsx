"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar, FileText, Building, ArrowRight, Trash2 } from "lucide-react";
import { Link } from "@/lib/navigation";
import { useMemo } from "react";
import { ColumnDef, getCoreRowModel, useReactTable } from "@tanstack/react-table";
import { DataGrid, DataGridContainer } from "@/components/ui/data-grid";
import {
  DataGridTable,
  DataGridTableRowSelect,
  DataGridTableRowSelectAll,
} from "@/components/ui/data-grid-table";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { useTranslations } from "next-intl";
import { SrDto } from "@/dtos/sr.dto";
import { DataGridColumnHeader } from "@/components/ui/data-grid-column-header";
import { formatDate } from "@/utils/format/date";
interface Props {
  readonly storeRequisitions: SrDto[];
  readonly isLoading: boolean;
  readonly dateFormat?: string;
  onDelete: (id: string) => void;
}

export default function StoreRequisitionList({
  storeRequisitions,
  isLoading,
  dateFormat,
  onDelete,
}: Props) {
  const tCommon = useTranslations("Common");
  const tTableHeader = useTranslations("TableHeader");

  const columns = useMemo<ColumnDef<SrDto>[]>(
    () => [
      {
        id: "select",
        header: () => <DataGridTableRowSelectAll />,
        cell: ({ row }) => <DataGridTableRowSelect row={row} />,
        enableSorting: false,
        enableHiding: false,
        size: 30,
      },
      {
        id: "no",
        header: () => "#",
        cell: ({ row }) => <span>{row.index + 1}</span>,
        enableSorting: false,
        size: 30,
        meta: {
          cellClassName: "text-center",
          headerClassName: "text-center",
        },
      },

      {
        accessorKey: "sr_no",

        header: ({ column }) => (
          <DataGridColumnHeader
            column={column}
            title="Ref"
            icon={<FileText className="h-4 w-4" />}
          />
        ),
        cell: ({ row }) => (
          <Link
            href={`/store-operation/store-requisition/${row.original.id}`}
            className="link-primary"
          >
            {row.original.sr_no}
          </Link>
        ),
        enableSorting: false,
        size: 200,
      },
      {
        accessorKey: "sr_date",
        header: ({ column }) => (
          <DataGridColumnHeader
            column={column}
            title="Date"
            icon={<Calendar className="h-4 w-4" />}
          />
        ),
        cell: ({ row }) => (
          <span>{formatDate(row.original.sr_date, dateFormat || "yyyy-MM-dd")}</span>
        ),
        enableSorting: false,
        size: 120,
      },
      {
        id: "location",
        header: ({ column }) => (
          <DataGridColumnHeader
            column={column}
            title="Location"
            icon={<Building className="h-4 w-4" />}
          />
        ),
        cell: ({ row }) => (
          <div className="flex items-center gap-2">
            <span>{row.original.from_location_name}</span>
            <ArrowRight className="h-4 w-4 text-muted-foreground" />
            <span>{row.original.to_location_name}</span>
          </div>
        ),
        enableSorting: false,
        size: 280,
      },
      {
        accessorKey: "requestor_name",
        header: () => <span>Requestor</span>,
        cell: ({ row }) => <span>{row.original.requestor_name}</span>,
        enableSorting: false,
        size: 150,
      },
      {
        accessorKey: "doc_status",
        header: () => <span>Status</span>,
        cell: ({ row }) => (
          <Badge variant={row.original.doc_status}>{row.original.doc_status}</Badge>
        ),
        enableSorting: false,
        size: 120,
        meta: {
          cellClassName: "text-center",
          headerClassName: "text-center",
        },
      },
      {
        id: "action",
        header: () => <span>{tTableHeader("action")}</span>,
        cell: ({ row }) => {
          return (
            <Button
              variant="destructive"
              size="sm"
              onClick={() => {
                onDelete(row.original.id);
              }}
            >
              <Trash2 />
              <span className="sr-only">Delete</span>
            </Button>
          );
        },
        enableSorting: false,
        size: 100,
        meta: {
          cellClassName: "text-right",
          headerClassName: "text-right",
        },
      },
    ],
    [tTableHeader]
  );

  // Initialize table
  const table = useReactTable({
    data: storeRequisitions,
    columns,
    getRowId: (row) => row.id ?? "",
    state: {},
    enableRowSelection: true,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <DataGrid
      table={table}
      recordCount={storeRequisitions.length}
      isLoading={isLoading}
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
          <ScrollArea className="max-h-[calc(100vh-250px)]">
            <DataGridTable />
            <ScrollBar orientation="horizontal" />
          </ScrollArea>
        </DataGridContainer>
      </div>
    </DataGrid>
  );
}
