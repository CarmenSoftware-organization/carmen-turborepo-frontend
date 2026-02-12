"use client";

import { Button } from "@/components/ui/button";
import { useTranslations } from "next-intl";
import { List, MoreHorizontal, Trash2 } from "lucide-react";
import { RoleDto } from "@/dtos/role.dto";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
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
import { Link } from "@/lib/navigation";

interface ListRoleProps {
  readonly roles: RoleDto[];
  readonly isLoading: boolean;
  readonly currentPage: number;
  readonly totalPages: number;
  readonly totalItems: number;
  readonly perpage: number;
  readonly onPageChange: (page: number) => void;
  readonly sort?: { field: string; direction: "asc" | "desc" };
  readonly onSort?: (sortString: string) => void;
  readonly onDelete: (role: RoleDto) => void;
  readonly setPerpage: (perpage: number) => void;
  readonly canUpdate?: boolean;
  readonly canDelete?: boolean;
}

export default function ListRole({
  roles,
  isLoading,
  currentPage,
  totalPages,
  totalItems,
  perpage,
  onPageChange,
  sort,
  onSort,
  onDelete,
  setPerpage,
  canUpdate = true,
  canDelete = true,
}: ListRoleProps) {
  const t = useTranslations("TableHeader");
  const tCommon = useTranslations("Common");

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

  const columns = useMemo<ColumnDef<RoleDto>[]>(
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
        header: () => <span className="text-center">#</span>,
        cell: ({ row }) => (
          <span className="text-center">
            {(currentPage - 1) * perpage + row.index + 1}
          </span>
        ),
        enableSorting: false,
        size: 20,
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
          const role = row.original;
          if (canUpdate) {
            return (
              <Link
                href={`/system-administration/role/${role.id}`}
                className="text-primary dark:text-foreground cursor-pointer hover:underline text-left text-xs md:text-sm"
              >
                {role.name}
              </Link>
            );
          }
          return <span>{role.name}</span>;
        },
        enableSorting: true,
        size: 250,
        meta: {
          headerTitle: t("name"),
        },
      },
      {
        accessorKey: "description",
        header: ({ column }) => (
          <DataGridColumnHeader column={column} title={t("description")} />
        ),
        cell: ({ row }) => (
          <span className="text-muted-foreground">
            {row.original.description ?? "-"}
          </span>
        ),
        enableSorting: false,
        size: 400,
        meta: {
          headerTitle: t("description"),
        },
      },
      {
        id: "action",
        header: () => <span className="text-right">{t("action")}</span>,
        cell: ({ row }) => {
          const role = row.original;

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
                      onClick={() => onDelete(role)}
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
        size: 80,
        meta: {
          cellClassName: "text-right",
          headerClassName: "text-right",
        },
      },
    ],
    [t, tCommon, currentPage, perpage, canUpdate, canDelete, onDelete]
  );

  const table = useReactTable({
    data: roles,
    columns,
    pageCount: totalPages,
    getRowId: (row) => row.id,
    state: {
      pagination,
      sorting,
    },
    enableRowSelection: true,
    onPaginationChange: (updater) => {
      const newPagination =
        typeof updater === "function" ? updater(pagination) : updater;
      onPageChange(newPagination.pageIndex + 1);
      setPerpage(newPagination.pageSize);
    },
    onSortingChange: (updater) => {
      if (!onSort) return;

      const newSorting =
        typeof updater === "function" ? updater(sorting) : updater;

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
