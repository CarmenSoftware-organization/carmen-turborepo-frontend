"use client";

import { useMemo } from "react";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { SquarePen, Calendar, Building2, Coins, Package } from "lucide-react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Skeleton } from "@/components/ui/skeleton";
import { formatDate } from "@/utils/format/date";
import { useAuth } from "@/context/AuthContext";
import { ColumnDef, getCoreRowModel, useReactTable } from "@tanstack/react-table";
import { DataGrid, DataGridContainer } from "@/components/ui/data-grid";
import { DataGridTable } from "@/components/ui/data-grid-table";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
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

  interface ProductViewItem {
    id: string;
    product_code: string;
    product_name: string;
    unit_name: string;
    tax_profile_name: string;
    moq_qty: number;
  }

  const products: ProductViewItem[] = useMemo(() => {
    return rawProducts.map((p: any) => ({
      id: p.id,
      product_code: p.product_code || p.tb_product?.code || "",
      product_name: p.product_name || p.tb_product?.name || "",
      unit_name: p.unit_name || p.tb_unit?.name || "-",
      tax_profile_name: p.tax_profile_name || p.tb_tax_profile?.name || "-",
      moq_qty: p.moq_qty ?? 0,
    }));
  }, [rawProducts]);

  const productsCount = products.length;

  const columns = useMemo<ColumnDef<ProductViewItem>[]>(
    () => [
      {
        id: "index",
        header: () => <div className="text-center">#</div>,
        cell: ({ row }) => <div className="text-center text-muted-foreground">{row.index + 1}</div>,
        size: 50,
      },
      {
        id: "product",
        header: "Product",
        cell: ({ row }) => (
          <span>
            {row.original.product_code} - {row.original.product_name}
          </span>
        ),
        size: 250,
      },
      {
        accessorKey: "unit_name",
        header: "Unit",
        cell: ({ row }) => <span>{row.original.unit_name}</span>,
        size: 120,
      },
      {
        accessorKey: "tax_profile_name",
        header: "Tax Profile",
        cell: ({ row }) => <span>{row.original.tax_profile_name}</span>,
        size: 150,
      },
      {
        accessorKey: "moq_qty",
        header: "MOQ",
        cell: ({ row }) => <span>{row.original.moq_qty}</span>,
        size: 100,
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

            <div className="space-y-1">
              <dt className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                {tPriceList("rfp")}
              </dt>
              <dd className="text-sm">{initialData.rfp?.name || "-"}</dd>
            </div>

            <div className="space-y-1 sm:col-span-2">
              <dt className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                {tHeader("description")}
              </dt>
              <dd className="text-sm text-muted-foreground">{initialData.description || "-"}</dd>
            </div>

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
