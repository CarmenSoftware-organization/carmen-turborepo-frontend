import { Button } from "@/components/ui/button";
import { Plus, Pencil, Trash2 } from "lucide-react";
import { useTranslations } from "next-intl";
import { Checkbox } from "@/components/ui/checkbox";
import { PurchaseOrderItemDto } from "@/dtos/procurement.dto";
import { ColumnDef, getCoreRowModel, useReactTable } from "@tanstack/react-table";
import { DataGrid, DataGridContainer } from "@/components/ui/data-grid";
import { DataGridTable } from "@/components/ui/data-grid-table";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { useMemo } from "react";

interface PoItemsProps {
  readonly items: PurchaseOrderItemDto[];
}

export default function PoItems({ items }: PoItemsProps) {
  const tPurchaseOrder = useTranslations("PurchaseOrder");
  const tTableHeader = useTranslations("TableHeader");

  const columns = useMemo<ColumnDef<PurchaseOrderItemDto>[]>(
    () => [
      {
        id: "select",
        header: ({ table }) => (
          <Checkbox
            checked={
              table.getIsAllPageRowsSelected() ||
              (table.getIsSomePageRowsSelected() && "indeterminate")
            }
            onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
            aria-label="Select all"
          />
        ),
        cell: ({ row }) => (
          <Checkbox
            checked={row.getIsSelected()}
            onCheckedChange={(value) => row.toggleSelected(!!value)}
            aria-label="Select row"
          />
        ),
        enableSorting: false,
        enableHiding: false,
        size: 48,
      },
      {
        id: "no",
        accessorKey: "no",
        header: "#",
        cell: ({ row, table }) => {
          const index = table.getSortedRowModel().flatRows.indexOf(row);
          return <div className="text-muted-foreground">{index + 1}</div>;
        },
        size: 60,
      },
      {
        accessorKey: "name",
        header: tTableHeader("name"),
        cell: ({ row }) => {
          return (
            <div className="flex flex-col gap-0.5 min-w-[200px]">
              <p className="text-sm font-medium text-foreground">{row.original.name}</p>
              <p className="text-xs text-muted-foreground">{row.original.description}</p>
            </div>
          );
        },
        size: 200,
      },
      {
        id: "order",
        header: tTableHeader("order"),
        cell: ({ row }) => {
          return (
            <div className="flex items-center justify-end gap-1">
              <span>{row.original.order_qty}</span>
              <span className="text-muted-foreground text-xs">{row.original.unit}</span>
            </div>
          );
        },
        meta: {
          align: "text-right",
          headerClassName: "text-right",
        },
        size: 100,
      },
      {
        accessorKey: "tax",
        header: tTableHeader("tax"),
        cell: ({ row }) => <span className="text-muted-foreground">{row.original.tax}</span>,
        meta: {
          cellClassName: "text-right",
          headerClassName: "text-right",
        },
      },
      {
        accessorKey: "net",
        header: tTableHeader("net"),
        cell: ({ row }) => <span className="text-muted-foreground">{row.original.net}</span>,
        meta: {
          cellClassName: "text-right",
          headerClassName: "text-right",
        },
      },
      {
        accessorKey: "discount",
        header: tTableHeader("discount"),
        cell: ({ row }) => <span className="text-muted-foreground">{row.original.discount}</span>,
        meta: {
          cellClassName: "text-right",
          headerClassName: "text-right",
        },
      },
      {
        accessorKey: "amount",
        header: tTableHeader("amount"),
        cell: ({ row }) => <span className="font-medium">{row.original.amount}</span>,
        meta: {
          cellClassName: "text-right",
          headerClassName: "text-right",
        },
      },
      {
        id: "actions",
        header: tTableHeader("action"),
        cell: () => {
          return (
            <div className="flex items-center justify-end gap-1">
              <Button
                variant="ghost"
                size={"icon"}
                className="h-8 w-8 text-muted-foreground hover:text-foreground"
              >
                <Pencil className="h-3.5 w-3.5" />
              </Button>
              <Button
                variant="ghost"
                size={"icon"}
                className="h-8 w-8 text-muted-foreground hover:text-destructive"
              >
                <Trash2 className="h-3.5 w-3.5" />
              </Button>
            </div>
          );
        },
        size: 100,
        meta: {
          align: "right",
          headerClassName: "text-right",
        },
      },
    ],
    [tTableHeader]
  );

  const table = useReactTable({
    data: items,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <div className="space-y-4 pt-2">
      <div className="flex items-center justify-between">
        <p className="font-semibold text-muted-foreground">{tPurchaseOrder("items")}</p>
        <Button variant="outlinePrimary" size={"sm"} className="h-7">
          <Plus className="h-4 w-4 mr-1.5" />
          {tPurchaseOrder("add_item")}
        </Button>
      </div>

      <DataGrid
        table={table}
        recordCount={items.length}
        isLoading={false}
        loadingMode="skeleton"
        tableLayout={{
          headerSticky: true,
          dense: true,
          rowBorder: true,
          headerBackground: false,
          headerBorder: true,
          width: "fixed",
        }}
      >
        <div className="w-full space-y-2">
          <DataGridContainer>
            <ScrollArea>
              <div className="pb-3">
                <DataGridTable />
              </div>
              <ScrollBar orientation="horizontal" />
            </ScrollArea>
          </DataGridContainer>
        </div>
      </DataGrid>
    </div>
  );
}
