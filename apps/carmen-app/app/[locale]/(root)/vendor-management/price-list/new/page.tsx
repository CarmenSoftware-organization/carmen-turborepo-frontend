import { formType } from "@/dtos/form.dto";
import DetailPriceList from "../_components/form/FormDetailPriceList";

export default function NewPriceListPage() {
  return <DetailPriceList mode={formType.ADD} />;
}
