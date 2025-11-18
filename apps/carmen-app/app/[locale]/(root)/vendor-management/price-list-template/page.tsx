import { createMetadata } from "@/utils/metadata";
import PriceListTemplate from "./_components/PriceListTemplate";

export const generateMetadata = createMetadata("PriceListTemplate", "title");

export default function PriceListTemplatePage() {
  return <PriceListTemplate />;
}
