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
}

export default function ExpandedContent({
  item,
  getItemValue,
  onItemUpdate,
  currencyBase,
  token,
  buCode,
}: ExpandedContentProps) {
  const tPr = useTranslations("PurchaseRequest");

  const defaultAmount = { locales: "en-US", minimumFractionDigits: 2 };

  return (
    <Card className="m-2 rounded-md">
      <Accordion type="single" collapsible defaultValue="vendor-price-list">
        <AccordionItem value="vendor-price-list">
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
              <PrLabelItem
                label={tPr("vendor")}
                value={(getItemValue(item, "vendor_name") as string) ?? "-"}
              />
              <PrLabelItem
                label={tPr("pricelist")}
                value={(getItemValue(item, "pricelist_no") as string) ?? "-"}
              />
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-1 px-2">
              <PrLabelItem
                label={tPr("unit_price")}
                value={formatPrice(
                  Number(getItemValue(item, "pricelist_price")) || item.base_price || 0,
                  currencyBase ?? "THB",
                  defaultAmount.locales,
                  defaultAmount.minimumFractionDigits
                )}
                position="text-right"
              />
              <PrLabelItem
                label={tPr("sub_total")}
                value={Number(
                  getItemValue(item, "base_sub_total_price") ?? item.base_sub_total_price
                ).toFixed(2)}
                position="text-right"
              />
              <PrLabelItem
                label={tPr("discount")}
                value={Number(
                  getItemValue(item, "discount_amount") ?? item.discount_amount ?? 0
                ).toFixed(2)}
                position="text-right"
              />
              <PrLabelItem
                label={tPr("net_amount")}
                value={Number(getItemValue(item, "net_amount") ?? item.net_amount).toFixed(2)}
                position="text-right"
              />
              <PrLabelItem
                label={tPr("tax")}
                value={Number(getItemValue(item, "tax_amount") ?? item.tax_amount ?? 0).toFixed(2)}
                position="text-right"
              />
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
