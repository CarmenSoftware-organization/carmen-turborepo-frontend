"use client";

import { Button } from "@/components/ui/button";
import {
  Activity,
  Calendar,
  DollarSign,
  FileText,
  MoreHorizontal,
  Trash2,
  TypeIcon,
} from "lucide-react";
import { useTranslations } from "next-intl";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import ButtonLink from "@/components/ButtonLink";
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
import {
  PurchaseRequestTemplateDto,
  PurchaseRequestTemplateDetailDto,
} from "@/dtos/pr-template.dto";
import { useAuth } from "@/context/AuthContext";
import { formatDate } from "@/utils/format/date";
import { StatusCustom } from "@/components/ui-custom/StatusCustom";

const calculateTotalAmount = (details: PurchaseRequestTemplateDetailDto[]): number => {
  if (!details || details.length === 0) return 0;

  return details.reduce((total, item) => {
    const taxAmount = item.tax_amount || 0;
    const discountAmount = item.discount_amount || 0;
    const lineTotal = taxAmount - discountAmount;
    return total + lineTotal;
  }, 0);
};

interface PurchaseRequestTemplateListProps {
  readonly prts: PurchaseRequestTemplateDto[];
  readonly isLoading: boolean;
  readonly totalItems: number;
  readonly currentPage: number;
  readonly totalPages: number;
  readonly perpage: number;
  readonly onPageChange: (page: number) => void;
  readonly sort?: { field: string; direction: "asc" | "desc" };
  readonly onSort?: (sortString: string) => void;
  readonly setPerpage: (perpage: number) => void;
}

export default function PurchaseRequestTemplateList({
  prts,
  isLoading,
  totalItems,
  currentPage,
  totalPages,
  perpage,
  onPageChange,
  sort,
  onSort,
  setPerpage,
}: PurchaseRequestTemplateListProps) {
  const tTableHeader = useTranslations("TableHeader");
  const tCommon = useTranslations("Common");
  const { dateFormat } = useAuth();

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

  const columns = useMemo<ColumnDef<PurchaseRequestTemplateDto>[]>(
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
        header: () => "#",
        cell: ({ row }) => <span>{(currentPage - 1) * perpage + row.index + 1}</span>,
        enableSorting: false,
        size: 40,
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
            title={tTableHeader("name")}
            icon={<FileText className="h-4 w-4" />}
          />
        ),
        cell: ({ row }) => (
          <div className="max-w-[150px] truncate">
            <ButtonLink href={`/procurement/purchase-request-template/${row.original.id}`}>
              {row.original.name}
            </ButtonLink>
          </div>
        ),
        enableSorting: true,
        size: 150,
      },
      {
        accessorKey: "title",
        header: ({ column }) => (
          <DataGridColumnHeader
            column={column}
            title={tTableHeader("description")}
            icon={<FileText className="h-4 w-4" />}
          />
        ),
        cell: ({ row }) => (
          <span className="truncate max-w-[200px] inline-block">{row.original.description}</span>
        ),
        enableSorting: false,
        size: 200,
        meta: {
          headerTitle: tTableHeader("description"),
        },
      },
      {
        accessorKey: "date_created",
        header: ({ column }) => (
          <DataGridColumnHeader
            column={column}
            title={tTableHeader("date")}
            icon={<Calendar className="h-4 w-4" />}
          />
        ),
        cell: ({ row }) => (
          <span>{formatDate(row.original.created_at, dateFormat || "yyyy-MM-dd")}</span>
        ),
        enableSorting: false,
        size: 120,
        meta: {
          cellClassName: "text-center",
          headerClassName: "text-center",
        },
      },
      {
        accessorKey: "type",
        header: ({ column }) => (
          <DataGridColumnHeader
            column={column}
            title={tTableHeader("type")}
            icon={<TypeIcon className="h-4 w-4" />}
          />
        ),
        cell: ({ row }) => <span>{row.original.workflow_name}</span>,
        enableSorting: false,
        size: 120,
        meta: {
          cellClassName: "text-center",
          headerClassName: "text-center",
        },
      },
      {
        accessorKey: "amount",
        header: ({ column }) => (
          <DataGridColumnHeader
            column={column}
            title={tTableHeader("amount")}
            icon={<DollarSign className="h-4 w-4" />}
          />
        ),
        cell: ({ row }) => {
          const totalAmount = calculateTotalAmount(row.original.purchase_request_template_detail);
          return <span>{totalAmount.toLocaleString()}</span>;
        },
        enableSorting: false,
        size: 130,
        meta: {
          cellClassName: "text-right",
          headerClassName: "text-right",
        },
      },
      {
        accessorKey: "status",
        header: ({ column }) => (
          <DataGridColumnHeader
            column={column}
            title={tTableHeader("status")}
            icon={<Activity className="h-4 w-4" />}
          />
        ),
        cell: ({ row }) => (
          <StatusCustom is_active={row.original.is_active}>
            {row.original.is_active ? tCommon("active") : tCommon("inactive")}
          </StatusCustom>
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
        header: () => {
          tTableHeader("action");
        },
        cell: ({ row }) => {
          const prt = row.original;
          return (
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
                  onClick={() => console.log("Delete", prt.id)}
                >
                  <Trash2 className="h-4 w-4" />
                  {tCommon("delete")}
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
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
    [tTableHeader, tCommon, currentPage, perpage]
  );

  // Initialize table
  const table = useReactTable({
    data: prts,
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
