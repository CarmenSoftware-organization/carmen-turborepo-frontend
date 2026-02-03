"use client";

import { UseFormReturn, useFieldArray, FieldArrayWithId } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Package, Plus, Trash2 } from "lucide-react";
import type { PriceListFormData, PriceListDetailItem } from "../../_schema/price-list.schema";
import LookupProduct from "@/components/lookup/LookupProduct";
import LookupUnit from "@/components/lookup/LookupUnit";
import LookupTaxProfile from "@/components/lookup/LookupTaxProfile";
import { useProductQuery } from "@/hooks/use-product-query";
import { useAuth } from "@/context/AuthContext";
import { cn } from "@/lib/utils";
import { ColumnDef, getCoreRowModel, useReactTable } from "@tanstack/react-table";
import { DataGrid, DataGridContainer } from "@/components/ui/data-grid";
import { DataGridTable } from "@/components/ui/data-grid-table";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { useMemo } from "react";
import { DataGridColumnHeader } from "@/components/ui/data-grid-column-header";

interface ProductsSectionProps {
  form: UseFormReturn<PriceListFormData>;
  isViewMode: boolean;
}

type ProductTableItem = FieldArrayWithId<PriceListFormData, "pricelist_detail", "id">;

export default function ProductsSection({ form, isViewMode }: ProductsSectionProps) {
  const { token, buCode } = useAuth();
  const { products: productList } = useProductQuery({ token, buCode });

  const { fields, prepend, remove, update } = useFieldArray({
    control: form.control,
    name: "pricelist_detail",
  });

  const handleAddProduct = () => {
    const newItem: PriceListDetailItem = {
      sequence_no: fields.length + 1,
      product_id: "",
      price: 0,
      unit_id: "",
      tax_profile_id: "",
      tax_rate: 0,
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

  const handleProductChange = (index: number, productId: string) => {
    const product = productList?.data?.find((p: any) => p.id === productId);
    const currentItem = fields[index];

    const newAction = currentItem._action === "none" ? "update" : currentItem._action;

    update(index, {
      ...currentItem,
      product_id: productId,
      product_name: product?.name || "",
      product_code: product?.code || "",
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
        cell: ({ row }) => <div className="text-center font-mono text-xs">{row.index + 1}</div>,
        size: 50,
      },
      {
        accessorKey: "product_id",
        header: ({ column }) => <DataGridColumnHeader column={column} title="Product" />,
        cell: ({ row }) => {
          const item = row.original;
          const index = getOriginalIndex(item.id); // id from useFieldArray
          if (index === -1) return null;

          return isViewMode ? (
            <span className="text-sm">
              {item.product_code} - {item.product_name}
            </span>
          ) : (
            <LookupProduct
              value={item.product_id}
              onValueChange={(val) => handleProductChange(index, val)}
              placeholder="Select Product"
              buCode={buCode}
              token={token}
              // className="h-8 text-sm" // Assuming Lookup supports className or size
            />
          );
        },
        size: 300,
      },
      {
        accessorKey: "price",
        header: ({ column }) => <DataGridColumnHeader column={column} title="Price" />,
        cell: ({ row }) => {
          const item = row.original;
          const index = getOriginalIndex(item.id || "");
          if (index === -1) return null;

          return isViewMode ? (
            <span className="font-mono text-sm">{item.price}</span>
          ) : (
            <Input
              type="number"
              value={item.price}
              onChange={(e) => handleFieldChange(index, "price", Number(e.target.value))}
              className="h-8 text-sm"
            />
          );
        },
        size: 150,
      },
      {
        accessorKey: "unit_id",
        header: ({ column }) => <DataGridColumnHeader column={column} title="Unit" />,
        cell: ({ row }) => {
          const item = row.original;
          const index = getOriginalIndex(item.id || "");
          if (index === -1) return null;

          return isViewMode ? (
            <span className="text-sm">{item.unit_name || "-"}</span>
          ) : (
            <LookupUnit
              value={item.unit_id || ""}
              onValueChange={(val) => handleFieldChange(index, "unit_id", val)}
              placeholder="Select Unit"
            />
          );
        },
        size: 150,
      },
      {
        accessorKey: "tax_profile_id",
        header: ({ column }) => <DataGridColumnHeader column={column} title="Tax Profile" />,
        cell: ({ row }) => {
          const item = row.original;
          const index = getOriginalIndex(item.id || "");
          if (index === -1) return null;

          return isViewMode ? (
            <span className="text-sm">{item.tax_profile_name || "-"}</span>
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
            />
          );
        },
        size: 200,
      },
      {
        accessorKey: "moq_qty",
        header: ({ column }) => <DataGridColumnHeader column={column} title="MOQ" />,
        cell: ({ row }) => {
          const item = row.original;
          const index = getOriginalIndex(item.id || "");
          if (index === -1) return null;

          return isViewMode ? (
            <span className="font-mono text-sm">{item.moq_qty || 0}</span>
          ) : (
            <Input
              type="number"
              value={item.moq_qty || 0}
              onChange={(e) => handleFieldChange(index, "moq_qty", Number(e.target.value))}
              className="w-full h-8 text-sm"
              min={0}
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
            Add Product
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
                <ScrollArea className="h-[calc(100vh-500px)] min-h-[300px]">
                  <DataGridTable />
                  <ScrollBar orientation="horizontal" />
                </ScrollArea>
              </DataGridContainer>
            </div>
          </DataGrid>
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-muted">
            <Package className="h-6 w-6 text-muted-foreground" />
          </div>
          <h3 className="mt-4 text-sm font-semibold">No products added</h3>
          <p className="mb-4 text-xs text-muted-foreground max-w-sm">
            Start by adding products to this price list. You can define specific prices per unit.
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
              Add Product
            </Button>
          )}
        </div>
      )}
    </div>
  );
}
