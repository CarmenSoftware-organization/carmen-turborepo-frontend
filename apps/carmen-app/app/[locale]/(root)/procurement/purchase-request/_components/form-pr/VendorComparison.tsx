"use client";

import { useMemo, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { formatPrice } from "@/utils/format/currency";
import { useAuth } from "@/context/AuthContext";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { DataGrid, DataGridContainer } from "@/components/ui/data-grid";
import { DataGridTable } from "@/components/ui/data-grid-table";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { createColumnHelper, getCoreRowModel, useReactTable } from "@tanstack/react-table";
import { Checkbox } from "@/components/ui/checkbox";
import { usePriceList } from "@/hooks/use-price-list";
import { Loader2 } from "lucide-react";

interface Props {
  req_qty: number;
  req_unit: string;
  apv_qty: number;
  apv_unit: string;
  itemId: string;
  productId?: string;
  productName?: string;
  bu_code?: string;
  onItemUpdate: (
    itemId: string,
    fieldName: string,
    value: unknown,
    selectedProduct?: unknown
  ) => void;
}

interface PriceListCompareRow {
  pricelist_id: string;
  pricelist_no: string;
  pricelist_name: string;
  pricelist_status: string;
  pricelist_description?: string;
  vendor_id: string;
  vendor_name: string;
  currency_id: string;
  currency_name: string;
  detail_id: string;
  product_id: string;
  product_name: string;
  moq_qty: number;
  unit_id: string;
  unit_name: string | null;
  lead_time_days: number;
  price: number;
  price_without_tax: number;
  tax_amt: number;
  tax_profile_id: string;
  tax_profile_name: string;
  tax_rate: number;
}

const columnHelper = createColumnHelper<PriceListCompareRow>();

export default function VendorComparison({
  req_qty,
  req_unit,
  apv_qty,
  apv_unit,
  itemId,
  productId,
  productName,
  bu_code,
  onItemUpdate,
}: Props) {
  const { token, buCode, currencyBase } = useAuth();
  const currentBuCode = bu_code ?? buCode;
  const { data: priceLists, isLoading } = usePriceList(token, currentBuCode);

  const [selectedDetailId, setSelectedDetailId] = useState<string | null>(null);
  const [isOpen, setIsOpen] = useState(false);

  // Transform price list data to comparison rows filtered by productId
  const comparisonData: PriceListCompareRow[] = useMemo(() => {
    if (!priceLists?.data) return [];

    const rows: PriceListCompareRow[] = [];

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    priceLists.data.forEach((priceList: any) => {
      const details = priceList.pricelist_detail || [];

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      details.forEach((detail: any) => {
        // Filter by productId if provided
        if (productId && detail.product_id !== productId) return;

        rows.push({
          pricelist_id: priceList.id,
          pricelist_no: priceList.no,
          pricelist_name: priceList.name,
          pricelist_status: priceList.status,
          pricelist_description: priceList.description,
          vendor_id: priceList.vender?.id || "",
          vendor_name: priceList.vender?.name || "",
          currency_id: priceList.currency?.id || "",
          currency_name: priceList.currency?.name || "",
          detail_id: detail.id,
          product_id: detail.product_id,
          product_name: detail.product_name || "",
          moq_qty: detail.moq_qty || 0,
          unit_id: detail.unit_id || "",
          unit_name: detail.unit_name,
          lead_time_days: detail.lead_time_days || 0,
          price: detail.price || 0,
          price_without_tax: detail.price_without_tax || 0,
          tax_amt: detail.tax_amt || 0,
          tax_profile_id: detail.tax_profile?.id || "",
          tax_profile_name: detail.tax_profile?.name || "",
          tax_rate: detail.tax_profile?.rate || 0,
        });
      });
    });

    return rows;
  }, [priceLists, productId]);

  const columns = useMemo(
    () => [
      columnHelper.display({
        id: "select",
        header: () => null,
        cell: ({ row }) => (
          <Checkbox
            checked={selectedDetailId === row.original.detail_id}
            onCheckedChange={() => setSelectedDetailId(row.original.detail_id)}
          />
        ),
        size: 40,
      }),
      columnHelper.accessor("vendor_name", {
        header: "Vendor",
        cell: ({ getValue }) => <span className="font-medium">{getValue()}</span>,
        size: 180,
      }),
      columnHelper.display({
        id: "pricelist_info",
        header: "Price List",
        cell: ({ row }) => (
          <div className="flex flex-col max-w-[200px]">
            <p className="truncate text-sm font-medium">{row.original.pricelist_name}</p>
            <p className="truncate text-xs text-muted-foreground">{row.original.pricelist_no}</p>
          </div>
        ),
        size: 180,
      }),
      columnHelper.accessor("pricelist_status", {
        header: "Status",
        cell: ({ getValue }) => {
          const status = getValue();
          const variant = status === "active" ? "active" : "inactive";
          return <Badge variant={variant}>{status}</Badge>;
        },
        size: 100,
      }),
      columnHelper.accessor("moq_qty", {
        header: "MOQ",
        cell: ({ row }) => (
          <div className="text-center">
            {row.original.moq_qty} {row.original.unit_name || ""}
          </div>
        ),
        size: 100,
        meta: {
          cellClassName: "text-center",
          headerClassName: "text-center",
        },
      }),
      columnHelper.accessor("lead_time_days", {
        header: "Lead Time",
        cell: ({ getValue }) => <div className="text-center">{getValue()} days</div>,
        size: 100,
        meta: {
          cellClassName: "text-center",
          headerClassName: "text-center",
        },
      }),
      columnHelper.accessor("currency_name", {
        header: "Currency",
        cell: ({ getValue }) => <div className="text-center">{getValue()}</div>,
        size: 100,
        meta: {
          cellClassName: "text-center",
          headerClassName: "text-center",
        },
      }),
      columnHelper.accessor("price", {
        header: "Unit Price",
        cell: ({ row }) => (
          <div className="text-right font-medium">
            {formatPrice(row.original.price, currencyBase || "THB")}
          </div>
        ),
        size: 120,
        meta: {
          cellClassName: "text-right",
          headerClassName: "text-right",
        },
      }),
      columnHelper.accessor("tax_profile_name", {
        header: "Tax",
        cell: ({ getValue }) => <div className="text-center">{getValue() || "-"}</div>,
        size: 100,
        meta: {
          cellClassName: "text-center",
          headerClassName: "text-center",
        },
      }),
    ],
    [selectedDetailId, currencyBase]
  );

  const table = useReactTable<PriceListCompareRow>({
    data: comparisonData,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });
  const handleSelectVendor = () => {
    if (selectedDetailId) {
      const selectedItem = comparisonData.find((item) => item.detail_id === selectedDetailId);

      if (selectedItem) {
        onItemUpdate(itemId, "vendor_id", selectedItem.vendor_id);
        onItemUpdate(itemId, "vendor_name", selectedItem.vendor_name);
        onItemUpdate(itemId, "pricelist_detail_id", selectedItem.detail_id);
        onItemUpdate(itemId, "pricelist_id", selectedItem.pricelist_id);
        onItemUpdate(itemId, "pricelist_no", selectedItem.pricelist_no);
        onItemUpdate(itemId, "pricelist_unit", selectedItem.unit_id);
        onItemUpdate(itemId, "pricelist_price", selectedItem.price);
        onItemUpdate(itemId, "currency_id", selectedItem.currency_id);
        onItemUpdate(itemId, "currency_name", selectedItem.currency_name);
        onItemUpdate(itemId, "tax_rate", selectedItem.tax_rate);
        onItemUpdate(itemId, "tax_profile_id", selectedItem.tax_profile_id);
        onItemUpdate(itemId, "tax_profile_name", selectedItem.tax_profile_name);

        // Calculate prices
        const qty = apv_qty > 0 ? apv_qty : req_qty;
        const price = selectedItem.price || 0;
        const subTotal = qty * price;
        const taxRate = selectedItem.tax_rate || 0;
        const taxAmount = subTotal * (taxRate / 100);
        const totalPrice = subTotal + taxAmount;

        onItemUpdate(itemId, "sub_total_price", subTotal);
        onItemUpdate(itemId, "tax_amount", taxAmount);
        onItemUpdate(itemId, "total_price", totalPrice);

        // Update base values
        onItemUpdate(itemId, "base_sub_total_price", subTotal);
        onItemUpdate(itemId, "base_tax_amount", taxAmount);
        onItemUpdate(itemId, "base_total_price", totalPrice);
        onItemUpdate(itemId, "base_price", price);
      }
    }
    setSelectedDetailId(null);
    setIsOpen(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger
        className="hover:bg-transparent text-primary hover:text-blue-500 text-xs font-semibold pr-4"
        onClick={() => setIsOpen(true)}
      >
        Compare
      </DialogTrigger>
      <DialogContent className="max-w-5xl">
        <DialogHeader>
          <DialogTitle>Vendor Comparison</DialogTitle>
        </DialogHeader>

        {/* Product Info Card */}
        <Card className="p-3 space-y-2">
          <div className="flex items-center justify-between gap-2">
            <div>
              <p className="text-sm font-semibold">{productName || "Select product first"}</p>
              {productId && <p className="text-xs text-muted-foreground">ID: {productId}</p>}
            </div>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <div className="text-right p-2 border border-border rounded-md">
              <p className="text-xs text-muted-foreground">Requested</p>
              <p className="text-xs font-medium">
                {req_qty} {req_unit}
              </p>
            </div>
            <div className="text-right p-2 border border-border rounded-md">
              <p className="text-xs text-muted-foreground">Approved</p>
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
            <span className="ml-2 text-sm text-muted-foreground">Loading...</span>
          </div>
        )}

        {!isLoading && comparisonData.length === 0 && (
          <div className="flex flex-col items-center justify-center py-8 text-center border-2 border-dashed rounded-lg">
            <p className="text-sm text-muted-foreground">No price list found</p>
          </div>
        )}

        {!isLoading && comparisonData.length > 0 && (
          <DataGrid
            table={table}
            recordCount={comparisonData.length}
            tableLayout={{
              dense: true,
              headerBorder: true,
              rowBorder: true,
              cellBorder: true,
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

        <div className="flex justify-end gap-2">
          <Button
            size="sm"
            variant="outline"
            onClick={() => {
              setSelectedDetailId(null);
              setIsOpen(false);
            }}
          >
            Cancel
          </Button>
          <Button size="sm" onClick={handleSelectVendor} disabled={!selectedDetailId}>
            Select Vendor
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
