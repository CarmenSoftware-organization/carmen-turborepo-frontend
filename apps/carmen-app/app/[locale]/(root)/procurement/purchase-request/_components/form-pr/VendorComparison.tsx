"use client";

import { useCallback, useMemo, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/AuthContext";
import { Card } from "@/components/ui/card";
import { DataGrid, DataGridContainer } from "@/components/ui/data-grid";
import { DataGridTable } from "@/components/ui/data-grid-table";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { ColumnDef, getCoreRowModel, useReactTable } from "@tanstack/react-table";
import { AlertCircle, Loader2 } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { formatDate } from "@/utils/format";
import { useTranslations } from "next-intl";
import { usePriceCompareQuery } from "@/hooks/use-bidding";

interface Props {
  req_qty: number;
  req_unit: string;
  apv_qty: number;
  apv_unit: string;
  itemId: string;
  productId?: string;
  productName?: string;
  unitId?: string;
  currencyId?: string;
  bu_code?: string;
  token: string;
  onItemUpdate: (
    itemId: string,
    fieldName: string,
    value: unknown,
    selectedProduct?: unknown
  ) => void;
}

interface PriceCompareItem {
  product_id: string;
  product_name: string | null;
  unit_id: string;
  unit_name: string | null;
  price: number;
  currency: string;
  base_price: number;
  base_currency: string;
  pricelist_detail_id: string;
  exchange_rate: number;
  pricelist_no: string;
  is_preferred: boolean;
  vendor_id: string;
  vendor_name: string;
  effective_date: {
    from: string;
    to: string;
  };
}

export default function VendorComparison({
  req_qty,
  req_unit,
  apv_qty,
  apv_unit,
  itemId,
  productId,
  productName,
  unitId,
  currencyId,
  bu_code,
  onItemUpdate,
  token,
}: Props) {
  const { buCode } = useAuth();
  const currentBuCode = bu_code ?? buCode;
  const tPr = useTranslations("PurchaseRequest");
  const [isOpen, setIsOpen] = useState(false);

  const {
    data: priceCompareData,
    isLoading,
    error,
  } = usePriceCompareQuery(
    token || "",
    currentBuCode || "",
    {
      product_id: productId || "",
      unit_id: unitId || "",
      currency_id: currencyId || "",
    },
    isOpen && !!productId && !!unitId && !!currencyId
  );

  const rows: PriceCompareItem[] = useMemo(
    () => (priceCompareData as PriceCompareItem[]) || [],
    [priceCompareData]
  );

  const handleSelectVendor = useCallback(
    (item: PriceCompareItem) => {
      const qty = apv_qty > 0 ? apv_qty : req_qty;
      const price = item.price || 0;
      const subTotal = qty * price;

      const updates: Record<string, unknown> = {
        vendor_id: item.vendor_id,
        vendor_name: item.vendor_name,
        pricelist_detail_id: item.pricelist_detail_id,
        pricelist_no: item.pricelist_no,
        pricelist_unit: item.unit_id,
        pricelist_price: price,
        currency_name: item.currency,
        exchange_rate: item.exchange_rate,
        sub_total_price: subTotal,
        total_price: subTotal,
        base_price: item.base_price,
        base_sub_total_price: qty * (item.base_price || 0),
        base_total_price: qty * (item.base_price || 0),
      };

      Object.entries(updates).forEach(([fieldName, value]) => {
        onItemUpdate(itemId, fieldName, value);
      });

      setIsOpen(false);
    },
    [apv_qty, req_qty, itemId, onItemUpdate]
  );

  const columns: ColumnDef<PriceCompareItem>[] = useMemo(
    () => [
      {
        id: "vendor_name",
        header: () => <span className="text-xs">{tPr("vendor")}</span>,
        cell: ({ row }) => <span className="text-xs">{row.original.vendor_name || "-"}</span>,
        size: 150,
      },
      {
        id: "pricelist_no",
        header: () => <span className="text-xs">{tPr("pricelistNo")}</span>,
        cell: ({ row }) => <span className="text-xs">{row.original.pricelist_no || "-"}</span>,
        size: 120,
      },
      {
        id: "product_name",
        header: () => <span className="text-xs">{tPr("product")}</span>,
        cell: ({ row }) => <span className="text-xs">{row.original.product_name || "-"}</span>,
        size: 150,
      },
      {
        id: "price",
        header: () => <span className="text-xs">{tPr("unit_price")}</span>,
        cell: ({ row }) => <span className="text-xs">{row.original.price || 0}</span>,
        size: 80,
        meta: {
          cellClassName: "text-right",
          headerClassName: "text-right",
        },
      },
      {
        id: "currency",
        header: () => <span className="text-xs">{tPr("currency")}</span>,
        cell: ({ row }) => <span className="text-xs">{row.original.currency || "-"}</span>,
        size: 80,
        meta: {
          cellClassName: "text-center",
          headerClassName: "text-center",
        },
      },
      {
        id: "valid_period",
        header: () => <span className="text-xs">{tPr("valid_period")}</span>,
        cell: ({ row }) => {
          const { from, to } = row.original.effective_date || {};
          const fromStr = from ? formatDate(from, "dd/MM/yyyy") : "-";
          const toStr = to ? formatDate(to, "dd/MM/yyyy") : "-";
          return (
            <span className="text-xs">
              {fromStr} - {toStr}
            </span>
          );
        },
        size: 150,
        meta: {
          cellClassName: "text-center",
          headerClassName: "text-center",
        },
      },
      {
        id: "action",
        header: "",
        cell: ({ row }) => (
          <Button size="sm" className="h-7" onClick={() => handleSelectVendor(row.original)}>
            {tPr("select")}
          </Button>
        ),
        size: 100,
        meta: {
          cellClassName: "text-right",
          headerClassName: "text-right",
        },
      },
    ],
    [handleSelectVendor, tPr]
  );

  const table = useReactTable<PriceCompareItem>({
    data: rows,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger
        className="hover:bg-transparent text-primary hover:text-blue-500 text-xs font-semibold pr-4"
        onClick={() => setIsOpen(true)}
      >
        {tPr("compare")}
      </DialogTrigger>
      <DialogContent className="max-w-6xl">
        <DialogHeader>
          <DialogTitle>{tPr("vendor_comparison")}</DialogTitle>
        </DialogHeader>

        {/* Product Info Card */}
        <Card className="p-3 space-y-2">
          <div className="flex items-center justify-between gap-2">
            <div>
              <p className="text-sm font-semibold">{productName || tPr("select_product_first")}</p>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <div className="text-right p-2 border border-border rounded-md">
              <p className="text-xs text-muted-foreground">{tPr("requested")}</p>
              <p className="text-xs font-medium">
                {req_qty} {req_unit}
              </p>
            </div>
            <div className="text-right p-2 border border-border rounded-md">
              <p className="text-xs text-muted-foreground">{tPr("approved")}</p>
              <p className="text-xs font-medium">
                {apv_qty} {apv_unit}
              </p>
            </div>
          </div>
        </Card>

        {/* Price List Comparison Table */}
        {isLoading && (
          <div className="flex items-center justify-center py-8">
            <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
            <span className="ml-2 text-sm text-muted-foreground">{tPr("loading")}</span>
          </div>
        )}

        {error && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{tPr("error_load_pricelist")}</AlertDescription>
          </Alert>
        )}

        {!isLoading && !error && rows.length === 0 && (
          <div className="flex flex-col items-center justify-center py-8 text-center border-2 border-dashed rounded-lg">
            <p className="text-sm text-muted-foreground">{tPr("no_pricelist_found")}</p>
          </div>
        )}

        {!isLoading && !error && rows.length > 0 && (
          <DataGrid
            table={table}
            recordCount={rows.length}
            tableLayout={{
              dense: true,
              stripped: false,
              headerSticky: false,
            }}
          >
            <DataGridContainer>
              <ScrollArea className="max-h-[400px]">
                <DataGridTable />
                <ScrollBar orientation="horizontal" />
              </ScrollArea>
            </DataGridContainer>
          </DataGrid>
        )}

        <div className="flex justify-end">
          <Button size="sm" variant="outline" onClick={() => setIsOpen(false)}>
            {tPr("cancel")}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
