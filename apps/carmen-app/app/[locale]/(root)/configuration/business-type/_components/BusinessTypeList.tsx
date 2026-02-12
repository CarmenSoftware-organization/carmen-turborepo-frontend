"use client";

import { BuTypeGetAllDto } from "@/dtos/bu-type.dto";
import { Activity, Info, List, MoreHorizontal, Trash2 } from "lucide-react";
import { useTranslations } from "next-intl";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { StatusCustom } from "@/components/ui-custom/StatusCustom";
import { useMemo } from "react";
import {
  ColumnDef,
  getCoreRowModel,
  useReactTable,
  PaginationState,
  SortingState,
} from "@tanstack/react-table";
import { DataGrid, DataGridContainer } from "@/components/ui/data-grid";
import {
  DataGridTable,
  DataGridTableRowSelect,
  DataGridTableRowSelectAll,
} from "@/components/ui/data-grid-table";
import { DataGridPagination } from "@/components/ui/data-grid-pagination";
import { DataGridColumnHeader } from "@/components/ui/data-grid-column-header";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";

interface Props {
  readonly buTypes: BuTypeGetAllDto[];
  readonly isLoading: boolean;
  readonly onEdit: (id: string) => void;
  readonly onDelete: (id: string) => void;
  readonly currentPage: number;
  readonly totalPages: number;
  readonly totalItems: number;
  readonly perpage: number;
  readonly onPageChange: (page: number) => void;
  readonly sort?: { field: string; direction: "asc" | "desc" };
  readonly onSort?: (sortString: string) => void;
  readonly setPerpage: (perpage: number) => void;
  readonly canUpdate?: boolean;
  readonly canDelete?: boolean;
}

export default function BusinessTypeList({
  buTypes,
  isLoading,
  onEdit,
  onDelete,
  currentPage,
  totalPages,
  totalItems,
  perpage,
  onPageChange,
  sort,
  onSort,
  setPerpage,
  canUpdate = true,
  canDelete = true,
}: Props) {
  const t = useTranslations("TableHeader");
  const tCommon = useTranslations("Common");

  // Action header component
  const ActionHeader = () => <div className="text-right">{t("action")}</div>;

  // Convert sort to TanStack Table format
  const sorting: SortingState = useMemo(() => {
    if (!sort) return [];
    return [{ id: sort.field, desc: sort.direction === "desc" }];
  }, [sort]);

  const pagination: PaginationState = useMemo(
    () => ({
      pageIndex: currentPage - 1,
      pageSize: perpage,
    }),
    [currentPage, perpage]
  );

  const columns = useMemo<ColumnDef<BuTypeGetAllDto>[]>(
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
        cell: ({ row }) => <span>{(currentPage - 1) * perpage + row.index + 1}</span>,
        enableSorting: false,
        size: 30,
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
            icon={<List className="h-4 w-4" />}
          />
        ),
        cell: ({ row }) => {
          const buType = row.original;
          if (canUpdate) {
            return (
              <button
                type="button"
                className="text-primary dark:text-foreground cursor-pointer hover:underline text-left text-xs md:text-sm"
                onClick={() => onEdit(buType.id)}
              >
                {buType.name}
              </button>
            );
          }
          return <span className="max-w-[200px] truncate inline-block">{buType.name}</span>;
        },
        enableSorting: true,
        size: 280,
        meta: {
          headerTitle: t("name"),
        },
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
        cell: ({ row }) => <p>{row.original.description}</p>,
        enableSorting: false,
        size: 250,
        meta: {
          headerTitle: t("description"),
        },
      },
      // {
      //   accessorKey: "note",
      //   header: ({ column }) => (
      //     <DataGridColumnHeader column={column} title={t("note")} icon={<Info className="h-4 w-4" />} />
      //   ),
      //   cell: ({ row }) => (
      //     <span className="truncate max-w-[200px] inline-block">
      //       {row.original.note}
      //     </span>
      //   ),
      //   enableSorting: false,
      //   size: 200,
      //   meta: {
      //     headerTitle: t("note"),
      //   },
      // },
      {
        accessorKey: "is_active",
        header: ({ column }) => (
          <div className="flex justify-center">
            <DataGridColumnHeader
              column={column}
              title={t("status")}
              icon={<Activity className="h-4 w-4" />}
            />
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
        header: ActionHeader,
        cell: ({ row }) => {
          const buType = row.original;

          if (!canDelete) return null;

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
                      onClick={() => onDelete(buType.id)}
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
    [t, tCommon, currentPage, perpage, canUpdate, canDelete, onEdit, onDelete]
  );

  // Initialize table
  const table = useReactTable({
    data: buTypes,
    columns,
    pageCount: totalPages,
    getRowId: (row) => row.id,
    state: {
      pagination,
      sorting,
    },
    enableRowSelection: true,
    onPaginationChange: (updater) => {
      const newPagination = typeof updater === "function" ? updater(pagination) : updater;
      onPageChange(newPagination.pageIndex + 1);
      setPerpage(newPagination.pageSize);
    },
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
    manualPagination: true,
    manualSorting: true,
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
        <DataGridPagination sizes={[5, 10, 25, 50, 100]} />
      </div>
    </DataGrid>
  );
}
