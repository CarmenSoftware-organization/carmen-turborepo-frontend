"use client";

import { ProductGetDto } from "@/dtos/product.dto";
import { Button } from "@/components/ui/button";
import { useTranslations } from "next-intl";
import { Activity, Box, Layers, List, MoreHorizontal, Ruler, Tag, Trash2 } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
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
import { DataGridTable, DataGridTableRowSelect, DataGridTableRowSelectAll } from "@/components/ui/data-grid-table";
import { DataGridPagination } from "@/components/ui/data-grid-pagination";
import { DataGridColumnHeader } from "@/components/ui/data-grid-column-header";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { Link } from "@/lib/navigation";

interface ProductListProps {
  readonly products: ProductGetDto[];
  readonly isLoading: boolean;
  readonly currentPage: number;
  readonly totalPages: number;
  readonly totalItems: number;
  readonly perpage: number;
  readonly onPageChange: (page: number) => void;
  readonly sort?: { field: string; direction: "asc" | "desc" };
  readonly onSort?: (sortString: string) => void;
  readonly setPerpage: (perpage: number) => void;
}

export default function ProductList({
  products = [],
  isLoading,
  currentPage,
  totalPages,
  totalItems,
  perpage,
  onPageChange,
  sort,
  onSort,
  setPerpage,
}: ProductListProps) {
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

  const columns = useMemo<ColumnDef<ProductGetDto>[]>(
    () => [
      {
        id: "select",
        header: () => <DataGridTableRowSelectAll />,
        cell: ({ row }) => <DataGridTableRowSelect row={row} />,
        enableSorting: false,
        enableHiding: false,
        size: 40,
      },
      {
        id: "no",
        header: () => <div className="text-center">#</div>,
        cell: ({ row }) => (
          <div className="text-center">
            {(currentPage - 1) * perpage + row.index + 1}
          </div>
        ),
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
          <DataGridColumnHeader column={column} title={t("name")} icon={<List className="h-4 w-4" />} />
        ),
        cell: ({ row }) => {
          const product = row.original;
          return (
            <div className="max-w-[300px] truncate">
              <Link
                href={`/product-management/product/${product.id}`}
                className="link-primary"
              >
                {product.name}
              </Link>
            </div>
          );
        },
        enableSorting: true,
        size: 300,
        meta: {
          headerTitle: t("name"),
        },
      },
      {
        id: "code",
        accessorKey: 'code',
        header: ({ column }) => (
          <DataGridColumnHeader column={column} title="SKU" icon={<Tag className="h-4 w-4" />} />
        ),
        cell: ({ row }) => {
          const product = row.original;
          return (
            <span className="text-sm">
              {product.code}
            </span>
          );
        },
        enableSorting: true,
        size: 120,
      },
      {
        accessorKey: "product_category.name",
        header: ({ column }) => (
          <DataGridColumnHeader column={column} title={t("category")} icon={<Tag className="h-4 w-4" />} />
        ),
        cell: ({ row }) => (
          <span className="truncate max-w-[150px] inline-block">
            {row.original.product_category?.name || "-"}
          </span>
        ),
        enableSorting: true,
        size: 150,
        meta: {
          headerTitle: t("category"),
        },
      },
      {
        accessorKey: "product_sub_category.name",
        header: ({ column }) => (
          <DataGridColumnHeader column={column} title={t("sub_category")} icon={<Layers className="h-4 w-4" />} />
        ),
        cell: ({ row }) => (
          <span className="truncate max-w-[150px] inline-block">
            {row.original.product_sub_category?.name || "-"}
          </span>
        ),
        enableSorting: false,
        size: 150,
        meta: {
          headerTitle: t("sub_category"),
        },
      },
      {
        accessorKey: "product_item_group.name",
        header: ({ column }) => (
          <DataGridColumnHeader column={column} title={t("item_group")} icon={<Box className="h-4 w-4" />} />
        ),
        cell: ({ row }) => (
          <span className="truncate max-w-[150px] inline-block">
            {row.original.product_item_group?.name || "-"}
          </span>
        ),
        enableSorting: false,
        size: 150,
        meta: {
          headerTitle: t("item_group"),
        },
      },
      {
        accessorKey: "inventory_unit_name",
        header: ({ column }) => (
          <DataGridColumnHeader column={column} title={t("inventory_unit")} icon={<Ruler className="h-4 w-4" />} />
        ),
        cell: ({ row }) => (
          <span className="text-sm">{row.original.inventory_unit_name || "-"}</span>
        ),
        enableSorting: false,
        size: 150,
        meta: {
          headerTitle: t("inventory_unit"),
          cellClassName: "text-center",
          headerClassName: "text-center",
        },
      },
      {
        accessorKey: "product_status_type",
        header: ({ column }) => (
          <div className="flex justify-center">
            <DataGridColumnHeader column={column} title={t("status")} icon={<Activity className="h-4 w-4" />} />
          </div>
        ),
        cell: ({ row }) => (
          <div className="flex justify-center">
            <StatusCustom is_active={row.original.product_status_type === "active"}>
              {row.original.product_status_type === "active" ? tCommon("active") : tCommon("inactive")}
            </StatusCustom>
          </div>
        ),
        enableSorting: false,
        size: 120,
        meta: {
          headerTitle: t("status"),
          cellClassName: "text-center",
          headerClassName: "text-center",
        },
      },
      {
        id: "action",
        header: () => <div className="text-right">{t("action")}</div>,
        cell: ({ row }) => {
          const product = row.original;
          return (
            <div className="flex justify-end">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm" className="h-6 w-6">
                    <MoreHorizontal className="h-4 w-4" />
                    <span className="sr-only">More options</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem
                    className="text-destructive cursor-pointer hover:bg-transparent"
                    onClick={() => console.log("Delete", product.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                    {tCommon("delete")}
                  </DropdownMenuItem>
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
    [t, tCommon, currentPage, perpage]
  );

  const table = useReactTable({
    data: products,
    columns,
    pageCount: totalPages,
    getRowId: (row) => row.id ?? "",
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
      <div className="w-full space-y-2">
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
