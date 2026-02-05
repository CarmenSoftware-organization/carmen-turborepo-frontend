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

// Type for grouped rows in view mode - stores all values as arrays
interface GroupedProductRow {
  product_id: string;
  product_name: string;
  product_code: string;
  itemCount: number;
  // All values from items (displayed as list)
  prices: number[];
  prices_without_tax: number[];
  tax_amts: number[];
  moq_qtys: number[];
  unit_names: string[];
  tax_profile_names: string[];
  lead_time_days_list: number[];
}

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

  // Grouped table data for view mode only - collects all values into arrays
  const groupedTableData = useMemo(() => {
    if (!isViewMode) return [];

    const activeItems = fields.filter((f) => f._action !== "remove");
    const groupMap = new Map<string, GroupedProductRow>();

    for (const item of activeItems) {
      const key = item.product_id || `ungrouped-${item.id}`;

      if (groupMap.has(key)) {
        const group = groupMap.get(key)!;
        group.itemCount++;
        group.prices.push(item.price);
        group.prices_without_tax.push(item.price_without_tax ?? 0);
        group.tax_amts.push(item.tax_amt ?? 0);
        group.moq_qtys.push(item.moq_qty ?? 0);
        group.unit_names.push(item.unit_name || "-");
        group.tax_profile_names.push(item.tax_profile_name || "-");
        group.lead_time_days_list.push(item.lead_time_days ?? 0);
      } else {
        groupMap.set(key, {
          product_id: item.product_id,
          product_name: item.product_name || "",
          product_code: item.product_code || "",
          itemCount: 1,
          prices: [item.price],
          prices_without_tax: [item.price_without_tax ?? 0],
          tax_amts: [item.tax_amt ?? 0],
          moq_qtys: [item.moq_qty ?? 0],
          unit_names: [item.unit_name || "-"],
          tax_profile_names: [item.tax_profile_name || "-"],
          lead_time_days_list: [item.lead_time_days ?? 0],
        });
      }
    }

    return Array.from(groupMap.values());
  }, [fields, isViewMode]);

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

  // Columns for view mode (grouped data - displays combined pricing info)
  const viewModeColumns = useMemo<ColumnDef<GroupedProductRow>[]>(
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
        accessorKey: "product_name",
        header: ({ column }) => (
          <DataGridColumnHeader column={column} title={tPriceList("product")} />
        ),
        cell: ({ row }) => <span className="text-xs">{row.original.product_name || "-"}</span>,
        size: 250,
      },
      {
        id: "pricing",
        header: ({ column }) => <DataGridColumnHeader column={column} title="MOQ" />,
        cell: ({ row }) => (
          <div className="flex flex-col gap-0.5">
            {row.original.moq_qtys.map((moq, i) => (
              <span key={i} className="text-xs">
                {moq}+ {row.original.unit_names[i]}→{row.original.prices[i]}({row.original.lead_time_days_list[i]}d)
              </span>
            ))}
          </div>
        ),
        size: 200,
      },
      {
        accessorKey: "prices_without_tax",
        header: ({ column }) => <DataGridColumnHeader column={column} title="PWT" />,
        cell: ({ row }) => (
          <div className="flex flex-col gap-0.5">
            {row.original.prices_without_tax.map((p, i) => (
              <span key={i} className="text-xs">
                {p}
              </span>
            ))}
          </div>
        ),
        size: 150,
      },
      {
        accessorKey: "tax_profile_names",
        header: ({ column }) => (
          <DataGridColumnHeader column={column} title={tPriceList("tax_profile")} />
        ),
        cell: ({ row }) => (
          <div className="flex flex-col gap-0.5">
            {row.original.tax_profile_names.map((t, i) => (
              <span key={i} className="text-xs">
                {t}
              </span>
            ))}
          </div>
        ),
        size: 150,
      },
      {
        accessorKey: "tax_amts",
        header: ({ column }) => (
          <DataGridColumnHeader column={column} title={tPriceList("tax_amt")} />
        ),
        cell: ({ row }) => (
          <div className="flex flex-col gap-0.5">
            {row.original.tax_amts.map((t, i) => (
              <span key={i} className="text-xs">
                {t}
              </span>
            ))}
          </div>
        ),
        size: 120,
      },
    ],
    [tPriceList]
  );

  // Table for edit mode (individual rows)
  const editTable = useReactTable({
    data: tableData,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getRowId: (row) => row.id || "",
  });

  // Table for view mode (grouped rows)
  const viewTable = useReactTable({
    data: groupedTableData,
    columns: viewModeColumns,
    getCoreRowModel: getCoreRowModel(),
    getRowId: (row) => row.product_id || `ungrouped-${row.product_name}`,
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

      {(isViewMode ? groupedTableData.length : tableData.length) > 0 ? (
        <div className="border-none">
          {isViewMode ? (
            <DataGrid
              table={viewTable}
              recordCount={groupedTableData.length}
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
          ) : (
            <DataGrid
              table={editTable}
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
          )}
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
