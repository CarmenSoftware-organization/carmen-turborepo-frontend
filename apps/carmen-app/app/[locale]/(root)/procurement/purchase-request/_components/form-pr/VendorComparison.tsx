"use client";

import { useMemo, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { ProductPriceListCompareDto } from "@/dtos/price-list.dto";
import { mockProductPriceListCompare } from "@/mock-data/priceList";
import { Button } from "@/components/ui/button";
import { formatDate } from "@/utils/format/date";
import { useAuth } from "@/context/AuthContext";
import { Card } from "@/components/ui/card";
import { Clock10, Star } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useTranslations } from "next-intl";
import { DataGrid, DataGridContainer } from "@/components/ui/data-grid";
import { DataGridTable } from "@/components/ui/data-grid-table";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { createColumnHelper, getCoreRowModel, useReactTable } from "@tanstack/react-table";
import { Checkbox } from "@/components/ui/checkbox";

interface Props {
  req_qty: number;
  req_unit: string;
  apv_qty: number;
  apv_unit: string;
  pricelist_detail_id?: string;
  itemId: string;
  onItemUpdate: (
    itemId: string,
    fieldName: string,
    value: unknown,
    selectedProduct?: unknown
  ) => void;
}

const columnHelper = createColumnHelper<ProductPriceListCompareDto>();

export default function VendorComparison({
  req_qty,
  req_unit,
  apv_qty,
  apv_unit,
  itemId,
  onItemUpdate,
}: Props) {
  const { dateFormat } = useAuth();
  const tPr = useTranslations("PurchaseRequest");
  const [selectedVendorId, setSelectedVendorId] = useState<string | null>(null);
  const [isOpen, setIsOpen] = useState(false);

  const columns = useMemo(
    () => [
      columnHelper.display({
        id: "select",
        header: () => null,
        cell: ({ row }) => (
          <Checkbox
            checked={selectedVendorId === row.original.pricelist_detail_id}
            onCheckedChange={() => setSelectedVendorId(row.original.pricelist_detail_id)}
          />
        ),
        size: 40,
      }),
      columnHelper.accessor("vendor_name", {
        header: "Vendor",
        cell: ({ getValue }) => <span className="font-medium">{getValue()}</span>,
        size: 200,
      }),
      columnHelper.accessor("is_prefer", {
        header: "Preferred",
        cell: ({ getValue }) => <span>{getValue() ? "Yes" : "No"}</span>,
        size: 80,
      }),
      columnHelper.accessor("rating", {
        header: "Rating",
        cell: ({ getValue }) => (
          <div className="flex items-center gap-1">
            <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
            <span>{getValue()}</span>
          </div>
        ),
        size: 80,
      }),
      columnHelper.display({
        id: "description",
        header: "Description",
        cell: ({ row }) => (
          <div className="flex flex-col max-w-[200px]">
            <p className="truncate text-sm font-medium">{row.original.pricelist_name}</p>
            <p className="truncate text-xs text-muted-foreground">
              {row.original.pricelist_description}
            </p>
          </div>
        ),
        size: 200,
      }),
      columnHelper.accessor("pricelist_no", {
        header: "Pricelist #",
        cell: ({ getValue }) => getValue(),
        size: 120,
      }),
      columnHelper.display({
        id: "valid_period",
        header: () => <div className="text-center">Valid Period</div>,
        cell: ({ row }) => (
          <div className="flex flex-col items-center text-xs">
            <span>{formatDate(row.original.valid_from, dateFormat || "yyyy-MM-dd")}</span>
            <span className="text-muted-foreground">to</span>
            <span>{formatDate(row.original.valid_to, dateFormat || "yyyy-MM-dd")}</span>
          </div>
        ),
        size: 120,
        meta: {
          cellClassName: "text-center",
        },
      }),
      columnHelper.accessor("currency_code", {
        header: () => <div className="text-center">Currency</div>,
        cell: ({ getValue }) => <div className="text-center">{getValue()}</div>,
        size: 80,
      }),
      columnHelper.accessor("pricelist_price", {
        header: () => <div className="text-right">Unit Price</div>,
        cell: ({ getValue }) => <div className="text-right">{getValue().toFixed(2)}</div>,
        size: 120,
      }),
    ],
    [selectedVendorId, dateFormat]
  );

  const table = useReactTable<ProductPriceListCompareDto>({
    data: mockProductPriceListCompare,
    columns,
    getCoreRowModel: getCoreRowModel(),
    debugTable: true, // เพิ่มเพื่อ debug
  });
  const handleSelectVendor = () => {
    if (selectedVendorId) {
      const selectedItem = mockProductPriceListCompare.find(
        (item) => item.pricelist_detail_id === selectedVendorId
      );
      if (selectedItem) {
        onItemUpdate(itemId, "pricelist_detail_id", selectedItem.pricelist_detail_id);
        onItemUpdate(itemId, "vendor_id", selectedItem.vendor_id);
        onItemUpdate(itemId, "vendor_name", selectedItem.vendor_name);
        onItemUpdate(itemId, "pricelist_no", selectedItem.pricelist_no);
        onItemUpdate(itemId, "pricelist_unit", selectedItem.pricelist_unit);
        onItemUpdate(itemId, "pricelist_price", selectedItem.pricelist_price);
        onItemUpdate(itemId, "discount_amount", selectedItem.discount_amount);
        onItemUpdate(itemId, "currency_id", selectedItem.currency_id);
        onItemUpdate(itemId, "currency_name", selectedItem.currency_name);
        onItemUpdate(itemId, "currency_code", selectedItem.currency_code);
        onItemUpdate(itemId, "exchange_rate_date", selectedItem.exchange_rate_date);
        onItemUpdate(itemId, "tax_rate", selectedItem.tax_rate);
        onItemUpdate(itemId, "tax_profile_id", selectedItem.tax_profile_id);
        onItemUpdate(itemId, "tax_profile_name", selectedItem.tax_profile_name);

        // Calculate prices
        const qty = apv_qty > 0 ? apv_qty : req_qty;
        const price = selectedItem.pricelist_price || 0;
        const discount = selectedItem.discount_amount || 0;
        const subTotal = qty * price;
        const discountRate = subTotal > 0 ? (discount / subTotal) * 100 : 0;
        const netAmount = Math.max(0, subTotal - discount);
        const taxRate = selectedItem.tax_rate || 0;
        const taxAmount = netAmount * (taxRate / 100);
        const totalPrice = netAmount + taxAmount;

        onItemUpdate(itemId, "sub_total_price", subTotal);
        onItemUpdate(itemId, "discount_rate", discountRate);
        onItemUpdate(itemId, "net_amount", netAmount);
        onItemUpdate(itemId, "tax_amount", taxAmount);
        onItemUpdate(itemId, "total_price", totalPrice);

        // Update base values (assuming 1:1 for now if no exchange rate logic available here,
        // or we should rely on a separate effect to update base values.
        // But to be safe, let's update them if currency matches or just leave them?
        // If we don't update them, they might be wrong.
        // Let's update them with same values for now, assuming base currency or let the user handle exchange rate later.)
        onItemUpdate(itemId, "base_sub_total_price", subTotal);
        onItemUpdate(itemId, "base_net_amount", netAmount);
        onItemUpdate(itemId, "base_tax_amount", taxAmount);
        onItemUpdate(itemId, "base_total_price", totalPrice);
        onItemUpdate(itemId, "base_price", price);
        onItemUpdate(itemId, "base_discount_amount", discount);
      }
    }
    setSelectedVendorId(null);
    setIsOpen(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger
        className="hover:bg-transparent text-primary hover:text-blue-500 text-xs font-semibold pr-4"
        onClick={() => setIsOpen(true)}
      >
        {tPr("compare")}
      </DialogTrigger>
      <DialogContent className="max-w-7xl">
        <DialogHeader>
          <DialogTitle>Vendor Comparison</DialogTitle>
        </DialogHeader>
        <Card className="p-2 space-y-2">
          <div className="flex items-center justify-between gap-2">
            <div>
              <p className="text-sm font-semibold">Professional Stand Mixer</p>
              <p className="text-xs text-muted-foreground">
                Heavy-duty commercial stand mixer, 20 quart capacity
              </p>
            </div>
            <Badge variant={"outline"}>Active</Badge>
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
        <Card className="p-2 space-y-2">
          <div className="flex items-center gap-2">
            <Clock10 className="w-4 h-4" />
            <p className="text-sm font-semibold">Purchase History</p>
          </div>
          <div className="grid grid-cols-4 gap-2">
            <div className="text-right p-2 border border-border rounded-md">
              <p className="text-xs text-muted-foreground">Last Vendor</p>
              <p className="text-xs font-medium">Seasonal Gourmet Supplies</p>
            </div>
            <div className="text-right p-2 border border-border rounded-md">
              <p className="text-xs text-muted-foreground">Last Purchase Date</p>
              <p className="text-xs font-medium">2025-08-29</p>
            </div>
            <div className="text-right p-2 border border-border rounded-md">
              <p className="text-xs text-muted-foreground">Last Price</p>
              <p className="text-xs font-medium">100,000.00</p>
            </div>
            <div className="text-right p-2 border border-border rounded-md">
              <p className="text-xs text-muted-foreground">Unit</p>
              <p className="text-xs font-medium">KG</p>
            </div>
          </div>
        </Card>

        <DataGrid
          table={table}
          recordCount={mockProductPriceListCompare.length}
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
            <ScrollArea>
              <DataGridTable />
              <ScrollBar orientation="horizontal" />
            </ScrollArea>
          </DataGridContainer>
        </DataGrid>

        <div className="flex justify-end gap-2">
          <Button
            size={"sm"}
            variant="outline"
            onClick={() => {
              setSelectedVendorId(null);
              setIsOpen(false);
            }}
          >
            Cancel
          </Button>
          <Button size={"sm"} onClick={handleSelectVendor} disabled={!selectedVendorId}>
            Select This Vendor
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
