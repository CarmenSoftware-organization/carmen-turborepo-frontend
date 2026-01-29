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
import { usePriceList } from "@/hooks/use-price-list";
import { AlertCircle, Loader2 } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { formatDate } from "@/utils/format";
import { useTranslations } from "next-intl";
import { usePriceCompareQuery } from "@/hooks/use-bidding";

// Format effectivePeriod string (e.g., "Wed Dec 10 2025... - Sat Dec 20 2025...") to "dd/MM/yyyy - dd/MM/yyyy"
const formatEffectivePeriod = (period: string | null | undefined): string => {
  if (!period) return "-";
  const parts = period.split(" - ");
  if (parts.length !== 2) return period;
  const startDate = formatDate(parts[0], "dd/MM/yyyy");
  const endDate = formatDate(parts[1], "dd/MM/yyyy");
  if (startDate === "-" || endDate === "-") return period;
  return `${startDate} - ${endDate}`;
};

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

interface PriceListDetail {
  id: string;
  sequence_no: number;
  moq_qty: number;
  unit_id: string;
  unit_name: string | null;
  lead_time_days: number;
  price_wirhout_tax: number;
  tax_amt: number;
  price: number;
  tax_profile_id: string;
  is_active: boolean;
  note: string | null;
  info: Record<string, unknown>;
  product_id: string;
  product_name: string;
  tax_profile: {
    id: string;
    name: string;
    rate: number;
  } | null;
}

interface PriceListData {
  id: string;
  no: string;
  name: string;
  status: string;
  description: string;
  vendor: {
    id: string;
    name: string;
  } | null;
  currency: {
    id: string;
    name: string;
  } | null;
  effectivePeriod: string;
  note: string;
  pricelist_detail: PriceListDetail[];
}

// Flattened row: 1 row = 1 pricelist_detail
interface FlattenedRow {
  priceList: PriceListData;
  detail: PriceListDetail;
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
  const { data: priceLists, isLoading, error } = usePriceList(token, currentBuCode);
  const tPr = useTranslations("PurchaseRequest");
  const [isOpen, setIsOpen] = useState(false);

  // Fetch price compare when dialog opens
  const {
    data: priceCompareData,
    isLoading: isPriceCompareLoading,
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

  console.log("priceCompareData", priceCompareData);

  const rawData = (priceLists?.data || []) as PriceListData[];

  // Flatten: 1 row = 1 pricelist_detail
  const flattenedData: FlattenedRow[] = useMemo(() => {
    return rawData.flatMap((priceList) =>
      (priceList.pricelist_detail || []).map((detail) => ({
        priceList,
        detail,
      }))
    );
  }, [rawData]);

  const handleSelectVendor = useCallback(
    (row: FlattenedRow) => {
      const { priceList, detail } = row;

      // Calculate prices
      const qty = apv_qty > 0 ? apv_qty : req_qty;
      const price = detail.price || 0;
      const subTotal = qty * price;
      const taxRate = detail.tax_profile?.rate || 0;
      const taxAmount = subTotal * (taxRate / 100);
      const totalPrice = subTotal + taxAmount;

      // Batch all updates
      const updates: Record<string, unknown> = {
        vendor_id: priceList.vendor?.id || "",
        vendor_name: priceList.vendor?.name || "",
        pricelist_detail_id: detail.id,
        pricelist_id: priceList.id,
        pricelist_no: priceList.no,
        pricelist_unit: detail.unit_id,
        pricelist_price: price,
        currency_id: priceList.currency?.id || "",
        currency_name: priceList.currency?.name || "",
        tax_rate: taxRate,
        tax_profile_id: detail.tax_profile?.id || "",
        tax_profile_name: detail.tax_profile?.name || "",
        sub_total_price: subTotal,
        tax_amount: taxAmount,
        total_price: totalPrice,
        base_sub_total_price: subTotal,
        base_tax_amount: taxAmount,
        base_total_price: totalPrice,
        base_price: price,
      };

      Object.entries(updates).forEach(([fieldName, value]) => {
        onItemUpdate(itemId, fieldName, value);
      });

      setIsOpen(false);
    },
    [apv_qty, req_qty, itemId, onItemUpdate]
  );

  const columns: ColumnDef<FlattenedRow>[] = useMemo(
    () => [
      {
        id: "vendor_name",
        header: () => <span className="text-xs">{tPr("vendor")}</span>,
        cell: ({ row }) => (
          <span className="text-xs">{row.original.priceList.vendor?.name || "-"}</span>
        ),
        size: 150,
      },
      {
        id: "pricelist_no",
        header: () => <span className="text-xs">{tPr("pricelistNo")}</span>,
        cell: ({ row }) => <span className="text-xs">{row.original.priceList.no || "-"}</span>,
        size: 120,
      },
      {
        id: "product_name",
        header: () => <span className="text-xs">{tPr("product")}</span>,
        cell: ({ row }) => (
          <span className="text-xs">{row.original.detail.product_name || "-"}</span>
        ),
        size: 150,
      },
      {
        id: "price",
        header: () => <span className="text-xs">{tPr("unit_price")}</span>,
        cell: ({ row }) => (
          <span className="text-xs">
            {row.original.detail.price || 0} {row.original.detail.unit_name || "-"}
          </span>
        ),
        size: 80,
        meta: {
          cellClassName: "text-right",
          headerClassName: "text-right",
        },
      },
      {
        id: "moq_qty",
        header: () => <span className="text-xs">MOQ</span>,
        cell: ({ row }) => <span className="text-xs">{row.original.detail.moq_qty || 0}</span>,
        size: 80,
        meta: {
          cellClassName: "text-center",
          headerClassName: "text-center",
        },
      },
      {
        id: "currency",
        header: () => <span className="text-xs">{tPr("currency")}</span>,
        cell: ({ row }) => (
          <span className="text-xs">{row.original.priceList.currency?.name || "-"}</span>
        ),
        size: 80,
        meta: {
          cellClassName: "text-center",
          headerClassName: "text-center",
        },
      },
      {
        id: "valid_period",
        header: () => <span className="text-xs">{tPr("valid_period")}</span>,
        cell: ({ row }) => (
          <span className="text-xs">
            {formatEffectivePeriod(row.original.priceList.effectivePeriod)}
          </span>
        ),
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

  const table = useReactTable<FlattenedRow>({
    data: flattenedData,
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

        {!isLoading && !error && flattenedData.length === 0 && (
          <div className="flex flex-col items-center justify-center py-8 text-center border-2 border-dashed rounded-lg">
            <p className="text-sm text-muted-foreground">{tPr("no_pricelist_found")}</p>
          </div>
        )}

        {!isLoading && !error && flattenedData.length > 0 && (
          <DataGrid
            table={table}
            recordCount={flattenedData.length}
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
