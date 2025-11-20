"use client";

import { Button } from "@/components/ui/button";
import { Calendar, List, MoreHorizontal, Trash2 } from "lucide-react";
import { useState, useMemo } from "react";
import { useAuth } from "@/context/AuthContext";
import { useDeletePriceList } from "../_hooks/use-price-list";
import { toastError, toastSuccess } from "@/components/ui-custom/Toast";
import { useQueryClient } from "@tanstack/react-query";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
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
import type { PriceListDtoList } from "../_dto/price-list-dto";

interface ListPriceListProps {
  readonly priceLists?: PriceListDtoList[];
  readonly isLoading?: boolean;
}

export default function ListPriceList({ priceLists = [], isLoading = false }: ListPriceListProps) {
  const { token, buCode, dateFormat } = useAuth();
  const tTableHeader = useTranslations("TableHeader");
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
        // Invalidate and refetch price list data
        queryClient.invalidateQueries({ queryKey: ["price-lists", buCode] });
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
  const columns = useMemo<ColumnDef<PriceListDtoList>[]>(
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
        cell: ({ row }) => (
          <span>
            {row.original.effectivePeriod.from} - {row.original.effectivePeriod.to}
          </span>
        ),
        enableSorting: false,
        size: 200,
      },
      {
        accessorKey: "status",
        header: () => <span>{tTableHeader("status")}</span>,
        cell: ({ row }) => <span className="capitalize">{row.original.status}</span>,
        enableSorting: false,
        size: 80,
        meta: {
          cellClassName: "text-center",
          headerClassName: "text-center",
        },
      },
      {
        accessorKey: "itemsCount",
        header: () => <span className="text-right">{tTableHeader("items")}</span>,
        cell: ({ row }) => <span className="text-right block">{row.original.itemsCount}</span>,
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

      <AlertDialog open={alertOpen} onOpenChange={setAlertOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Price List</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this price list for &quot;
              {selectedPriceList?.vendor?.name}&quot;? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setAlertOpen(false)}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              disabled={isDeleting}
            >
              {isDeleting ? "Deleting..." : "Delete"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
