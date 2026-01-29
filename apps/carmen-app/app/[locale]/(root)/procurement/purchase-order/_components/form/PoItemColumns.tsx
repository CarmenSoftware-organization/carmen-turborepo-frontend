import { ColumnDef } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import { Package, Trash2 } from "lucide-react";
import { DataGridColumnHeader } from "@/components/ui/data-grid-column-header";
import { DataGridTableRowSelect, DataGridTableRowSelectAll } from "@/components/ui/data-grid-table";
import { formType } from "@/dtos/form.dto";
import LookupProduct from "@/components/lookup/LookupProduct";
import NumberInput from "@/components/form-custom/NumberInput";
import { PoDetailItemDto } from "../../_schema/po.schema";
import { Checkbox } from "@/components/ui/checkbox";

// Type for display items with index
export type PoDetailItem = PoDetailItemDto & {
  _type: "add" | "original";
  _index: number;
};

interface ColumnConfig {
  currentMode: formType;
  buCode: string;
  token: string;
  tTableHeader: (key: string) => string;
  updateItemField: (item: PoDetailItem, updates: Partial<PoDetailItemDto>) => void;
  onDelete: (item: PoDetailItem) => void;
}

// Helper function to calculate prices
const calculatePrices = (item: PoDetailItem, updates: Partial<PoDetailItemDto>) => {
  const orderQty = updates.order_qty ?? item.order_qty ?? 0;
  const price = updates.price ?? item.price ?? 0;
  const discountAmount = updates.discount_amount ?? item.discount_amount ?? 0;
  const taxAmount = updates.tax_amount ?? item.tax_amount ?? 0;

  const subTotalPrice = orderQty * price;
  const netAmount = subTotalPrice - discountAmount;
  const totalPrice = netAmount + taxAmount;

  return { sub_total_price: subTotalPrice, net_amount: netAmount, total_price: totalPrice };
};

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
            token={token}
            buCode={buCode}
            onValueChange={(value, selectedProduct) => {
              console.log("Selected product:", selectedProduct);
              updateItemField(row.original, {
                product_id: value,
                product_name: selectedProduct?.name || "",
                product_local_name: selectedProduct?.local_name || null,
                base_unit_id: selectedProduct?.inventory_unit_id || "",
                base_unit_name: selectedProduct?.inventory_unit_name || "",
                // ใช้ค่านี้ไปก่อน
                order_unit_id: selectedProduct?.inventory_unit_id || "",
                order_unit_name: selectedProduct?.inventory_unit_name || "",
                tax_profile_id: "01f9b0b6-9fb5-4e13-9252-6a5d4178be58",
                tax_profile_name: "None",
                tax_rate: 0,
              });
            }}
            classNames="text-xs h-7 w-full"
            initialDisplayName={row.original.product_name}
          />
        ) : (
          <div className="max-w-[200px]">
            <p className="text-xs font-medium line-clamp-2 break-words">
              {row.original.product_name}
            </p>
          </div>
        ),
      enableSorting: false,
      size: 200,
    },
    {
      accessorKey: "order_qty",
      header: ({ column }) => (
        <DataGridColumnHeader column={column} title={tTableHeader("order")} />
      ),
      cell: ({ row }) =>
        isEditMode ? (
          <NumberInput
            value={row.original.order_qty || 0}
            onChange={(value) => {
              const conversionFactor = row.original.order_unit_conversion_factor || 1;
              const baseQty = value * conversionFactor;
              const prices = calculatePrices(row.original, { order_qty: value });

              updateItemField(row.original, {
                order_qty: value,
                base_qty: baseQty,
                ...prices,
              });
            }}
            classNames="h-7 text-xs"
            disabled={!row.original.product_id}
          />
        ) : (
          <div className="text-xs flex items-center justify-end gap-1">
            <span>{row.original.order_qty}</span>
            <span className="text-muted-foreground">{row.original.order_unit_name}</span>
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
              const prices = calculatePrices(row.original, { price: value });
              updateItemField(row.original, { price: value, ...prices });
            }}
            classNames="h-7 text-xs"
            disabled={!row.original.product_id}
          />
        ) : (
          <span className="text-xs">
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
              const prices = calculatePrices(row.original, { discount_amount: value });
              updateItemField(row.original, { discount_amount: value, ...prices });
            }}
            classNames="h-7 text-xs"
            disabled={!row.original.product_id}
          />
        ) : (
          <span className="text-xs">
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
              const prices = calculatePrices(row.original, { tax_amount: value });
              updateItemField(row.original, { tax_amount: value, ...prices });
            }}
            classNames="h-7 text-xs"
            disabled={!row.original.product_id}
          />
        ) : (
          <span className="text-xs">
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
        <span className="text-xs">
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
        <span className="text-xs">
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
          <span className="text-xs">{row.original.is_foc ? "Yes" : "No"}</span>
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
