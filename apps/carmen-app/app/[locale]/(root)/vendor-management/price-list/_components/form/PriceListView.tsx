"use client";

import { useMemo } from "react";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import {
  SquarePen,
  Calendar,
  Building2,
  Coins,
  TrendingUp,
  TrendingDown,
} from "lucide-react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Skeleton } from "@/components/ui/skeleton";
import { formatDate } from "@/utils/format/date";
import { useAuth } from "@/context/AuthContext";
import { ColumnDef, getCoreRowModel, useReactTable } from "@tanstack/react-table";
import { DataGrid, DataGridContainer } from "@/components/ui/data-grid";
import { DataGridTable } from "@/components/ui/data-grid-table";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { DataGridColumnHeader } from "@/components/ui/data-grid-column-header";
import { ProductPlDto } from "@/dtos/price-list-dto";
import { Badge } from "@/components/ui/badge";
import { Package } from "lucide-react";
import { PriceListBreadcrumb, PriceListCardHeader, ProductsCardHeader } from "../shared";

interface PriceListViewProps {
  readonly initialData?: any;
  readonly onEditMode: () => void;
}

export default function PriceListView({ initialData, onEditMode }: PriceListViewProps) {
  const { dateFormat } = useAuth();
  const tPriceList = useTranslations("PriceList");
  const tCommon = useTranslations("Common");
  const tHeader = useTranslations("TableHeader");

  const rawProducts = initialData?.pricelist_detail || initialData?.products || [];

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

  const productsCount = products.length;

  const columns = useMemo<ColumnDef<ProductPlDto>[]>(
    () => [
      {
        id: "index",
        header: () => <div className="text-center">#</div>,
        cell: ({ row }) => <div className="text-center">{row.index + 1}</div>,
        size: 50,
      },
      {
        accessorKey: "code",
        header: ({ column }) => (
          <DataGridColumnHeader column={column} title={tPriceList("product_code")} />
        ),
        cell: ({ row }) => (
          <Badge variant="outline" className="font-mono">
            {row.original.code}
          </Badge>
        ),
        size: 150,
      },
      {
        accessorKey: "name",
        header: ({ column }) => (
          <DataGridColumnHeader column={column} title={tPriceList("product_name")} />
        ),
        cell: ({ row }) => <span className="font-medium">{row.original.name}</span>,
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

          return (
            <div className="flex items-center justify-end gap-1">
              {isPositive && <TrendingUp className="h-3.5 w-3.5 text-green-600" />}
              {isNegative && <TrendingDown className="h-3.5 w-3.5 text-red-600" />}
              <span
                className={`text-sm font-medium ${isPositive ? "text-green-600" : isNegative ? "text-red-600" : "text-muted-foreground"}`}
              >
                {change > 0 ? "+" : ""}
                {change.toFixed(2)}%
              </span>
            </div>
          );
        },
        size: 120,
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

  // Loading skeleton
  if (!initialData) {
    return (
      <div className="space-y-4 mx-auto max-w-3xl">
        <div className="flex items-center justify-between">
          <Skeleton className="h-5 w-48" />
          <Skeleton className="h-8 w-20" />
        </div>
        <Card>
          <CardHeader className="pb-4">
            <div className="flex items-center gap-3">
              <Skeleton className="h-10 w-10 rounded-lg" />
              <div className="space-y-2">
                <Skeleton className="h-5 w-32" />
                <Skeleton className="h-4 w-20" />
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="space-y-1">
                  <Skeleton className="h-3 w-20" />
                  <Skeleton className="h-5 w-32" />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
        <Skeleton className="h-[300px] w-full rounded-lg" />
      </div>
    );
  }

  return (
    <div className="space-y-4 mx-auto max-w-3xl">
      {/* Header: Breadcrumb + Edit button */}
      <div className="flex items-center justify-between">
        <PriceListBreadcrumb currentPage={initialData.no || initialData.name} />
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                onClick={onEditMode}
                size="sm"
                variant="outline"
                className="h-8 gap-1.5 hover:bg-primary hover:text-primary-foreground transition-all"
              >
                <SquarePen className="w-4 h-4" />
                {tCommon("edit")}
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>{tCommon("edit")}</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>

      {/* Main Card */}
      <Card className="overflow-hidden">
        <CardHeader className="bg-muted/30 pb-4">
          <PriceListCardHeader
            name={initialData.name}
            no={initialData.no}
            lastUpdate={initialData.lastUpdate}
            status={initialData.status}
            dateFormat={dateFormat}
          />
        </CardHeader>
        <CardContent className="pt-6">
          <dl className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-4">
            {/* Vendor */}
            <div className="space-y-1">
              <dt className="text-xs font-medium text-muted-foreground uppercase tracking-wide flex items-center gap-1">
                <Building2 className="h-3 w-3" />
                {tPriceList("vendor")}
              </dt>
              <dd className="text-sm font-medium">{initialData.vender?.name || "-"}</dd>
            </div>

            {/* Currency */}
            <div className="space-y-1">
              <dt className="text-xs font-medium text-muted-foreground uppercase tracking-wide flex items-center gap-1">
                <Coins className="h-3 w-3" />
                {tPriceList("currency")}
              </dt>
              <dd className="text-sm font-medium">{initialData.currency?.name || "-"}</dd>
            </div>

            {/* Effective Period */}
            <div className="space-y-1">
              <dt className="text-xs font-medium text-muted-foreground uppercase tracking-wide flex items-center gap-1">
                <Calendar className="h-3 w-3" />
                {tPriceList("effective_period")}
              </dt>
              <dd className="text-sm">
                {(() => {
                  const period = initialData.effectivePeriod;
                  if (!period) return "-";

                  // Case: string format "date1 - date2"
                  if (typeof period === "string") {
                    const parts = period.split(" - ");
                    if (parts.length === 2) {
                      return `${formatDate(new Date(parts[0]), dateFormat || "yyyy-MM-dd")} - ${formatDate(new Date(parts[1]), dateFormat || "yyyy-MM-dd")}`;
                    }
                    return period;
                  }

                  // Case: array [date1, date2]
                  if (Array.isArray(period) && period.length === 2) {
                    return `${formatDate(new Date(period[0]), dateFormat || "yyyy-MM-dd")} - ${formatDate(new Date(period[1]), dateFormat || "yyyy-MM-dd")}`;
                  }

                  // Case: object { from, to }
                  if (period.from && period.to) {
                    return `${formatDate(new Date(period.from), dateFormat || "yyyy-MM-dd")} - ${formatDate(new Date(period.to), dateFormat || "yyyy-MM-dd")}`;
                  }

                  return "-";
                })()}
              </dd>
            </div>

            {/* RFP */}
            <div className="space-y-1">
              <dt className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                {tPriceList("rfp")}
              </dt>
              <dd className="text-sm">{initialData.rfp?.name || "-"}</dd>
            </div>

            {/* Description - Full width */}
            <div className="space-y-1 sm:col-span-2">
              <dt className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                {tHeader("description")}
              </dt>
              <dd className="text-sm text-muted-foreground">{initialData.description || "-"}</dd>
            </div>

            {/* Note - Full width */}
            {initialData.note && (
              <div className="space-y-1 sm:col-span-2">
                <dt className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                  {tCommon("note")}
                </dt>
                <dd className="text-sm text-muted-foreground">{initialData.note}</dd>
              </div>
            )}
          </dl>
        </CardContent>
      </Card>

      {/* Products Section */}
      <Card>
        <CardHeader className="pb-3">
          <ProductsCardHeader count={productsCount} />
        </CardHeader>
        <CardContent className="pt-0">
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
                <ScrollArea className="max-h-[400px]">
                  <DataGridTable />
                  <ScrollBar orientation="horizontal" />
                </ScrollArea>
              </DataGridContainer>
            </DataGrid>
          ) : (
            <div className="flex flex-col items-center justify-center py-12 text-center border-2 border-dashed rounded-lg">
              <Package className="h-10 w-10 text-muted-foreground/40 mb-3" />
              <h3 className="text-sm font-medium mb-1">{tPriceList("no_products")}</h3>
              <p className="text-xs text-muted-foreground max-w-sm">
                {tPriceList("no_products_description")}
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
