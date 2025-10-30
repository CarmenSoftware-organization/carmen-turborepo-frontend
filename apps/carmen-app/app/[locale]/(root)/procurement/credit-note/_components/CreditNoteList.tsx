"use client";

import { Button } from "@/components/ui/button";
import {
  Calendar,
  FileText,
  FileType2,
  Info,
  MoreHorizontal,
  StickyNote,
  Trash2,
  User,
} from "lucide-react";
import { CreditNoteGetAllDto } from "@/dtos/credit-note.dto";
import ButtonLink from "@/components/ButtonLink";
import { useAuth } from "@/context/AuthContext";
import { formatDate } from "@/utils/format/date";
import CreditNoteCard from "./CreditNoteCard";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useTranslations } from "next-intl";
import { StatusBadge } from "@/components/ui-custom/StatusBadge";
import { useMemo, useState } from "react";
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

interface CreditNoteListProps {
  readonly creditNotes: CreditNoteGetAllDto[];
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

export default function CreditNoteList({
  creditNotes = [],
  isLoading,
  totalItems,
  currentPage,
  totalPages,
  perpage,
  onPageChange,
  sort,
  onSort,
  setPerpage,
}: CreditNoteListProps) {
  const { dateFormat } = useAuth();
  const tTableHeader = useTranslations("TableHeader");
  const tStatus = useTranslations("Status");
  const tCommon = useTranslations("Common");
  const [selectedItems, setSelectedItems] = useState<string[]>([]);

  const handleSelectItem = (id: string) => {
    if (!id) return;
    setSelectedItems((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const handleSelectAll = () => {
    if (selectedItems.length === creditNotes.length) {
      setSelectedItems([]);
    } else {
      const allIds = creditNotes.filter((cn) => cn && cn.id).map((cn) => cn.id as string);
      setSelectedItems(allIds);
    }
  };

  const isAllSelected = creditNotes?.length > 0 && selectedItems.length === creditNotes.length;

  const getStatusText = (status: string) => {
    if (status === "in_progress") return tStatus("in_progress");
    if (status === "completed") return tStatus("completed");
    if (status === "cancelled") return tStatus("cancelled");
    return tStatus("draft");
  };

  // Action header component
  const ActionHeader = () => <div className="text-right">{tTableHeader("action")}</div>;

  // Convert sort to TanStack Table format
  const sorting: SortingState = useMemo(() => {
    if (!sort) return [];
    return [{ id: sort.field, desc: sort.direction === "desc" }];
  }, [sort]);

  // Pagination state
  const pagination: PaginationState = useMemo(
    () => ({
      pageIndex: currentPage - 1,
      pageSize: perpage,
    }),
    [currentPage, perpage]
  );

  // Define columns
  const columns = useMemo<ColumnDef<CreditNoteGetAllDto>[]>(
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
        accessorKey: "cn_no",
        header: ({ column }) => (
          <DataGridColumnHeader
            column={column}
            title={tTableHeader("reference")}
            icon={<FileText className="h-4 w-4" />}
          />
        ),
        cell: ({ row }) => (
          <div className="max-w-[150px] truncate">
            <ButtonLink href={`/procurement/credit-note/${row.original.id}`}>
              {row.original.cn_no}
            </ButtonLink>
          </div>
        ),
        enableSorting: true,
        size: 150,
        meta: {
          headerTitle: tTableHeader("reference"),
        },
      },
      {
        accessorKey: "doc_status",
        header: ({ column }) => (
          <div className="flex justify-center">
            <DataGridColumnHeader
              column={column}
              title={tTableHeader("status")}
              icon={<FileText className="h-4 w-4" />}
            />
          </div>
        ),
        cell: ({ row }) => (
          <div className="flex justify-center">
            <StatusBadge status={row.original.doc_status}>
              {getStatusText(row.original.doc_status || "-")}
            </StatusBadge>
          </div>
        ),
        enableSorting: false,
        size: 140,
        meta: {
          headerTitle: tTableHeader("status"),
          cellClassName: "text-center",
          headerClassName: "text-center",
        },
      },
      {
        accessorKey: "cn_date",
        header: ({ column }) => (
          <div className="flex justify-center">
            <DataGridColumnHeader
              column={column}
              title={tTableHeader("date")}
              icon={<Calendar className="h-4 w-4" />}
            />
          </div>
        ),
        cell: ({ row }) => (
          <div className="text-center">
            {formatDate(row.original.cn_date, dateFormat || "yyyy/MM/dd")}
          </div>
        ),
        enableSorting: false,
        size: 120,
        meta: {
          headerTitle: tTableHeader("date"),
          cellClassName: "text-center",
          headerClassName: "text-center",
        },
      },
      {
        accessorKey: "note",
        header: ({ column }) => (
          <DataGridColumnHeader
            column={column}
            title={tTableHeader("note")}
            icon={<Info className="h-4 w-4" />}
          />
        ),
        cell: ({ row }) => <p className="max-w-[128px] truncate">{row.original.note || "-"}</p>,
        enableSorting: false,
        size: 130,
        meta: {
          headerTitle: tTableHeader("note"),
        },
      },
      {
        accessorKey: "current_workflow_status",
        header: ({ column }) => (
          <DataGridColumnHeader
            column={column}
            title={tTableHeader("workflow_status")}
            icon={<FileType2 className="h-4 w-4" />}
          />
        ),
        cell: ({ row }) => (
          <span className="truncate max-w-[150px] inline-block">
            {row.original.current_workflow_status || "-"}
          </span>
        ),
        enableSorting: false,
        size: 150,
        meta: {
          headerTitle: tTableHeader("workflow_status"),
        },
      },
      {
        accessorKey: "last_action_name",
        header: ({ column }) => (
          <DataGridColumnHeader
            column={column}
            title={tTableHeader("last_action")}
            icon={<StickyNote className="h-4 w-4" />}
          />
        ),
        cell: ({ row }) => (
          <span className="truncate max-w-[150px] inline-block">
            {row.original.last_action_name || "-"}
          </span>
        ),
        enableSorting: false,
        size: 150,
        meta: {
          headerTitle: tTableHeader("last_action"),
        },
      },
      {
        accessorKey: "last_action_by_name",
        header: ({ column }) => (
          <DataGridColumnHeader
            column={column}
            title={tTableHeader("last_action_by")}
            icon={<User className="h-4 w-4" />}
          />
        ),
        cell: ({ row }) => (
          <span className="truncate max-w-[150px] inline-block">
            {row.original.last_action_by_name || "-"}
          </span>
        ),
        enableSorting: false,
        size: 150,
        meta: {
          headerTitle: tTableHeader("last_action_by"),
        },
      },
      {
        accessorKey: "last_action_date",
        header: ({ column }) => (
          <DataGridColumnHeader
            column={column}
            title={tTableHeader("last_action_date")}
            icon={<Calendar className="h-4 w-4" />}
          />
        ),
        cell: ({ row }) => <span>{row.original.last_action_date || "-"}</span>,
        enableSorting: false,
        size: 150,
        meta: {
          headerTitle: tTableHeader("last_action_date"),
        },
      },
      {
        id: "action",
        header: ActionHeader,
        cell: ({ row }) => {
          const cn = row.original;
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
                    className="text-destructive cursor-pointer"
                    onClick={() => console.log(cn.id)}
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
    [tTableHeader, tStatus, tCommon, currentPage, perpage, dateFormat, getStatusText]
  );

  // Initialize table
  const table = useReactTable({
    data: creditNotes,
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
    <div className="space-y-4">
      <div className="hidden md:block">
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
      </div>

      <div className="grid gap-4 md:hidden">
        <CreditNoteCard
          creditNotes={creditNotes}
          selectAll={handleSelectAll}
          selectItem={handleSelectItem}
          isSelected={isAllSelected}
          isLoading={isLoading}
          selectedItems={selectedItems}
        />
      </div>
    </div>
  );
}
