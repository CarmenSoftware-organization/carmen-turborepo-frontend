"use client";

import { UseFormReturn, useFieldArray, FieldArrayWithId } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Package, Plus, Trash2 } from "lucide-react";
import type { PriceListFormData, PriceListDetailItem } from "../../_schema/price-list.schema";
import LookupProduct from "@/components/lookup/LookupProduct";
import LookupTaxProfile from "@/components/lookup/LookupTaxProfile";
import { PriceListUnitSelectCell } from "./PriceListUnitSelectCell";
import { ColumnDef, getCoreRowModel, useReactTable } from "@tanstack/react-table";
import { DataGrid, DataGridContainer } from "@/components/ui/data-grid";
import { DataGridTable } from "@/components/ui/data-grid-table";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { useMemo } from "react";
import { DataGridColumnHeader } from "@/components/ui/data-grid-column-header";
import NumberInput from "@/components/form-custom/NumberInput";
import { useTranslations } from "next-intl";

interface ProductsSectionProps {
  form: UseFormReturn<PriceListFormData>;
  isViewMode: boolean;
  token: string;
  buCode: string;
}

type ProductTableItem = FieldArrayWithId<PriceListFormData, "pricelist_detail", "id">;

export default function ProductsSection({ form, isViewMode, token, buCode }: ProductsSectionProps) {
  const tPriceList = useTranslations("PriceList");

  const { fields, prepend, remove, update } = useFieldArray({
    control: form.control,
    name: "pricelist_detail",
  });

  const handleAddProduct = () => {
    const newItem: PriceListDetailItem = {
      sequence_no: fields.length + 1,
      product_id: "",
      price: 0,
      price_without_tax: 0,
      unit_id: "",
      unit_name: "",
      tax_profile_id: "",
      tax_rate: 0,
      tax_amt: 0,
      lead_time_days: 0,
      moq_qty: 1,
      _action: "add",
    };
    prepend(newItem);
  };

  const isExistingItem = (item: (typeof fields)[number]) => {
    return item._action === "none" || item._action === "update" || item._action === "remove";
  };

  const handleRemoveProduct = (index: number) => {
    const item = fields[index];
    if (isExistingItem(item)) {
      update(index, { ...item, _action: "remove" });
    } else {
      remove(index);
    }
  };

  const handleProductChange = (
    index: number,
    productId: string,
    productName?: string,
    productCode?: string
  ) => {
    const currentItem = fields[index];
    const newAction = currentItem._action === "none" ? "update" : currentItem._action;

    update(index, {
      ...currentItem,
      product_id: productId,
      product_name: productName || "",
      product_code: productCode || "",
      // Reset unit when product changes
      unit_id: "",
      unit_name: "",
      _action: newAction,
    });
  };

  const handleUnitChange = (index: number, unitId: string, unitName: string) => {
    const currentItem = fields[index];
    const newAction = currentItem._action === "none" ? "update" : currentItem._action;

    update(index, {
      ...currentItem,
      unit_id: unitId,
      unit_name: unitName,
      _action: newAction,
    });
  };

  const handleFieldChange = (index: number, field: keyof PriceListDetailItem, value: any) => {
    const currentItem = fields[index];
    const newAction = currentItem._action === "none" ? "update" : currentItem._action;
    update(index, {
      ...currentItem,
      [field]: value,
      _action: newAction,
    });
  };

  const handleMultipleFieldChange = (index: number, changes: Partial<PriceListDetailItem>) => {
    const currentItem = fields[index];
    const newAction = currentItem._action === "none" ? "update" : currentItem._action;

    update(index, {
      ...currentItem,
      ...changes,
      _action: newAction,
    });
  };

  const tableData = useMemo(() => fields.filter((field) => field._action !== "remove"), [fields]);

  // Helper to find original index in fields array
  const getOriginalIndex = (id: string) => fields.findIndex((f) => f.id === id);

  const columns = useMemo<ColumnDef<ProductTableItem>[]>(
    () => [
      {
        id: "no",
        header: ({ column }) => <DataGridColumnHeader column={column} title="#" />,
        cell: ({ row }) => <span>{row.index + 1}</span>,
        size: 50,
        meta: {
          cellClassName: "text-center",
          headerClassName: "text-center",
        },
      },
      {
        accessorKey: "product_id",
        header: ({ column }) => (
          <DataGridColumnHeader column={column} title={tPriceList("product")} />
        ),
        cell: ({ row }) => {
          const item = row.original;
          const index = getOriginalIndex(item.id);
          if (index === -1) return null;

          return isViewMode ? (
            <span className="text-xs">{item.product_name || "-"}</span>
          ) : (
            <div className="min-w-[220px]">
              <LookupProduct
                value={item.product_id}
                onValueChange={(val, product) => {
                  handleProductChange(index, val, product?.name, product?.code);
                }}
                buCode={buCode}
                token={token}
                classNames="text-xs h-7 w-full"
                initialDisplayName={item.product_name}
              />
            </div>
          );
        },
        size: 250,
      },
      {
        accessorKey: "price",
        header: ({ column }) => (
          <DataGridColumnHeader column={column} title={tPriceList("price")} />
        ),
        cell: ({ row }) => {
          const item = row.original;
          const index = getOriginalIndex(item.id || "");
          if (index === -1) return null;

          return isViewMode ? (
            <span className="text-xs">{item.price}</span>
          ) : (
            <NumberInput
              value={item.price}
              onChange={(value) => handleFieldChange(index, "price", value)}
              min={0.01}
              step={0.01}
              classNames="text-xs h-7"
            />
          );
        },
        size: 120,
      },
      {
        accessorKey: "price_without_tax",
        header: ({ column }) => (
          <DataGridColumnHeader column={column} title={tPriceList("price_without_tax")} />
        ),
        cell: ({ row }) => {
          const item = row.original;
          const index = getOriginalIndex(item.id || "");
          if (index === -1) return null;

          return isViewMode ? (
            <span className="text-xs">{item.price_without_tax ?? 0}</span>
          ) : (
            <NumberInput
              value={item.price_without_tax ?? 0}
              onChange={(value) => handleFieldChange(index, "price_without_tax", value)}
              min={0}
              step={0.01}
              classNames="text-xs h-7"
            />
          );
        },
        size: 150,
      },
      {
        accessorKey: "unit_id",
        header: ({ column }) => <DataGridColumnHeader column={column} title={tPriceList("unit")} />,
        cell: ({ row }) => {
          const item = row.original;
          const index = getOriginalIndex(item.id || "");
          if (index === -1) return null;

          return isViewMode ? (
            <span className="text-xs">{item.unit_name || "-"}</span>
          ) : (
            <div className="min-w-[100px]">
              <PriceListUnitSelectCell
                productId={item.product_id || ""}
                currentUnitId={item.unit_id}
                onUnitChange={(unitId, unitName) => handleUnitChange(index, unitId, unitName)}
                token={token}
                buCode={buCode}
                disabled={!item.product_id}
              />
            </div>
          );
        },
        size: 120,
      },
      {
        accessorKey: "tax_profile_id",
        header: ({ column }) => (
          <DataGridColumnHeader column={column} title={tPriceList("tax_profile")} />
        ),
        cell: ({ row }) => {
          const item = row.original;
          const index = getOriginalIndex(item.id || "");
          if (index === -1) return null;

          return isViewMode ? (
            <span className="text-xs">{item.tax_profile_name || "-"}</span>
          ) : (
            <LookupTaxProfile
              value={item.tax_profile_id || ""}
              onValueChange={(val) => handleFieldChange(index, "tax_profile_id", val)}
              onSelectObject={(obj) => {
                handleMultipleFieldChange(index, {
                  tax_profile_id: obj.id,
                  tax_rate: obj.tax_rate,
                });
              }}
              classNames="h-7"
            />
          );
        },
        size: 150,
      },
      {
        accessorKey: "tax_amt",
        header: ({ column }) => (
          <DataGridColumnHeader column={column} title={tPriceList("tax_amt")} />
        ),
        cell: ({ row }) => {
          const item = row.original;
          const index = getOriginalIndex(item.id || "");
          if (index === -1) return null;

          return isViewMode ? (
            <span className="text-xs">{item.tax_amt ?? 0}</span>
          ) : (
            <NumberInput
              value={item.tax_amt ?? 0}
              onChange={(value) => handleFieldChange(index, "tax_amt", value)}
              min={0}
              step={0.01}
              classNames="text-xs h-7"
            />
          );
        },
        size: 120,
      },
      {
        accessorKey: "lead_time_days",
        header: ({ column }) => (
          <DataGridColumnHeader column={column} title={tPriceList("lead_time_days")} />
        ),
        cell: ({ row }) => {
          const item = row.original;
          const index = getOriginalIndex(item.id || "");
          if (index === -1) return null;

          return isViewMode ? (
            <span className="text-xs">{item.lead_time_days ?? 0}</span>
          ) : (
            <NumberInput
              value={item.lead_time_days ?? 0}
              onChange={(value) => handleFieldChange(index, "lead_time_days", value)}
              min={0}
              classNames="text-xs h-7"
            />
          );
        },
        size: 150,
      },
      {
        accessorKey: "moq_qty",
        header: ({ column }) => <DataGridColumnHeader column={column} title={tPriceList("moq")} />,
        cell: ({ row }) => {
          const item = row.original;
          const index = getOriginalIndex(item.id || "");
          if (index === -1) return null;

          return isViewMode ? (
            <span className="text-xs">{item.moq_qty || 0}</span>
          ) : (
            <NumberInput
              value={item.moq_qty || 0}
              onChange={(value) => handleFieldChange(index, "moq_qty", value)}
              min={0}
              classNames="text-xs h-7"
            />
          );
        },
        size: 100,
      },
      {
        id: "actions",
        header: () => null,
        cell: ({ row }) => {
          const item = row.original;
          const index = getOriginalIndex(item.id || "");
          if (index === -1 || isViewMode) return null;

          return (
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="h-7 w-7 text-muted-foreground hover:text-destructive hover:bg-destructive/10"
              onClick={() => handleRemoveProduct(index)}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          );
        },
        size: 50,
      },
    ],
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [fields, isViewMode, buCode, token]
  );

  const table = useReactTable({
    data: tableData,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getRowId: (row) => row.id || "",
  });

  return (
    <div>
      {!isViewMode && (
        <div className="flex justify-end bg-muted/20 px-4 py-2 border-b">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={handleAddProduct}
            className="h-8 gap-1.5 text-xs font-medium"
          >
            <Plus className="h-3.5 w-3.5" />
            {tPriceList("add_product")}
          </Button>
        </div>
      )}

      {tableData.length > 0 ? (
        <div className="border-none">
          <DataGrid
            table={table}
            recordCount={tableData.length}
            isLoading={false}
            tableLayout={{
              headerSticky: true,
              rowBorder: true,
              headerBackground: true,
              headerBorder: true,
              width: "fixed",
              dense: true,
            }}
          >
            <div className="w-full">
              <DataGridContainer>
                <ScrollArea className="h-[calc(100vh-500px)]">
                  <DataGridTable />
                  <ScrollBar orientation="horizontal" />
                </ScrollArea>
              </DataGridContainer>
            </div>
          </DataGrid>
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center pb-5 text-center">
          <div className="flex h-12 w-12 items-center justify-center">
            <Package className="h-6 w-6 text-muted-foreground" />
          </div>
          <h3 className="mt-4 text-sm font-semibold">{tPriceList("no_products_added")}</h3>
          <p className="mb-4 text-xs text-muted-foreground max-w-sm">
            {tPriceList("no_products_added_description")}
          </p>
          {!isViewMode && (
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={handleAddProduct}
              className="h-8 gap-1.5"
            >
              <Plus className="h-3.5 w-3.5" />
              {tPriceList("add_product")}
            </Button>
          )}
        </div>
      )}
    </div>
  );
}
