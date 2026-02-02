import { formType } from "@/dtos/form.dto";
import FormAdjustment from "../../_components/FormAdjustment";
import { INVENTORY_ADJUSTMENT_TYPE } from "@/dtos/inventory-adjustment.dto";

export default function StockOutNewPage() {
  return <FormAdjustment mode={formType.ADD} form_type={INVENTORY_ADJUSTMENT_TYPE.STOCK_OUT} />;
}
