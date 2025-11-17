"use client";

import { Button } from "@/components/ui/button";
import { PriceListDto } from "@/dtos/price-list.dto";
import { Calendar, List, MoreHorizontal, Trash2 } from "lucide-react";
import { useState, useMemo } from "react";
import { useAuth } from "@/context/AuthContext";
import { useDeletePriceList } from "@/hooks/use-price-list";
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
import { formatDate } from "@/utils/format/date";
import { useTranslations } from "next-intl";
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

interface ListPriceListProps {
  readonly priceLists?: PriceListDto[];
  readonly isLoading?: boolean;
  readonly totalItems?: number;
  readonly totalPages?: number;
  readonly perpage?: number;
  readonly currentPage?: number;
  readonly onPageChange?: (page: number) => void;
  readonly sort?: { field: string; direction: "asc" | "desc" } | null;
  readonly onSort?: (sortString: string) => void;
  readonly setPerpage?: (perpage: number) => void;
}

export default function ListPriceList({
  priceLists = [],
  isLoading = false,
  totalItems = 0,
  totalPages = 1,
  perpage = 10,
  currentPage = 1,
  onPageChange,
  sort,
  onSort,
  setPerpage,
}: ListPriceListProps) {
  const { token, buCode, dateFormat } = useAuth();
  const tTableHeader = useTranslations("TableHeader");
  const tCommon = useTranslations("Common");
  const queryClient = useQueryClient();
  const [deleteId, setDeleteId] = useState<string>("");
  const [alertOpen, setAlertOpen] = useState(false);
  const [selectedPriceList, setSelectedPriceList] = useState<PriceListDto | null>(null);

  const { mutate: deletePriceList, isPending: isDeleting } = useDeletePriceList(token, buCode);

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

  const handleDeleteClick = (priceList: PriceListDto) => {
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
  const columns = useMemo<ColumnDef<PriceListDto>[]>(
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
        accessorKey: "vendor.name",
        header: ({ column }) => (
          <DataGridColumnHeader
            column={column}
            title={tTableHeader("name")}
            icon={<List className="h-4 w-4" />}
          />
        ),
        cell: ({ row }) => {
          const priceList = row.original;
          return (
            <ButtonLink href={`/vendor-management/price-list/${priceList.id}`}>
              {priceList.vendor?.name}
            </ButtonLink>
          );
        },
        enableSorting: true,
        size: 300,
        meta: {
          headerTitle: tTableHeader("name"),
        },
      },
      {
        accessorKey: "from_date",
        header: () => (
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4" />
            <span>{tTableHeader("start_date")}</span>
          </div>
        ),
        cell: ({ row }) => (
          <span>{formatDate(row.original.from_date ?? "", dateFormat ?? "dd/MM/yyyy")}</span>
        ),
        enableSorting: false,
        size: 150,
      },
      {
        accessorKey: "to_date",
        header: () => (
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4" />
            <span>{tTableHeader("end_date")}</span>
          </div>
        ),
        cell: ({ row }) => (
          <span>{formatDate(row.original.to_date ?? "", dateFormat ?? "dd/MM/yyyy")}</span>
        ),
        enableSorting: false,
        size: 150,
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
        size: 80,
        meta: {
          cellClassName: "text-right",
          headerClassName: "text-right",
        },
      },
    ],
    [tTableHeader, currentPage, perpage, dateFormat, isDeleting, deleteId]
  );

  // Initialize table
  const table = useReactTable({
    data: priceLists,
    columns,
    pageCount: totalPages,
    getRowId: (row) => row.id ?? "",
    state: {
      pagination,
      sorting,
    },
    enableRowSelection: true,
    onPaginationChange: (updater) => {
      const newPagination = typeof updater === "function" ? updater(pagination) : updater;
      if (onPageChange) {
        onPageChange(newPagination.pageIndex + 1);
      }
      if (setPerpage) {
        setPerpage(newPagination.pageSize);
      }
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
