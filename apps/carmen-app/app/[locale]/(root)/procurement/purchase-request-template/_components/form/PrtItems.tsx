import { Button } from "@/components/ui/button";
import { MapPin, Package, Pencil, Plus, Trash2 } from "lucide-react";
import { useTranslations } from "next-intl";
import { useAuth } from "@/context/AuthContext";
import { useCurrenciesQuery } from "@/hooks/use-currency";
import { UseFormReturn } from "react-hook-form";
import { PrtFormValues } from "./PrtForm";
import { useMemo } from "react";
import { ColumnDef, getCoreRowModel, useReactTable } from "@tanstack/react-table";
import { DataGrid, DataGridContainer } from "@/components/ui/data-grid";
import {
  DataGridTable,
  DataGridTableRowSelect,
  DataGridTableRowSelectAll,
} from "@/components/ui/data-grid-table";
import { DataGridColumnHeader } from "@/components/ui/data-grid-column-header";
import { PurchaseRequestTemplateDetailDto } from "@/dtos/pr-template.dto";
import { formType } from "@/dtos/form.dto";
import LookupLocation from "@/components/lookup/LookupLocation";
import LookupProductLocation from "@/components/lookup/LookupProductLocation";
import NumberInput from "@/components/form-custom/NumberInput";
import PrtUnitSelectCell from "./PrtUnitSelectCell";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { Input } from "@/components/ui/input";

interface Props {
  readonly form: UseFormReturn<PrtFormValues>;
  currentMode: formType;
}

export default function PrtItems({ form, currentMode }: Props) {
  const tPurchaseRequest = useTranslations("PurchaseRequest");
  const tTableHeader = useTranslations("TableHeader");
  const tCommon = useTranslations("Common");
  const { token, buCode } = useAuth();
  const { getCurrencyCode } = useCurrenciesQuery(token, buCode);

  const items = form.watch("purchase_request_template_detail") || [];

  const isEditMode = currentMode === formType.EDIT;

  const updateItemField = (
    rowIndex: number,
    updates: Partial<PurchaseRequestTemplateDetailDto>
  ) => {
    const currentItems = form.getValues("purchase_request_template_detail");
    const updatedItems = currentItems.map((item, index) =>
      index === rowIndex ? { ...item, ...updates } : item
    );
    form.setValue("purchase_request_template_detail", updatedItems);
  };

  const columns = useMemo<ColumnDef<PurchaseRequestTemplateDetailDto>[]>(
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
        header: () => "#",
        cell: ({ row }) => <span>{row.index + 1}</span>,
        enableSorting: false,
        size: 30,
        meta: {
          cellClassName: "text-center",
          headerClassName: "text-center",
        },
      },
      {
        accessorKey: "location_name",
        header: ({ column }) => (
          <DataGridColumnHeader
            column={column}
            title={tTableHeader("location")}
            icon={<MapPin className="h-4 w-4" />}
          />
        ),
        cell: ({ row }) =>
          isEditMode ? (
            <LookupLocation
              value={row.original.location_id}
              bu_code={buCode}
              onValueChange={(value, selectedLocation) => {
                updateItemField(row.index, {
                  location_id: value,
                  location_name: selectedLocation?.name || "",
                });
              }}
              classNames="text-xs h-7 w-full"
            />
          ) : (
            <span>{row.original.location_name}</span>
          ),
        enableSorting: false,
        size: 180,
      },
      {
        accessorKey: "product_name",
        header: ({ column }) => (
          <DataGridColumnHeader
            column={column}
            title={tTableHeader("product")}
            icon={<Package className="h-4 w-4" />}
          />
        ),
        cell: ({ row }) =>
          isEditMode ? (
            <LookupProductLocation
              location_id={row.original.location_id}
              value={row.original.product_id}
              bu_code={buCode}
              onValueChange={(value, selectedProduct) => {
                updateItemField(row.index, {
                  product_id: value,
                  product_name: selectedProduct?.name || "",
                  inventory_unit_id: selectedProduct?.inventory_unit?.id || "",
                  inventory_unit_name: selectedProduct?.inventory_unit?.name || "",
                });
              }}
              classNames="text-xs h-7 w-full"
              initialDisplayName={row.original.product_name}
            />
          ) : (
            <div className="flex flex-col gap-1">
              <p className="text-sm font-medium">{row.original.product_name}</p>
              <p className="text-xs text-muted-foreground">{row.original.description}</p>
            </div>
          ),
        enableSorting: false,
        size: 200,
      },
      {
        accessorKey: "requested_qty",
        header: ({ column }) => (
          <DataGridColumnHeader column={column} title={tTableHeader("requested")} />
        ),
        cell: ({ row }) =>
          isEditMode ? (
            <div className="flex flex-col items-end gap-1">
              <NumberInput
                value={Number(row.original.requested_qty) || 0}
                onChange={(value) => {
                  const conversionFactor =
                    Number(row.original.requested_unit_conversion_factor) || 1;
                  const baseQty = value * conversionFactor;
                  updateItemField(row.index, {
                    requested_qty: String(value),
                    requested_base_qty: String(baseQty),
                  });
                }}
                classNames="h-7 text-xs bg-background w-20"
                disabled={!row.original.product_id}
              />
              <PrtUnitSelectCell
                rowIndex={row.index}
                productId={row.original.product_id}
                currentUnitId={row.original.requested_unit_id}
                requestedQty={Number(row.original.requested_qty) || 0}
                updateItemField={updateItemField}
                token={token}
                buCode={buCode}
              />
            </div>
          ) : (
            <div className="flex flex-col text-xs">
              <p>{row.original.requested_qty}</p>
              <p className="text-xs text-muted-foreground">
                {row.original.requested_unit_name || "-"}
              </p>
            </div>
          ),
        enableSorting: false,
        size: 110,
        meta: {
          cellClassName: "text-right",
          headerClassName: "text-right",
        },
      },
      {
        accessorKey: "foc_qty",
        header: () => "FOC",
        cell: ({ row }) =>
          isEditMode ? (
            <div className="flex flex-col items-end gap-1">
              <NumberInput
                value={Number(row.original.foc_qty) || 0}
                onChange={(value) => {
                  const conversionFactor = Number(row.original.foc_unit_conversion_factor) || 1;
                  const baseQty = value * conversionFactor;
                  updateItemField(row.index, {
                    foc_qty: String(value),
                    foc_base_qty: String(baseQty),
                  });
                }}
                classNames="h-7 text-xs bg-background w-20"
                disabled={!row.original.product_id}
              />
              <Input
                className="text-xs text-right h-7"
                defaultValue={row.original.foc_unit_name}
                disabled
              />
            </div>
          ) : (
            <div className="flex flex-col text-xs">
              <p>{row.original.foc_qty}</p>
              <p>{row.original.foc_unit_name || "-"}</p>
            </div>
          ),
        enableSorting: false,
        size: 100,
        meta: {
          cellClassName: "text-right",
          headerClassName: "text-right",
        },
      },
      {
        accessorKey: "tax_amount",
        header: ({ column }) => (
          <DataGridColumnHeader column={column} title={tTableHeader("price")} />
        ),
        cell: ({ row }) =>
          isEditMode ? (
            <p>Edit Mode</p>
          ) : (
            <div className="flex flex-col gap-1">
              <p>
                {getCurrencyCode(row.original.currency_id)} {row.original.tax_amount}
              </p>
              <p className="text-xs text-muted-foreground">
                Discount: {row.original.discount_amount}
              </p>
            </div>
          ),
        enableSorting: false,
        size: 120,
        meta: {
          cellClassName: "text-right",
          headerClassName: "text-right",
        },
      },
      {
        id: "action",
        header: () => tTableHeader("action"),
        cell: () => (
          <Button variant="ghost" size={"sm"}>
            <Trash2 className="h-3 w-3" />
          </Button>
        ),
        enableSorting: false,
        size: 120,
        meta: {
          cellClassName: "text-right",
          headerClassName: "text-right",
        },
      },
    ],
    [tTableHeader, getCurrencyCode, isEditMode, buCode, updateItemField]
  );

  const table = useReactTable({
    data: items,
    columns,
    getRowId: (row) => row.id,
    getCoreRowModel: getCoreRowModel(),
    enableRowSelection: true,
  });

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <p className="font-medium">{tPurchaseRequest("items")}</p>
        <Button size={"sm"} className="h-7 text-xs">
          <Plus className="h-3 w-3" />
          {tPurchaseRequest("add_item")}
        </Button>
      </div>
      <DataGrid
        table={table}
        recordCount={items.length}
        emptyMessage={tCommon("no_data")}
        tableLayout={{
          headerSticky: true,
          dense: false,
          rowBorder: true,
          headerBackground: true,
          headerBorder: true,
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
    </div>
  );
}
