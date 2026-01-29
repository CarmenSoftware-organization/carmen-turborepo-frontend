"use client";

import { useMemo } from "react";
import { useSearchParams } from "next/navigation";
import { nanoid } from "nanoid";
import { formType } from "@/dtos/form.dto";
import { useAuth } from "@/context/AuthContext";
import { usePrTemplateByIdQuery } from "@/hooks/use-pr-tmpl";
import { PurchaseRequestTemplateDto } from "@/dtos/pr-template.dto";
import { PurchaseRequestByIdDto, PurchaseRequestDetail } from "@/dtos/purchase-request.dto";
import MainForm from "../_components/form-pr/MainForm";
import ErrorBoundary from "../_components/ErrorBoundary";
import { DetailLoading } from "@/components/loading/DetailLoading";

function mapTemplateToPrInitValues(
  templateData: PurchaseRequestTemplateDto
): Partial<PurchaseRequestByIdDto> {
  // Use Partial because some fields are undefined for new items (vendor, pricelist, etc.)
  const purchaseRequestDetail: Partial<PurchaseRequestDetail>[] =
    templateData.purchase_request_template_detail.map((detail, index) => ({
      id: nanoid(),
      purchase_request_id: "",
      sequence_no: index + 1,
      // Product info
      product_id: detail.product_id,
      product_name: detail.product_name,
      product_local_name: detail.product_local_name,
      // Location info
      location_id: detail.location_id,
      location_name: detail.location_name,
      delivery_point_id: detail.delivery_point_id,
      delivery_point_name: detail.delivery_point_name || "",
      delivery_date: new Date().toISOString(),
      // Unit info
      inventory_unit_id: detail.inventory_unit_id,
      inventory_unit_name: detail.inventory_unit_name || "",
      // Vendor info - use undefined instead of "" for uuid validation
      vendor_id: undefined,
      vendor_name: undefined,
      // Pricelist info
      pricelist_detail_id: undefined,
      pricelist_no: undefined,
      pricelist_unit: undefined,
      pricelist_price: undefined,
      // Currency info
      currency_id: detail.currency_id,
      currency_name: detail.currency_name || "",
      exchange_rate: detail.exchange_rate,
      exchange_rate_date: detail.exchange_rate_date || new Date().toISOString(),
      // Quantity info
      requested_qty: detail.requested_qty,
      requested_unit_id: detail.requested_unit_id,
      requested_unit_name: detail.requested_unit_name,
      requested_unit_conversion_factor: detail.requested_unit_conversion_factor,
      requested_base_qty: detail.requested_base_qty,
      // Approved quantity info
      approved_qty: detail.requested_qty,
      approved_unit_id: detail.requested_unit_id,
      approved_unit_name: detail.requested_unit_name,
      approved_unit_conversion_factor: detail.requested_unit_conversion_factor,
      approved_base_qty: detail.requested_base_qty,
      // FOC quantity info
      foc_qty: detail.foc_qty,
      foc_unit_id: detail.foc_unit_id,
      foc_unit_name: detail.foc_unit_name,
      foc_unit_conversion_factor: detail.foc_unit_conversion_factor,
      foc_base_qty: detail.foc_base_qty,
      // Tax info
      tax_profile_id: detail.tax_profile_id,
      tax_profile_name: detail.tax_profile_name,
      tax_rate: detail.tax_rate,
      tax_amount: detail.tax_amount,
      base_tax_amount: detail.base_tax_amount,
      is_tax_adjustment: detail.is_tax_adjustment,
      // Discount info
      discount_rate: detail.discount_rate,
      discount_amount: detail.discount_amount,
      base_discount_amount: detail.base_discount_amount,
      is_discount_adjustment: detail.is_discount_adjustment,
      // Price calculation - use undefined instead of null for schema validation
      sub_total_price: undefined,
      net_amount: 0,
      total_price: 0,
      base_price: undefined,
      base_sub_total_price: undefined,
      base_net_amount: 0,
      base_total_price: 0,
      // On hand/order
      on_hand_qty: 0,
      on_order_qty: 0,
      re_order_qty: 0,
      re_stock_qty: 0,
      // Detail common info
      description: detail.description,
      comment: detail.comment,
      // Audit info
      doc_version: "1",
      created_at: new Date().toISOString(),
      created_by_id: "",
      updated_at: new Date().toISOString(),
    }));

  return {
    workflow_id: templateData.workflow_id,
    workflow_name: templateData.workflow_name,
    department_id: templateData.department_id,
    department_name: templateData.department_name,
    description: templateData.description,
    note: templateData.note,
    purchase_request_detail: purchaseRequestDetail as PurchaseRequestDetail[],
  };
}

export default function PurchaseRequestNewPage() {
  const searchParams = useSearchParams();
  const { token, buCode } = useAuth();

  const type = searchParams.get("type");
  const templateId = searchParams.get("template_id");

  const isTemplate = type === "template" && !!templateId;

  const { prTemplate, isLoading } = usePrTemplateByIdQuery(
    token,
    buCode,
    isTemplate ? templateId : ""
  );

  const initValues = useMemo(() => {
    if (isTemplate && prTemplate) {
      return mapTemplateToPrInitValues(prTemplate) as PurchaseRequestByIdDto;
    }
    return undefined;
  }, [isTemplate, prTemplate]);

  if (isTemplate && isLoading) {
    return <DetailLoading />;
  }

  return (
    <ErrorBoundary>
      <MainForm mode={formType.ADD} bu_code={buCode} initValues={initValues} />
    </ErrorBoundary>
  );
}
