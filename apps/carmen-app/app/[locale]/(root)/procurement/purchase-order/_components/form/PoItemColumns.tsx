import { ColumnDef } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import { Package, Trash2 } from "lucide-react";
import { DataGridColumnHeader } from "@/components/ui/data-grid-column-header";
import { DataGridTableRowSelect, DataGridTableRowSelectAll } from "@/components/ui/data-grid-table";
import { formType } from "@/dtos/form.dto";
import { PoDetailItemDto as PoDetailItemDtoFromDto } from "@/dtos/po.dto";
import LookupProduct from "@/components/lookup/LookupProduct";
import NumberInput from "@/components/form-custom/NumberInput";
import { CreatePoDetailDto, UpdatePoDetailDto } from "../../_schema/po.schema";
import { Checkbox } from "@/components/ui/checkbox";

// Combined type for display (add, update, and original items)
export type PoDetailItem = (CreatePoDetailDto | UpdatePoDetailDto | PoDetailItemDtoFromDto) & {
  _type: "add" | "update" | "original";
  _index: number;
};

interface ColumnConfig {
  currentMode: formType;
  buCode: string;
  token: string;
  tTableHeader: (key: string) => string;
  updateItemField: (item: PoDetailItem, updates: Partial<CreatePoDetailDto>) => void;
  onDelete: (item: PoDetailItem) => void;
}

export const createPoItemColumns = (config: ColumnConfig): ColumnDef<PoDetailItem>[] => {
  const { currentMode, buCode, token, tTableHeader, updateItemField, onDelete } = config;

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
      cell: ({ row }) => <span>{row.original.sequence}</span>,
      enableSorting: false,
      size: 40,
      meta: {
        cellClassName: "text-center",
        headerClassName: "text-center",
      },
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
          <LookupProduct
            value={row.original.product_id || ""}
            bu_code={buCode}
            onValueChange={(value, selectedProduct) => {
              updateItemField(row.original, {
                product_id: value,
                product_name: selectedProduct?.name || "",
                product_local_name: selectedProduct?.local_name || null,
                base_unit_id: selectedProduct?.inventory_unit?.id || "",
                base_unit_name: selectedProduct?.inventory_unit?.name || "",
              });
            }}
            classNames="text-xs h-7 w-full"
            initialDisplayName={row.original.product_name}
          />
        ) : (
          <div className="flex flex-col gap-1">
            <p className="text-sm font-medium">{row.original.product_name}</p>
            {row.original.product_local_name && (
              <p className="text-xs text-muted-foreground">{row.original.product_local_name}</p>
            )}
          </div>
        ),
      enableSorting: false,
      size: 200,
    },
    {
      accessorKey: "order_qty",
      header: ({ column }) => <DataGridColumnHeader column={column} title={tTableHeader("order")} />,
      cell: ({ row }) =>
        isEditMode ? (
          <NumberInput
            value={row.original.order_qty || 0}
            onChange={(value) => {
              const conversionFactor = row.original.order_unit_conversion_factor || 1;
              const baseQty = value * conversionFactor;
              const price = row.original.price || 0;
              const subTotalPrice = value * price;
              const discountAmount = row.original.discount_amount || 0;
              const netAmount = subTotalPrice - discountAmount;
              const taxAmount = row.original.tax_amount || 0;
              const totalPrice = netAmount + taxAmount;

              updateItemField(row.original, {
                order_qty: value,
                base_qty: baseQty,
                sub_total_price: subTotalPrice,
                net_amount: netAmount,
                total_price: totalPrice,
              });
            }}
            classNames="h-7 text-xs"
            disabled={!row.original.product_id}
          />
        ) : (
          <div className="flex items-center justify-end gap-1">
            <span>{row.original.order_qty}</span>
            <span className="text-muted-foreground text-xs">{row.original.order_unit_name}</span>
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
      accessorKey: "price",
      header: ({ column }) => (
        <DataGridColumnHeader column={column} title={tTableHeader("price")} />
      ),
      cell: ({ row }) =>
        isEditMode ? (
          <NumberInput
            value={row.original.price || 0}
            onChange={(value) => {
              const orderQty = row.original.order_qty || 0;
              const subTotalPrice = orderQty * value;
              const discountAmount = row.original.discount_amount || 0;
              const netAmount = subTotalPrice - discountAmount;
              const taxAmount = row.original.tax_amount || 0;
              const totalPrice = netAmount + taxAmount;

              updateItemField(row.original, {
                price: value,
                sub_total_price: subTotalPrice,
                net_amount: netAmount,
                total_price: totalPrice,
              });
            }}
            classNames="h-7 text-xs"
            disabled={!row.original.product_id}
          />
        ) : (
          <span>
            {row.original.price?.toLocaleString("en-US", {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            })}
          </span>
        ),
      enableSorting: false,
      size: 120,
      meta: {
        cellClassName: "text-right",
        headerClassName: "text-right",
      },
    },
    {
      accessorKey: "discount_amount",
      header: () => tTableHeader("discount"),
      cell: ({ row }) =>
        isEditMode ? (
          <NumberInput
            value={row.original.discount_amount || 0}
            onChange={(value) => {
              const subTotalPrice = row.original.sub_total_price || 0;
              const netAmount = subTotalPrice - value;
              const taxAmount = row.original.tax_amount || 0;
              const totalPrice = netAmount + taxAmount;

              updateItemField(row.original, {
                discount_amount: value,
                net_amount: netAmount,
                total_price: totalPrice,
              });
            }}
            classNames="h-7 text-xs"
            disabled={!row.original.product_id}
          />
        ) : (
          <span>
            {row.original.discount_amount?.toLocaleString("en-US", {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            })}
          </span>
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
      header: () => tTableHeader("tax"),
      cell: ({ row }) =>
        isEditMode ? (
          <NumberInput
            value={row.original.tax_amount || 0}
            onChange={(value) => {
              const netAmount = row.original.net_amount || 0;
              const totalPrice = netAmount + value;

              updateItemField(row.original, {
                tax_amount: value,
                total_price: totalPrice,
              });
            }}
            classNames="h-7 text-xs"
            disabled={!row.original.product_id}
          />
        ) : (
          <span>
            {row.original.tax_amount?.toLocaleString("en-US", {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            })}
          </span>
        ),
      enableSorting: false,
      size: 100,
      meta: {
        cellClassName: "text-right",
        headerClassName: "text-right",
      },
    },
    {
      accessorKey: "net_amount",
      header: () => tTableHeader("net"),
      cell: ({ row }) => (
        <span>
          {row.original.net_amount?.toLocaleString("en-US", {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          })}
        </span>
      ),
      enableSorting: false,
      size: 120,
      meta: {
        cellClassName: "text-right",
        headerClassName: "text-right",
      },
    },
    {
      accessorKey: "total_price",
      header: () => tTableHeader("amount"),
      cell: ({ row }) => (
        <span className="font-medium">
          {row.original.total_price?.toLocaleString("en-US", {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          })}
        </span>
      ),
      enableSorting: false,
      size: 120,
      meta: {
        cellClassName: "text-right",
        headerClassName: "text-right",
      },
    },
    {
      accessorKey: "is_foc",
      header: () => "FOC",
      cell: ({ row }) =>
        isEditMode ? (
          <Checkbox
            checked={row.original.is_foc || false}
            onCheckedChange={(checked) => {
              updateItemField(row.original, {
                is_foc: !!checked,
              });
            }}
            disabled={!row.original.product_id}
          />
        ) : (
          <span>{row.original.is_foc ? "Yes" : "No"}</span>
        ),
      enableSorting: false,
      size: 60,
      meta: {
        cellClassName: "text-center",
        headerClassName: "text-center",
      },
    },
    {
      id: "action",
      header: () => tTableHeader("action"),
      cell: ({ row }) =>
        isEditMode ? (
          <Button
            type="button"
            variant="ghost"
            size={"sm"}
            onClick={() => onDelete(row.original)}
            className="text-destructive hover:text-destructive"
          >
            <Trash2 className="h-3 w-3" />
          </Button>
        ) : null,
      enableSorting: false,
      size: 60,
      meta: {
        cellClassName: "text-center",
        headerClassName: "text-center",
      },
    },
  ];
};
