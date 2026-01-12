"use client";

import { DepartmentGetListDto } from "@/dtos/department.dto";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { Activity, Info, List, MoreHorizontal, Trash2 } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
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
import { Link } from "@/lib/navigation";

interface DepartmentListProps {
  readonly departments: DepartmentGetListDto[];
  readonly isLoading: boolean;
  readonly currentPage: number;
  readonly totalPages: number;
  readonly totalItems: number;
  readonly perpage: number;
  readonly onPageChange: (page: number) => void;
  readonly sort?: { field: string; direction: "asc" | "desc" };
  readonly onSort?: (sortString: string) => void;
  readonly setPerpage: (perpage: number) => void;
  readonly onDelete?: (department: DepartmentGetListDto) => void;
  readonly canUpdate?: boolean;
  readonly canDelete?: boolean;
}

export default function DepartmentList({
  departments,
  isLoading,
  currentPage,
  totalPages,
  totalItems,
  perpage,
  onPageChange,
  sort,
  onSort,
  setPerpage,
  onDelete,
  canUpdate = true,
  canDelete = true,
}: DepartmentListProps) {
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

  const columns = useMemo<ColumnDef<DepartmentGetListDto>[]>(
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
        header: () => <div className="text-center">#</div>,
        cell: ({ row }) => (
          <div className="text-center">{(currentPage - 1) * perpage + row.index + 1}</div>
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
          const department = row.original;
          if (canUpdate) {
            return (
              <Link
                href={`/configuration/department/${department.id}`}
                className="hover:underline hover:underline-offset text-primary dark:text-primary-foreground hover:text-primary/80"
              >
                {department.name}
              </Link>
            );
          }
          return <span className="max-w-[200px] break-words">{department.name}</span>;
        },
        enableSorting: true,
        size: 280,
        meta: {
          headerTitle: t("name"),
        },
      },
      {
        accessorKey: "code",
        header: ({ column }) => (
          <DataGridColumnHeader
            column={column}
            title={t("code")}
            icon={<List className="h-4 w-4" />}
          />
        ),
        cell: ({ row }) => {
          const department = row.original;
          if (canUpdate) {
            return <span className="max-w-[200px] truncate">{row.original.code}</span>;
          }
          return <span className="max-w-[200px] break-words">{department.code}</span>;
        },
        enableSorting: true,
        size: 100,
        meta: {
          headerTitle: t("code"),
          cellClassName: "text-center",
          headerClassName: "text-center",
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
        cell: ({ row }) => <p className="max-w-[200px] truncate">{row.original.description}</p>,
        enableSorting: false,
        size: 200,
        meta: {
          headerTitle: t("description"),
        },
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
          if (!canDelete) return null;

          const department = row.original;

          return (
            <div className="flex justify-end">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="h-7 w-7">
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  {canDelete && onDelete && (
                    <DropdownMenuItem
                      className="cursor-pointer"
                      onClick={() => onDelete(department)}
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

  // Initialize table
  const table = useReactTable({
    data: departments,
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
        rowBorder: true,
        headerBackground: true,
        headerBorder: true,
        width: "fixed",
        dense: false,
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
