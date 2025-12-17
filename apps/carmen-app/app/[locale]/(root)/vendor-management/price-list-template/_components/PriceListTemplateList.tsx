"use client";

import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { toastError, toastSuccess } from "@/components/ui-custom/Toast";
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
import { PriceListTemplateListDto } from "@/dtos/price-list-template.dto";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Activity, Calendar, Info, List, MoreHorizontal, Trash2 } from "lucide-react";
import { useMemo } from "react";
import { ColumnDef, getCoreRowModel, useReactTable, SortingState } from "@tanstack/react-table";
import { DataGrid, DataGridContainer } from "@/components/ui/data-grid";
import {
  DataGridTable,
  DataGridTableRowSelect,
  DataGridTableRowSelectAll,
} from "@/components/ui/data-grid-table";
import { DataGridColumnHeader } from "@/components/ui/data-grid-column-header";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { Link } from "@/lib/navigation";
import { format } from "date-fns";
import { Badge } from "@/components/ui/badge";
import { useTranslations } from "next-intl";
import { convertStatus } from "@/utils/status";
import { useDeletePriceListTemplate } from "@/hooks/use-price-list-template";

interface PriceListTemplateListProps {
  readonly templates: PriceListTemplateListDto[];
  readonly isLoading: boolean;
  readonly sort?: { field: string; direction: "asc" | "desc" } | null;
  readonly onSort?: (sortString: string) => void;
  readonly canUpdate?: boolean;
  readonly canDelete?: boolean;
}

export default function PriceListTemplateList({
  templates,
  isLoading,
  sort,
  onSort,
  canUpdate = true,
  canDelete = true,
}: PriceListTemplateListProps) {
  const tStatus = useTranslations("Status");
  const tHeader = useTranslations("TableHeader");
  const { token, buCode } = useAuth();
  const [deleteId, setDeleteId] = useState<string>("");
  const [templateToDelete, setTemplateToDelete] = useState<PriceListTemplateListDto | null>(null);
  const [alertOpen, setAlertOpen] = useState(false);

  const { mutate: deleteTemplate, isPending: isDeleting } = useDeletePriceListTemplate(
    token,
    buCode
  );

  const handleDeleteClick = (template: PriceListTemplateListDto) => {
    setTemplateToDelete(template);
    setDeleteId(template.id);
    setAlertOpen(true);
  };

  const handleConfirmDelete = () => {
    if (!deleteId) return;

    deleteTemplate(deleteId, {
      onSuccess: () => {
        toastSuccess({ message: "Price list template deleted successfully" });
        setAlertOpen(false);
        setDeleteId("");
        setTemplateToDelete(null);
      },
      onError: () => {
        toastError({ message: "Failed to delete price list template" });
        setAlertOpen(false);
        setDeleteId("");
        setTemplateToDelete(null);
      },
    });
  };
  const sorting: SortingState = useMemo(() => {
    if (!sort) return [];
    return [{ id: sort.field, desc: sort.direction === "desc" }];
  }, [sort]);

  const getStatusLabel = (status: string) => convertStatus(status, tStatus);

  const columns = useMemo<ColumnDef<PriceListTemplateListDto>[]>(
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
        accessorKey: "name",
        header: ({ column }) => (
          <DataGridColumnHeader
            column={column}
            title={tHeader("name")}
            icon={<List className="h-4 w-4" />}
          />
        ),
        cell: ({ row }) => {
          const template = row.original;
          if (canUpdate) {
            return (
              <div className="max-w-[350px] truncate ellipsis">
                <Link
                  href={`/vendor-management/price-list-template/${template.id}`}
                  className="hover:underline text-primary"
                >
                  {template.name}
                </Link>
              </div>
            );
          }
          return <span>{template.name}</span>;
        },
        enableSorting: true,
        size: 250,
        meta: {
          headerTitle: tHeader("name"),
        },
      },
      {
        accessorKey: "status",
        header: ({ column }) => (
          <DataGridColumnHeader
            column={column}
            title={tHeader("status")}
            icon={<Activity className="h-4 w-4" />}
          />
        ),
        cell: ({ row }) => {
          const status = row.original.status;
          return (
            <div className="flex justify-center">
              <Badge variant={status}>{getStatusLabel(status)}</Badge>
            </div>
          );
        },
        enableSorting: false,
        size: 120,
        meta: {
          cellClassName: "text-center",
          headerClassName: "text-center",
        },
      },
      {
        accessorKey: "description",
        header: ({ column }) => (
          <DataGridColumnHeader
            column={column}
            title={tHeader("description")}
            icon={<Info className="h-4 w-4" />}
          />
        ),
        cell: ({ row }) => (
          <span className="truncate max-w-[200px] inline-block">{row.original.description}</span>
        ),
        enableSorting: false,
        size: 300,
      },
      {
        accessorKey: "validity_period",
        header: ({ column }) => (
          <DataGridColumnHeader
            column={column}
            title={tHeader("valid_period")}
            icon={<Calendar className="h-4 w-4" />}
          />
        ),
        cell: ({ row }) => <span>{row.original.validity_period} days</span>,
        enableSorting: false,
        size: 150,
      },
      {
        accessorKey: "create_date",
        header: ({ column }) => (
          <DataGridColumnHeader
            column={column}
            title={tHeader("create_date")}
            icon={<Calendar className="h-4 w-4" />}
          />
        ),
        cell: ({ row }) => <span>{format(new Date(row.original.created_at), "dd/MM/yyyy")}</span>,
        enableSorting: false,
        size: 150,
      },
      {
        accessorKey: "update_date",
        header: ({ column }) => (
          <DataGridColumnHeader
            column={column}
            title={tHeader("update_date")}
            icon={<Calendar className="h-4 w-4" />}
          />
        ),
        cell: ({ row }) => <span>{format(new Date(row.original.updated_at), "dd/MM/yyyy")}</span>,
        enableSorting: false,
        size: 150,
      },

      {
        id: "action",
        header: () => <span className="text-right">{tHeader("action")}</span>,
        cell: ({ row }) => {
          const template = row.original;

          // Hide action menu if no permissions
          if (!canDelete) return null;

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
                  {canDelete && (
                    <DropdownMenuItem
                      className="text-destructive cursor-pointer hover:bg-transparent"
                      onClick={() => handleDeleteClick(template)}
                    >
                      <Trash2 className="h-4 w-4" />
                      Delete
                    </DropdownMenuItem>
                  )}
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
    [canUpdate, canDelete]
  );

  // Initialize table
  const table = useReactTable({
    data: templates,
    columns,
    getRowId: (row) => row.id ?? "",
    state: {
      sorting,
    },
    enableRowSelection: true,
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
    manualSorting: true,
  });

  return (
    <>
      <DataGrid
        table={table}
        recordCount={templates.length}
        isLoading={isLoading}
        loadingMode="skeleton"
        emptyMessage="No data"
        tableLayout={{
          headerSticky: true,
          dense: false,
          rowBorder: true,
          headerBackground: true,
          headerBorder: true,
          width: "fixed",
        }}
      >
        <DataGridContainer>
          <ScrollArea className="max-h-[calc(100vh-250px)]">
            <DataGridTable />
            <ScrollBar orientation="horizontal" />
          </ScrollArea>
        </DataGridContainer>
      </DataGrid>

      <AlertDialog open={alertOpen} onOpenChange={setAlertOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Price List Template</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete &quot;{templateToDelete?.name}&quot;? This action
              cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleConfirmDelete}
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
