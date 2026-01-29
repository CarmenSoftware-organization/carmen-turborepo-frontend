import { ColumnDef } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import { MapPin, Package, Trash2 } from "lucide-react";
import { DataGridColumnHeader } from "@/components/ui/data-grid-column-header";
import { DataGridTableRowSelect, DataGridTableRowSelectAll } from "@/components/ui/data-grid-table";
import { formType } from "@/dtos/form.dto";
import { PurchaseRequestTemplateDetailDto } from "@/dtos/pr-template.dto";
import LookupLocation from "@/components/lookup/LookupLocation";
import LookupProductLocation from "@/components/lookup/LookupProductLocation";
import LookupCurrency from "@/components/lookup/LookupCurrency";
import { LookupDeliveryPointSelect } from "@/components/lookup/LookupDeliveryPointSelect";
import NumberInput from "@/components/form-custom/NumberInput";
import PrtUnitSelectCell from "./PrtUnitSelectCell";
import { CreatePrtDetailDto, UpdatePrtDetailDto } from "../../_schema/prt.schema";

// Combined type for display (add, update, and original items)
export type PrtDetailItem = (
  | CreatePrtDetailDto
  | UpdatePrtDetailDto
  | PurchaseRequestTemplateDetailDto
) & {
  _type: "add" | "update" | "original";
  _index: number;
};

interface ColumnConfig {
  currentMode: formType;
  buCode: string;
  token: string;
  tTableHeader: (key: string) => string;
  getCurrencyCode: (currencyId: string) => string;
  updateItemField: (item: PrtDetailItem, updates: Partial<CreatePrtDetailDto>) => void;
  onDelete: (item: PrtDetailItem) => void;
}

export const createPrtItemColumns = (config: ColumnConfig): ColumnDef<PrtDetailItem>[] => {
  const { currentMode, buCode, token, tTableHeader, getCurrencyCode, updateItemField, onDelete } =
    config;

  const isEditMode = currentMode !== formType.VIEW;

  return [
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
      cell: ({ row }) => <span>{row.index + 1}</span>,
      enableSorting: false,
      size: 40,
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
              updateItemField(row.original, {
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
      size: 150,
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
            location_id={row.original.location_id || ""}
            value={row.original.product_id || ""}
            bu_code={buCode}
            onValueChange={(value, selectedProduct) => {
              updateItemField(row.original, {
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
            <p className="text-xs font-medium">{row.original.product_name}</p>
            <p className="text-xs text-muted-foreground">{row.original.description}</p>
          </div>
        ),
      enableSorting: false,
      size: 180,
    },
    {
      accessorKey: "requested_qty",
      header: ({ column }) => (
        <DataGridColumnHeader column={column} title={tTableHeader("requested")} />
      ),
      cell: ({ row }) =>
        isEditMode ? (
          <NumberInput
            value={row.original.requested_qty || 0}
            onChange={(value) => {
              const conversionFactor = row.original.requested_unit_conversion_factor || 1;
              const baseQty = value * conversionFactor;
              updateItemField(row.original, {
                requested_qty: value,
                requested_base_qty: baseQty,
              });
            }}
            classNames="h-7 text-xs"
            disabled={!row.original.product_id}
          />
        ) : (
          <span>{row.original.requested_qty}</span>
        ),
      enableSorting: false,
      size: 100,
      meta: {
        cellClassName: "text-right",
        headerClassName: "text-right",
      },
    },
    {
      id: "requested_unit",
      header: () => tTableHeader("unit"),
      cell: ({ row }) =>
        isEditMode ? (
          <PrtUnitSelectCell
            rowIndex={row.index}
            productId={row.original.product_id || ""}
            currentUnitId={row.original.requested_unit_id || ""}
            requestedQty={row.original.requested_qty || 0}
            updateItemField={(_, updates) => updateItemField(row.original, updates)}
            token={token}
            buCode={buCode}
          />
        ) : (
          <span>{row.original.requested_unit_name || "-"}</span>
        ),
      enableSorting: false,
      size: 120,
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
          <NumberInput
            value={row.original.foc_qty || 0}
            onChange={(value) => {
              const conversionFactor = row.original.foc_unit_conversion_factor || 1;
              const baseQty = value * conversionFactor;
              updateItemField(row.original, {
                foc_qty: value,
                foc_base_qty: baseQty,
              });
            }}
            classNames="h-7 text-xs"
            disabled={!row.original.product_id}
          />
        ) : (
          <span>{row.original.foc_qty}</span>
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
          <NumberInput
            value={row.original.tax_amount || 0}
            onChange={(value) => {
              updateItemField(row.original, {
                tax_amount: value,
              });
            }}
            classNames="h-7 text-xs"
            disabled={!row.original.product_id}
          />
        ) : (
          <span>{row.original.tax_amount}</span>
        ),
      enableSorting: false,
      size: 100,
      meta: {
        cellClassName: "text-right",
        headerClassName: "text-right",
      },
    },
    {
      id: "discount_amount",
      header: () => tTableHeader("discount"),
      cell: ({ row }) =>
        isEditMode ? (
          <NumberInput
            value={row.original.discount_amount || 0}
            onChange={(value) => {
              updateItemField(row.original, {
                discount_amount: value,
              });
            }}
            classNames="h-7 text-xs"
            disabled={!row.original.product_id}
          />
        ) : (
          <span>{row.original.discount_amount}</span>
        ),
      enableSorting: false,
      size: 100,
      meta: {
        cellClassName: "text-right",
        headerClassName: "text-right",
      },
    },
    {
      id: "currency_id",
      header: () => tTableHeader("currency"),
      cell: ({ row }) =>
        isEditMode ? (
          <LookupCurrency
            value={row.original.currency_id}
            bu_code={buCode}
            onValueChange={(value) => {
              updateItemField(row.original, {
                currency_id: value,
              });
            }}
            classNames="text-xs h-7"
            disabled={!row.original.product_id}
          />
        ) : (
          <span>{getCurrencyCode(row.original.currency_id || "")}</span>
        ),
      enableSorting: false,
      size: 180,
      meta: {
        cellClassName: "text-center",
        headerClassName: "text-center",
      },
    },
    {
      accessorKey: "delivery_point_id",
      header: ({ column }) => (
        <DataGridColumnHeader column={column} title={tTableHeader("delivery_point")} />
      ),
      cell: ({ row }) =>
        isEditMode ? (
          <LookupDeliveryPointSelect
            value={row.original.delivery_point_id || ""}
            onValueChange={(value) => {
              updateItemField(row.original, {
                delivery_point_id: value,
              });
            }}
            className="h-7 text-xs w-full"
            disabled={!row.original.location_id}
          />
        ) : (
          <span>{row.original.delivery_point_name || "-"}</span>
        ),
      enableSorting: false,
      size: isEditMode ? 200 : 130,
    },
    ...(isEditMode
      ? [
          {
            id: "action",
            header: () => tTableHeader("action"),
            cell: ({ row }: { row: { original: PrtDetailItem } }) => (
              <Button
                type="button"
                variant="ghost"
                size={"sm"}
                onClick={() => onDelete(row.original)}
                className="text-destructive hover:text-destructive"
              >
                <Trash2 className="h-3 w-3" />
              </Button>
            ),
            enableSorting: false,
            size: 60,
            meta: {
              cellClassName: "text-center",
              headerClassName: "text-center",
            },
          },
        ]
      : []),
  ];
};
