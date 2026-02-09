"use client";

import { Button } from "@/components/ui/button";
import {
  FileText,
  FileImage,
  FileSpreadsheet,
  FileArchive,
  File,
  MoreHorizontal,
  Trash2,
} from "lucide-react";
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

interface DocumentDto {
  fileToken: string;
  objectName: string;
  originalName: string;
  size: number;
  contentType: string;
  lastModified: string;
}

interface ListDocumentProps {
  readonly documents: DocumentDto[];
  readonly isLoading: boolean;
  readonly currentPage: number;
  readonly totalPages: number;
  readonly totalItems: number;
  readonly perpage: number;
  readonly onPageChange: (page: number) => void;
  readonly sort?: { field: string; direction: "asc" | "desc" };
  readonly onSort?: (sortString: string) => void;
  readonly onDelete: (doc: DocumentDto) => void;
  readonly setPerpage: (perpage: number) => void;
}

function getFileTypeIcon(contentType: string) {
  if (contentType.startsWith("image/")) return <FileImage className="h-4 w-4 text-green-600" />;
  if (contentType === "application/pdf") return <FileText className="h-4 w-4 text-red-500" />;
  if (
    contentType.includes("spreadsheet") ||
    contentType.includes("excel") ||
    contentType === "text/csv"
  )
    return <FileSpreadsheet className="h-4 w-4 text-emerald-600" />;
  if (
    contentType.includes("zip") ||
    contentType.includes("rar") ||
    contentType.includes("tar") ||
    contentType.includes("compressed")
  )
    return <FileArchive className="h-4 w-4 text-yellow-600" />;
  if (contentType.includes("word") || contentType.includes("document"))
    return <FileText className="h-4 w-4 text-blue-600" />;
  return <File className="h-4 w-4 text-muted-foreground" />;
}

function formatFileSize(bytes: number): string {
  if (bytes === 0) return "0 B";
  const k = 1024;
  const sizes = ["B", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(2))} ${sizes[i]}`;
}

export default function ListDocument({
  documents,
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
}: ListDocumentProps) {
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

  const columns = useMemo<ColumnDef<DocumentDto>[]>(
    () => [
      {
        accessorKey: "originalName",
        header: ({ column }) => (
          <DataGridColumnHeader
            column={column}
            title="File Name"
            icon={<FileText className="h-4 w-4" />}
          />
        ),
        cell: ({ row }) => <span className="text-xs break-all">{row.original.originalName}</span>,
        enableSorting: true,
        size: 300,
        meta: {
          headerTitle: "File Name",
        },
      },
      {
        accessorKey: "contentType",
        header: ({ column }) => <DataGridColumnHeader column={column} title="Type" />,
        cell: ({ row }) => (
          <div className="flex items-center justify-center" title={row.original.contentType}>
            {getFileTypeIcon(row.original.contentType)}
          </div>
        ),
        enableSorting: false,
        size: 60,
        meta: {
          headerTitle: "Type",
        },
      },
      {
        accessorKey: "size",
        header: ({ column }) => <DataGridColumnHeader column={column} title="Size" />,
        cell: ({ row }) => <span className="text-xs">{formatFileSize(row.original.size)}</span>,
        enableSorting: true,
        size: 100,
        meta: {
          headerTitle: "Size",
        },
      },
      {
        accessorKey: "lastModified",
        header: ({ column }) => <DataGridColumnHeader column={column} title="Last Modified" />,
        cell: ({ row }) => (
          <span className="text-xs break-all">
            {new Date(row.original.lastModified).toLocaleString()}
          </span>
        ),
        enableSorting: true,
        size: 180,
        meta: {
          headerTitle: "Last Modified",
        },
      },
      {
        id: "action",
        header: () => <span className="text-right">Action</span>,
        cell: ({ row }) => {
          const doc = row.original;
          return (
            <Button
              variant="ghost"
              size="sm"
              className="h-7 w-7 text-destructive"
              onClick={() => onDelete(doc)}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
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
    [currentPage, perpage, onDelete]
  );

  const table = useReactTable({
    data: documents,
    columns,
    pageCount: totalPages,
    getRowId: (row) => row.fileToken,
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
      emptyMessage="No documents found"
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
