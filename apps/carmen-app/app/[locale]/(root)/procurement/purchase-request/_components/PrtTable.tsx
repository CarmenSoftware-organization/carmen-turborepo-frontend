"use client";

import { PurchaseRequestTemplateDto } from "@/dtos/pr-template.dto";
import { PaginateDto } from "@/dtos/paginate.dto";
import { useMemo, useState } from "react";
import { useTranslations } from "next-intl";
import {
  ColumnDef,
  getCoreRowModel,
  useReactTable,
  RowSelectionState,
  PaginationState,
} from "@tanstack/react-table";
import { DataGrid, DataGridContainer } from "@/components/ui/data-grid";
import {
  DataGridTable,
  DataGridTableRowSelect,
  DataGridTableRowSelectAll,
} from "@/components/ui/data-grid-table";
import { DataGridColumnHeader } from "@/components/ui/data-grid-column-header";
import { DataGridPagination } from "@/components/ui/data-grid-pagination";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { StatusCustom } from "@/components/ui-custom/StatusCustom";
import { Activity, FileText, Info, Building2 } from "lucide-react";

interface Props {
  readonly prtDatas: PurchaseRequestTemplateDto[];
  readonly paginate?: PaginateDto;
  readonly isLoading?: boolean;
  readonly currentPage: number;
  readonly perpage: number;
  readonly onPageChange: (page: number) => void;
  readonly onPerPageChange: (perpage: number) => void;
  readonly onSelectTemplate?: (template: PurchaseRequestTemplateDto | null) => void;
}

export default function PrtTable({
  prtDatas,
  paginate,
  isLoading = false,
  currentPage,
  perpage,
  onPageChange,
  onPerPageChange,
  onSelectTemplate,
}: Props) {
  const t = useTranslations("TableHeader");
  const tCommon = useTranslations("Common");
  const [rowSelection, setRowSelection] = useState<RowSelectionState>({});

  const pagination: PaginationState = useMemo(
    () => ({
      pageIndex: currentPage - 1,
      pageSize: perpage,
    }),
    [currentPage, perpage]
  );

  const totalPages = paginate?.total_pages ?? 1;
  const totalItems = paginate?.total_items ?? prtDatas.length;

  const columns = useMemo<ColumnDef<PurchaseRequestTemplateDto>[]>(
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
        size: 40,
        meta: {
          cellClassName: "text-center",
          headerClassName: "text-center",
        },
      },
      {
        accessorKey: "name",
        header: ({ column }) => (
          <DataGridColumnHeader
            column={column}
            title={t("name")}
            icon={<FileText className="h-4 w-4" />}
          />
        ),
        cell: ({ row }) => (
          <span className="font-medium">{row.original.name}</span>
        ),
        enableSorting: true,
        size: 200,
      },
      {
        accessorKey: "description",
        header: ({ column }) => (
          <DataGridColumnHeader
            column={column}
            title={t("description")}
            icon={<Info className="h-4 w-4" />}
          />
        ),
        cell: ({ row }) => (
          <p className="max-w-[200px] truncate text-muted-foreground">
            {row.original.description || "-"}
          </p>
        ),
        enableSorting: false,
        size: 200,
      },
      {
        accessorKey: "department_name",
        header: ({ column }) => (
          <DataGridColumnHeader
            column={column}
            title={t("department")}
            icon={<Building2 className="h-4 w-4" />}
          />
        ),
        cell: ({ row }) => <span>{row.original.department_name || "-"}</span>,
        enableSorting: true,
        size: 150,
      },
      {
        accessorKey: "is_active",
        header: ({ column }) => (
          <DataGridColumnHeader
            column={column}
            title={t("status")}
            icon={<Activity className="h-4 w-4" />}
          />
        ),
        cell: ({ row }) => (
          <StatusCustom is_active={row.original.is_active}>
            {row.original.is_active ? tCommon("active") : tCommon("inactive")}
          </StatusCustom>
        ),
        enableSorting: true,
        size: 100,
        meta: {
          cellClassName: "text-center",
          headerClassName: "text-center",
        },
      },
    ],
    [t, tCommon]
  );

  const table = useReactTable({
    data: prtDatas,
    columns,
    pageCount: totalPages,
    getRowId: (row) => row.id,
    state: {
      rowSelection,
      pagination,
    },
    enableRowSelection: true,
    enableMultiRowSelection: false,
    onRowSelectionChange: (updater) => {
      const newSelection = typeof updater === "function" ? updater(rowSelection) : updater;
      setRowSelection(newSelection);

      const selectedIds = Object.keys(newSelection).filter((id) => newSelection[id]);
      if (selectedIds.length > 0) {
        const selectedTemplate = prtDatas.find((t) => t.id === selectedIds[0]);
        onSelectTemplate?.(selectedTemplate || null);
      } else {
        onSelectTemplate?.(null);
      }
    },
    onPaginationChange: (updater) => {
      const newPagination = typeof updater === "function" ? updater(pagination) : updater;
      onPageChange(newPagination.pageIndex + 1);
      onPerPageChange(newPagination.pageSize);
    },
    getCoreRowModel: getCoreRowModel(),
    manualPagination: true,
  });

  return (
    <DataGrid
      table={table}
      recordCount={totalItems}
      isLoading={isLoading}
      loadingMode="skeleton"
      emptyMessage={tCommon("no_data")}
      tableLayout={{
        headerSticky: true,
        rowBorder: true,
        headerBackground: true,
        headerBorder: true,
        width: "fixed",
        dense: true,
      }}
    >
      <div className="w-full space-y-2.5">
        <DataGridContainer>
          <ScrollArea className="max-h-[300px]">
            <DataGridTable />
            <ScrollBar orientation="horizontal" />
          </ScrollArea>
        </DataGridContainer>
        <DataGridPagination sizes={[5, 10, 25, 50]} />
      </div>
    </DataGrid>
  );
}
