import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { formType } from "@/dtos/form.dto";
import { PurchaseRequestDetail } from "@/dtos/purchase-request.dto";
import { useTranslations } from "next-intl";
import { formatPrice } from "@/utils/format/currency";
import VendorComparison from "./VendorComparison";
import InventoryInfo from "./InventoryInfo";
import InventoryProgress from "./InventoryProgress";
import PrLabelItem from "./PrLabelItem";
import NumberInput from "@/components/form-custom/NumberInput";
import VendorLookup from "@/components/lookup/LookupVendor";
import LookupTaxProfile from "@/components/lookup/LookupTaxProfile";
import LookupCurrency from "@/components/lookup/LookupCurrency";
import { Checkbox } from "@/components/ui/checkbox";
import { cn } from "@/lib/utils";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { PR_STATUS } from "../../_constants/pr-status";

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
  currentMode: formType;
}

export default function ExpandedContent({
  item,
  getItemValue,
  onItemUpdate,
  currencyBase,
  token,
  buCode,
  prStatus,
  currentMode,
}: ExpandedContentProps) {
  const tPr = useTranslations("PurchaseRequest");

  const defaultAmount = { locales: "en-US", minimumFractionDigits: 2 };

  const recalculateAll = (overrides: Record<string, unknown>) => {
    // Merge current values with overrides
    const getValue = (key: string) => (key in overrides ? overrides[key] : getItemValue(item, key));

    const qty =
      (getValue("approved_qty") as number) > 0
        ? (getValue("approved_qty") as number)
        : (getValue("requested_qty") as number);
    const price = Number(getValue("pricelist_price") || 0);
    const isDiscountAdjustment = Boolean(getValue("is_discount_adjustment"));
    const isTaxAdjustment = Boolean(getValue("is_tax_adjustment"));

    // 1. Calculate Sub Total
    const subTotal = qty * price;

    // 2. Calculate Discount
    let discountAmount = Number(getValue("discount_amount") || 0);
    let discountRate = Number(getValue("discount_rate") || 0);

    if (isDiscountAdjustment) {
      // Input is Amount, Calculate Rate
      discountRate = subTotal > 0 ? (discountAmount / subTotal) * 100 : 0;
    } else {
      // Input is Rate, Calculate Amount
      discountAmount = subTotal * (discountRate / 100);
    }

    // 3. Calculate Net Amount
    const netAmount = Math.max(0, subTotal - discountAmount);

    // 4. Calculate Tax
    let taxAmount = Number(getValue("tax_amount") || 0);
    let taxRate = Number(getValue("tax_rate") || 0);

    if (isTaxAdjustment) {
      // Input is Amount, Calculate Rate
      taxRate = netAmount > 0 ? (taxAmount / netAmount) * 100 : 0;
    } else {
      // Input is Rate, Calculate Amount
      taxAmount = netAmount * (taxRate / 100);
    }

    // 5. Calculate Total
    const totalPrice = netAmount + taxAmount;

    // Update all fields
    // First apply overrides to ensure the input value is set
    Object.entries(overrides).forEach(([key, value]) => {
      onItemUpdate(item.id, key, value);
    });

    // Then update calculated fields
    onItemUpdate(item.id, "base_price", price);
    onItemUpdate(item.id, "sub_total_price", subTotal);
    onItemUpdate(item.id, "base_sub_total_price", subTotal);

    onItemUpdate(item.id, "discount_amount", discountAmount);
    onItemUpdate(item.id, "base_discount_amount", discountAmount);
    onItemUpdate(item.id, "discount_rate", discountRate);

    onItemUpdate(item.id, "net_amount", netAmount);
    onItemUpdate(item.id, "base_net_amount", netAmount);

    onItemUpdate(item.id, "tax_amount", taxAmount);
    onItemUpdate(item.id, "base_tax_amount", taxAmount);
    onItemUpdate(item.id, "tax_rate", taxRate);

    onItemUpdate(item.id, "total_price", totalPrice);
    onItemUpdate(item.id, "base_total_price", totalPrice);
  };

  const isPriceValid = Number(getItemValue(item, "pricelist_price")) > 0;

  return (
    <Card className="m-2 rounded-md">
      {prStatus !== PR_STATUS.DRAFT && (
        <Accordion type="single" collapsible defaultValue="item-1">
          <AccordionItem value="item-1">
            <div className="flex items-center justify-between border-b border-border">
              <AccordionTrigger iconPosition="left" className="px-2">
                <h4 className="font-semibold text-xs text-muted-foreground">
                  {tPr("vendor_and_price_info")}
                </h4>
              </AccordionTrigger>
              {currentMode === formType.EDIT && (
                <VendorComparison
                  req_qty={item.requested_qty}
                  req_unit={item.requested_unit_name ?? "-"}
                  apv_qty={item.approved_qty}
                  apv_unit={item.approved_unit_name ?? "-"}
                  productId={item.product_id}
                  productName={item.product_name}
                  itemId={item.id}
                  bu_code={buCode}
                  onItemUpdate={onItemUpdate}
                />
              )}
            </div>
            <AccordionContent>
              <div className="grid grid-cols-2 gap-4 px-3 py-2">
                <div className="space-y-1.5">
                  <Label className="text-muted-foreground text-xs font-medium">
                    {tPr("vendor")}
                  </Label>
                  <VendorLookup
                    value={(getItemValue(item, "vendor_id") as string) || ""}
                    onValueChange={(value) => {
                      onItemUpdate(item.id, "vendor_id", value);
                    }}
                    classNames="h-7 text-xs"
                    disabled={currentMode !== formType.EDIT}
                  />
                  <div className="grid grid-cols-4 gap-2">
                    <div className="space-y-0.5 text-right">
                      <Label className="text-muted-foreground text-xs font-medium">
                        {tPr("currency")}
                      </Label>
                      <LookupCurrency
                        value={(getItemValue(item, "currency_id") as string) || ""}
                        onValueChange={(value) => {
                          onItemUpdate(item.id, "currency_id", value);
                        }}
                        onSelectObject={(selectedCurrency) => {
                          onItemUpdate(item.id, "currency_code", selectedCurrency.code);
                        }}
                        classNames="h-7 justify-end text-right text-xs"
                        disabled={currentMode !== formType.EDIT}
                      />
                    </div>
                    <div className="space-y-0.5 text-right">
                      <Label className="text-muted-foreground text-xs font-medium">
                        {tPr("unit_price")}
                      </Label>
                      <NumberInput
                        value={Number(getItemValue(item, "pricelist_price")) || 0}
                        onChange={(value) => {
                          recalculateAll({ pricelist_price: Number(value) });
                        }}
                        classNames="h-7 text-xs w-full text-right bg-background"
                        disabled={currentMode !== formType.EDIT}
                      />
                    </div>
                    <div className="space-y-0.5 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Label className="text-muted-foreground text-xs font-medium">
                          {tPr("discount")}
                        </Label>
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Checkbox
                                checked={Boolean(getItemValue(item, "is_discount_adjustment"))}
                                onCheckedChange={(checked) => {
                                  recalculateAll({ is_discount_adjustment: Boolean(checked) });
                                }}
                                className="h-3.5 w-3.5"
                                disabled={!isPriceValid || currentMode !== formType.EDIT}
                              />
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>{tPr("adjustment_discount")}</p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      </div>
                      <div className="relative">
                        <NumberInput
                          value={
                            Boolean(getItemValue(item, "is_discount_adjustment"))
                              ? Number(getItemValue(item, "discount_amount")) || 0
                              : Number(getItemValue(item, "discount_rate")) || 0
                          }
                          onChange={(value) => {
                            const isAdjustment = Boolean(
                              getItemValue(item, "is_discount_adjustment")
                            );
                            if (isAdjustment) {
                              recalculateAll({ discount_amount: Number(value) });
                            } else {
                              recalculateAll({ discount_rate: Number(value) });
                            }
                          }}
                          classNames={cn(
                            "h-7 text-xs w-full text-right bg-background",
                            !Boolean(getItemValue(item, "is_discount_adjustment")) && "pr-6"
                          )}
                          disabled={!isPriceValid || currentMode !== formType.EDIT}
                        />
                        {!Boolean(getItemValue(item, "is_discount_adjustment")) && (
                          <span className="absolute right-2 top-1/2 -translate-y-1/2 text-xs text-muted-foreground">
                            %
                          </span>
                        )}
                      </div>
                      <p className="text-[10px] text-muted-foreground">
                        {formatPrice(
                          Number(getItemValue(item, "discount_amount") || 0),
                          (getItemValue(item, "currency_code") as string) || "THB",
                          defaultAmount.locales,
                          defaultAmount.minimumFractionDigits
                        )}
                      </p>
                    </div>
                    <div className="space-y-0.5 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Label className="text-muted-foreground text-xs font-medium">
                          {tPr("tax")}
                        </Label>
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Checkbox
                                checked={Boolean(getItemValue(item, "is_tax_adjustment"))}
                                onCheckedChange={(checked) => {
                                  recalculateAll({ is_tax_adjustment: Boolean(checked) });
                                }}
                                className="h-3.5 w-3.5"
                                disabled={!isPriceValid || currentMode !== formType.EDIT}
                              />
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>{tPr("adjustment_tax")}</p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      </div>
                      {Boolean(getItemValue(item, "is_tax_adjustment")) ? (
                        <NumberInput
                          value={Number(getItemValue(item, "tax_amount")) || 0}
                          onChange={(value) => {
                            recalculateAll({ tax_amount: Number(value) });
                          }}
                          classNames="h-7 text-xs w-full text-right bg-background"
                          disabled={!isPriceValid || currentMode !== formType.EDIT}
                        />
                      ) : (
                        <LookupTaxProfile
                          value={(getItemValue(item, "tax_profile_id") as string) || ""}
                          onValueChange={(value) => {
                            onItemUpdate(item.id, "tax_profile_id", value);
                          }}
                          onSelectObject={(selectedTax) => {
                            recalculateAll({
                              tax_profile_name: selectedTax.name,
                              tax_rate: selectedTax.tax_rate,
                            });
                          }}
                          classNames="h-7 text-xs w-full text-right justify-end"
                          disabled={!isPriceValid || currentMode !== formType.EDIT}
                        />
                      )}
                      <p className="text-[10px] text-muted-foreground">
                        {formatPrice(
                          Number(getItemValue(item, "tax_amount") || 0),
                          (getItemValue(item, "currency_code") as string) || "THB",
                          defaultAmount.locales,
                          defaultAmount.minimumFractionDigits
                        )}
                      </p>
                    </div>
                  </div>
                </div>
                <div className="space-y-1.5">
                  <PrLabelItem
                    label={tPr("pricelist")}
                    value={(getItemValue(item, "pricelist_no") as string) ?? "-"}
                  />
                  <div className="grid grid-cols-2 gap-4">
                    <PrLabelItem
                      label={tPr("sub_total")}
                      value={Number(
                        getItemValue(item, "base_sub_total_price") ?? item.base_sub_total_price
                      ).toFixed(2)}
                      position="text-right"
                    />

                    <PrLabelItem
                      label={tPr("net_amount")}
                      value={Number(getItemValue(item, "net_amount") ?? item.net_amount).toFixed(2)}
                      position="text-right"
                    />

                    <div className="text-right">
                      <Label className="text-muted-foreground text-xs font-medium">
                        {tPr("total")}
                      </Label>
                      <p className="font-bold text-base text-active">
                        {formatPrice(
                          Number(getItemValue(item, "total_price") ?? item.total_price),
                          (getItemValue(item, "currency_code") as string) || "THB",
                          defaultAmount.locales,
                          defaultAmount.minimumFractionDigits
                        )}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      )}

      <Accordion type="single" collapsible>
        <AccordionItem value="item-2">
          <AccordionTrigger iconPosition="left" className="px-2 border-b border-border">
            <h4 className="font-bold text-xs text-muted-foreground">{tPr("inventory_info")}</h4>
          </AccordionTrigger>
          <AccordionContent className="space-y-1 flex flex-col gap-2 p-4">
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
