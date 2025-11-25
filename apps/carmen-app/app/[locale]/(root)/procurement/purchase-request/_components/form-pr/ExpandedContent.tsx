import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { PurchaseRequestDetail } from "@/dtos/purchase-request.dto";
import { useTranslations } from "next-intl";
import { formatPrice } from "@/utils/format/currency";
import VendorComparison from "./VendorComparison";
import InventoryInfo from "./InventoryInfo";
import InventoryProgress from "./InventoryProgress";
import PrLabelItem from "./PrLabelItem";
import NumberInput from "@/components/form-custom/NumberInput";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const mockVendors = [
  { id: "007e666b-98ac-4d81-a93e-fff701239b7f", name: "PAWINEE KHAKHO CO.,LTD." },
  { id: "031c1bda-fa8f-40b0-aa7e-01b2b903a53d", name: "เอทีวี ซีวิว ออน ทัวร์" },
  { id: "071a2e74-9a3f-46fd-b09d-aa5f9bf26f7c", name: "KINGART ADVERTISING CO.,LTD." },
];

import { mockTaxProfileList } from "@/mock-data/priceList";

interface ExpandedContentProps {
  item: PurchaseRequestDetail;
  getItemValue: (item: PurchaseRequestDetail, fieldName: string) => unknown;
  onItemUpdate: (
    itemId: string,
    fieldName: string,
    value: unknown,
    selectedProduct?: unknown
  ) => void;
  currencyBase: string;
  token: string;
  buCode: string;
  prStatus?: string;
}

export default function ExpandedContent({
  item,
  getItemValue,
  onItemUpdate,
  currencyBase,
  token,
  buCode,
  prStatus,
}: ExpandedContentProps) {
  const tPr = useTranslations("PurchaseRequest");

  const defaultAmount = { locales: "en-US", minimumFractionDigits: 2 };

  return (
    <Card className="m-2 rounded-md">
      {prStatus === "in_progress" && (
        <Accordion type="single" collapsible defaultValue="item-1">
          <AccordionItem value="item-1">
            <div className="flex items-center justify-between border-b border-border">
              <AccordionTrigger iconPosition="left" className="px-2">
                <h4 className="font-semibold text-xs text-muted-foreground">
                  {tPr("vendor_and_price_info")}
                </h4>
              </AccordionTrigger>
              <VendorComparison
                req_qty={item.requested_qty}
                req_unit={item.requested_unit_name ?? "-"}
                apv_qty={item.approved_qty}
                apv_unit={item.approved_unit_name ?? "-"}
                pricelist_detail_id={item.pricelist_detail_id ?? ""}
                itemId={item.id}
                onItemUpdate={onItemUpdate}
              />
            </div>
            <AccordionContent className="flex flex-col gap-2 border-l-4 border-sky-100 mx-3 my-1 -mt-px">
              <div className="grid grid-cols-1 md:grid-cols-2 border-t border-border mx-4 pt-2 -mt-px">
                <div>
                  <Label className="text-muted-foreground/80 text-xs">{tPr("vendor")}</Label>
                  <Select
                    value={(getItemValue(item, "vendor_id") as string) || ""}
                    onValueChange={(value) => {
                      const selectedVendor = mockVendors.find((v) => v.id === value);
                      if (selectedVendor) {
                        onItemUpdate(item.id, "vendor_id", selectedVendor.id);
                        onItemUpdate(item.id, "vendor_name", selectedVendor.name);
                      }
                    }}
                  >
                    <SelectTrigger className="h-7 text-xs max-w-[300px]">
                      <SelectValue placeholder="Select Vendor" />
                    </SelectTrigger>
                    <SelectContent>
                      {mockVendors.map((vendor) => (
                        <SelectItem key={vendor.id} value={vendor.id} className="text-xs">
                          {vendor.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <PrLabelItem
                  label={tPr("pricelist")}
                  value={(getItemValue(item, "pricelist_no") as string) ?? "-"}
                />
              </div>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-1 px-2">
                <div className="space-y-1 text-right">
                  <Label className="text-muted-foreground/80 text-xs">{tPr("unit_price")}</Label>
                  <NumberInput
                    value={Number(getItemValue(item, "pricelist_price")) || 0}
                    onChange={(value) => {
                      const newPrice = Number(value);
                      onItemUpdate(item.id, "pricelist_price", newPrice);
                      onItemUpdate(item.id, "base_price", newPrice);

                      // Recalculate everything
                      const qty =
                        (getItemValue(item, "approved_qty") as number) > 0
                          ? (getItemValue(item, "approved_qty") as number)
                          : (getItemValue(item, "requested_qty") as number);

                      const subTotal = qty * newPrice;
                      const discount = Number(getItemValue(item, "discount_amount") || 0);
                      const discountRate = subTotal > 0 ? (discount / subTotal) * 100 : 0;
                      const netAmount = Math.max(0, subTotal - discount);
                      const taxRate = Number(getItemValue(item, "tax_rate") || 0);
                      const taxAmount = netAmount * (taxRate / 100);
                      const totalPrice = netAmount + taxAmount;

                      onItemUpdate(item.id, "sub_total_price", subTotal);
                      onItemUpdate(item.id, "base_sub_total_price", subTotal);
                      onItemUpdate(item.id, "discount_rate", discountRate);
                      onItemUpdate(item.id, "net_amount", netAmount);
                      onItemUpdate(item.id, "base_net_amount", netAmount);
                      onItemUpdate(item.id, "tax_amount", taxAmount);
                      onItemUpdate(item.id, "base_tax_amount", taxAmount);
                      onItemUpdate(item.id, "total_price", totalPrice);
                      onItemUpdate(item.id, "base_total_price", totalPrice);
                    }}
                    classNames="h-7 text-xs w-full text-right bg-background"
                  />
                </div>
                <PrLabelItem
                  label={tPr("sub_total")}
                  value={Number(
                    getItemValue(item, "base_sub_total_price") ?? item.base_sub_total_price
                  ).toFixed(2)}
                  position="text-right"
                />
                <div className="space-y-1 text-right">
                  <Label className="text-muted-foreground/80 text-xs">{tPr("discount")}</Label>
                  <NumberInput
                    value={Number(getItemValue(item, "discount_amount")) || 0}
                    onChange={(value) => {
                      const newDiscount = Number(value);
                      onItemUpdate(item.id, "discount_amount", newDiscount);
                      onItemUpdate(item.id, "base_discount_amount", newDiscount);

                      // Recalculate everything
                      const qty =
                        (getItemValue(item, "approved_qty") as number) > 0
                          ? (getItemValue(item, "approved_qty") as number)
                          : (getItemValue(item, "requested_qty") as number);
                      const price = Number(getItemValue(item, "pricelist_price") || 0);
                      const subTotal = qty * price;

                      const discountRate = subTotal > 0 ? (newDiscount / subTotal) * 100 : 0;
                      const netAmount = Math.max(0, subTotal - newDiscount);
                      const taxRate = Number(getItemValue(item, "tax_rate") || 0);
                      const taxAmount = netAmount * (taxRate / 100);
                      const totalPrice = netAmount + taxAmount;

                      onItemUpdate(item.id, "discount_rate", discountRate);
                      onItemUpdate(item.id, "net_amount", netAmount);
                      onItemUpdate(item.id, "base_net_amount", netAmount);
                      onItemUpdate(item.id, "tax_amount", taxAmount);
                      onItemUpdate(item.id, "base_tax_amount", taxAmount);
                      onItemUpdate(item.id, "total_price", totalPrice);
                      onItemUpdate(item.id, "base_total_price", totalPrice);
                    }}
                    classNames="h-7 text-xs w-full text-right bg-background"
                  />
                </div>
                <PrLabelItem
                  label={tPr("net_amount")}
                  value={Number(getItemValue(item, "net_amount") ?? item.net_amount).toFixed(2)}
                  position="text-right"
                />
                <div className="text-right">
                  <Label className="text-muted-foreground/80 text-xs">{tPr("tax")}</Label>
                  <Select
                    value={(getItemValue(item, "tax_profile_id") as string) || ""}
                    onValueChange={(value) => {
                      const selectedTax = mockTaxProfileList.find((t) => t.id === value);
                      if (selectedTax) {
                        onItemUpdate(item.id, "tax_profile_id", selectedTax.id);
                        onItemUpdate(item.id, "tax_profile_name", selectedTax.name);
                        onItemUpdate(item.id, "tax_rate", selectedTax.tax_rate);

                        // Recalculate prices
                        const netAmount = Number(getItemValue(item, "net_amount") || 0);
                        const taxRate = selectedTax.tax_rate || 0;
                        const taxAmount = netAmount * (taxRate / 100);
                        const totalPrice = netAmount + taxAmount;

                        onItemUpdate(item.id, "tax_amount", taxAmount);
                        onItemUpdate(item.id, "total_price", totalPrice);
                        onItemUpdate(item.id, "base_tax_amount", taxAmount);
                        onItemUpdate(item.id, "base_total_price", totalPrice);
                      }
                    }}
                  >
                    <SelectTrigger className="h-7 text-xs w-20 text-right justify-end">
                      <SelectValue placeholder="Select Tax" />
                    </SelectTrigger>
                    <SelectContent>
                      {mockTaxProfileList.map((tax) => (
                        <SelectItem key={tax.id} value={tax.id} className="text-xs">
                          {tax.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-1 text-right">
                  <Label className="text-muted-foreground/80 text-xs">{tPr("total")}</Label>
                  <p className="font-bold text-sm text-active">
                    {Number(getItemValue(item, "total_price") ?? item.total_price).toFixed(2)}
                  </p>
                </div>
              </div>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      )}

      <Accordion type="single" collapsible>
        <AccordionItem value="item-2">
          <AccordionTrigger iconPosition="left" className="px-2">
            <h4 className="font-bold text-xs text-muted-foreground">{tPr("inventory_info")}</h4>
          </AccordionTrigger>
          <AccordionContent className="space-y-1 flex flex-col gap-2 border-l-4 border-green-100 mx-3 my-1 -mt-px">
            <InventoryInfo item={item} token={token} buCode={buCode} />
            <InventoryProgress item={item} token={token} buCode={buCode} />
          </AccordionContent>
        </AccordionItem>
      </Accordion>

      {item.dimension?.length > 0 && (
        <Accordion type="single" collapsible>
          <AccordionItem value="item-3">
            <AccordionTrigger iconPosition="left" className="px-2">
              <h4 className="font-bold text-sm text-muted-foreground">
                {tPr("business_dimensions")}
              </h4>
            </AccordionTrigger>
            <AccordionContent className="flex flex-col gap-2  border-l-4 border-purple-100 mx-3 my-1 -mt-px">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-2 px-2">
                {item.dimension?.map((dimension: unknown) => {
                  if (
                    typeof dimension === "object" &&
                    dimension !== null &&
                    "key" in dimension &&
                    "label" in dimension &&
                    "value" in dimension
                  ) {
                    const dim = dimension as {
                      key: string | number;
                      label: string;
                      value: string | number;
                    };
                    return (
                      <div key={dim.key}>
                        <div className="space-y-1 text-right">
                          <Label className="text-muted-foreground text-xs">{dim.label}</Label>
                          <p className="text-sm font-semibold">{dim.value}</p>
                        </div>
                      </div>
                    );
                  }
                  return null;
                })}
              </div>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      )}
    </Card>
  );
}
