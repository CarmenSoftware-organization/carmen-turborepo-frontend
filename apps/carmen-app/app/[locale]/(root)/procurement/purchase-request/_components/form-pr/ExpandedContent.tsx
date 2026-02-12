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
import { useCallback } from "react";
import { formatPrice } from "@/utils/format/currency";
import VendorComparison from "./VendorComparison";
import InventoryInfo from "./InventoryInfo";
import InventoryProgress from "./InventoryProgress";
import PrLabelItem from "./PrLabelItem";
import NumberInput from "@/components/form-custom/NumberInput";
import VendorLookup from "@/components/lookup/LookupVendor";
import LookupTaxProfile from "@/components/lookup/LookupTaxProfile";
import { Checkbox } from "@/components/ui/checkbox";
import { cn } from "@/lib/utils";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { PR_STATUS } from "../../_constants/pr-status";
import { useInventoryData } from "../../_hooks/use-inventory-data";

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

  // Consolidated inventory data fetching - single API call for both InventoryInfo and InventoryProgress
  const {
    inventoryData,
    stockLevel,
    isLoading: isInventoryLoading,
  } = useInventoryData({
    item,
    token,
    buCode,
  });

  const recalculateAll = useCallback(
    (overrides: Record<string, unknown>) => {
      // Merge current values with overrides
      const getValue = (key: string) =>
        key in overrides ? overrides[key] : getItemValue(item, key);

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

      // Batch all updates into a single object to reduce re-renders
      const updates: Record<string, unknown> = {
        ...overrides,
        base_price: price,
        sub_total_price: subTotal,
        base_sub_total_price: subTotal,
        discount_amount: discountAmount,
        base_discount_amount: discountAmount,
        discount_rate: discountRate,
        net_amount: netAmount,
        base_net_amount: netAmount,
        tax_amount: taxAmount,
        base_tax_amount: taxAmount,
        tax_rate: taxRate,
        total_price: totalPrice,
        base_total_price: totalPrice,
      };

      // Apply all updates
      Object.entries(updates).forEach(([key, value]) => {
        onItemUpdate(item.id, key, value);
      });
    },
    [item, getItemValue, onItemUpdate]
  );

  const isPriceValid = Number(getItemValue(item, "pricelist_price")) > 0;
  const isDiscountAdjustment = !!getItemValue(item, "is_discount_adjustment");
  const isTaxAdjustment = !!getItemValue(item, "is_tax_adjustment");

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
                  unitId={item.requested_unit_id}
                  currencyId={item.currency_id}
                  deliveryDate={item.delivery_date}
                  itemId={item.id}
                  bu_code={buCode}
                  onItemUpdate={onItemUpdate}
                  token={token}
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
                  <div className="grid grid-cols-3 gap-1">
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
                    <div className="space-y-0.5 text-right mt-1">
                      <div className="flex items-center justify-end gap-2">
                        <Label className="text-muted-foreground text-xs font-medium">
                          {tPr("discount")}
                        </Label>
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Checkbox
                                checked={isDiscountAdjustment}
                                onCheckedChange={(checked) => {
                                  recalculateAll({ is_discount_adjustment: !!checked });
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
                            isDiscountAdjustment
                              ? Number(getItemValue(item, "discount_amount")) || 0
                              : Number(getItemValue(item, "discount_rate")) || 0
                          }
                          onChange={(value) => {
                            if (isDiscountAdjustment) {
                              recalculateAll({ discount_amount: Number(value) });
                            } else {
                              recalculateAll({ discount_rate: Number(value) });
                            }
                          }}
                          classNames={cn(
                            "h-7 text-xs w-full text-right bg-background",
                            !isDiscountAdjustment && "pr-6"
                          )}
                          disabled={!isPriceValid || currentMode !== formType.EDIT}
                        />
                        {!isDiscountAdjustment && (
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
                    <div className="space-y-0.5 text-right mt-1">
                      <div className="flex items-center justify-end gap-2">
                        <Label className="text-muted-foreground text-xs font-medium">
                          {tPr("tax")}
                        </Label>
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Checkbox
                                checked={isTaxAdjustment}
                                onCheckedChange={(checked) => {
                                  recalculateAll({ is_tax_adjustment: !!checked });
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
                      {isTaxAdjustment ? (
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
                      <p className="font-semibold text-sm text-active">
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
            <h4 className="font-semibold text-xs text-muted-foreground">{tPr("inventory_info")}</h4>
          </AccordionTrigger>
          <AccordionContent className="flex flex-col gap-2 p-3">
            <InventoryInfo
              inventoryData={inventoryData}
              inventoryUnitName={item.inventory_unit_name}
              isLoading={isInventoryLoading}
            />
            <InventoryProgress stockLevel={stockLevel} isLoading={isInventoryLoading} />
          </AccordionContent>
        </AccordionItem>
      </Accordion>

      {item.dimension?.length > 0 && (
        <Accordion type="single" collapsible>
          <AccordionItem value="item-3">
            <AccordionTrigger iconPosition="left" className="px-2">
              <h4 className="font-semibold text-xs text-muted-foreground">
                {tPr("business_dimensions")}
              </h4>
            </AccordionTrigger>
            <AccordionContent className="flex flex-col gap-2 border-l-4 border-primary/20 mx-3 my-1 -mt-px">
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
                          <p className="text-xs font-semibold">{dim.value}</p>
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
