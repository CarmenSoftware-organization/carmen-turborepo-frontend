"use client";

import { Button } from "@/components/ui/button";
import { Calendar, List, MoreHorizontal, Trash2 } from "lucide-react";
import { useState, useMemo } from "react";
import { useAuth } from "@/context/AuthContext";
import { useBuConfig } from "@/context/BuConfigContext";
import { toastError, toastSuccess } from "@/components/ui-custom/Toast";
import { useQueryClient } from "@tanstack/react-query";
import ButtonLink from "@/components/ButtonLink";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useTranslations } from "next-intl";
import { ColumnDef, getCoreRowModel, useReactTable, PaginationState } from "@tanstack/react-table";
import { DataGrid, DataGridContainer } from "@/components/ui/data-grid";
import {
  DataGridTable,
  DataGridTableRowSelect,
  DataGridTableRowSelectAll,
} from "@/components/ui/data-grid-table";
import { DataGridColumnHeader } from "@/components/ui/data-grid-column-header";
import { DataGridPagination } from "@/components/ui/data-grid-pagination";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { formatDate } from "@/utils/format/date";
import { Badge } from "@/components/ui/badge";
import { PriceListDtoList } from "@/dtos/price-list-dto";
import { useDeletePriceList } from "@/hooks/use-price-list";
import DeleteConfirmDialog from "@/components/ui-custom/DeleteConfirmDialog";

interface ListPriceListProps {
  readonly priceLists?: any[];
  readonly isLoading?: boolean;
  readonly currentPage: number;
  readonly totalPages: number;
  readonly totalItems: number;
  readonly perpage: number;
  readonly onPageChange: (page: number) => void;
  readonly setPerpage: (perpage: number) => void;
}

export default function ListPriceList({
  priceLists = [],
  isLoading = false,
  currentPage,
  totalPages,
  totalItems,
  perpage,
  onPageChange,
  setPerpage,
}: ListPriceListProps) {
  const { token, buCode } = useAuth();
  const { dateFormat } = useBuConfig();
  const tTableHeader = useTranslations("TableHeader");
  const tPriceList = useTranslations("PriceList");
  const tCommon = useTranslations("Common");
  const queryClient = useQueryClient();
  const [deleteId, setDeleteId] = useState<string>("");
  const [alertOpen, setAlertOpen] = useState(false);
  const [selectedPriceList, setSelectedPriceList] = useState<PriceListDtoList | null>(null);

  const pagination: PaginationState = useMemo(
    () => ({
      pageIndex: currentPage - 1,
      pageSize: perpage,
    }),
    [currentPage, perpage]
  );

  const { mutate: deletePriceList, isPending: isDeleting } = useDeletePriceList(token, buCode);

  const handleDeleteClick = (priceList: PriceListDtoList) => {
    setSelectedPriceList(priceList);
    setAlertOpen(true);
  };

  const handleDelete = () => {
    if (!selectedPriceList?.id) return;

    setDeleteId(selectedPriceList.id);
    deletePriceList(selectedPriceList.id, {
      onSuccess: () => {
        toastSuccess({ message: "Price list deleted successfully" });
        setDeleteId("");
        setAlertOpen(false);
        setSelectedPriceList(null);
        queryClient.invalidateQueries({ queryKey: ["price-list", buCode] });
      },
      onError: () => {
        toastError({ message: "Failed to delete price list" });
        setDeleteId("");
        setAlertOpen(false);
        setSelectedPriceList(null);
      },
    });
  };

  // Define columns
  const columns = useMemo<ColumnDef<any>[]>(
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
        size: 30,
        meta: {
          cellClassName: "text-center",
          headerClassName: "text-center",
        },
      },
      {
        accessorKey: "no",
        header: ({ column }) => (
          <DataGridColumnHeader
            column={column}
            title={tTableHeader("price_list_no")}
            icon={<List className="h-4 w-4" />}
          />
        ),
        cell: ({ row }) => {
          const priceList = row.original;
          return (
            <ButtonLink href={`/vendor-management/price-list/${priceList.id}`}>
              {priceList.no}
            </ButtonLink>
          );
        },
        enableSorting: false,
        size: 180,
      },
      {
        accessorKey: "name",
        header: ({ column }) => (
          <DataGridColumnHeader
            column={column}
            title={tTableHeader("name")}
            icon={<List className="h-4 w-4" />}
          />
        ),
        cell: ({ row }) => {
          const priceList = row.original;
          return <span>{priceList.name}</span>;
        },
        enableSorting: false,
        size: 200,
      },
      {
        accessorKey: "vendor.name",
        header: ({ column }) => (
          <DataGridColumnHeader column={column} title={tTableHeader("vendor")} />
        ),
        cell: ({ row }) => {
          const priceList = row.original;
          return <span>{priceList.vendor?.name}</span>;
        },
        enableSorting: false,
        size: 300,
      },
      {
        accessorKey: "effectivePeriod",
        header: () => (
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4" />
            <span>{tTableHeader("effective_period")}</span>
          </div>
        ),
        cell: ({ row }) => {
          const period = row.original.effectivePeriod;
          if (!period) return <span>-</span>;

          if (typeof period === "string") {
            const [start, end] = period.split(" - ");
            if (start && end) {
              return (
                <div>
                  {formatDate(start, dateFormat || "yyyy-MM-dd")} -{" "}
                  {formatDate(end, dateFormat || "yyyy-MM-dd")}
                </div>
              );
            }
            return <span>{period}</span>;
          }
          return <span>{period}</span>;
        },
        enableSorting: false,
        size: 220,
      },
      {
        accessorKey: "status",
        header: () => <span>{tTableHeader("status")}</span>,
        cell: ({ row }) => (
          <Badge variant={row.original.status} className="font-bold text-xs">
            {row.original.status.toUpperCase()}
          </Badge>
        ),
        enableSorting: false,
        size: 80,
        meta: {
          cellClassName: "text-center",
          headerClassName: "text-center",
        },
      },
      {
        accessorKey: "itemsCount",
        header: () => <span>{tTableHeader("items")}</span>,
        cell: ({ row }) => {
          return <span>{row.original.pricelist_detail?.length || 0}</span>;
        },
        enableSorting: false,
        size: 90,
        meta: {
          cellClassName: "text-center",
          headerClassName: "text-center",
        },
      },
      {
        id: "action",
        header: () => <span>{tTableHeader("action")}</span>,
        cell: ({ row }) => {
          const priceList = row.original;
          return (
            <Button
              variant="ghost"
              size="sm"
              className="text-destructive hover:text-destructive/80 hover:bg-transparent"
              onClick={() => handleDeleteClick(priceList)}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
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
    [tTableHeader, dateFormat, isDeleting, deleteId, currentPage, perpage]
  );

  // Initialize table
  const table = useReactTable({
    data: priceLists,
    columns,
    pageCount: totalPages,
    getRowId: (row) => row.id ?? "",
    state: {
      pagination,
    },
    enableRowSelection: true,
    onPaginationChange: (updater) => {
      const newPagination = typeof updater === "function" ? updater(pagination) : updater;
      onPageChange(newPagination.pageIndex + 1);
      setPerpage(newPagination.pageSize);
    },
    getCoreRowModel: getCoreRowModel(),
    manualPagination: true,
  });

  return (
    <>
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

      <DeleteConfirmDialog
        open={alertOpen}
        onOpenChange={setAlertOpen}
        title={tPriceList("delete_price_list")}
        description={`${tPriceList("delete_price_list_confirmation")} "${selectedPriceList?.vendor?.name}"? ${tCommon("action_cannot_be_undone")}`}
        onConfirm={handleDelete}
      />
    </>
  );
}
