import { ColumnDef } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import { MapPin, Package, Trash2 } from "lucide-react";
import { DataGridColumnHeader } from "@/components/ui/data-grid-column-header";
import {
  DataGridTableRowSelect,
  DataGridTableRowSelectAll,
} from "@/components/ui/data-grid-table";
import { formType } from "@/dtos/form.dto";
import { PurchaseRequestTemplateDetailDto } from "@/dtos/pr-template.dto";
import LookupLocation from "@/components/lookup/LookupLocation";
import LookupProductLocation from "@/components/lookup/LookupProductLocation";
import LookupCurrency from "@/components/lookup/LookupCurrency";
import NumberInput from "@/components/form-custom/NumberInput";
import PrtUnitSelectCell from "./PrtUnitSelectCell";
import { Input } from "@/components/ui/input";
import {
  CreatePrtDetailDto,
  UpdatePrtDetailDto,
} from "../../_schema/prt.schema";

// Combined type for display (add, update, and original items)
export type PrtDetailItem = (CreatePrtDetailDto | UpdatePrtDetailDto | PurchaseRequestTemplateDetailDto) & {
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
  const {
    currentMode,
    buCode,
    token,
    tTableHeader,
    getCurrencyCode,
    updateItemField,
    onDelete,
  } = config;

  const isEditMode = currentMode !== formType.VIEW;

  return [
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
              value={row.original.requested_qty || 0}
              onChange={(value) => {
                const conversionFactor = row.original.requested_unit_conversion_factor || 1;
                const baseQty = value * conversionFactor;
                updateItemField(row.original, {
                  requested_qty: value,
                  requested_base_qty: baseQty,
                });
              }}
              classNames="h-7 text-xs bg-background w-20"
              disabled={!row.original.product_id}
            />
            <PrtUnitSelectCell
              rowIndex={row.index}
              productId={row.original.product_id || ""}
              currentUnitId={row.original.requested_unit_id || ""}
              requestedQty={row.original.requested_qty || 0}
              updateItemField={(_, updates) => updateItemField(row.original, updates)}
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
              value={row.original.foc_qty || 0}
              onChange={(value) => {
                const conversionFactor = row.original.foc_unit_conversion_factor || 1;
                const baseQty = value * conversionFactor;
                updateItemField(row.original, {
                  foc_qty: value,
                  foc_base_qty: baseQty,
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
          <div className="flex flex-col items-end gap-1">
            <div className="flex items-center gap-1">
              <NumberInput
                value={row.original.tax_amount || 0}
                onChange={(value) => {
                  updateItemField(row.original, {
                    tax_amount: value,
                  });
                }}
                classNames="h-7 text-xs bg-background w-16"
                disabled={!row.original.product_id}
              />
              <LookupCurrency
                value={row.original.currency_id}
                bu_code={buCode}
                onValueChange={(value) => {
                  updateItemField(row.original, {
                    currency_id: value,
                  });
                }}
                classNames="h-7 text-xs w-24"
                disabled={!row.original.product_id}
              />
            </div>
            <NumberInput
              value={row.original.discount_amount || 0}
              onChange={(value) => {
                updateItemField(row.original, {
                  discount_amount: value,
                });
              }}
              classNames="h-7 text-xs bg-background w-16"
              disabled={!row.original.product_id}
            />
          </div>
        ) : (
          <div className="flex flex-col text-xs">
            <p>
              {getCurrencyCode(row.original.currency_id || "")} {row.original.tax_amount}
            </p>
            <p className="text-muted-foreground">Disc: {row.original.discount_amount}</p>
          </div>
        ),
      enableSorting: false,
      size: 220,
      meta: {
        cellClassName: "text-right",
        headerClassName: "text-right",
      },
    },
    {
      id: "action",
      header: () => tTableHeader("action"),
      cell: ({ row }) =>
        isEditMode ? (
          <Button
            variant="ghost"
            size={"sm"}
            onClick={() => onDelete(row.original)}
            className="text-destructive hover:text-destructive"
          >
            <Trash2 className="h-3 w-3" />
          </Button>
        ) : null,
      enableSorting: false,
      size: 80,
      meta: {
        cellClassName: "text-center",
        headerClassName: "text-center",
      },
    },
  ];
};
