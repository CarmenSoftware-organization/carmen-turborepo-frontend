"use client";

import { useMemo } from "react";
import { UseFormReturn } from "react-hook-form";
import { useTranslations } from "next-intl";
import { ColumnDef, getCoreRowModel, useReactTable } from "@tanstack/react-table";
import { DataGrid, DataGridContainer } from "@/components/ui/data-grid";
import { DataGridTable } from "@/components/ui/data-grid-table";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { Package, TrendingDown, TrendingUp } from "lucide-react";
import type { PriceListFormData } from "../../_schema/price-list.schema";
import { DataGridColumnHeader } from "@/components/ui/data-grid-column-header";
import { PriceListDetailDto, ProductPlDto } from "@/dtos/price-list-dto";

interface ProductsSectionProps {
  form: UseFormReturn<PriceListFormData>;
  priceList?: PriceListDetailDto;
  isViewMode: boolean;
}

export default function ProductsSection({ form, priceList, isViewMode }: ProductsSectionProps) {
  const tPriceList = useTranslations("PriceList");

  const rawProducts =
    // @ts-ignore
    priceList?.pricelist_detail || priceList?.products || [];

  const products: ProductPlDto[] = useMemo(() => {
    return rawProducts.map((p: any) => ({
      id: p.id,
      code: p.code || p.tb_product?.code || "",
      name: p.name || p.tb_product?.name || "",
      moqs: p.moqs || [],
      taxRate: p.taxRate ?? p.tax_rate ?? 0,
      totalAmount: p.totalAmount ?? p.total_amount ?? 0,
      priceChange: p.priceChange ?? p.price_change ?? 0,
      lastUpdate: p.lastUpdate || p.last_update || "",
    }));
  }, [rawProducts]);

  const columns = useMemo<ColumnDef<ProductPlDto>[]>(
    () => [
      {
        id: "index",
        header: () => <div className="text-center">#</div>,
        cell: ({ row }) => <div className="text-center">{row.index + 1}</div>,
        size: 50,
        meta: {
          cellClassName: "text-center",
          headerClassName: "text-center",
        },
      },
      {
        accessorKey: "code",
        header: ({ column }) => (
          <DataGridColumnHeader column={column} title={tPriceList("product_code")} />
        ),
        cell: ({ row }) => <span className="font-medium">{row.original.code}</span>,
        size: 150,
      },
      {
        accessorKey: "name",
        header: ({ column }) => (
          <DataGridColumnHeader column={column} title={tPriceList("product_name")} />
        ),
        cell: ({ row }) => <span>{row.original.name}</span>,
        size: 250,
      },
      {
        id: "moqs",
        header: ({ column }) => (
          <DataGridColumnHeader column={column} title={tPriceList("moq_tiers")} />
        ),
        cell: ({ row }) => {
          const moqs = row.original.moqs || [];
          return (
            <div className="flex flex-col gap-1">
              {moqs.map((moq, idx) => (
                <span key={idx} className="text-xs">
                  {moq.minQuantity} + {moq.unit} → {moq.price} ({moq.leadTimeDays}d)
                </span>
              ))}
            </div>
          );
        },
        size: 180,
      },
      {
        accessorKey: "taxRate",
        header: ({ column }) => (
          <DataGridColumnHeader column={column} title={tPriceList("tax_rate")} />
        ),
        cell: ({ row }) => (
          <span className="text-right block">{(row.original.taxRate * 100).toFixed(2)}%</span>
        ),
        size: 100,
        meta: {
          cellClassName: "text-right",
          headerClassName: "text-right",
        },
      },
      {
        accessorKey: "totalAmount",
        header: ({ column }) => (
          <DataGridColumnHeader column={column} title={tPriceList("total_amount")} />
        ),
        cell: ({ row }) => (
          <span className="text-right block font-medium">{row.original.totalAmount}</span>
        ),
        size: 120,
        meta: {
          cellClassName: "text-right",
          headerClassName: "text-right",
        },
      },
      {
        accessorKey: "priceChange",
        header: ({ column }) => (
          <DataGridColumnHeader column={column} title={tPriceList("price_change")} />
        ),
        cell: ({ row }) => {
          const change = row.original.priceChange;
          const isPositive = change > 0;
          const isNegative = change < 0;

          const getChangeColorClass = () => {
            if (isPositive) return "text-green-600";
            if (isNegative) return "text-red-600";
            return "text-muted-foreground";
          };

          return (
            <div className="flex items-center justify-end gap-1">
              {isPositive && <TrendingUp className="h-3.5 w-3.5 text-green-600" />}
              {isNegative && <TrendingDown className="h-3.5 w-3.5 text-red-600" />}
              <span className={`text-sm font-medium ${getChangeColorClass()}`}>
                {change > 0 ? "+" : ""}
                {change.toFixed(2)}%
              </span>
            </div>
          );
        },
        size: 120,
        meta: {
          cellClassName: "text-right",
          headerClassName: "text-right",
        },
      },
    ],
    [tPriceList]
  );

  const table = useReactTable({
    data: products,
    columns,
    getRowId: (row) => row.id,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
          {tPriceList("products")}
        </h2>
        <Badge variant="secondary">
          {products.length} {tPriceList("items")}
        </Badge>
      </div>

      {products.length > 0 ? (
        <DataGrid
          table={table}
          recordCount={products.length}
          isLoading={false}
          loadingMode="skeleton"
          emptyMessage={tPriceList("no_products")}
          tableLayout={{
            headerSticky: false,
            dense: true,
            rowBorder: true,
            headerBackground: true,
            headerBorder: true,
            width: "fixed",
          }}
        >
          <DataGridContainer>
            <ScrollArea className="max-h-[500px]">
              <DataGridTable />
              <ScrollBar orientation="horizontal" />
            </ScrollArea>
          </DataGridContainer>
        </DataGrid>
      ) : (
        <div className="flex flex-col items-center justify-center py-16 text-center border-2 border-dashed rounded-lg">
          <Package className="h-10 w-10 text-muted-foreground/40 mb-3" />
          <h3 className="text-sm font-medium mb-1">{tPriceList("no_products")}</h3>
          <p className="text-xs text-muted-foreground max-w-sm">
            {tPriceList("no_products_description")}
          </p>
        </div>
      )}
    </div>
  );
}
