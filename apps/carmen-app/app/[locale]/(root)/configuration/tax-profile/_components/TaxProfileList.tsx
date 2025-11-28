"use client";

import { Button } from "@/components/ui/button";
import { TaxProfileGetAllDto } from "@/dtos/tax-profile.dto";
import { Activity, List, Trash2, Percent } from "lucide-react";
import { useTranslations } from "next-intl";
import { StatusCustom } from "@/components/ui-custom/StatusCustom";
import { useMemo } from "react";
import { ColumnDef, getCoreRowModel, useReactTable } from "@tanstack/react-table";
import { DataGrid, DataGridContainer } from "@/components/ui/data-grid";
import { DataGridTable } from "@/components/ui/data-grid-table";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";

interface TaxProfileListProps {
  readonly taxProfiles: TaxProfileGetAllDto[];
  readonly isLoading: boolean;
  readonly onEdit: (id: string) => void;
  readonly onDelete: (id: string) => void;
  readonly canUpdate?: boolean;
  readonly canDelete?: boolean;
}

export default function TaxProfileList({
  taxProfiles,
  isLoading,
  onEdit,
  onDelete,
  canUpdate = true,
  canDelete = true,
}: TaxProfileListProps) {
  const t = useTranslations("TableHeader");
  const tCommon = useTranslations("Common");

  // Define columns
  const columns = useMemo<ColumnDef<TaxProfileGetAllDto>[]>(
    () => [
      {
        id: "no",
        header: () => <div className="text-center">#</div>,
        cell: ({ row }) => <div className="text-center">{row.index + 1}</div>,
        enableSorting: false,
        size: 20,
        meta: {
          cellClassName: "text-center",
          headerClassName: "text-center",
        },
      },
      {
        accessorKey: "name",
        header: () => (
          <div className="flex items-center gap-2">
            <List className="h-4 w-4" />
            {t("name")}
          </div>
        ),
        cell: ({ row }) => {
          const taxProfile = row.original;
          if (canUpdate) {
            return (
              <div className="max-w-[300px] truncate">
                <button type="button" className="btn-dialog" onClick={() => onEdit(taxProfile.id)}>
                  {taxProfile.name}
                </button>
              </div>
            );
          }
          return <span className="max-w-[300px] truncate inline-block">{taxProfile.name}</span>;
        },
        enableSorting: false,
        size: 100,
      },
      {
        accessorKey: "tax_rate",
        header: () => (
          <div className="flex items-center justify-end gap-2">
            <Percent className="h-4 w-4" />
            {t("rate")}
          </div>
        ),
        cell: ({ row }) => <div className="text-right">{row.original.tax_rate}%</div>,
        enableSorting: false,
        size: 100,
        meta: {
          cellClassName: "text-right",
          headerClassName: "text-right",
        },
      },
      {
        accessorKey: "is_active",
        header: () => (
          <div className="flex justify-center items-center gap-2">
            <Activity className="h-4 w-4" />
            {t("status")}
          </div>
        ),
        cell: ({ row }) => (
          <div className="flex justify-center">
            <StatusCustom is_active={row.original.is_active}>
              {row.original.is_active ? tCommon("active") : tCommon("inactive")}
            </StatusCustom>
          </div>
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
        header: () => <span className="text-right">{t("action")}</span>,
        cell: ({ row }) => {
          const taxProfile = row.original;

          if (!canDelete) return null;

          return (
            <div className="flex justify-end">
              {canDelete && (
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-7 w-7 text-destructive cursor-pointer hover:bg-transparent"
                  onClick={() => onDelete(taxProfile.id)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              )}
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
    [t, tCommon, canUpdate, canDelete, onEdit, onDelete]
  );

  // Initialize table
  const table = useReactTable({
    data: taxProfiles,
    columns,
    getRowId: (row) => row.id,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <DataGrid
      table={table}
      recordCount={taxProfiles.length}
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
      <DataGridContainer>
        <ScrollArea className="max-h-[calc(100vh-250px)]">
          <DataGridTable />
          <ScrollBar orientation="horizontal" />
        </ScrollArea>
      </DataGridContainer>
    </DataGrid>
  );
}
