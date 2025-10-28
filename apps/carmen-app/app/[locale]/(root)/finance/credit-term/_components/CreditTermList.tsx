"use client";

import { Button } from "@/components/ui/button";
import { useTranslations } from "next-intl";
import { Activity, CreditCard, FileText, Hash, MoreHorizontal, StickyNote, Trash2 } from "lucide-react";
import { CreditTermGetAllDto } from "@/dtos/credit-term.dto";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { StatusCustom } from "@/components/ui-custom/StatusCustom";
import { useMemo } from "react";
import {
  ColumnDef,
  getCoreRowModel,
  useReactTable,
  SortingState,
} from "@tanstack/react-table";
import { DataGrid, DataGridContainer } from "@/components/ui/data-grid";
import { DataGridTable } from "@/components/ui/data-grid-table";
import { DataGridColumnHeader } from "@/components/ui/data-grid-column-header";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";

interface CreditTermListProps {
  readonly creditTerms: CreditTermGetAllDto[];
  readonly isLoading: boolean;
  readonly onEdit: (creditTerm: CreditTermGetAllDto) => void;
  readonly onDelete: (creditTerm: CreditTermGetAllDto) => void;
  readonly sort?: { field: string; direction: "asc" | "desc" };
  readonly onSort?: (sortString: string) => void;
  readonly canUpdate?: boolean;
  readonly canDelete?: boolean;
}

export default function CreditTermList({
  creditTerms = [],
  isLoading,
  onEdit,
  onDelete,
  sort,
  onSort,
  canUpdate = true,
  canDelete = true,
}: CreditTermListProps) {
  const t = useTranslations("TableHeader");
  const tCommon = useTranslations("Common");

  const sorting: SortingState = useMemo(() => {
    if (!sort) return [];
    return [{ id: sort.field, desc: sort.direction === "desc" }];
  }, [sort]);


  // Define columns
  const columns = useMemo<ColumnDef<CreditTermGetAllDto>[]>(
    () => [
      {
        accessorKey: "name",
        header: ({ column }) => (
          <DataGridColumnHeader column={column} title={t("name")} icon={<CreditCard className="h-4 w-4" />} />
        ),
        cell: ({ row }) => {
          const creditTerm = row.original;
          if (canUpdate) {
            return (
              <button
                type="button"
                className="btn-dialog"
                onClick={() => onEdit(creditTerm)}
              >
                {creditTerm.name}
              </button>
            );
          }
          return <span>{creditTerm.name}</span>;
        },
        enableSorting: true,
        size: 200,
        meta: {
          headerTitle: t("name"),
        },
      },
      {
        accessorKey: "value",
        header: ({ column }) => (
          <div className="flex justify-center">
            <DataGridColumnHeader column={column} title={t("value")} icon={<Hash className="h-4 w-4" />} />
          </div>
        ),
        cell: ({ row }) => (
          <div className="text-center font-mono text-sm font-medium">
            {row.original.value}
          </div>
        ),
        enableSorting: true,
        size: 100,
        meta: {
          headerTitle: t("value"),
          cellClassName: "text-center",
          headerClassName: "text-center",
        },
      },
      {
        accessorKey: "description",
        header: ({ column }) => (
          <DataGridColumnHeader column={column} title={t("description")} icon={<FileText className="h-4 w-4" />} />
        ),
        cell: ({ row }) => (
          <p className="truncate max-w-[250px] inline-block">
            {row.original.description || "-"}
          </p>
        ),
        enableSorting: false,
        size: 250,
        meta: {
          headerTitle: t("description"),
        },
      },
      {
        accessorKey: "note",
        header: ({ column }) => (
          <DataGridColumnHeader column={column} title={t("note")} icon={<StickyNote className="h-4 w-4" />} />
        ),
        cell: ({ row }) => (
          <p className="truncate max-w-[200px] inline-block">
            {row.original.note || "-"}
          </p>
        ),
        enableSorting: false,
        size: 200,
        meta: {
          headerTitle: t("note"),
        },
      },
      {
        accessorKey: "is_active",
        header: ({ column }) => (
          <div className="flex justify-center">
            <DataGridColumnHeader column={column} title={t("status")} icon={<Activity className="h-4 w-4" />} />
          </div>
        ),
        cell: ({ row }) => (
          <div className="flex justify-center">
            <StatusCustom is_active={row.original.is_active}>
              {row.original.is_active ? tCommon("active") : tCommon("inactive")}
            </StatusCustom>
          </div>
        ),
        enableSorting: true,
        size: 120,
        meta: {
          headerTitle: t("status"),
          cellClassName: "text-center",
          headerClassName: "text-center",
        },
      },
      {
        id: "action",
        header: () => <span className="text-right">{t("action")}</span>,
        cell: ({ row }) => {
          const creditTerm = row.original;

          if (!canUpdate && !canDelete) return null;

          return (
            <div className="flex justify-end">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="h-7 w-7">
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  {canDelete && (
                    <DropdownMenuItem
                      className="text-destructive cursor-pointer hover:bg-transparent"
                      onClick={() => onDelete(creditTerm)}
                    >
                      <Trash2 className="h-4 w-4" />
                      {tCommon("delete")}
                    </DropdownMenuItem>
                  )}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          );
        },
        enableSorting: false,
        size: 120,
        meta: {
          cellClassName: "text-right",
          headerClassName: "text-right",
        },
      },
    ],
    [
      t,
      tCommon,
      canUpdate,
      canDelete,
      onEdit,
      onDelete,
    ]
  );

  // Initialize table
  const table = useReactTable({
    data: creditTerms,
    columns,
    getRowId: (row) => row.id,
    state: {
      sorting,
    },
    enableRowSelection: true,
    onSortingChange: (updater) => {
      if (!onSort) return;

      const newSorting = typeof updater === "function" ? updater(sorting) : updater;

      if (newSorting.length > 0) {
        const sortField = newSorting[0].id;
        const sortDirection = newSorting[0].desc ? "desc" : "asc";
        onSort(`${sortField}:${sortDirection}`);
      } else {
        onSort("");
      }
    },
    getCoreRowModel: getCoreRowModel(),
    manualSorting: true,
  });

  return (
    <DataGrid
      table={table}
      recordCount={creditTerms.length}
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
