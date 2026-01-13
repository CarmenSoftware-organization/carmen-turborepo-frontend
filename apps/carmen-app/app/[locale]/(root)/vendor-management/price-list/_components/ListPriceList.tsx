"use client";

import { Button } from "@/components/ui/button";
import { Calendar, List, MoreHorizontal, Trash2 } from "lucide-react";
import { useState, useMemo } from "react";
import { useAuth } from "@/context/AuthContext";
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
import { ColumnDef, getCoreRowModel, useReactTable } from "@tanstack/react-table";
import { DataGrid, DataGridContainer } from "@/components/ui/data-grid";
import {
  DataGridTable,
  DataGridTableRowSelect,
  DataGridTableRowSelectAll,
} from "@/components/ui/data-grid-table";
import { DataGridColumnHeader } from "@/components/ui/data-grid-column-header";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { formatDate } from "@/utils/format/date";
import { Badge } from "@/components/ui/badge";
import { PriceListDtoList } from "@/dtos/price-list-dto";
import { useDeletePriceList } from "@/hooks/use-price-list";
import DeleteConfirmDialog from "@/components/ui-custom/DeleteConfirmDialog";

interface ListPriceListProps {
  readonly priceLists?: any[];
  readonly isLoading?: boolean;
}

export default function ListPriceList({ priceLists = [], isLoading = false }: ListPriceListProps) {
  const { token, buCode, dateFormat } = useAuth();
  const tTableHeader = useTranslations("TableHeader");
  const tPriceList = useTranslations("PriceList");
  const tCommon = useTranslations("Common");
  const queryClient = useQueryClient();
  const [deleteId, setDeleteId] = useState<string>("");
  const [alertOpen, setAlertOpen] = useState(false);
  const [selectedPriceList, setSelectedPriceList] = useState<PriceListDtoList | null>(null);

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
        cell: ({ row }) => <div className="text-center">{row.index + 1}</div>,
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
        accessorKey: "vendor.name",
        header: ({ column }) => (
          <DataGridColumnHeader column={column} title={tTableHeader("vendor")} />
        ),
        cell: ({ row }) => {
          const priceList = row.original;
          return <span>{priceList.vendor?.name}</span>;
        },
        enableSorting: false,
        size: 200,
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
        size: 200,
      },
      {
        accessorKey: "status",
        header: () => <span>{tTableHeader("status")}</span>,
        cell: ({ row }) => (
          <Badge variant={row.original.status} className="capitalize text-xs">
            {row.original.status}
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
        accessorKey: "itemsCount", // Accessor key might be virtual or mapped, keeping it for now but cell uses pricelist_detail
        header: () => <span className="text-right">{tTableHeader("items")}</span>,
        cell: ({ row }) => {
          // @ts-ignore - pricelist_detail might not be directly on the type inferred by row.original types if not fully updated in usage, but is in DTO
          return (
            <span className="text-right block">{row.original.pricelist_detail?.length || 0}</span>
          );
        },
        enableSorting: false,
        size: 90,
        meta: {
          cellClassName: "text-right",
          headerClassName: "text-right",
        },
      },
      {
        id: "action",
        header: () => <span className="text-right">{tTableHeader("action")}</span>,
        cell: ({ row }) => {
          const priceList = row.original;

          return (
            <div className="flex justify-end">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="h-7 w-7">
                    <MoreHorizontal className="h-4 w-4" />
                    <span className="sr-only">More options</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem
                    className="text-destructive cursor-pointer hover:bg-transparent"
                    disabled={isDeleting && deleteId === priceList?.id}
                    onClick={() => handleDeleteClick(priceList)}
                  >
                    <Trash2 className="h-4 w-4" />
                    Delete
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          );
        },
        enableSorting: false,
        size: 150,
        meta: {
          cellClassName: "text-right",
          headerClassName: "text-right",
        },
      },
    ],
    [tTableHeader, dateFormat, isDeleting, deleteId]
  );

  // Initialize table
  const table = useReactTable({
    data: priceLists,
    columns,
    getRowId: (row) => row.id ?? "",
    enableRowSelection: true,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <>
      <DataGrid
        table={table}
        recordCount={priceLists.length}
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
