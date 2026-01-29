import { ADJUSTMENT_TYPE } from "@/dtos/adjustment-type.dto";
import { formType } from "@/dtos/form.dto";
import FormAdjustment from "../../components/FormAdjustment";

export default function StockOutNewPage() {
  return <FormAdjustment mode={formType.ADD} form_type={ADJUSTMENT_TYPE.STOCK_OUT} />;
}
