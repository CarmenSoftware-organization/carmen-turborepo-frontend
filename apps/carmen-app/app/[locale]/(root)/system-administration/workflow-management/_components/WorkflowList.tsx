"use client";
import { Activity, Banknote, Coins } from "lucide-react";
import { FileDown, FileText, MoreHorizontal, Printer, Trash2 } from "lucide-react";
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
import { DataGridTable } from "@/components/ui/data-grid-table";
import { DataGridPagination } from "@/components/ui/data-grid-pagination";
import { DataGridColumnHeader } from "@/components/ui/data-grid-column-header";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { WorkflowDto } from "@/dtos/workflows.dto";
import { StatusCustom } from "@/components/ui-custom/StatusCustom";

interface WorkflowListProps {
  readonly isLoading: boolean;
  readonly workflows: WorkflowDto[];
  readonly currentPage: number;
  readonly totalPages: number;
  readonly totalItems: number;
  readonly perpage: number;
  readonly onPageChange: (page: number) => void;
  readonly sort?: { field: string; direction: "asc" | "desc" };
  readonly onSort?: (sortString: string) => void;
  readonly setPerpage: (perpage: number) => void;
}

const ActionHeader = () => {
  const tTableHeader = useTranslations("TableHeader");
  return <div className="text-right">{tTableHeader("action")}</div>;
};

const WorkflowList = ({
  isLoading,
  workflows = [],
  currentPage,
  totalPages,
  totalItems,
  onPageChange,
  sort,
  onSort,
  perpage,
  setPerpage,
}: WorkflowListProps) => {
  const tTableHeader = useTranslations("TableHeader");
  const tCommon = useTranslations("Common");

  // Convert sort to TanStack Table format
  const sorting: SortingState = useMemo(() => {
    if (!sort) return [];
    return [{ id: sort.field, desc: sort.direction === "desc" }];
  }, [sort]);

  // Pagination state
  const pagination: PaginationState = useMemo(
    () => ({
      pageIndex: currentPage - 1, // TanStack uses 0-based index
      pageSize: perpage,
    }),
    [currentPage, perpage]
  );

  // Define columns

  const columns = useMemo<ColumnDef<WorkflowDto>[]>(
    () => [
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
        accessorKey: "name",
        header: ({ column }) => (
          <DataGridColumnHeader
            column={column}
            title={tTableHeader("name")}
            icon={<FileText className="h-4 w-4" />}
          />
        ),
        cell: ({ row }) => (
          <ButtonLink href={`/system-administration/workflow-management/${row.original.id}`}>
            {row.original.name ?? "-"}
          </ButtonLink>
        ),
        enableSorting: true,
        size: 200,
        meta: {
          headerTitle: tTableHeader("name"),
        },
      },
      {
        accessorKey: "workflow_type",
        header: ({ column }) => (
          <div className="flex justify-center">
            <DataGridColumnHeader
              column={column}
              title={tTableHeader("workflow_type")}
              icon={<Banknote className="h-4 w-4" />}
            />
          </div>
        ),
        cell: ({ row }) => <div className="text-center">{row.original.workflow_type}</div>,
        enableSorting: true,
        size: 100,
        meta: {
          headerTitle: tTableHeader("workflow_type"),
          cellClassName: "text-center",
          headerClassName: "text-center",
        },
      },
      {
        accessorKey: "stages",
        header: ({ column }) => (
          <div className="flex justify-center">
            <DataGridColumnHeader
              column={column}
              title={tTableHeader("workflow_stages")}
              icon={<Coins className="h-4 w-4" />}
            />
          </div>
        ),
        cell: ({ row }) => <div className="text-center">{row.original.stages}</div>,
        enableSorting: true,
        size: 120,
        meta: {
          headerTitle: tTableHeader("workflow_stages"),
          cellClassName: "text-center",
          headerClassName: "text-center",
        },
      },
      {
        accessorKey: "is_active",
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
            <StatusCustom is_active={row.original.is_active}>
              {row.original.is_active ? tCommon("active") : tCommon("inactive")}
            </StatusCustom>
          </div>
        ),
        enableSorting: true,
        size: 150,
        meta: {
          headerTitle: tTableHeader("status"),
          cellClassName: "text-center",
          headerClassName: "text-center",
        },
      },
      {
        id: "action",
        header: ActionHeader,
        cell: ({ row }) => {
          const po = row.original;
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
                      console.log("Print", po.id);
                    }}
                  >
                    <Printer className="h-4 w-4" />
                    {tCommon("print")}
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={(e) => {
                      e.stopPropagation();
                      console.log("Export", po.id);
                    }}
                  >
                    <FileDown className="h-4 w-4" />
                    {tCommon("export")}
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={(e) => {
                      e.stopPropagation();
                      console.log("Delete", po.id);
                    }}
                    className="text-destructive cursor-pointer"
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
    [tCommon, currentPage, perpage]
  );

  // Initialize table
  const table = useReactTable({
    data: workflows,
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
};

export default WorkflowList;
