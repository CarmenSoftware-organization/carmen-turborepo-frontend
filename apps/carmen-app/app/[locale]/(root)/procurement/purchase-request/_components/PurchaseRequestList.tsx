"use client";

import {
  Activity,
  Building,
  Calendar,
  DollarSign,
  FileDown,
  FileText,
  MoreHorizontal,
  Printer,
  Trash2,
  TypeIcon,
  User,
  Workflow,
} from "lucide-react";
import { useTranslations } from "next-intl";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { PurchaseRequestListDto } from "@/dtos/purchase-request.dto";
import { useAuth } from "@/context/AuthContext";
import { formatDate } from "@/utils/format/date";
import { formatPrice } from "@/utils/format/currency";
import { useMemo, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { toastError, toastSuccess } from "@/components/ui-custom/Toast";
import { useDeletePr } from "@/hooks/use-purchase-request";
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
import { Button } from "@/components/ui/button";
import { Link } from "@/lib/navigation";
import { Badge } from "@/components/ui/badge";
import { useSearchParams } from "next/navigation";
import { returnUrl } from "@/utils/url";
import { useWorkflowTypeTranslation } from "@/utils/workflow-helpers";

interface PurchaseRequestListProps {
  readonly purchaseRequests: PurchaseRequestListDto[];
  readonly currentPage: number;
  readonly totalPages: number;
  readonly totalItems: number;
  readonly perpage: number;
  readonly onPageChange: (page: number) => void;
  readonly isLoading: boolean;
  readonly sort?: { field: string; direction: "asc" | "desc" };
  readonly onSort?: (sortString: string) => void;
  readonly setPerpage: (perpage: number) => void;
  readonly convertStatus: (status: string) => string;
}

export default function PurchaseRequestList({
  purchaseRequests,
  currentPage,
  totalPages,
  totalItems,
  perpage,
  onPageChange,
  isLoading,
  sort,
  onSort,
  setPerpage,
  convertStatus,
}: PurchaseRequestListProps) {
  const tTableHeader = useTranslations("TableHeader");
  const tPr = useTranslations("PurchaseRequest");
  const searchParams = useSearchParams();
  const { workflowTypeName } = useWorkflowTypeTranslation();

  const { dateFormat, amount, currencyBase } = useAuth();

  const defaultAmount = { locales: "en-US", minimumFractionDigits: 2 };

  // State for delete dialog
  const [alertOpen, setAlertOpen] = useState(false);
  const [prToDelete, setPrToDelete] = useState<PurchaseRequestListDto | null>(null);

  const queryClient = useQueryClient();
  const { token, buCode } = useAuth();

  const { mutate: deletePr, isPending: isDeleting } = useDeletePr(token, buCode);

  const handleDeleteClick = (pr: PurchaseRequestListDto) => {
    setPrToDelete(pr);
    setAlertOpen(true);
  };

  const handleConfirmDelete = () => {
    if (!prToDelete?.id) return;

    deletePr(prToDelete.id, {
      onSuccess: () => {
        toastSuccess({ message: tPr("delete_success") });
        queryClient.invalidateQueries({ queryKey: ["purchase-request"] });
        setAlertOpen(false);
        setPrToDelete(null);
      },
      onError: (error) => {
        console.error("Delete error:", error);
        toastError({ message: tPr("delete_failed") });
        setAlertOpen(false);
      },
    });
  };

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

  const columns = useMemo<ColumnDef<PurchaseRequestListDto>[]>(
    () => [
      {
        id: "select",
        header: () => <DataGridTableRowSelectAll />,
        cell: ({ row }) => <DataGridTableRowSelect row={row} />,
        enableSorting: false,
        enableHiding: false,
        size: 35,
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
        accessorKey: "pr_no",
        header: ({ column }) => (
          <DataGridColumnHeader
            column={column}
            title={tTableHeader("pr_no")}
            icon={<FileText className="h-4 w-4" />}
          />
        ),
        cell: ({ row }) => (
          <div className="max-w-[200px] truncate">
            <Link
              href={returnUrl(
                `/procurement/purchase-request/${row.original.id}`,
                `/procurement/purchase-request`,
                searchParams
              )}
              className="link-primary"
            >
              {row.original.pr_no ?? "-"}
            </Link>
          </div>
        ),
        enableSorting: true,
        size: 200,
        meta: {
          headerTitle: tTableHeader("pr_no"),
        },
      },
      {
        accessorKey: "pr_date",
        header: ({ column }) => (
          <DataGridColumnHeader
            column={column}
            title={tTableHeader("date")}
            icon={<Calendar className="h-4 w-4" />}
          />
        ),
        cell: ({ row }) => (
          <div className="text-left">
            {formatDate(row.original.pr_date, dateFormat || "yyyy-MM-dd")}
          </div>
        ),
        enableSorting: true,
        size: 120,
        meta: {
          headerTitle: tTableHeader("date"),
        },
      },
      {
        accessorKey: "workflow_name",
        header: ({ column }) => (
          <DataGridColumnHeader
            column={column}
            title={tTableHeader("type")}
            icon={<TypeIcon className="h-4 w-4" />}
          />
        ),
        cell: ({ row }) => <p>{workflowTypeName(row.original.workflow_name)}</p>,
        enableSorting: true,
        size: 120,
        meta: {
          headerTitle: tTableHeader("type"),
        },
      },
      {
        accessorKey: "pr_status",
        header: ({ column }) => (
          <div className="flex justify-center">
            <DataGridColumnHeader
              column={column}
              title={tTableHeader("status")}
              icon={<Activity className="h-4 w-4" />}
            />
          </div>
        ),
        cell: ({ row }) => (
          <div className="flex justify-center">
            {row.original.pr_status && (
              <Badge variant={row.original.pr_status}>
                {convertStatus(row.original.pr_status)}
              </Badge>
            )}
          </div>
        ),
        enableSorting: true,
        size: 180,
        meta: {
          headerTitle: tTableHeader("status"),
          cellClassName: "text-center",
          headerClassName: "text-center",
        },
      },
      {
        accessorKey: "workflow_current_stage",
        header: ({ column }) => (
          <div className="flex justify-center">
            <DataGridColumnHeader
              column={column}
              title={tTableHeader("stage")}
              icon={<Workflow className="h-4 w-4" />}
            />
          </div>
        ),
        cell: ({ row }) => (
          <div className="flex justify-center">
            {row.original.pr_status !== "voided" && <p>{row.original.workflow_current_stage}</p>}
          </div>
        ),
        enableSorting: true,
        size: 100,
        meta: {
          headerTitle: tTableHeader("stage"),
          cellClassName: "text-center",
          headerClassName: "text-center",
        },
      },
      {
        accessorKey: "requestor_name",
        header: ({ column }) => (
          <DataGridColumnHeader
            column={column}
            title={tTableHeader("requestor")}
            icon={<User className="h-4 w-4" />}
          />
        ),
        cell: ({ row }) => (
          <span className="truncate max-w-[150px] inline-block">{row.original.requestor_name}</span>
        ),
        enableSorting: true,
        size: 150,
        meta: {
          headerTitle: tTableHeader("requestor"),
        },
      },
      {
        accessorKey: "department_name",
        header: ({ column }) => (
          <DataGridColumnHeader
            column={column}
            title={tTableHeader("department")}
            icon={<Building className="h-4 w-4" />}
          />
        ),
        cell: ({ row }) => (
          <span className="truncate max-w-[150px] inline-block">
            {row.original.department_name}
          </span>
        ),
        enableSorting: true,
        size: 150,
        meta: {
          headerTitle: tTableHeader("department"),
        },
      },
      {
        accessorKey: "total_amount",
        header: ({ column }) => (
          <div className="flex justify-end">
            <DataGridColumnHeader
              column={column}
              title={tTableHeader("amount")}
              icon={<DollarSign className="h-4 w-4" />}
            />
          </div>
        ),
        cell: ({ row }) => (
          <div className="text-right">
            <span>
              {formatPrice(
                row.original.total_amount,
                currencyBase ?? "THB",
                amount?.locales ?? defaultAmount.locales,
                amount?.minimumFractionDigits ?? defaultAmount.minimumFractionDigits
              )}
            </span>
          </div>
        ),
        enableSorting: false,
        size: 150,
        meta: {
          headerTitle: tTableHeader("amount"),
          cellClassName: "text-right",
          headerClassName: "text-right",
        },
      },
      {
        id: "action",
        header: () => <span className="text-right">{tTableHeader("action")}</span>,
        cell: ({ row }) => {
          const pr = row.original;
          return (
            <div className="flex justify-end">
              <DropdownMenu>
                <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                  <Button variant="ghost" size="icon" className="h-7 w-7">
                    <MoreHorizontal className="h-4 w-4" />
                    <span className="sr-only">More options</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem
                    onClick={(e) => {
                      e.stopPropagation();
                      console.log("Print", pr.id);
                    }}
                  >
                    <Printer className="h-4 w-4" />
                    {tPr("print")}
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={(e) => {
                      e.stopPropagation();
                      console.log("Export", pr.id);
                    }}
                  >
                    <FileDown className="h-4 w-4" />
                    {tPr("export")}
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDeleteClick(pr);
                    }}
                    className="text-destructive cursor-pointer"
                  >
                    <Trash2 className="h-4 w-4" />
                    {tPr("delete")}
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
    [tTableHeader, tPr, currentPage, perpage, dateFormat, amount, currencyBase, convertStatus]
  );

  // Initialize table
  const table = useReactTable({
    data: purchaseRequests,
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
    <>
      <DataGrid
        table={table}
        recordCount={totalItems}
        isLoading={isLoading}
        loadingMode="skeleton"
        emptyMessage={tPr("no_data")}
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
            <ScrollArea className="max-h-[calc(100vh-250px)] pb-2">
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
            <AlertDialogTitle>{tPr("confirm_delete")}</AlertDialogTitle>
            <AlertDialogDescription>
              {tPr("confirm_delete_message")} &quot;{prToDelete?.pr_no}&quot;?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>{tPr("cancel")}</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleConfirmDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              disabled={isDeleting}
            >
              {isDeleting ? tPr("deleting") : tPr("delete")}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
