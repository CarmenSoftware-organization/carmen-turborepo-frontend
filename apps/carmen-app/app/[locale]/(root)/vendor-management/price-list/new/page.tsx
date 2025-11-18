import { formType } from "@/dtos/form.dto";
import DetailPriceList from "../_components/form/FormDetailPriceList";
import { createMetadata } from "@/utils/metadata";

export const generateMetadata = createMetadata("PriceList", "new_price_list");

export default function NewPriceListPage() {
  return <DetailPriceList mode={formType.ADD} />;
}
