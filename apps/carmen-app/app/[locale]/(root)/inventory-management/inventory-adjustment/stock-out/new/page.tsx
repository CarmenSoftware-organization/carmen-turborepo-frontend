import { formType } from "@/dtos/form.dto";
import FormAdjustment from "../../_components/FormAdjustment";
import { STOCK_IN_OUT_TYPE } from "@/dtos/stock-in-out.dto";

export default function StockOutNewPage() {
  return <FormAdjustment mode={formType.ADD} form_type={STOCK_IN_OUT_TYPE.STOCK_OUT} />;
}
